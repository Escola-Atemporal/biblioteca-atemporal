import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { databaseConfigured, dbQuery } from "../../../lib/database";
import BrandLogo from "../../components/BrandLogo";
import { saveLesson, submitQuiz } from "./actions";
import styles from "./learning.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Formação institucional | Biblioteca Atemporal", robots: { index: false, follow: false, noarchive: true } };

type Lesson = { module_no:number; lesson_no:number; module_title:string; title:string; body:string; practice:string; reflection:string; source_url:string|null };
type Progress = {module_no:number;lesson_no:number;reflection:string;completed:boolean};
type Quiz = {module_no:number;question:string;options:string[]};
type Attempt = {module_no:number;passed:boolean;attempts:number};

export default async function KnowledgeTransfer() {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email || await roleForEmailAsync(email) !== "administrador") redirect("/painel?acesso=restrito");
  let lessons:Lesson[]=[];
  let progress:Progress[]=[];
  let quizzes:Quiz[]=[];
  let attempts:Attempt[]=[];
  let unavailable=!databaseConfigured;
  if(databaseConfigured) {
    try {
      [lessons,progress,quizzes,attempts]=await Promise.all([
        dbQuery<Lesson>("SELECT module_no,lesson_no,module_title,title,body,practice,reflection,source_url FROM biblioteca_institutional_lessons WHERE published=true ORDER BY module_no,lesson_no"),
        dbQuery<Progress>("SELECT module_no,lesson_no,reflection,completed FROM biblioteca_institutional_progress WHERE email=$1",[email]),
        dbQuery<Quiz>("SELECT module_no,question,options FROM biblioteca_institutional_quizzes ORDER BY module_no"),
        dbQuery<Attempt>("SELECT module_no,passed,attempts FROM biblioteca_institutional_quiz_attempts WHERE email=$1",[email])
      ]);
    } catch { unavailable=true; }
  }
  const modules=[...new Set(lessons.map(l=>l.module_no))];
  const completed=(l:Lesson)=>progress.some(p=>p.module_no===l.module_no && p.lesson_no===l.lesson_no && p.completed);
  const done=lessons.filter(completed).length;
  const ready=(n:number)=>{const group=lessons.filter(l=>l.module_no===n);return group.length>0&&group.every(completed);};
  const passed=modules.filter(n=>ready(n)&&attempts.some(a=>a.module_no===n&&a.passed)).length;
  const next=lessons.find(l=>!completed(l));
  return <main className="learning-page referencia-trilha01">
    <header className="topbar"><BrandLogo/><nav aria-label="Navegação"><Link href="/painel">Meu painel ↗</Link></nav></header>
    <section className="learning-hero"><div className="learning-wrap">
      <div className="learning-hero-copy"><span className="eyebrow">FORMAÇÃO INSTITUCIONAL · TRILHA 07</span><h1>Knowledge <em>Transfer.</em></h1><p className="learning-lead">Da essência à prática.</p><p>Um percurso reservado de aprendizagem e continuidade institucional.</p></div>
      <div className="learning-facts"><span>{modules.length} módulos</span><span>{lessons.length} aulas disponíveis</span><span>Acesso restrito</span>{!unavailable&&<span>{done}/{lessons.length} aulas concluídas · {passed}/{modules.length} módulos aprovados</span>}</div>
    </div></section>
    <div aria-hidden="true" style={{height:5,background:"linear-gradient(90deg,#C60344,#E35918,#FFD201,#82B41B,#0BB4D7,#624993)"}}/>
    <section className={"learning-section learning-wrap "+styles.course} aria-label="Módulos">
      {!unavailable&&lessons.length>0&&<div className={styles.progress}><label htmlFor="institutional-progress">Seu progresso</label><progress id="institutional-progress" value={done} max={lessons.length} className={styles.progressBar}/>{next&&<a href={"#aula-"+next.module_no+"-"+next.lesson_no}>Retomar próxima aula ↗</a>}{lessons.length>0&&done===lessons.length&&passed===modules.length&&<p role="status">Percurso concluído. Certificação sujeita à validação institucional.</p>}</div>}
      {unavailable?<p role="status">Conteúdo temporariamente indisponível. Consulte a administração.</p>:!lessons.length?<p role="status">Conteúdo em preparação.</p>:<><nav aria-label="Índice dos módulos" className={styles.index}>{modules.map(n=><a key={n} href={"#modulo-"+n} className={styles.indexItem}><strong>{String(n).padStart(2,"0")} · {lessons.find(l=>l.module_no===n)?.module_title}</strong><br/>{lessons.filter(l=>l.module_no===n&&completed(l)).length}/{lessons.filter(l=>l.module_no===n).length} aulas</a>)}</nav>{modules.map(n=>{
        const quiz=quizzes.find(q=>q.module_no===n);
        const attempt=attempts.find(a=>a.module_no===n);
        return <section key={n} id={"modulo-"+n} className={styles.module}>
          <span className={styles.kicker}>MÓDULO {String(n).padStart(2,"0")}</span><h2>{lessons.find(l=>l.module_no===n)?.module_title}</h2>
          {lessons.filter(l=>l.module_no===n).map(l=>{
            const saved=progress.find(p=>p.module_no===n&&p.lesson_no===l.lesson_no);
            return <details key={l.lesson_no} id={"aula-"+n+"-"+l.lesson_no} open={next?.module_no===n&&next?.lesson_no===l.lesson_no} className={styles.lesson}>
              <summary className={styles.lessonHeader}><span className={styles.lessonNumber}>{String(l.lesson_no).padStart(2,"0")}</span><span><small>AULA {String(n).padStart(2,"0")}.{String(l.lesson_no).padStart(2,"0")}</small><strong>{l.title}</strong></span><span className={styles.status}>{saved?.completed?"Concluída":"Estudar"}</span></summary>
              <div className={styles.lessonContent}><article className={styles.reading}><span className={styles.kicker}>01 · MATERIAL DE ESTUDO</span>{l.body.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</article><aside className={styles.resources}><h3>Material de referência</h3>{l.source_url&&/^https:\/\//.test(l.source_url)?<a href={l.source_url} target="_blank" rel="noopener noreferrer">Abrir fonte original ↗</a>:<p>Consulte as referências indicadas no texto.</p>}</aside><section className={styles.activity}><span className={styles.kicker}>02 · APLICAÇÃO</span><h3>Prática orientada</h3><p>{l.practice}</p></section><section className={styles.reflect}><span className={styles.kicker}>03 · REFLEXÃO</span><h3>Conecte à sua realidade</h3><p>{l.reflection}</p></section></div>
              <form action={saveLesson} className={styles.form}>
                <input type="hidden" name="module" value={n}/><input type="hidden" name="lesson" value={l.lesson_no}/>
                <label htmlFor={"reflection-"+n+"-"+l.lesson_no}>Sua reflexão individual</label>
                <textarea id={"reflection-"+n+"-"+l.lesson_no} name="reflection" maxLength={5000} rows={4} defaultValue={saved?.reflection??""}/>
                <label><input type="checkbox" name="completed" defaultChecked={saved?.completed??false}/> Marcar aula como concluída</label>
                <button className="primary" type="submit">Salvar aprendizagem</button>
              </form>
            </details>;
          })}
          {quiz&&<section className={styles.quiz}><h3>Avaliação do módulo</h3>{!ready(n)?<p>Conclua todas as aulas deste módulo para responder.</p>:attempt?.passed?<p role="status">Avaliação aprovada.</p>:<form action={submitQuiz}><input type="hidden" name="module" value={n}/><fieldset><legend>{quiz.question}</legend>{quiz.options.map((option,i)=><label key={i} style={{display:"block",padding:"0.5rem"}}><input type="radio" name="answer" value={i+1} required/> {option}</label>)}</fieldset>{attempt&&<p role="status">Resposta incorreta. Revise o módulo e tente novamente.</p>}<button className="primary" type="submit">Responder</button></form>}</section>}
        </section>;
      })}</>}
    </section>
  </main>;
}
