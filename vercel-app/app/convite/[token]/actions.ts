"use server";

import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { transaction, databaseConfigured } from "../../../lib/database";
import { hashPassword } from "../../../lib/password-login";
import { createEmail, emailOrigin, enqueueEmail, sendEmailBatch } from "../../../lib/email";

type ActivationResult = { ok: boolean; message: string };
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export async function activateInvitation(_previous: ActivationResult, formData: FormData): Promise<ActivationResult> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (!databaseConfigured) return { ok: false, message: "Convites indisponíveis neste momento." };
  if (!TOKEN_PATTERN.test(token)) return { ok: false, message: "Este convite não é válido." };
  if (password.length < 12 || password.length > 256 || password !== confirmation) {
    return { ok: false, message: "Use uma senha de pelo menos 12 caracteres e confirme-a corretamente." };
  }
  const hash = createHash("sha256").update(token).digest("hex");
  const passwordHash = hashPassword(password);
  let activation: {activated:boolean;mailId:string|null} = {activated:false,mailId:null};
  try {
    activation = await transaction(async (client) => {
      const result = await client.query<{ id: string; email: string }>(
        `SELECT id,email FROM biblioteca_access_invites
         WHERE token_hash=$1 AND used_at IS NULL AND expires_at > now()
         FOR UPDATE`,
        [hash],
      );
      const invite = result.rows[0];
      if (!invite) return {activated:false,mailId:null};
      const update = await client.query(
        `UPDATE biblioteca_access_accounts
          SET password_hash=$1,active=true,updated_at=now(),password_changed_at=now()
          WHERE email=$2`,
        [passwordHash, invite.email],
      );
      if (update.rowCount !== 1) throw new Error("Account not found for invite");
      await client.query(
        "UPDATE biblioteca_access_invites SET used_at=now() WHERE id=$1",
        [invite.id],
      );
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action)
         VALUES($1,$1,'invitation_accepted')`,
        [invite.email],
      );
      const mailId = await enqueueEmail(client,createEmail(
        "account_activated",invite.email,"Seu acesso foi ativado | Biblioteca Atemporal",
        {eyebrow:"Acesso ativado",greeting:"Sua jornada continua.",
         paragraphs:[
           "Sua conta da Biblioteca Atemporal foi ativada com sucesso.",
           "Você já pode entrar usando o e-mail cadastrado e sua senha pessoal.",
           "Se não reconhece esta ativação, entre em contato com a administração da Escola.",
         ],action:{label:"Acessar a Biblioteca",url:`${emailOrigin()}/entrar`}},
        `account:activated:${invite.id}`,
      ));
      return {activated:true,mailId};
    });
  } catch {
    return { ok: false, message: "Não foi possível ativar o convite. Tente novamente." };
  }
  if (!activation.activated) return { ok: false, message: "Convite expirado ou já utilizado. Solicite um novo à administração." };
  await sendEmailBatch([activation.mailId]).catch(()=>[]);
  redirect("/entrar?convite=ativado");
}
