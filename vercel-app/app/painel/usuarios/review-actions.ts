"use server";

import { createHash, randomBytes } from "node:crypto";
import { auth } from "../../../auth";
import { roleForEmail, roleForEmailAsync } from "../../../lib/access";
import { databaseConfigured, transaction } from "../../../lib/database";

export type ReviewResult = { ok: boolean; message: string; inviteUrl: string | null };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const actor = session?.user?.email?.trim().toLowerCase();
  if (!actor || await roleForEmailAsync(actor) !== "administrador") {
    throw new Error("Ação exclusiva para administradores.");
  }
  if (!databaseConfigured) throw new Error("Banco da Biblioteca indisponível.");
  return actor;
}

/**
 * Request approval only creates a pending invitation, never activates an account.
 * The admin must privately share the one-use link.
 */
export async function approveMembership(
  _prior: ReviewResult,
  form: FormData,
): Promise<ReviewResult> {
  const actor = await requireAdmin();
  const id = String(form.get("requestId") ?? "");
  if (!UUID.test(id)) return { ok: false, message: "Solicitação inválida.", inviteUrl: null };

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  try {
    const outcome = await transaction(async (client) => {
      const r = await client.query<{ id: string; email: string; full_name: string }>(
        `SELECT id,email,full_name FROM biblioteca_membership_requests
         WHERE id=$1 AND status='pending' FOR UPDATE`,
        [id],
      );
      const request = r.rows[0];
      if (!request) return "not-pending";
      // Never allow a public request to modify an existing account, including legacy admins.
      const legacy = roleForEmail(request.email);
      const account = await client.query(
        "SELECT email FROM biblioteca_access_accounts WHERE email=$1",
        [request.email],
      );
      if (legacy || (account.rowCount ?? 0) > 0) return "already-account";

      await client.query(
        `INSERT INTO biblioteca_access_accounts(email,display_name,role,active,created_by)
          VALUES($1,$2,'experiencialista',false,$3)`,
        [request.email,request.full_name,actor],
      );
      const newInvite = await client.query<{ id: string }>(
        `INSERT INTO biblioteca_access_invites(email,token_hash,created_by,expires_at)
          VALUES($1,$2,$3,now()+interval '48 hours') RETURNING id`,
        [request.email,tokenHash,actor],
      );
      await client.query(
        `UPDATE biblioteca_membership_requests SET
           status='approved',updated_at=now(),reviewed_at=now(),reviewed_by=$2,invite_id=$3
         WHERE id=$1`,
        [id,actor,newInvite.rows[0].id],
      );
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
          VALUES($1,$2,'membership_request_approved',jsonb_build_object('requestId',$3::text,'role','experiencialista'))`,
        [actor,request.email,id],
      );
      return "approved";
    });
    if (outcome === "not-pending") return { ok: false, message: "Esta solicitação já foi analisada ou não existe. Atualize a lista.", inviteUrl: null };
    if (outcome === "already-account") return { ok: false, message: "Já existe uma conta vinculada a este e-mail. Verifique-a em Pessoas cadastradas, sem criar um novo convite aqui.", inviteUrl: null };

    const origin = (process.env.AUTH_URL || "https://biblioteca-atemporal-web.onrender.com").replace(/\/$/, "");
    return {
      ok: true,
      message: "Solicitação aprovada. Copie o convite abaixo antes de atualizar a lista; ele só será exibido agora, vence em 48 horas e exige que a pessoa defina uma senha.",
      inviteUrl: `${origin}/convite/${token}`,
    };
  } catch {
    return { ok: false, message: "Não foi possível aprovar. Nenhuma conta foi ativada.", inviteUrl: null };
  }
}

export async function rejectMembership(
  _prior: ReviewResult,
  form: FormData,
): Promise<ReviewResult> {
  const actor = await requireAdmin();
  const id = String(form.get("requestId") ?? "");
  if (!UUID.test(id)) return { ok: false, message: "Solicitação inválida.", inviteUrl: null };
  try {
    const found = await transaction(async (client) => {
      const r = await client.query<{ email: string }>(
        `UPDATE biblioteca_membership_requests
          SET status='rejected',updated_at=now(),reviewed_at=now(),reviewed_by=$2
          WHERE id=$1 AND status='pending' RETURNING email`,
        [id,actor],
      );
      if (!r.rows[0]) return false;
      await client.query(
        `INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
          VALUES($1,$2,'membership_request_rejected',jsonb_build_object('requestId',$3::text))`,
        [actor,r.rows[0].email,id],
      );
      return true;
    });
    return found
      ? { ok: true, message: "Solicitação recusada. Nenhum acesso foi criado; a lista será atualizada ao recarregar a página.", inviteUrl: null }
      : { ok: false, message: "Esta solicitação já foi analisada. Atualize a lista.", inviteUrl: null };
  } catch {
    return { ok: false, message: "Não foi possível recusar a solicitação.", inviteUrl: null };
  }
}
