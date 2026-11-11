import type { Role } from "./access";

/** One authoritative authorization matrix for Biblioteca resources. */
export type Capability = "tracks:read" | "drafts:read" | "users:manage" | "analytics:read" | "emails:manage";
const CAPABILITIES: Readonly<Record<Role, ReadonlySet<Capability>>> = {
  experiencialista: new Set(["tracks:read"]),
  curador: new Set(["tracks:read", "drafts:read"]),
  administrador: new Set(["tracks:read", "drafts:read", "users:manage", "analytics:read", "emails:manage"]),
};
export function can(role: Role | null | undefined, capability: Capability): boolean {
  return role === "administrador" || role === "curador" || role === "experiencialista"
    ? CAPABILITIES[role].has(capability)
    : false;
}
