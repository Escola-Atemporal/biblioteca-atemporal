"use server";

import { createHash, randomBytes } from "node:crypto";
import { auth } from "../../../auth";
import { roleForEmailAsync, type Role } from "../../../lib/access";
import { databaseConfigured, dbQuery, transaction } from "../../../lib/database";
import { revalidatePath } from "next/cache";
import { createEmail, emailConfigured, emailOrigin, enqueueEmail, sendEmailBatch } from "../../../lib/email";

export type InviteResult = {
  ok: boolean;
  message: string;
  inviteUrl: string | null;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES: Role[] = ["administrador", "curador", "experiencialista"];

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email || await roleForEmailAsync(email) !== "administrador") {
    throw new Error("Acesso administrativo não autorizado.");
  }
  if (!databaseConfigured) throw new Error("A base administrativa não está configurada.");
  return email;
}

export async function createAccessInvite(_previous: InviteResult, formData: FormData): Promise<InviteResult> {
  const actor=await requireAdmin();
  if(!emailConfigured)return{ok:false,message:"Configure primeiro o remetente de e-mail em E-mails transacionais. Nenhum convite foi criado.",inviteUrl:null};
  const email=String(formData.get("email")??"").trim().toLowerCase();
  const name=String(formData.get("name")??"").trim().replace(/\s+/g," ");
  const role=String(formData.get("role")??"") as Role;
  if(!EMAIL.test(email)||email.length>254||name.length<2||name.length>120||!ROLES.includes(role))
    return{ok:false,message:"Confira nome, e-mail e perfil.",inviteUrl:null};
  if(email===actor)return{ok:false,message:"Não é possível gerar um convite para sua própria conta administrativa.",inviteUrl:null};

  const token=randomBytes(32).toString("base64url");
  const tokenHash=createHash("sha256").update(token).digest("hex");
  try{
    const result=await transaction(async(client)=>{
      const existing=await client.query<{active:boolean; password_hash:string|null}>(
        "SELECT active,password_hash FROM biblioteca_access_accounts WHERE email=$1 FOR UPDATE",[email],
      );
      if(existing.rows[0]?.active)return{kind:"already-active",mailId:null};
      await client.query(
        `INSERT INTO biblioteca_access_accounts(email,display_name,role,active,created_by)
         VALUES($1,$2,$3,false,$4)
         ON CONFLICT(email) DO UPDATE SET
         display_name=EXCLUDED.display_name,role=EXCLUDED.role,updated_at=now()`,
        [email,name,role,actor],
      );
      await client.query("UPDATE biblioteca_access_invites SET used_at=now() WHERE email=$1 AND used_at IS NULL",[email]);
      const rows=await client.query<{id:string}>(
        `INSERT INTO biblioteca_access_invites(email,token_hash,created_by,expires_at)
         VALUES($1,$2,$3,now()+interval '48 hours') RETURNING id`,
        [email,tokenHash,actor],
      );
      const invitationId=rows.rows[0].id;
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
         VALUES($1,$2,'invitation_created',jsonb_build_object('role',$3))`,
        [actor,email,role],
      );
      const mailId=await enqueueEmail(client,createEmail(
        "invitation",email,"Convite para a Biblioteca Atemporal",
        {eyebrow:"Convite de acesso",greeting:`Olá, ${name}.`,
         paragraphs:[
           "Você recebeu um convite individual para participar da Biblioteca Atemporal.",
           `Seu perfil será ${role}. Clique no botão e crie uma senha pessoal para ativar sua conta.`,
           "Este convite é válido por 48 horas, funciona apenas uma vez e não exige contato pelo WhatsApp.",
         ],action:{label:"Criar senha e ativar acesso",url:`${emailOrigin()}/convite/${token}`}},
        `invitation:direct:${invitationId}`,
      ));
      if(!mailId)throw new Error("Cannot queue invitation email");
      return{kind:"created",mailId};
    });
    if(result.kind==="already-active")return{ok:false,message:"Já existe uma conta ativa com esse e-mail. Use o painel para gerenciar suas permissões.",inviteUrl:null};
    revalidatePath("/painel/usuarios");
    const status=(await sendEmailBatch([result.mailId]).catch(()=>[]))[0];
    return{ok:true,inviteUrl:null,message:status==="sent"
      ?"Convite gerado. O e-mail foi aceito para envio. A pessoa poderá criar a senha pelo botão recebido."
      :"Convite registrado, mas o e-mail ainda não foi enviado. Verifique a fila de E-mails transacionais."};
  }catch{
    return{ok:false,message:"Não foi possível registrar o convite. Tente novamente.",inviteUrl:null};
  }
}

export async function setAccountActive(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const action = String(formData.get("action") ?? "");
  if (!EMAIL.test(email) || email === actor || !["activate","deactivate"].includes(action)) return;
  const active = action === "activate";
  const accounts = await dbQuery<{ email: string }>(
    "UPDATE biblioteca_access_accounts SET active=$1,updated_at=now() WHERE email=$2 AND ($1::boolean=false OR password_hash IS NOT NULL) RETURNING email",
    [active,email],
  );
  if (accounts.length) {
    if (!active) {
      await dbQuery(
        "UPDATE biblioteca_access_invites SET used_at=now() WHERE email=$1 AND used_at IS NULL",
        [email],
      );
    }
    await dbQuery(
      `INSERT INTO biblioteca_access_audit(actor_email,target_email,action)
       VALUES($1,$2,$3)`,
      [actor,email,active?"account_activated":"account_deactivated"],
    );
  }
  revalidatePath("/painel/usuarios");
}

export async function changeAccountRole(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "") as Role;
  if (!EMAIL.test(email) || email === actor || !ROLES.includes(role)) return;
  const accounts = await dbQuery<{ email: string }>(
    "UPDATE biblioteca_access_accounts SET role=$1,updated_at=now() WHERE email=$2 RETURNING email",
    [role,email],
  );
  if (accounts.length) await dbQuery(
    `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
     VALUES($1,$2,'role_changed',jsonb_build_object('role',$3))`,
    [actor,email,role],
  );
  revalidatePath("/painel/usuarios");
}
