import Link from "next/link";
import {redirect} from "next/navigation";
import BrandLogo from "../../components/BrandLogo";
import PresenceHeartbeat from "../../components/PresenceHeartbeat";
import {auth,authConfigured} from "../../../auth";
import {roleForEmailAsync} from "../../../lib/access";
import {can} from "../../../lib/permissions";
import {databaseConfigured,dbQuery} from "../../../lib/database";
import {LEARNING_TRAILS,resolveTrail} from "../../../lib/learning-progress";
import {saveReflection} from "./actions";
import DeleteReflection from "./DeleteReflection";
import "./caderno.css";

export const dynamic="force-dynamic";
export const revalidate=0;
export const metadata={title:"Meu caderno de reflexões | Biblioteca Atemporal",robots:{index:false,follow:false,noarchive:true}};
type Note={id:string;trail_slug:string;title:string;content:string;created_at:string;updated_at:string};
export default async function ReflectionNotebook(){
 if(!authConfigured)redirect("/entrar");
 const session=await auth();
 if(!session?.user?.email)redirect("/entrar");
 if(!can(await roleForEmailAsync(session.user.email),"tracks:read"))redirect("/painel");
 let notes:Note[]=[];
 let error=!databaseConfigured;
 if(databaseConfigured)try{
  notes=await dbQuery<Note>(`SELECT id::text,trail_slug,title,content,created_at::text,updated_at::text
    FROM biblioteca_reflection_notes WHERE email=$1 ORDER BY updated_at DESC LIMIT 200`,[session.user.email.trim().toLowerCase()]);
 }catch{error=true;}
 const date=(value:string)=>new Date(value).toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"long",year:"numeric"});
 return <main className="admin-atm-page reflection-page">
  <PresenceHeartbeat section="Caderno de reflexões"/>
  <header className="topbar login-atm-topbar"><BrandLogo/><nav aria-label="Navegação do caderno"><Link href="/painel">Meu painel</Link><Link href="/arquivos">Arquivos</Link></nav></header>
  <section className="admin-atm-hero"><div className="admin-atm-container">
   <span className="admin-atm-eyebrow">BIBLIOTECA ATEMPORAL · ESPAÇO PESSOAL</span>
   <h1>Meu caderno de <em>reflexões.</em></h1>
   <p>Um lugar para registrar perguntas, descobertas e escolhas que merecem ser revisitadas. No seu tempo, com suas próprias palavras.</p>
   <p className="reflection-privacy-note">Suas anotações são privadas, vinculadas à sua conta e não aparecem no painel administrativo.</p>
  </div></section>
  <div className="admin-atm-container admin-atm-main reflection-main">
    {error?<p role="alert" className="admin-atm-feedback admin-atm-failure">O caderno está temporariamente indisponível. Nenhuma anotação foi alterada.</p>:<>
     <section aria-labelledby="reflection-new-title" className="reflection-editor">
       <div><span className="admin-atm-eyebrow">NOVA REFLEXÃO</span><h2 id="reflection-new-title">O que merece permanecer?</h2><p>Escreva livremente ou retome uma pergunta encontrada nas trilhas.</p></div>
       <form action={saveReflection} className="reflection-form">
        <label>Trilha relacionada<select name="trail" required>{LEARNING_TRAILS.map(t=><option key={t.slug} value={t.slug}>{t.number} — {t.title}</option>)}</select></label>
        <label>Título da reflexão<input name="title" type="text" maxLength={120} required placeholder="Uma pergunta, uma ideia, uma descoberta..."/></label>
        <label>Meu registro<textarea name="content" minLength={1} maxLength={8000} rows={7} required placeholder="O que você percebeu? O que deseja experimentar a partir disso?"/></label>
        <button type="submit">Guardar reflexão</button>
       </form>
     </section>
     <section aria-labelledby="reflection-list-title" className="reflection-list-section">
       <div className="admin-atm-section-head"><div><span className="admin-atm-eyebrow">MEUS REGISTROS</span><h2 id="reflection-list-title">Reflexões para revisitar.</h2></div>
        <p>{notes.length} {notes.length===1?"reflexão registrada":"reflexões registradas"} · exibindo até 200 registros recentes</p></div>
       {!notes.length?<p className="admin-atm-empty">Seu caderno começa em branco. Registre sua primeira reflexão no formulário acima.</p>:<div className="reflection-list">
        {notes.map(note=><article className="reflection-entry" key={note.id}>
          <div className="reflection-entry-meta"><span>{resolveTrail(note.trail_slug)?.title??"Trilha"}</span><time dateTime={note.updated_at}>Atualizado em {date(note.updated_at)}</time></div>
          <h3>{note.title}</h3><p className="reflection-entry-content">{note.content}</p>
          <details className="reflection-edit"><summary>Editar minha reflexão</summary>
            <form action={saveReflection} className="reflection-form">
             <input type="hidden" name="id" value={note.id}/>
             <label>Trilha<select name="trail" defaultValue={note.trail_slug}>{LEARNING_TRAILS.map(t=><option key={t.slug} value={t.slug}>{t.number} — {t.title}</option>)}</select></label>
             <label>Título<input name="title" defaultValue={note.title} maxLength={120} required/></label>
             <label>Reflexão<textarea name="content" defaultValue={note.content} maxLength={8000} rows={6} required/></label>
             <button type="submit">Salvar alterações</button>
            </form>
          </details>
          <DeleteReflection id={note.id}/>
        </article>)}
       </div>}
     </section>
    </>}
    <Link href="/painel" className="admin-atm-back">← Voltar às minhas trilhas</Link>
  </div>
 </main>;
}
