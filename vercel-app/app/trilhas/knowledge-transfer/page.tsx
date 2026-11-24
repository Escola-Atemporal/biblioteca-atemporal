import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { databaseConfigured, dbQuery } from "../../../lib/database";
import BrandLogo from "../../components/BrandLogo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Formação institucional | Biblioteca Atemporal", robots: { index: false, follow: false, noarchive: true } };

type Lesson = { module_no: number; lesson_no: number; module_title: string; title: string; body: string; practice: string; reflection: string; source_url: string | null };

export default async function KnowledgeTransfer() {
  const session = await auth();
  const role = await roleForEmailAsync(session?.user?.email);
  if (role !== "administrador") redirect("/painel?acesso=restrito");
  let lessons: Lesson[] = [];
  let unavailable = !databaseConfigured;
  if (databaseConfigured) {
    try {
      lessons = await dbQuery<Lesson>("SELECT module_no, lesson_no, module_title, title, body, practice, reflection, source_url FROM biblioteca_institutional_lessons WHERE published = true ORDER BY module_no, lesson_no");
    } catch { unavailable = true; }
  }
  const modules = [...new Set(lessons.map(l => l.module_no))];
  return <main className="learning-page referencia-trilha01">
    <header className="topbar"><BrandLogo/><nav aria-label="Navegação"><Link href="/painel">Meu painel ↗</Link></nav></header>
    <section className="learning-hero"><div className="learning-wrap">
      <div className="learning-hero-copy"><span className="eyebrow">FORMAÇÃO INSTITUCIONAL · TRILHA 07</span><h1>Knowledge <em>Transfer.</em></h1><p className="learning-lead">Da essência à prática.</p><p>Um percurso reservado de aprendizagem e continuidade institucional.</p></div>
      <div className="learning-facts"><span>{modules.length} módulos</span><span>{lessons.length} aulas disponíveis</span><span>Acesso restrito</span></div>
    </div></section>
    <div aria-hidden="true" style={{height:5,background:"linear-gradient(90deg,#C60344,#E35918,#FFD201,#82B41B,#0BB4D7,#624993)"}}/>
    <section className="learning-section learning-wrap" aria-label="Módulos">
      {unavailable ? <p role="status">Conteúdo temporariamente indisponível. Consulte a administração.</p> : !lessons.length ? <p role="status">Conteúdo em preparação.</p> : modules.map(n => <section key={n} id={`modulo-${n}`} style={{marginBottom:"3rem"}}>
        <span className="eyebrow dark">MÓDULO {String(n).padStart(2,"0")}</span>
        <h2>{lessons.find(l=>l.module_no===n)?.module_title}</h2>
        {lessons.filter(l=>l.module_no===n).map(l=><details key={l.lesson_no} style={{padding:"1.25rem 0",borderBottom:"1px solid currentColor"}}>
          <summary style={{cursor:"pointer",fontWeight:600}}>Aula {l.lesson_no} — {l.title}</summary>
          <div className="reading-copy" style={{paddingTop:"1rem",whiteSpace:"pre-line"}}><p>{l.body}</p><h3>Aplicação prática</h3><p>{l.practice}</p><h3>Reflexão</h3><p>{l.reflection}</p>{l.source_url && /^https:\/\/(drive|docs)\.google\.com\//.test(l.source_url) && <a href={l.source_url} target="_blank" rel="noopener noreferrer">Consultar material de referência ↗</a>}</div>
        </details>)}
      </section>)}
    </section>
  </main>;
}
