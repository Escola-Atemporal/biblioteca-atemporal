"use server";

import { createHash, randomBytes } from "node:crypto";
import { auth } from "../../../auth";
import { roleForEmailAsync, type Role } from "../../../lib/access";
import { databaseConfigured, dbQuery, transaction } from "../../../lib/database";
import { revalidatePath } from "next/cache";

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
  const actor = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const role = String(formData.get("role") ?? "") as Role;
  if (!EMAIL.test(email) || email.length > 254 || name.length < 2 || name.length > 120 || !ROLES.includes(role)) {
    return { ok: false, message: "Confira o nome, o e-mail e o perfil da pessoa.", inviteUrl: null };
  }
  if (email === actor) {
    return { ok: false, message: "Para preservar a conta administradora, não crie um convite para seu próprio e-mail.", inviteUrl: null };
  }
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  try {
    const result = await transaction(async (client) => {
      const existing = await client.query<{ active: boolean }>(
        "SELECT active FROM biblioteca_access_accounts WHERE email=$1 FOR UPDATE",
        [email],
      );
      if (existing.rows[0]?.active) return "already-active";
      await client.query(
        `INSERT INTO biblioteca_access_accounts(email, display_name, role, active, created_by)
           VALUES($1,$2,$3,false,$4)
           ON CONFLICT(email) DO UPDATE SET
             display_name=EXCLUDED.display_name, role=EXCLUDED.role, updated_at=now()`,
        [email, name, role, actor],
      );
      // A replacement invite invalidates older invitations for the same address.
      await client.query(
        "UPDATE biblioteca_access_invites SET used_at=now() WHERE email=$1 AND used_at IS NULL",
        [email],
      );
      await client.query(
        `INSERT INTO biblioteca_access_invites(email,token_hash,created_by,expires_at)
         VALUES($1,$2,$3,now()+interval '48 hours')`,
        [email, tokenHash, actor],
      );
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
         VALUES($1,$2,'invitation_created',jsonb_build_object('role',$3))`,
        [actor, email, role],
      );
      return "created";
    });
    if (result === "already-active") {
      return { ok: false, message: "Este e-mail já possui uma conta ativa. Para alterar o perfil, use Pessoas cadastradas. Para redefinir a senha, desative a conta antes de emitir um novo convite.", inviteUrl: null };
    }
    revalidatePath("/painel/usuarios");
    const origin = process.env.AUTH_URL || "https://biblioteca-atemporal-web.onrender.com";
    return {
      ok: true,
      message: "Convite criado. Copie o link e envie diretamente à pessoa. Ele expira em 48 horas e funciona uma única vez.",
      inviteUrl: `${origin.replace(/\/$/, "")}/convite/${token}`,
    };
  } catch {
    return { ok: false, message: "Não foi possível registrar o convite. Tente novamente.", inviteUrl: null };
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
