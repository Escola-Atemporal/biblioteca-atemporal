"use server";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { can } from "../../../lib/permissions";
import { databaseConfigured, transaction } from "../../../lib/database";
import { isAccessResource, type AccessResource } from "../../../lib/individual-access";

const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export type AccessUpdateState={ok:boolean;message:string};
export async function saveIndividualAccess(_previous:AccessUpdateState,form:FormData):Promise<AccessUpdateState>{
 const session=await auth();
 const actor=session?.user?.email?.trim().toLowerCase();
 if(!actor||!can(await roleForEmailAsync(actor),"users:manage"))throw new Error("Permissão administrativa necessária.");
 if(!databaseConfigured)return {ok:false,message:"Banco indisponível. Nenhuma permissão foi alterada."};
 const email=String(form.get("email")??"").trim().toLowerCase();
 const resource=String(form.get("resource")??"");
 const mode=String(form.get("mode")??"");
 if(!EMAIL.test(email)||email.length>254||!isAccessResource(resource)||!["inherit","allow","deny"].includes(mode))
  return {ok:false,message:"Verifique o participante e o nível de acesso."};
 if(email===actor)return {ok:false,message:"O administrador não pode alterar as próprias permissões individuais."};
 try{
  const result=await transaction(async client=>{
   const target=await client.query<{role:string;active:boolean}>(
    "SELECT role,active FROM biblioteca_access_accounts WHERE email=$1 FOR UPDATE",[email]);
   if(!target.rows.length)return "missing";
   if(target.rows[0].role==="administrador")return "admin";
   if(mode==="inherit"){
    await client.query("DELETE FROM biblioteca_access_overrides WHERE email=$1 AND resource=$2",[email,resource]);
   }else{
    await client.query(`INSERT INTO biblioteca_access_overrides(email,resource,allowed,updated_by,updated_at)
       VALUES($1,$2,$3,$4,now())
       ON CONFLICT(email,resource) DO UPDATE SET allowed=EXCLUDED.allowed,updated_by=EXCLUDED.updated_by,updated_at=now()`,
      [email,resource,mode==="allow",actor]);
   }
   await client.query(`INSERT INTO biblioteca_access_audit(actor_email,target_email,action,details)
       VALUES($1,$2,'individual_permission_changed',jsonb_build_object('resource',$3::text,'mode',$4::text))`,
       [actor,email,resource,mode]);
   return "saved";
  });
  if(result==="missing")return {ok:false,message:"Conta não encontrada. Convide a pessoa primeiro."};
  if(result==="admin")return {ok:false,message:"Contas administrativas mantêm permissões definidas pelo perfil."};
  revalidatePath("/painel/usuarios");
  revalidatePath("/painel");
  return {ok:true,message:"Permissão individual atualizada. A alteração vale nos próximos acessos."};
 }catch{
  return {ok:false,message:"Não foi possível salvar a permissão. Nenhuma alteração foi confirmada."};
 }
}
