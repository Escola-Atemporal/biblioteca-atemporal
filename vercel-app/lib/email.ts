import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { dbQuery, databaseConfigured } from "./database";

/**
 * Entrega transacional via Gmail API OAuth2 (conta Google autorizada).
 * O plugin Gmail do ChatGPT nao fornece credenciais ao Render.
 * A fila permanece cifrada e acesso publico exige liberacao explicita.
 */
export const emailProviderConfigured = Boolean(
  process.env.GMAIL_CLIENT_ID &&
  process.env.GMAIL_CLIENT_SECRET &&
  process.env.GMAIL_REFRESH_TOKEN &&
  process.env.GMAIL_FROM_EMAIL &&
  process.env.AUTH_SECRET,
);
/** Only activate public onboarding after a real inbox test and explicit approval. */
export const emailConfigured = emailProviderConfigured && process.env.BIBLIOTECA_EMAIL_ENABLED === "true";

export type EmailKind =
  | "request_received" | "request_admin" | "invitation"
  | "request_rejected" | "account_activated" | "password_reset"
  | "password_changed" | "access_status" | "role_changed";

export type EmailInput = {
  kind: EmailKind;
  to: string;
  subject: string;
  text: string;
  html: string;
  dedupeKey: string;
};

export type MailStatus = "sent" | "pending" | "failed";

type MailRow = {
  id: string; kind: string; recipient: string; subject: string;
  encrypted_payload: string; attempts: number;
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
export const emailOrigin = () => (process.env.AUTH_URL || "https://biblioteca-atemporal-web.onrender.com").replace(/\/$/, "");

export function adminNotificationEmails(): string[] {
  const raw = process.env.BIBLIOTECA_ADMIN_NOTIFICATION_EMAILS
    || process.env.BIBLIOTECA_ADMIN_EMAILS || "jen@escolaatemporal.com.br";
  return [...new Set(raw.split(",").map(v => v.trim().toLowerCase()).filter(isEmail))].slice(0,8);
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));
}

function cryptKey(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET ausente para cifragem de e-mails");
  return createHash("sha256").update("biblioteca-atm-outbox-v1\n").update(secret).digest();
}

function encryptPayload(text: string, html: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cryptKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify({text,html}),"utf8"),cipher.final()]);
  return [iv.toString("base64url"),cipher.getAuthTag().toString("base64url"),encrypted.toString("base64url")].join(".");
}
function decryptPayload(value: string): {text:string;html:string} {
  const [iv,tag,body] = value.split(".");
  if (!iv || !tag || !body) throw new Error("Invalid encrypted message");
  const decipher = createDecipheriv("aes-256-gcm", cryptKey(), Buffer.from(iv,"base64url"));
  decipher.setAuthTag(Buffer.from(tag,"base64url"));
  const plain = Buffer.concat([decipher.update(Buffer.from(body,"base64url")),decipher.final()]).toString("utf8");
  return JSON.parse(plain) as {text:string;html:string};
}

export function messageTemplate(args: {eyebrow:string; greeting:string; paragraphs:string[]; action?:{label:string;url:string}}): {html:string;text:string} {
  const paragraphs = args.paragraphs.map(t => `<p style="font:400 15px/1.75 Arial,sans-serif;color:#423847;margin:0 0 18px">${escapeHtml(t)}</p>`).join("");
  const action = args.action
    ? `<p style="margin:27px 0 25px"><a href="${escapeHtml(args.action.url)}" style="display:inline-block;background:#ffd309;color:#191719;padding:15px 22px;font:bold 14px/1.4 Arial,sans-serif;text-decoration:none;border-radius:2px">${escapeHtml(args.action.label)} →</a></p>`
    : "";
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="padding:0;margin:0;background:#f6f4f7;font-family:Arial,sans-serif"><table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:#f6f4f7"><tr><td align="center" style="padding:34px 14px"><table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;max-width:570px;border-top:5px solid #ffd309;background:white"><tr><td style="padding:12px 32px 8px;background:#fff"><a href="${emailOrigin()}" style="display:inline-block;text-decoration:none"><img src="${emailOrigin()}/branding/logo-escola-atemporal-email.png" alt="Escola Atemporal" width="220" height="109" style="display:block;width:220px;height:auto;max-width:100%;border:0;outline:none;text-decoration:none" /></a></td></tr><tr><td style="padding:14px 32px 32px"><div style="font:bold 11px Arial,sans-serif;letter-spacing:1.4px;color:#634995;margin-bottom:24px">${escapeHtml(args.eyebrow.toUpperCase())}</div><h1 style="font:bold 29px/1.2 Arial,sans-serif;color:#242027;margin:0 0 23px">${escapeHtml(args.greeting)}</h1>${paragraphs}${action}<p style="border-top:1px solid #e8e2ea;padding-top:20px;font:12px/1.6 Arial,sans-serif;color:#726877">Esta é uma comunicação de acesso à Biblioteca Atemporal. Não responda com senhas ou dados confidenciais. Se não reconhece esta ação, desconsidere a mensagem e contate a Escola.</p></td></tr></table></td></tr></table></body></html>`;
  const text = [args.eyebrow,args.greeting,...args.paragraphs,args.action?`${args.action.label}: ${args.action.url}`:null,"Escola Atemporal — Biblioteca"].filter(Boolean).join("\n\n");
  return {html,text};
}

export function createEmail(kind: EmailKind, to: string, subject: string, opts: Parameters<typeof messageTemplate>[0], dedupeKey: string): EmailInput {
  const rendered = messageTemplate(opts);
  return {kind,to,subject,html:rendered.html,text:rendered.text,dedupeKey};
}

/** Enfileira dentro da mesma transação que cria o convite ou atualiza a conta. */
export async function enqueueEmail(client: PoolClient, mail: EmailInput): Promise<string|null> {
  const address = mail.to.trim().toLowerCase();
  if (!isEmail(address)) return null;
  const id = randomUUID();
  const rows = await client.query<{id:string}>(
    `INSERT INTO biblioteca_email_outbox
       (id,kind,recipient,subject,encrypted_payload,dedupe_key)
     VALUES($1,$2,$3,$4,$5,$6)
     ON CONFLICT(dedupe_key) DO NOTHING RETURNING id`,
    [id,mail.kind,address,mail.subject.slice(0,180),encryptPayload(mail.text,mail.html),mail.dedupeKey],
  );
  return rows.rows[0]?.id ?? null;
}

/** Uma tentativa imediata por requisição; falhas persistem na fila. */
export async function deliverEmail(id: string): Promise<MailStatus> {
  if (!databaseConfigured) return "failed";
  if (!emailProviderConfigured) return "pending";
  const rows = await dbQuery<MailRow>(
    `UPDATE biblioteca_email_outbox SET status='sending',
       attempts=attempts+1,next_attempt_at=now()+interval '2 minutes'
     WHERE id=$1 AND status IN ('pending','failed','sending')
       AND next_attempt_at<=now() AND attempts<8
     RETURNING id,kind,recipient,subject,encrypted_payload,attempts`,
    [id],
  );
  const mail = rows[0];
  if (!mail) return "pending";
  try {
    const from = String(process.env.GMAIL_FROM_EMAIL).trim();
    if (!isEmail(from) || /[\r\n]/.test(from)) throw new Error("Remetente Gmail invalido");
    const {text,html} = decryptPayload(mail.encrypted_payload);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: new URLSearchParams({
        client_id: String(process.env.GMAIL_CLIENT_ID),
        client_secret: String(process.env.GMAIL_CLIENT_SECRET),
        refresh_token: String(process.env.GMAIL_REFRESH_TOKEN),
        grant_type: "refresh_token",
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error(`Gmail OAuth HTTP ${tokenResponse.status}`);
    const tokenData = await tokenResponse.json() as {access_token?:string};
    if (!tokenData.access_token) throw new Error("Gmail OAuth sem access_token");

    const encodeBody = (value:string) => Buffer.from(value,"utf8").toString("base64").match(/.{1,76}/g)?.join("\r\n") ?? "";
    const safeRecipient = mail.recipient.trim().toLowerCase();
    if (!isEmail(safeRecipient)) throw new Error("Destinatario invalido");
    const safeSubject = mail.subject.replace(/[\r\n]/g," ").slice(0,180);
    const mimeSubject = `=?UTF-8?B?${Buffer.from(safeSubject,"utf8").toString("base64")}?=`;
    const boundary = `atm-${randomUUID()}`;
    const mime = [
      `From: Escola Atemporal <${from}>`,
      `To: <${safeRecipient}>`,
      `Subject: ${mimeSubject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      encodeBody(text),
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      encodeBody(html),
      `--${boundary}--`,
      "",
    ].join("\r\n");
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({raw: Buffer.from(mime,"utf8").toString("base64url")}),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Gmail API HTTP ${response.status}`);
    const data = await response.json() as {id?:string};
    await dbQuery(
      `UPDATE biblioteca_email_outbox
       SET status='sent',sent_at=now(),last_error=NULL,provider_id=$2
       WHERE id=$1`,
      [mail.id, data.id ?? null],
    );
    return "sent";
  } catch (err) {
    const errorText = err instanceof Error ? err.message.slice(0,180) : "Unknown delivery error";
    await dbQuery(
      `UPDATE biblioteca_email_outbox
       SET status='failed',last_error=$2,
         next_attempt_at=now() + (LEAST(attempts,8) * interval '10 minutes')
       WHERE id=$1`,
      [mail.id,errorText],
    );
    return "failed";
  }
}

export async function sendEmailBatch(ids: (string|null)[]): Promise<MailStatus[]> {
  return Promise.all(ids.filter((id):id is string=>Boolean(id)).map(id=>deliverEmail(id)));
}
