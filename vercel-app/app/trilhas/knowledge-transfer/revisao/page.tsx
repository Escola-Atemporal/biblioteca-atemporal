import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { roleForEmailAsync } from "../../../../lib/access";
import { dbQuery } from "../../../../lib/database";
import { reviewPractical } from "../actions";
import styles from "../learning.module.css";
export const dynamic="force-dynamic";
export const metadata={title:"Revisão de atividades | Biblioteca Atemporal",robots:{index:false,follow:false,noarchive:true}};
const criteria=["Coerência","Precisão","Viabilidade","Proteção de dados","Estados e rastreabilidade","Evidências de passagem"];
type Submission={email:string;module_no:number;version:number;module_title:string;work_text:string;self_review:string};
export default async function ReviewPage({searchParams}:{searchParams:Promise<{resultado?:string}>}){
 const session=await auth();
 const email=session?.user?.email?.trim().toLowerCase();
 if(!email||await roleForEmailAsync(email)!=="administrador") redirect("/painel?acesso=restrito");
 let pending:Submission[]=[];let unavailable=false;
 try { pending=await dbQuery<Submission>("SELECT s.email,s.module_no,s.version,l.module_title,s.work_text,s.self_review FROM biblioteca_institutional_practical_submissions s JOIN biblioteca_institutional_practical_review_assignments a ON a.email=s.email AND a.module_no=s.module_no AND a.reviewer_email=$1 JOIN biblioteca_institutional_lessons l ON l.module_no=s.module_no AND l.lesson_no=5 AND l.published=true LEFT JOIN biblioteca_institutional_practical_reviews r ON r.email=s.email AND r.module_no=s.module_no AND r.version=s.version WHERE s.status='submitted' AND s.email<>$1 AND r.email IS NULL ORDER BY s.updated_at LIMIT 30",[email]); } catch {unavailable=true;}
 const result=(await searchParams).resultado;
 return <main className={"learning-page referencia-trilha01 "+styles.brandPage}><section className={"learning-section learning-wrap "+styles.course}><Link href="/trilhas/knowledge-transfer">← Voltar à formação</Link><h1>Revisão de atividades práticas</h1><p>Acesso limitado às atribuições autorizadas. Avalie a versão entregue, não a pessoa. O parecer pedagógico não equivale à certificação institucional.</p>{result==="registrado"&&<p role="status">Parecer registrado.</p>}{result==="indisponivel"&&<p role="status">Entrega indisponível, não atribuída ou já revisada.</p>}{unavailable?<p>Revisão temporariamente indisponível.</p>:!pending.length?<p>Nenhuma entrega pendente atribuída a você.</p>:pending.map(s=><article key={s.email+"-"+s.module_no+"-"+s.version} className={styles.activity}><h2>Módulo {s.module_no} · {s.module_title}</h2><p>{s.email} · Versão {s.version}</p><h3>Entrega</h3><p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{s.work_text}</p><h3>Autoavaliação</h3><p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{s.self_review}</p><form action={reviewPractical} className={styles.form}><input type="hidden" name="learner" value={s.email}/><input type="hidden" name="module" value={s.module_no}/><input type="hidden" name="version" value={s.version}/><p>0 = ausência ou contradição; 1 = parcial; 2 = demonstração consistente. Critério pedagógico proposto: 10/12, nenhuma dimensão zerada e nenhuma falha crítica.</p>{criteria.map((c,i)=><label key={c}>{c}<select name={"score"+i} required defaultValue=""><option value="" disabled>Selecione</option><option value="1">0 — Ausente ou contraditório</option><option value="2">1 — Parcial</option><option value="3">2 — Consistente</option></select></label>)}<label>Falha crítica<select name="critical" required defaultValue=""><option value="" disabled>Selecione</option><option value="no">Não</option><option value="yes">Sim</option></select></label><label>Parecer, evidências e correções necessárias<textarea name="feedback" required maxLength={4000} rows={5}/></label><button type="submit" className="primary">Registrar parecer da versão</button></form></article>)}</section></main>;
}
