import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { databaseConfigured, dbQuery } from "../../../lib/database";
import BrandLogo from "../../components/BrandLogo";
import { saveLesson, submitQuiz, submitFormative } from "./actions";
import styles from "./learning.module.css";
import { resourcesFor, studyLinkParts } from "./study-links";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Formação institucional | Biblioteca Atemporal", robots: { index: false, follow: false, noarchive: true } };

type Lesson = { module_no:number; lesson_no:number; module_title:string; title:string; body:string; practice:string; reflection:string; source_url:string|null };
type Progress = {module_no:number;lesson_no:number;reflection:string;completed:boolean};
type Quiz = {module_no:number;question:string;options:string[]};
function LinkedText({text}:{text:string}) {
  return studyLinkParts(text).map((part,i)=>typeof part==="string"?part:
    <a key={i} href={part.url} target="_blank" rel="noopener noreferrer"
      className={styles.inlineReference} title={part.url}
      aria-label={`${part.title} (abre em nova aba)`}>
      {part.title}<span aria-hidden="true"> ↗</span>
    </a>);
}
type FormativeQuestion = {module_no:number;lesson_no:number;question:string;options:string[];last_answer:number|null;last_correct:boolean|null;explanation:string|null;correct_index:number|null};
type Attempt = {module_no:number;passed:boolean;attempts:number};

export default async function KnowledgeTransfer({searchParams}:{searchParams:Promise<{aula?:string|string[]}>}) {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email || await roleForEmailAsync(email) !== "administrador") redirect("/painel?acesso=restrito");
  let lessons:Lesson[]=[];
  let progress:Progress[]=[];
  let quizzes:Quiz[]=[];
  let attempts:Attempt[]=[];
  let formative:FormativeQuestion[]=[];
  let formativeUnavailable=false;
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
  if(!unavailable) {
    try {
      formative=await dbQuery<FormativeQuestion>("SELECT q.module_no,q.lesson_no,q.question,q.options,a.last_answer,a.last_correct,CASE WHEN a.email IS NOT NULL THEN q.explanation END AS explanation,CASE WHEN a.email IS NOT NULL THEN q.correct_index END AS correct_index FROM biblioteca_institutional_question_bank q JOIN biblioteca_institutional_lessons l USING(module_no,lesson_no) LEFT JOIN biblioteca_institutional_formative_attempts a ON a.module_no=q.module_no AND a.lesson_no=q.lesson_no AND a.email=$1 WHERE l.published=true ORDER BY q.module_no,q.lesson_no",[email]);
    } catch { formativeUnavailable=true; }
  }
  const modules=[...new Set(lessons.map(l=>l.module_no))];
  const completed=(l:Lesson)=>progress.some(p=>p.module_no===l.module_no && p.lesson_no===l.lesson_no && p.completed);
  const done=lessons.filter(completed).length;
  const ready=(n:number)=>{const group=lessons.filter(l=>l.module_no===n);return group.length>0&&group.every(completed);};
  const passed=modules.filter(n=>ready(n)&&attempts.some(a=>a.module_no===n&&a.passed)).length;
  const next=lessons.find(l=>!completed(l));
  const requested=(await searchParams).aula;
  const selected=lessons.find(l=>typeof requested==="string"&&requested===`${l.module_no}-${l.lesson_no}`)??next??lessons[0];
  const selectedIndex=lessons.findIndex(l=>l===selected);
  const href=(l:Lesson)=>`/trilhas/knowledge-transfer?aula=${l.module_no}-${l.lesson_no}#leitura`;
  const previous=lessons[selectedIndex-1];
  const following=lessons[selectedIndex+1];
  return <main className={"learning-page referencia-trilha01 "+styles.brandPage}>
    <header className="topbar"><BrandLogo/><nav aria-label="Navegação"><Link href="/painel">Meu painel ↗</Link></nav></header>
    <section className={"learning-hero "+styles.brandHero}><div className="learning-wrap">
      <div className="learning-hero-copy"><span className="eyebrow">FORMAÇÃO INSTITUCIONAL · TRILHA 07</span><h1>Knowledge <em>Transfer.</em></h1><p className="learning-lead">Da essência à prática.</p><p className={styles.heroDescription}>Conhecimento que permanece. Uma formação para compreender, aplicar e dar continuidade ao trabalho da Escola Atemporal.</p></div>
      <div className="learning-facts"><span>{modules.length} módulos</span><span>{lessons.length} aulas disponíveis</span><span>Acesso restrito</span>{!unavailable&&<span>{done}/{lessons.length} aulas concluídas · {passed}/{modules.length} módulos aprovados</span>}</div>
    </div></section>
    <div aria-hidden="true" className={styles.spectrum}/>
    <section className={"learning-section learning-wrap "+styles.course} aria-label="Módulos">
      {!unavailable&&lessons.length>0&&<div className={styles.progress}><div className={styles.progressHeading}><div><span className={styles.kicker}>PERCURSO DE APRENDIZAGEM</span><label htmlFor="institutional-progress">Seu progresso</label></div><strong>{Math.round(done/lessons.length*100)}<small>%</small></strong></div><progress id="institutional-progress" value={done} max={lessons.length} className={styles.progressBar}/><div className={styles.progressFoot}><span>{done} de {lessons.length} aulas concluídas</span>{next&&<a href={href(next)}>Retomar próxima aula <span aria-hidden="true">→</span></a>}</div>{lessons.length>0&&done===lessons.length&&passed===modules.length&&<p role="status">Percurso concluído. Certificação sujeita à validação institucional.</p>}</div>}
      {unavailable?<p role="status">Conteúdo temporariamente indisponível. Consulte a administração.</p>:!lessons.length?<p role="status">Conteúdo em preparação.</p>:<div className={styles.readerLayout}>
        <aside className={styles.sidebar}><nav aria-label="Navegação das aulas"><span className={styles.kicker}>TRILHA 07</span><h2>Seu percurso</h2>{modules.map(n=>{
          const group=lessons.filter(l=>l.module_no===n);
          return <details key={n} className={styles.navModule} open={selected?.module_no===n}><summary><span className={styles.moduleNumber}>{String(n).padStart(2,"0")}</span><span className={styles.moduleName}>{group[0].module_title}<small>{group.filter(completed).length} de {group.length} aulas</small></span><span className={styles.chevron} aria-hidden="true">⌄</span></summary><ul>{group.map(l=><li key={l.lesson_no}><Link href={href(l)} aria-current={selected===l?"page":undefined} className={selected===l?styles.activeLesson:styles.navLesson}><span aria-label={completed(l)?"Concluída":"Não concluída"}>{completed(l)?"✓":"○"}</span><span>{String(l.lesson_no).padStart(2,"0")} · {l.title}</span></Link></li>)}</ul></details>;
        })}</nav></aside>
        {selected&&(()=>{const l=selected,n=l.module_no;const saved=progress.find(p=>p.module_no===n&&p.lesson_no===l.lesson_no);const quiz=quizzes.find(q=>q.module_no===n);const attempt=attempts.find(a=>a.module_no===n);const resources=resourcesFor(l);const fq=formative.find(q=>q.module_no===n&&q.lesson_no===l.lesson_no);const fgroup=formative.filter(q=>q.module_no===n);const answered=fgroup.filter(q=>q.last_answer!==null).length;const correct=fgroup.filter(q=>q.last_correct===true).length;
        return <div key={`${n}-${l.lesson_no}`} id="leitura" className={styles.reader}><header className={styles.readerHead}><span className={styles.kicker}>MÓDULO {String(n).padStart(2,"0")} · AULA {String(l.lesson_no).padStart(2,"0")}</span><p>{l.module_title}</p><h2>{l.title}</h2><span>{saved?.completed?"Concluída":"Material de estudo"} · Aula {selectedIndex+1} de {lessons.length}</span></header>
          <nav aria-label="Seções da aula" className={styles.sectionNav}><a href="#estudo"><small>01</small>Estudo</a><a href="#pratica"><small>02</small>Prática</a><a href="#reflexao"><small>03</small>Reflexão</a><a href="#avaliacao-formativa"><small>04</small>Avaliação</a>{resources.length>0&&<a href="#referencias" className={styles.referenceNav}>Referências <span aria-hidden="true">↗</span></a>}</nav>
          <div className={styles.lessonContent}><article id="estudo" className={styles.reading}><span className={styles.kicker}>01 · COMPREENDER</span><h3 className={styles.studyHeading}>Material de estudo</h3>{l.body.split(/\n\s*\n/).map((p,i)=>p.startsWith("CADERNO DE ESTUDO")?<div key={i}><h3>{p.split("\n")[0]}</h3>{p.split("\n").slice(1).join("\n")&&<p><LinkedText text={p.split("\n").slice(1).join("\n")}/></p>}</div>:<p key={i}><LinkedText text={p}/></p>)}</article>
          {resources.length>0&&<details id="referencias" className={styles.resources} open><summary className={styles.resourceSummary}><span><span className={styles.kicker}>ACERVO DA AULA</span><strong>Materiais complementares</strong></span><span className={styles.resourceCount}>{resources.length} {resources.length===1?"fonte":"fontes"} <span aria-hidden="true">⌄</span></span></summary><ul className={styles.resourceList}>{resources.map(r=><li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.title} (abre em nova aba)`}><span className={styles.resourceSymbol} aria-hidden="true">↗</span><span><small>{r.kind}</small><strong>{r.title}</strong><span className={styles.resourceDomain}>{r.host}</span></span><span className={styles.resourceAction} aria-hidden="true">Abrir fonte ↗</span></a></li>)}</ul><p className={styles.resourceNote}>Clique na fonte para abri-la em outra aba e continuar sua leitura aqui. Arquivos institucionais mantêm suas permissões de origem.</p></details>}
          <section id="pratica" className={styles.activity}><span className={styles.kicker}>02 · APLICAR</span><h3>Prática orientada</h3><p><LinkedText text={l.practice}/></p></section><section id="reflexao" className={styles.reflect}><span className={styles.kicker}>03 · REFLETIR</span><h3>Conecte à sua realidade</h3><p><LinkedText text={l.reflection}/></p>
          <form action={saveLesson} className={styles.form}><input type="hidden" name="module" value={n}/><input type="hidden" name="lesson" value={l.lesson_no}/><label htmlFor="reflection">Sua reflexão individual</label><textarea id="reflection" name="reflection" maxLength={5000} rows={4} defaultValue={saved?.reflection??""}/><div className={styles.saveActions}><label className={styles.completionControl}><input type="checkbox" name="completed" defaultChecked={saved?.completed??false}/> Marcar aula como concluída</label><button className="primary" type="submit">Salvar aprendizagem <span aria-hidden="true">→</span></button></div></form></section>
          <section id="avaliacao-formativa" className={styles.quiz}><span className={styles.kicker}>04 · VERIFICAR A APRENDIZAGEM</span><h3>Questão da aula</h3>{formativeUnavailable?<p>Verificação formativa temporariamente indisponível.</p>:!fq?<p>Questão em preparação.</p>:<><p>Questões do módulo: {answered}/{fgroup.length} respondidas · {correct}/{fgroup.length} corretas na última resposta. Atividade formativa, sem alteração da aprovação anterior.</p><form action={submitFormative}><input type="hidden" name="module" value={n}/><input type="hidden" name="lesson" value={l.lesson_no}/><fieldset><legend>{fq.question}</legend>{fq.options.map((option,i)=><label key={i} style={{display:"block",padding:"0.5rem"}}><input type="radio" name="answer" value={i+1} defaultChecked={fq.last_answer===i} required/> {option}</label>)}</fieldset><button className="primary" type="submit">{fq.last_answer===null?"Confirmar resposta":"Responder novamente"}</button></form>{fq.last_answer!==null&&<div role="status"><p><strong>{fq.last_correct?"Resposta correta.":"Revise sua resposta."}</strong></p>{fq.correct_index!==null&&<p>Resposta esperada: {fq.options[fq.correct_index]}</p>}<p>{fq.explanation}</p></div>}</>}</section>
          <section id="avaliacao" className={styles.quiz}><span className={styles.kicker}>04 · CONSOLIDAR</span><h3>Avaliação original do módulo</h3>{!quiz?<p>Avaliação em preparação.</p>:!ready(n)?<p>Conclua todas as aulas deste módulo para responder.</p>:attempt?.passed?<p role="status">Avaliação aprovada.</p>:<form action={submitQuiz}><input type="hidden" name="module" value={n}/><input type="hidden" name="lesson" value={l.lesson_no}/><fieldset><legend>{quiz.question}</legend>{quiz.options.map((option,i)=><label key={i} style={{display:"block",padding:"0.5rem"}}><input type="radio" name="answer" value={i+1} required/> {option}</label>)}</fieldset>{attempt&&<p role="status">Resposta incorreta. Revise o módulo e tente novamente.</p>}<button className="primary" type="submit">Responder</button></form>}</section></div>
          <nav aria-label="Aula anterior e próxima" className={styles.pager}>{previous?<Link href={href(previous)}><span className={styles.pagerArrow} aria-hidden="true">←</span><span><small>Aula anterior</small><strong>{previous.title}</strong></span></Link>:<span/>}{following?<Link href={href(following)}><span><small>Próxima aula</small><strong>{following.title}</strong></span><span className={styles.pagerArrow} aria-hidden="true">→</span></Link>:<span className={styles.pagerEnd}>Última aula do percurso</span>}</nav>
        </div>})()}
      </div>}
    </section>
    <footer className={styles.brandFooter}><div><strong>Escola Atemporal</strong><span>Encorajar escolhas virtuosas.</span></div><Link href="/painel">Retornar ao painel ↗</Link></footer><div className={styles.spectrum} aria-hidden="true"/>
  </main>;
}
