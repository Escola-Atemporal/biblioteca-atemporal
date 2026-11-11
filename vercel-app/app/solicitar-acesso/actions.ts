"use server";

import { randomUUID } from "node:crypto";
import { databaseConfigured, transaction, dbQuery } from "../../lib/database";
import { adminNotificationEmails, createEmail, emailConfigured, emailOrigin, enqueueEmail, sendEmailBatch } from "../../lib/email";

export type AccessRequestState = { ok: boolean; message: string };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitAccessRequest(_previous: AccessRequestState, form: FormData): Promise<AccessRequestState> {
  if (!databaseConfigured || !emailConfigured) {
    return { ok: false, message: "A confirmação automática por e-mail está sendo configurada. Solicitações ficam suspensas até a ativação do remetente." };
  }
  if (String(form.get("website") ?? "").trim()) {
    return { ok: true, message: "Seus dados foram recebidos para análise." };
  }
  const name = String(form.get("name") ?? "").trim().replace(/\s+/g, " ");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const context = String(form.get("context") ?? "").trim().replace(/\s+/g, " ");
  const privacyAck = form.get("privacyAck") === "yes";
  if (name.length < 2 || name.length > 120 || !EMAIL.test(email) || email.length > 254 ||
      context.length > 450 || !privacyAck) {
    return { ok: false, message: "Confira nome, e-mail e autorização de uso dos dados." };
  }

  try {
    const [volume] = await dbQuery<{ total: number }>(
      "SELECT count(*)::integer AS total FROM biblioteca_membership_requests WHERE created_at > now() - interval '24 hours'",
    );
    if (Number(volume?.total || 0) >= 250) {
      return { ok: false, message: "O limite de solicitações foi atingido. Tente novamente amanhã." };
    }
    const ids = await transaction(async(client)=>{
      const created = await client.query<{id:string}>(
        `INSERT INTO biblioteca_membership_requests(full_name,email,context,privacy_ack)
         VALUES($1,$2,$3,true)
         ON CONFLICT(email) DO UPDATE SET
           full_name=EXCLUDED.full_name, context=EXCLUDED.context,
           status='pending', privacy_ack=true,created_at=now(),updated_at=now(),
           reviewed_at=NULL, reviewed_by=NULL,invite_id=NULL
         WHERE biblioteca_membership_requests.status='rejected'
           AND biblioteca_membership_requests.updated_at < now() - interval '30 days'
         RETURNING id`,
        [name,email,context],
      );
      const requestId=created.rows[0]?.id;
      if (!requestId) return [] as string[];
      const batchId=randomUUID();
      const queue: string[] = [];
      const user = await enqueueEmail(client,createEmail(
        "request_received",email,"Recebemos sua solicitação | Biblioteca Atemporal",
        {eyebrow:"Solicitação de participação",greeting:`Olá, ${name}.`,
         paragraphs:[
           "Recebemos seu pedido para participar da Biblioteca Atemporal.",
           "Nossa equipe analisará a solicitação. A decisão e, caso seja aprovado, seu convite pessoal para criar a senha chegarão por e-mail. Não é necessário entrar em contato por WhatsApp.",
           "Sua conta não foi ativada nesta etapa."
         ],action:{label:"Conhecer a Biblioteca",url:emailOrigin()}},
        `request:${batchId}:receipt`,
      ));
      if (user) queue.push(user);
      const adminList=adminNotificationEmails();
      for(const [i,to] of adminList.entries()){
        const id=await enqueueEmail(client,createEmail(
          "request_admin",to,"Nova solicitação de participação | Biblioteca Atemporal",
          {eyebrow:"Painel administrativo",greeting:"Nova solicitação recebida",
           paragraphs:[`Nome: ${name}`,`E-mail: ${email}`,context?`Motivação: ${context}`:"Motivação: não informada.",
            "Entre no painel para aprovar ou recusar. Não compartilhe dados da pessoa em canais públicos."],
           action:{label:"Avaliar solicitação",url:`${emailOrigin()}/painel/usuarios#solicitacoes`}},
          `request:${batchId}:admin:${i}`,
        ));
        if(id)queue.push(id);
      }
      return queue;
    });
    if(ids.length) await sendEmailBatch(ids).catch(()=>[]);
    // Neutral response does not reveal if an email already has an account or request.
    return {ok:true,message:"Sua solicitação foi registrada para análise. A Escola enviará as próximas informações por e-mail. Nenhuma conta é ativada automaticamente."};
  } catch {
    return {ok:false,message:"Não foi possível registrar o pedido agora. Tente novamente mais tarde."};
  }
}
