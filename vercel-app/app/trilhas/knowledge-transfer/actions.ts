"use server";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { dbQuery } from "../../../lib/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function identity() {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email || await roleForEmailAsync(email) !== "administrador") redirect("/painel?acesso=restrito");
  return email;
}
function numberField(data: FormData, key: string, max: number) {
  const raw = data.get(key);
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) throw new Error("Entrada inválida");
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new Error("Entrada inválida");
  return n;
}
export async function saveLesson(data: FormData) {
  const email = await identity();
  const moduleNo = numberField(data,"module",12);
  const lessonNo = numberField(data,"lesson",3);
  const reflection = data.get("reflection");
  if (typeof reflection !== "string" || reflection.length > 5000) throw new Error("Reflexão inválida");
  const completed = data.get("completed") === "on";
  await dbQuery("INSERT INTO biblioteca_institutional_progress(email,module_no,lesson_no,reflection,completed) SELECT $1,module_no,lesson_no,$4,$5 FROM biblioteca_institutional_lessons WHERE module_no=$2 AND lesson_no=$3 AND published=true ON CONFLICT(email,module_no,lesson_no) DO UPDATE SET reflection=excluded.reflection,completed=excluded.completed,updated_at=now()",[email,moduleNo,lessonNo,reflection,completed]);
  revalidatePath("/trilhas/knowledge-transfer");
  redirect("/trilhas/knowledge-transfer#modulo-"+moduleNo);
}
export async function submitQuiz(data: FormData) {
  const email = await identity();
  const moduleNo = numberField(data,"module",12);
  const answer = numberField(data,"answer",3)-1;
  await dbQuery("INSERT INTO biblioteca_institutional_quiz_attempts(email,module_no,passed,attempts) SELECT $1,q.module_no,q.correct_index=$3,1 FROM biblioteca_institutional_quizzes q WHERE q.module_no=$2 AND (SELECT count(*) FROM biblioteca_institutional_lessons l WHERE l.module_no=q.module_no AND l.published=true)=3 AND (SELECT count(*) FROM biblioteca_institutional_progress p JOIN biblioteca_institutional_lessons l USING(module_no,lesson_no) WHERE p.email=$1 AND p.module_no=q.module_no AND p.completed AND l.published)=3 ON CONFLICT(email,module_no) DO UPDATE SET passed=biblioteca_institutional_quiz_attempts.passed OR excluded.passed,attempts=biblioteca_institutional_quiz_attempts.attempts+1,updated_at=now()",[email,moduleNo,answer]);
  revalidatePath("/trilhas/knowledge-transfer");
  redirect("/trilhas/knowledge-transfer#modulo-"+moduleNo);
}
