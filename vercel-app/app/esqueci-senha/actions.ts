"use server";

import { randomBytes, createHash, randomUUID } from "node:crypto";
import { databaseConfigured, transaction } from "../../lib/database";
import { contasComSenha } from "../../lib/password-login";
import { createEmail, emailConfigured, emailOrigin, enqueueEmail, sendEmailBatch } from "../../lib/email";

export type PasswordRecoveryState = {ok:boolean;message:string};
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC="Se houver uma conta ativa com este e-mail, você receberá instruções para redefinir sua senha. Confira também a pasta de spam.";

export async function requestPasswordReset(_state:PasswordRecoveryState,form:FormData):Promise<PasswordRecoveryState>{
  if(!databaseConfigured || !emailConfigured){
    return{ok:false,message:"A recuperação automática por e-mail ainda não está disponível. Entre em contato com a administração da Escola."};
  }
  const email=String(form.get("email")??"").trim().toLowerCase();
  if(!EMAIL.test(email)||email.length>254)return{ok:false,message:"Informe um e-mail válido."};
  if(String(form.get("website")??"").trim())return{ok:true,message:GENERIC};

  const token=randomBytes(32).toString("base64url");
  const hash=createHash("sha256").update(token).digest("hex");
  try{
    const id=await transaction(async(client)=>{
      const legacy=contasComSenha().find(u=>u.email===email);
      if(legacy){
        // Migrate the original password account only when the owner requests recovery.
        await client.query(
          `INSERT INTO biblioteca_access_accounts(email,display_name,role,password_hash,active,created_by)
           VALUES($1,$2,$3,$4,true,'legacy-password-migration')
           ON CONFLICT (email) DO NOTHING`,
          [legacy.email,legacy.name??"Administração",legacy.role,legacy.passwordHash],
        );
      }
      const account=await client.query<{email:string;display_name:string}>(
        "SELECT email,display_name FROM biblioteca_access_accounts WHERE email=$1 AND active=true AND password_hash IS NOT NULL FOR UPDATE",
        [email],
      );
      if(!account.rows[0])return null;
      const limit=await client.query<{id:string}>(
        `SELECT id FROM biblioteca_password_resets
         WHERE email=$1 AND created_at > now()-interval '15 minutes'
         ORDER BY created_at DESC LIMIT 1`,[email],
      );
      if(limit.rows.length)return null;
      await client.query(
        "UPDATE biblioteca_password_resets SET used_at=now() WHERE email=$1 AND used_at IS NULL",[email],
      );
      const record=await client.query<{id:string}>(
        `INSERT INTO biblioteca_password_resets(email,token_hash,expires_at)
         VALUES($1,$2,now()+interval '60 minutes') RETURNING id`,[email,hash],
      );
      const resetId=record.rows[0]?.id??randomUUID();
      const mailId=await enqueueEmail(client,createEmail(
        "password_reset",email,"Redefina sua senha | Biblioteca Atemporal",
        {eyebrow:"Segurança de acesso",greeting:`Olá, ${account.rows[0].display_name}.`,
         paragraphs:[
           "Recebemos uma solicitação para redefinir sua senha da Biblioteca Atemporal.",
           "Use o botão abaixo para criar uma senha nova. O link expira em 60 minutos e pode ser usado uma única vez.",
           "Se não foi você, ignore este e-mail: sua senha atual permanecerá a mesma.",
         ],
         action:{label:"Criar nova senha",url:`${emailOrigin()}/redefinir-senha/${token}`}},
        `reset:password:${resetId}`,
      ));
      if(!mailId)throw new Error("Could not queue reset email");
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action)
         VALUES($1,$1,'password_reset_requested')`,[email],
      );
      return mailId;
    });
    if(id)await sendEmailBatch([id]).catch(()=>[]);
    return{ok:true,message:GENERIC};
  }catch{
    // Use an equally neutral response so account existence is not revealed by failures.
    return{ok:true,message:GENERIC};
  }
}
