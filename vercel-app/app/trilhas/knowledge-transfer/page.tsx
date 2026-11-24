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
type Resource = {url:string;title:string;kind:string};
function resourcesFor(l:Lesson):Resource[] {
  const urls=[l.source_url,...(l.body.match(/https:\/\/[^\s<>"]+/g)??[])];
  const seen=new Set<string>();const result:Resource[]=[];
  for(const raw of urls){if(!raw)continue;try{const url=new URL(raw.replace(/[.,;:)\]]+$/,""));if(url.protocol!=="https:"||url.username||url.password)continue;const host=url.hostname.toLowerCase();const allowed=["drive.google.com","docs.google.com","www.youtube.com","youtube.com","youtu.be","support.google.com","developers.google.com","learn.wordpress.org","elementor.com","www.ramper.com.br","github.com","docs.github.com","render.com","neon.com","nextjs.org","skillshop.withgoogle.com"];if(!allowed.includes(host)||seen.has(url.href))continue;seen.add(url.href);const video=["www.youtube.com","youtube.com","youtu.be"].includes(host);if(video)continue;const drive=host==="drive.google.com"||host==="docs.google.com";const pdf=url.pathname.toLowerCase().endsWith(".pdf");const kind=video?"Vídeo de referência":pdf?"PDF":drive?"Fonte institucional":"Leitura complementar";result.push({url:url.href,kind,title:raw===l.source_url?"Fonte principal da aula":video?"Conteúdo audiovisual de referência":drive?"Material de apoio no Google Drive":host});}catch{continue;}}
  return result;
}
type Attempt = {module_no:number;passed:boolean;attempts:number};

export default async function KnowledgeTransfer({searchParams}:{searchParams:Promise<{aula?:string|string[]}>}) {
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
      {!unavailable&&lessons.length>0&&<div className={styles.progress}><div className={styles.progressHeading}><div><span className={styles.kicker}>PERCURSO DE APRENDIZAGEM</span><label htmlFor="institutional-progress">Seu progresso</label></div><strong>{Math.round(done/lessons.length*100)}%</strong></div><progress id="institutional-progress" value={done} max={lessons.length} className={styles.progressBar}/>{next&&<a href={href(next)}>Retomar próxima aula ↗</a>}{lessons.length>0&&done===lessons.length&&passed===modules.length&&<p role="status">Percurso concluído. Certificação sujeita à validação institucional.</p>}</div>}
      {unavailable?<p role="status">Conteúdo temporariamente indisponível. Consulte a administração.</p>:!lessons.length?<p role="status">Conteúdo em preparação.</p>:<div className={styles.readerLayout}>
        <aside className={styles.sidebar}><nav aria-label="Navegação das aulas"><span className={styles.kicker}>TRILHA 07</span><h2>Seu percurso</h2>{modules.map(n=>{
          const group=lessons.filter(l=>l.module_no===n);
          return <details key={n} className={styles.navModule} open={selected?.module_no===n}><summary><span>{String(n).padStart(2,"0")} · {group[0].module_title}</span><small>{group.filter(completed).length}/{group.length}</small></summary><ul>{group.map(l=><li key={l.lesson_no}><Link href={href(l)} aria-current={selected===l?"page":undefined} className={selected===l?styles.activeLesson:styles.navLesson}><span aria-label={completed(l)?"Concluída":"Não concluída"}>{completed(l)?"✓":"○"}</span><span>{String(l.lesson_no).padStart(2,"0")} · {l.title}</span></Link></li>)}</ul></details>;
        })}</nav></aside>
        {selected&&(()=>{const l=selected,n=l.module_no;const saved=progress.find(p=>p.module_no===n&&p.lesson_no===l.lesson_no);const quiz=quizzes.find(q=>q.module_no===n);const attempt=attempts.find(a=>a.module_no===n);
        return <div id="leitura" className={styles.reader}><header className={styles.readerHead}><span className={styles.kicker}>MÓDULO {String(n).padStart(2,"0")} · AULA {String(l.lesson_no).padStart(2,"0")}</span><p>{l.module_title}</p><h2>{l.title}</h2><span>{saved?.completed?"Concluída":"Material de estudo"} · Aula {selectedIndex+1} de {lessons.length}</span></header>
          <nav aria-label="Seções da aula" className={styles.sectionNav}><a href="#estudo">Estudo</a><a href="#referencias">Referências</a><a href="#pratica">Prática</a><a href="#reflexao">Reflexão</a><a href="#avaliacao">Avaliação</a></nav>
          <div className={styles.lessonContent}><article id="estudo" className={styles.reading}><span className={styles.kicker}>01 · COMPREENDER</span><h3 className={styles.studyHeading}>Material de estudo</h3>{l.body.split(/\n\s*\n/).map((p,i)=>p.startsWith("CADERNO DE ESTUDO")?<div key={i}><h3>{p.split("\n")[0]}</h3>{p.split("\n").slice(1).join("\n")&&<p>{p.split("\n").slice(1).join("\n")}</p>}</div>:<p key={i}>{p}</p>)}</article>
          <aside id="referencias" className={styles.resources}><span className={styles.kicker}>ACERVO DA AULA</span><h3>Materiais complementares</h3>{resourcesFor(l).length>0?<ul className={styles.resourceList}>{resourcesFor(l).map(r=><li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer"><span className={styles.resourceSymbol} aria-hidden="true">{r.kind==="Vídeo de referência"?"▶":"↗"}</span><span><small>{r.kind}</small><strong>{r.title}</strong></span><span aria-hidden="true">↗</span></a></li>)}</ul>:<p>Consulte as referências indicadas no texto.</p>}<p className={styles.resourceNote}>Os materiais externos abrem em outra aba. Arquivos institucionais mantêm suas permissões de origem.</p></aside>
          <section id="pratica" className={styles.activity}><span className={styles.kicker}>02 · APLICAR</span><h3>Prática orientada</h3><p>{l.practice}</p></section><section id="reflexao" className={styles.reflect}><span className={styles.kicker}>03 · REFLETIR</span><h3>Conecte à sua realidade</h3><p>{l.reflection}</p></section></div>
          <form action={saveLesson} className={styles.form}><input type="hidden" name="module" value={n}/><input type="hidden" name="lesson" value={l.lesson_no}/><label htmlFor="reflection">Sua reflexão individual</label><textarea id="reflection" name="reflection" maxLength={5000} rows={4} defaultValue={saved?.reflection??""}/><label><input type="checkbox" name="completed" defaultChecked={saved?.completed??false}/> Marcar aula como concluída</label><button className="primary" type="submit">Salvar aprendizagem</button></form>
          <section id="avaliacao" className={styles.quiz}><span className={styles.kicker}>04 · CONSOLIDAR</span><h3>Avaliação do módulo</h3>{!quiz?<p>Avaliação em preparação.</p>:!ready(n)?<p>Conclua todas as aulas deste módulo para responder.</p>:attempt?.passed?<p role="status">Avaliação aprovada.</p>:<form action={submitQuiz}><input type="hidden" name="module" value={n}/><input type="hidden" name="lesson" value={l.lesson_no}/><fieldset><legend>{quiz.question}</legend>{quiz.options.map((option,i)=><label key={i} style={{display:"block",padding:"0.5rem"}}><input type="radio" name="answer" value={i+1} required/> {option}</label>)}</fieldset>{attempt&&<p role="status">Resposta incorreta. Revise o módulo e tente novamente.</p>}<button className="primary" type="submit">Responder</button></form>}</section>
          <nav aria-label="Aula anterior e próxima" className={styles.pager}>{previous?<Link href={href(previous)}>← {previous.title}</Link>:<span/>}{following?<Link href={href(following)}>{following.title} →</Link>:<span>Última aula</span>}</nav>
        </div>})()}
      </div>}
    </section>
    <footer className={styles.brandFooter}><div><strong>Escola Atemporal</strong><span>Encorajar escolhas virtuosas.</span></div><Link href="/painel">Retornar ao painel ↗</Link></footer><div className={styles.spectrum} aria-hidden="true"/>
  </main>;
}
