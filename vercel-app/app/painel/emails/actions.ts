"use server";

import {auth} from "../../../auth";
import {roleForEmailAsync} from "../../../lib/access";
import {dbQuery,databaseConfigured} from "../../../lib/database";
import {deliverEmail,emailConfigured} from "../../../lib/email";
import {revalidatePath} from "next/cache";

export type RetryState={ok:boolean;message:string};
export async function retryEmailOutbox(_previous:RetryState):Promise<RetryState>{
  const session=await auth();
  if(!session?.user?.email || await roleForEmailAsync(session.user.email)!=="administrador"){
    throw new Error("Acesso administrativo requerido");
  }
  if(!databaseConfigured || !emailConfigured)
    return{ok:false,message:"Configure o remetente transacional antes de reenviar mensagens."};
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
