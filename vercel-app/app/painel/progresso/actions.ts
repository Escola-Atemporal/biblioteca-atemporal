"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { can } from "../../../lib/permissions";
import { databaseConfigured,dbQuery } from "../../../lib/database";
import { resolveTrail,validSection, type LearningStatus } from "../../../lib/learning-progress";

export async function saveLearningProgress(form:FormData){
  const session=await auth();
  const email=session?.user?.email?.trim().toLowerCase();
  if(!email || !can(await roleForEmailAsync(email),"tracks:read")) throw new Error("Não autorizado.");
  if(!databaseConfigured)throw new Error("Banco de dados indisponível.");
  const slug=String(form.get("trail")??"");
  const section=String(form.get("section")??"");
  const status=String(form.get("status")??"") as LearningStatus;
  if(!resolveTrail(slug)||!validSection(slug,section)||!["iniciada","em_andamento","concluida"].includes(status))
    throw new Error("Progresso inválido.");
  await dbQuery(`INSERT INTO biblioteca_learning_progress (email,trail_slug,status,section_id,completed_at)
    VALUES ($1,$2,$3,$4,CASE WHEN $3::text='concluida' THEN now() ELSE NULL END)
    ON CONFLICT(email,trail_slug) DO UPDATE SET
      status=EXCLUDED.status,section_id=EXCLUDED.section_id,updated_at=now(),
      completed_at=CASE WHEN EXCLUDED.status='concluida' THEN COALESCE(biblioteca_learning_progress.completed_at,now()) ELSE NULL END`,
    [email,slug,status,section]);
  revalidatePath("/painel");
  redirect("/painel?progresso=salvo");
}
