"use server";

import {createHash} from "node:crypto";
import {redirect} from "next/navigation";
import {databaseConfigured,transaction} from "../../../lib/database";
import {hashPassword} from "../../../lib/password-login";
import {createEmail,emailOrigin,enqueueEmail,sendEmailBatch} from "../../../lib/email";

export type ChangePasswordState={ok:boolean;message:string};
const TOKEN=/^[a-zA-Z0-9_-]{43}$/;

export async function finishPasswordReset(_state:ChangePasswordState,form:FormData):Promise<ChangePasswordState>{
  const token=String(form.get("token")??"");
  const password=String(form.get("password")??"");
  const confirmation=String(form.get("confirmation")??"");
  if(!databaseConfigured||!TOKEN.test(token))
    return {ok:false,message:"Este link não é válido."};
  if(password.length<12||password.length>256||confirmation!==password)
    return {ok:false,message:"Use pelo menos 12 caracteres e repita exatamente a senha escolhida."};
  const tokenHash=createHash("sha256").update(token).digest("hex");
  const passwordHash=hashPassword(password);
  let changed:{ok:boolean;mailId:string|null}={ok:false,mailId:null};
  try{
    changed=await transaction(async(client)=>{
      const found=await client.query<{id:string;email:string}>(
        `SELECT p.id,p.email FROM biblioteca_password_resets p
         JOIN biblioteca_access_accounts a ON a.email=p.email
         WHERE p.token_hash=$1 AND p.used_at IS NULL AND p.expires_at>now()
           AND a.active=true AND a.password_hash IS NOT NULL
         FOR UPDATE OF p`,[tokenHash],
      );
      const reset=found.rows[0];
      if(!reset)return{ok:false,mailId:null};
      await client.query(
        `UPDATE biblioteca_access_accounts
         SET password_hash=$1,password_changed_at=now(),updated_at=now()
         WHERE email=$2`,[passwordHash,reset.email],
      );
      await client.query("UPDATE biblioteca_password_resets SET used_at=now() WHERE email=$1 AND used_at IS NULL",[reset.email]);
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action)
         VALUES($1,$1,'password_changed')`,[reset.email],
      );
      const mailId=await enqueueEmail(client,createEmail(
        "password_changed",reset.email,"Sua senha foi alterada | Biblioteca Atemporal",
        {eyebrow:"Alerta de segurança",greeting:"Senha atualizada.",
         paragraphs:[
           "A senha da sua conta na Biblioteca Atemporal foi alterada.",
           "Se você fez essa alteração, já pode entrar normalmente com a nova senha.",
           "Se não reconhece esta operação, informe imediatamente a administração da Escola.",
         ],action:{label:"Abrir Biblioteca",url:`${emailOrigin()}/entrar`}},
        `password:changed:${reset.id}`,
      ));
      return{ok:true,mailId};
    });
  }catch{
    return{ok:false,message:"Não foi possível concluir a alteração. Tente novamente."};
  }
  if(!changed.ok)return{ok:false,message:"O link expirou ou já foi utilizado. Peça um novo link de recuperação."};
  await sendEmailBatch([changed.mailId]).catch(()=>[]);
  redirect("/entrar?senha=alterada");
}
