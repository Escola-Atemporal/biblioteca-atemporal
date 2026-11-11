import { contasComSenha } from "./password-login";
import { dbQuery, databaseConfigured } from "./database";

export type Role = "administrador" | "curador" | "experiencialista";
type AccountRow = { email: string; role: Role; active: boolean };

function list(name: string): Set<string> {
  return new Set((process.env[name] ?? "").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean));
}

/** Legacy bootstrap and Google OAuth allowlists, always server-side. */
export function roleForEmail(email: string | null | undefined): Role | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  if (list("BIBLIOTECA_ADMIN_EMAILS").has(normalized)) return "administrador";
  if (list("BIBLIOTECA_CURATOR_EMAILS").has(normalized)) return "curador";
  if (list("BIBLIOTECA_MEMBER_EMAILS").has(normalized)) return "experiencialista";
  return contasComSenha().find((u) => u.email === normalized)?.role ?? null;
}

/**
 * Database overrides legacy roles to allow immediate account revocation.
 * On database errors fail closed to avoid reviving disabled sessions.
 */
export async function roleForEmailAsync(email: string | null | undefined): Promise<Role | null> {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  if (!databaseConfigured) return roleForEmail(normalized);
  try {
    const accounts = await dbQuery<AccountRow>(
      "SELECT email, role, active FROM biblioteca_access_accounts WHERE email = $1 LIMIT 1",
      [normalized],
    );
    if (accounts.length) return accounts[0].active ? accounts[0].role : null;
    return roleForEmail(normalized);
  } catch {
    return null;
  }
}

export async function isEditor(email: string | null | undefined): Promise<boolean> {
  const role = await roleForEmailAsync(email);
  return role === "administrador" || role === "curador";
}
