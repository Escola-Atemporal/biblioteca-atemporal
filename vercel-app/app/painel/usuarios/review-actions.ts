"use server";
import { can } from "../../../lib/permissions";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import { roleForEmail, roleForEmailAsync } from "../../../lib/access";
import { databaseConfigured, transaction } from "../../../lib/database";
import { createEmail, emailConfigured, emailOrigin, enqueueEmail, sendEmailBatch } from "../../../lib/email";

export type ReviewResult = { ok: boolean; message: string; inviteUrl: null };
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireAdmin(): Promise<string> {
  const session=await auth();
  const actor=session?.user?.email?.trim().toLowerCase();
  if (!actor || !can(await roleForEmailAsync(actor), "users:manage"))
    throw new Error("Ação exclusiva para administradores.");
  if (!databaseConfigured) throw new Error("Banco da Biblioteca indisponível.");
  return actor;
}

export async function approveMembership(_prior:ReviewResult, form:FormData):Promise<ReviewResult> {
  const actor=await requireAdmin();
  if(!emailConfigured) return {ok:false,message:"O remetente de e-mail ainda não está configurado. Nenhuma solicitação foi aprovada.",inviteUrl:null};
  const id=String(form.get("requestId")??"");
  if(!UUID.test(id))return {ok:false,message:"Solicitação inválida.",inviteUrl:null};
  const token=randomBytes(32).toString("base64url");
  const tokenHash=createHash("sha256").update(token).digest("hex");
  try {
    const result=await transaction(async(client)=>{
      const r=await client.query<{id:string;email:string;full_name:string}>(
        `SELECT id,email,full_name FROM biblioteca_membership_requests
         WHERE id=$1 AND status='pending' FOR UPDATE`,[id],
      );
      const request=r.rows[0];
      if(!request)return {kind:"not-pending",mailId:null};
      const existing=await client.query("SELECT email FROM biblioteca_access_accounts WHERE email=$1",[request.email]);
      if(roleForEmail(request.email)||(existing.rowCount??0)>0)return {kind:"already-account",mailId:null};
      await client.query(
        `INSERT INTO biblioteca_access_accounts(email,display_name,role,active,created_by)
         VALUES($1,$2,'experiencialista',false,$3)`,
        [request.email,request.full_name,actor],
      );
      const inv=await client.query<{id:string}>(
        `INSERT INTO biblioteca_access_invites(email,token_hash,created_by,expires_at)
         VALUES($1,$2,$3,now()+interval '48 hours') RETURNING id`,
        [request.email,tokenHash,actor],
      );
      await client.query(
        `UPDATE biblioteca_membership_requests
         SET status='approved',updated_at=now(),reviewed_at=now(),reviewed_by=$2,invite_id=$3
         WHERE id=$1`,[id,actor,inv.rows[0].id],
      );
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
         VALUES($1,$2,'membership_request_approved',jsonb_build_object('requestId',$3::text,'role','experiencialista'))`,
        [actor,request.email,id],
      );
      const mailId=await enqueueEmail(client,createEmail(
        "invitation",request.email,"Sua solicitação foi aprovada | Biblioteca Atemporal",
        {eyebrow:"Aprovação de participação",greeting:`Boas-vindas, ${request.full_name}.`,
         paragraphs:[
           "Sua solicitação de participação na Biblioteca Atemporal foi aprovada.",
           "Crie uma senha pessoal clicando no botão abaixo. O convite funciona uma única vez e expira em 48 horas.",
           "Você será cadastrado como Experiencialista. Os materiais em revisão editorial continuam reservados à equipe.",
         ],
         action:{label:"Criar minha senha e ativar acesso",url:`${emailOrigin()}/convite/${token}`}},
        `invitation:membership:${inv.rows[0].id}`,
      ));
      if(!mailId)throw new Error("Invitation email could not be queued");
      return {kind:"approved",mailId};
    });
    if(result.kind==="not-pending")return{ok:false,message:"Esta solicitação já foi analisada. Atualize a lista.",inviteUrl:null};
    if(result.kind==="already-account")return{ok:false,message:"Este e-mail já possui uma conta. Verifique-a em Pessoas cadastradas.",inviteUrl:null};
    revalidatePath("/painel/usuarios");
    const status=(await sendEmailBatch([result.mailId]).catch(()=>[]))[0];
    return{ok:true,inviteUrl:null,message:status==="sent"
      ?"Solicitação aprovada. O convite foi aceito pelo serviço de e-mail."
      :"Solicitação aprovada, mas o convite ainda não foi entregue ao serviço de e-mail. Confira a fila em E-mails transacionais."};
  }catch{
    return{ok:false,message:"Não foi possível aprovar a solicitação. Nenhuma conta foi ativada.",inviteUrl:null};
  }
}

export async function rejectMembership(_prior:ReviewResult,form:FormData):Promise<ReviewResult>{
  const actor=await requireAdmin();
  if(!emailConfigured) return {ok:false,message:"Configure o e-mail transacional antes de registrar decisões. Nenhuma solicitação foi recusada.",inviteUrl:null};
  const id=String(form.get("requestId")??"");
  if(!UUID.test(id))return{ok:false,message:"Solicitação inválida.",inviteUrl:null};
  try{
    const result=await transaction(async(client)=>{
      const r=await client.query<{email:string;full_name:string}>(
        `UPDATE biblioteca_membership_requests
         SET status='rejected',updated_at=now(),reviewed_at=now(),reviewed_by=$2
         WHERE id=$1 AND status='pending' RETURNING email,full_name`,[id,actor],
      );
      const req=r.rows[0];
      if(!req)return {updated:false,mailId:null};
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
         VALUES($1,$2,'membership_request_rejected',jsonb_build_object('requestId',$3::text))`,
        [actor,req.email,id],
      );
      const mailId=await enqueueEmail(client,createEmail(
        "request_rejected",req.email,"Atualização da sua solicitação | Biblioteca Atemporal",
        {eyebrow:"Retorno da Escola",greeting:`Olá, ${req.full_name}.`,
         paragraphs:[
           "Agradecemos seu interesse em fazer parte da Biblioteca Atemporal.",
           "Neste momento, não foi possível aprovar sua solicitação de acesso.",
           "O acervo público da Escola continua disponível para consulta. Obrigado por caminhar conosco.",
         ],action:{label:"Visitar Biblioteca",url:emailOrigin()}},
        `request:rejected:${id}`,
      ));
      return{updated:true,mailId};
    });
    if(!result.updated)return{ok:false,message:"Esta solicitação já foi analisada. Atualize a lista.",inviteUrl:null};
    revalidatePath("/painel/usuarios");
    const status=(await sendEmailBatch([result.mailId]).catch(()=>[]))[0];
    return{ok:true,inviteUrl:null,message:status==="sent"
      ?"Solicitação recusada. O e-mail com a decisão foi aceito pelo serviço."
      :"Solicitação recusada, mas o aviso aguarda envio. Consulte E-mails transacionais."};
  }catch{
    return{ok:false,message:"Não foi possível registrar a decisão.",inviteUrl:null};
  }
}
