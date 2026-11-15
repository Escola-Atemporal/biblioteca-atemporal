/**
 * Pure per-account authorization decision, without DB or session dependencies.
 * Null means "inherit role default"; false means an explicit denial.
 * Administrators cannot be changed by individual overrides.
 */
export type AccessRole = "administrador" | "curador" | "experiencialista" | null;
export function resolveIndividualDecision(
  role: AccessRole,
  defaultAllowed: boolean,
  override: boolean | null,
): boolean {
  if (role === null) return false;
  if (role === "administrador") return defaultAllowed;
  return override === null ? defaultAllowed : override;
}
