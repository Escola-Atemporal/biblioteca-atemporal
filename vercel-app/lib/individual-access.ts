import "server-only";
import { databaseConfigured, dbQuery } from "./database";
import { roleForEmailAsync } from "./access";
import { can } from "./permissions";
import { LEARNING_TRAILS, resolveTrail } from "./learning-progress";

export type AccessResource = "drafts:read" | `trail:${(typeof LEARNING_TRAILS)[number]["slug"]}`;
const RESOURCES: readonly string[] = [
 "drafts:read", ...LEARNING_TRAILS.map(t => `trail:${t.slug}`)
];
export function isAccessResource(resource:string): resource is AccessResource {
 return RESOURCES.includes(resource);
}
/** Explicit per-user settings override the role's defaults. No setting means inherit. */
export async function permittedEmail(email:string|null|undefined, resource:AccessResource):Promise<boolean>{
 const normalized=email?.trim().toLowerCase();
 if(!normalized || !isAccessResource(resource))return false;
 const role=await roleForEmailAsync(normalized);
 if(!role)return false;
 const defaultAllowed=resource==="drafts:read" ? can(role,"drafts:read") : can(role,"tracks:read");
 // Administrative authority remains controlled by the account role, never by overrides.
 if(role==="administrador")return defaultAllowed;
 if(!databaseConfigured)return defaultAllowed;
 try{
  const [override]=await dbQuery<{allowed:boolean}>(
   "SELECT allowed FROM biblioteca_access_overrides WHERE email=$1 AND resource=$2 LIMIT 1",
   [normalized,resource]
  );
  return override ? override.allowed : defaultAllowed;
 }catch{
  // A failed lookup must never accidentally grant editorial access.
  return false;
 }
}
export async function permittedTrail(email:string|null|undefined,slug:string):Promise<boolean>{
 if(!resolveTrail(slug))return false;
 return permittedEmail(email,`trail:${slug}` as AccessResource);
}
export function defaultAccess(role:string,resource:AccessResource):boolean{
 if(role!=="administrador"&&role!=="curador"&&role!=="experiencialista")return false;
 return resource==="drafts:read" ? can(role,"drafts:read") : can(role,"tracks:read");
}
