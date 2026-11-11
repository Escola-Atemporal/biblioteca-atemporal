import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { databaseConfigured, dbQuery } from "./database";
import type { Role } from "./access";

export type ContaComSenha = {
  email: string;
  passwordHash: string;
  role: Role;
  name?: string;
};

type ContaBanco = {
  email: string;
  display_name: string;
  role: Role;
  password_hash: string | null;
  active: boolean;
};

const ROLES: Role[] = ["administrador", "curador", "experiencialista"];
const HASH_PATTERN = /^scrypt:16384:8:1:[0-9a-f]{32}:[0-9a-f]{128}$/;

/** Only legacy/bootstrap account hashes stored as a Render environment variable. */
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
        && HASH_PATTERN.test(u.passwordHash)
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
  return Boolean(process.env.AUTH_SECRET && (databaseConfigured || contasComSenha().length));
}

const attempts = new Map<string, { failures: number; nextTry: number }>();
const LIMIT = 7;
const WINDOW_MS = 15 * 60_000;
function isRateLimited(email: string): boolean {
  const record = attempts.get(email);
  if (!record) return false;
  if (Date.now() >= record.nextTry) {
    attempts.delete(email);
    return false;
  }
  return record.failures >= LIMIT;
}
function recordFailure(email: string) {
  const now = Date.now();
  const old = attempts.get(email);
  if (!old || old.nextTry <= now) attempts.set(email, { failures: 1, nextTry: now + WINDOW_MS });
  else attempts.set(email, { failures: old.failures + 1, nextTry: old.nextTry });
  if (attempts.size > 3000) {
    for (const [key, value] of attempts) if (value.nextTry <= now) attempts.delete(key);
    if (attempts.size > 3000) attempts.delete(attempts.keys().next().value ?? "");
  }
}

export function hashPassword(password: string): string {
  if (password.length < 12 || password.length > 256) throw new Error("Password length invalid");
  const salt = randomBytes(16);
  const hashed = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt:16384:8:1:${salt.toString("hex")}:${hashed.toString("hex")}`;
}

function matchesPassword(password: string, encoded: string): boolean {
  if (!HASH_PATTERN.test(encoded)) return false;
  const parts = encoded.split(":");
  const salt = parts[4];
  const expected = Buffer.from(parts[5], "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), 64, {
    N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024,
  });
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

/** Authenticate persistent accounts first; fall back only to existing bootstrap users. */
export async function autenticarComSenha(emailInput: unknown, passwordInput: unknown) {
  if (typeof emailInput !== "string" || typeof passwordInput !== "string") return null;
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return null;
  if (passwordInput.length < 10 || passwordInput.length > 256) return null;
  if (isRateLimited(email)) return null;

  let account: { email: string; name: string; hash: string } | null = null;
  if (databaseConfigured) {
    try {
      const [user] = await dbQuery<ContaBanco>(
        "SELECT email, display_name, role, active, password_hash FROM biblioteca_access_accounts WHERE email = $1 LIMIT 1",
        [email],
      );
      if (user) {
        // A disabled account or a pending invitation always overrides bootstrap credentials.
        if (!user.active || !user.password_hash) { recordFailure(email); return null; }
        account = { email: user.email, name: user.display_name, hash: user.password_hash };
      }
    } catch {
      // Never fall back to an environment-allowlisted user when revocation cannot be checked.
      return null;
    }
  }
  if (!account) {
    const legacy = contasComSenha().find((u) => u.email === email);
    if (legacy) account = { email: legacy.email, name: legacy.name || "Comunidade Escola Atemporal", hash: legacy.passwordHash };
  }
  let valid = false;
  if (account) {
    try { valid = matchesPassword(passwordInput, account.hash); } catch { valid = false; }
  }
  if (!account || !valid) { recordFailure(email); return null; }
  attempts.delete(email);
  return { id: account.email, email: account.email, name: account.name };
}
