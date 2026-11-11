import { scryptSync, timingSafeEqual } from "node:crypto";
import type { Role } from "./access";

export type ContaComSenha = {
  email: string;
  passwordHash: string;
  role: Role;
  name?: string;
};

const ROLES: Role[] = ["administrador", "curador", "experiencialista"];

/**
 * Never store plain-text passwords in GitHub.
 * Provision accounts with BIBLIOTECA_PASSWORD_USERS on Render only.
 *
 * Hash format: scrypt:16384:8:1:<32-hex-character-salt>:<128-hex-character-hash>
 * Passwords should be generated individually and never reused.
 */
export function contasComSenha(): ContaComSenha[] {
  const raw = process.env.BIBLIOTECA_PASSWORD_USERS;
  if (!raw) return [];
  try {
    const records: unknown = JSON.parse(raw);
    if (!Array.isArray(records)) return [];
    return records.filter((v): v is ContaComSenha => {
      if (typeof v !== "object" || v === null) return false;
      const u = v as Record<string, unknown>;
      return typeof u.email === "string"
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email)
        && typeof u.passwordHash === "string"
        && /^scrypt:16384:8:1:[0-9a-f]{32}:[0-9a-f]{128}$/.test(u.passwordHash)
        && ROLES.includes(u.role as Role);
    }).map((u) => ({
      email: u.email.trim().toLowerCase(),
      passwordHash: u.passwordHash,
      role: u.role,
      name: typeof u.name === "string" ? u.name.slice(0, 90) : undefined,
    }));
  } catch {
    return [];
  }
}

export function senhaConfigurada(): boolean {
  return Boolean(process.env.AUTH_SECRET && contasComSenha().length);
}

const attempts = new Map<string, { failures: number; nextTry: number }>();
const LIMIT = 7;
const WINDOW_MS = 15 * 60_000;

function isRateLimited(key: string): boolean {
  const record = attempts.get(key);
  if (!record) return false;
  if (Date.now() >= record.nextTry) {
    attempts.delete(key);
    return false;
  }
  return record.failures >= LIMIT;
}
function recordFailure(key: string) {
  const now = Date.now();
  const old = attempts.get(key);
  if (!old || old.nextTry <= now) attempts.set(key, { failures: 1, nextTry: now + WINDOW_MS });
  else attempts.set(key, { failures: old.failures + 1, nextTry: old.nextTry });
  // Bounded memory even if requests target many unrelated emails.
  if (attempts.size > 3000) {
    for (const [entry, value] of attempts) {
      if (value.nextTry <= now) attempts.delete(entry);
    }
    if (attempts.size > 3000) attempts.delete(attempts.keys().next().value ?? "");
  }
}

function matchesPassword(password: string, encoded: string): boolean {
  const parts = encoded.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const salt = parts[4];
  const expected = Buffer.from(parts[5], "hex");
  if (expected.length !== 64) return false;
  const actual = scryptSync(password, Buffer.from(salt, "hex"), 64, {
    N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actual, expected);
}

/**
 * Called by Auth.js exclusively on the server.
 * Note: an in-memory rate limit protects the current Render instance;
 * a shared store will be required if we expand to multiple instances.
 */
export function autenticarComSenha(emailInput: unknown, passwordInput: unknown) {
  if (typeof emailInput !== "string" || typeof passwordInput !== "string") return null;
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return null;
  if (!passwordInput || passwordInput.length > 256) return null;
  const key = email;
  if (isRateLimited(key)) return null;

  const account = contasComSenha().find((a) => a.email === email);
  let verified = false;
  if (account) {
    try { verified = matchesPassword(passwordInput, account.passwordHash); }
    catch { verified = false; }
  }
  if (!account || !verified) {
    recordFailure(key);
    return null;
  }
  attempts.delete(key);
  return { id: account.email, email: account.email, name: account.name ?? "Comunidade Escola Atemporal" };
}
