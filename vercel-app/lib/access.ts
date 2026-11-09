export type Role = "administrador" | "curador" | "experiencialista";

function list(name: string): Set<string> {
  return new Set((process.env[name] ?? "").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean));
}

/** Server-only allowlist. A logged-in Google account is not automatically a member. */
export function roleForEmail(email: string | null | undefined): Role | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  if (list("BIBLIOTECA_ADMIN_EMAILS").has(normalized)) return "administrador";
  if (list("BIBLIOTECA_CURATOR_EMAILS").has(normalized)) return "curador";
  if (list("BIBLIOTECA_MEMBER_EMAILS").has(normalized)) return "experiencialista";
  return null;
}
