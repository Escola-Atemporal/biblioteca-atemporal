import { can } from "../../../lib/permissions";
"use server";

import {auth} from "../../../auth";
import {randomUUID} from "node:crypto";
import {roleForEmailAsync} from "../../../lib/access";
import {dbQuery,databaseConfigured,transaction} from "../../../lib/database";
import {createEmail,deliverEmail,emailConfigured,emailProviderConfigured,emailOrigin,enqueueEmail,sendEmailBatch} from "../../../lib/email";
import {revalidatePath} from "next/cache";

export type RetryState={ok:boolean;message:string};
export async function retryEmailOutbox(_previous:RetryState):Promise<RetryState>{
  const session=await auth();
  if(!session?.user?.email || !can(await roleForEmailAsync(session.user.email), "emails:manage")){
    throw new Error("Acesso administrativo requerido");
  }
  if(!databaseConfigured || !emailConfigured)
    return{ok:false,message:"O reenvio de mensagens reais so sera liberado apos o teste Gmail e a ativacao administrativa."};
  try{
    const ready=await dbQuery<{id:string}>(
      `UPDATE biblioteca_email_outbox SET
         status='pending',next_attempt_at=now(),attempts=0
       WHERE id IN (
         SELECT id FROM biblioteca_email_outbox
          WHERE status IN ('pending','failed')
             OR (status='sending' AND next_attempt_at < now())
          ORDER BY created_at ASC LIMIT 12
       ) RETURNING id`,
    );
    if(!ready.length)return{ok:true,message:"Nenhuma mensagem pendente de reenvio."};
    const results=await Promise.all(ready.map(({id})=>deliverEmail(id)));
    const sent=results.filter(s=>s==="sent").length;
    const pending=results.length-sent;
    revalidatePath("/painel/emails");
    return{ok:true,message:`Reprocessadas ${results.length} mensagens: ${sent} aceitas pelo serviço de e-mail; ${pending} ainda pendentes ou com erro.`};
  }catch{
    return{ok:false,message:"O reprocessamento falhou. Verifique a conexão com o serviço de e-mail."};
  }
}


/** Teste enviado apenas para o e-mail da sessão administrativa autenticada. */
export async function sendTestEmail(_previous:RetryState):Promise<RetryState>{
 const session=await auth();
 const email=session?.user?.email?.toLowerCase().trim();
 if(!email||!can(await roleForEmailAsync(email), "emails:manage"))throw new Error("Administrador não autorizado");
 if(!databaseConfigured||!emailProviderConfigured)return{ok:false,message:"Configure o serviço de e-mail primeiro."};
 try{
  const id=await transaction(async(client)=>enqueueEmail(client,createEmail(
   "request_admin",email,"Teste de envio | Biblioteca Atemporal",
   {eyebrow:"Verificação do envio",greeting:"O e-mail está configurado.",
    paragraphs:[
     "Este é um teste solicitado no painel administrativo da Biblioteca Atemporal.",
     "Se esta mensagem chegou à sua caixa de entrada, o remetente e o recebimento básico estão funcionando. Também confira se não foi para spam.",
    ],action:{label:"Abrir gestão de e-mails",url:`${emailOrigin()}/painel/emails`}},
   `test:${randomUUID()}`,
  )));
  const result=(await sendEmailBatch([id], true))[0];
  revalidatePath("/painel/emails");
  return result==="sent"
   ?{ok:true,message:"Teste aceito pelo serviço. Confira sua caixa de entrada e também a pasta spam."}
   :{ok:false,message:"O envio não foi aceito. Confira o erro na fila abaixo e a verificação do domínio remetente."};
 }catch{
  return{ok:false,message:"Não foi possível solicitar o teste. Confira a configuração do remetente."};
 }
}
