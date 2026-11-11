"use server";

import { dbQuery, databaseConfigured } from "../../lib/database";

export type AccessRequestState = {
  ok: boolean;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public requests do not create accounts or issue credentials.
 * Approval and invitation creation are administrator-only actions.
 */
export async function submitAccessRequest(
  _previous: AccessRequestState,
  form: FormData,
): Promise<AccessRequestState> {
  if (!databaseConfigured) {
    return { ok: false, message: "As solicitações estão indisponíveis. Tente novamente mais tarde." };
  }
  // Honeypot field. A human does not see or fill it.
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
    // Global ceiling prevents uncontrolled write amplification on this initial public form.
    const [volume] = await dbQuery<{ total: number }>(
      "SELECT count(*)::integer AS total FROM biblioteca_membership_requests WHERE created_at > now() - interval '24 hours'",
    );
    if (Number(volume?.total || 0) >= 250) {
      return { ok: false, message: "O limite de solicitações foi atingido. Tente novamente amanhã." };
    }
    await dbQuery(
      `INSERT INTO biblioteca_membership_requests(full_name,email,context,privacy_ack)
       VALUES($1,$2,$3,true)
       ON CONFLICT(email) DO UPDATE SET
          full_name=EXCLUDED.full_name,
          context=EXCLUDED.context,
          status='pending',
          privacy_ack=true,
          created_at=now(),
          updated_at=now(),
          reviewed_at=NULL,
          reviewed_by=NULL,
          invite_id=NULL
       WHERE biblioteca_membership_requests.status='rejected'
         AND biblioteca_membership_requests.updated_at < now() - interval '30 days'`,
      [name, email, context],
    );
    // The identical reply avoids disclosing which email is registered or already in review.
    return {
      ok: true,
      message: "Solicitação recebida. A Escola avaliará o pedido. Caso seja aprovado, um convite de ativação será enviado por um canal definido pela equipe.",
    };
  } catch {
    return { ok: false, message: "Não foi possível registrar o pedido agora. Tente novamente mais tarde." };
  }
}
