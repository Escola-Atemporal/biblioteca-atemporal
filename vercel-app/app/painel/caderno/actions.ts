"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { can } from "../../../lib/permissions";
import { databaseConfigured, dbQuery } from "../../../lib/database";
import { resolveTrail } from "../../../lib/learning-progress";

async function requireOwner(){
  const session=await auth();
  const email=session?.user?.email?.trim().toLowerCase();
  if(!email || !can(await roleForEmailAsync(email),"tracks:read"))throw new Error("Acesso não autorizado.");
  if(!databaseConfigured)throw new Error("Caderno indisponível.");
  return email;
}
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function saveReflection(form:FormData):Promise<void>{
 const email=await requireOwner();
 const id=String(form.get("id")??"").trim();
 const trail=String(form.get("trail")??"");
 const title=String(form.get("title")??"").trim().replace(/\s+/g," ");
 const content=String(form.get("content")??"").trim();
 if(!resolveTrail(trail)||title.length<1||title.length>120||content.length<1||content.length>8000|| (id!==""&&!UUID.test(id)))
   throw new Error("Verifique título e reflexão (até 8.000 caracteres).");
 if(id){
   await dbQuery(`UPDATE biblioteca_reflection_notes
       SET title=$1,content=$2,trail_slug=$3,updated_at=now()
       WHERE id=$4::uuid AND email=$5`,[title,content,trail,id,email]);
 }else{
   await dbQuery(`INSERT INTO biblioteca_reflection_notes(email,trail_slug,title,content)
       VALUES($1,$2,$3,$4)`,[email,trail,title,content]);
 }
 revalidatePath("/painel/caderno");
 redirect("/painel/caderno?registro=salvo#reflection-list-title");
}
export async function deleteReflection(form:FormData):Promise<void>{
 const email=await requireOwner();
 const id=String(form.get("id")??"");
 if(!UUID.test(id))throw new Error("Registro inválido.");
 await dbQuery("DELETE FROM biblioteca_reflection_notes WHERE id=$1::uuid AND email=$2",[id,email]);
 revalidatePath("/painel/caderno");
 redirect("/painel/caderno?registro=excluido#reflection-list-title");
}
