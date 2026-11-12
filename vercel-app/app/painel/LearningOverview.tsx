import Link from "next/link";
import { LEARNING_TRAILS, type ProgressRecord } from "../../lib/learning-progress";

export type RecentReflection = {
  id: string;
  title: string;
  trail_slug: string;
  updated_at: string;
};
type Props = {
  progress: ProgressRecord[];
  progressUnavailable: boolean;
  reflections: RecentReflection[];
  reflectionsUnavailable: boolean;
  reflectionCount: number | null;
  allowedTrails: readonly string[];
};
export default function LearningOverview({
 progress, progressUnavailable, reflections, reflectionsUnavailable, reflectionCount, allowedTrails
}: Props) {
 const active = [...progress]
   .filter(p => p.status !== "concluida" && allowedTrails.includes(p.trail_slug))
   .sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
 const current = active ? LEARNING_TRAILS.find(t => t.slug === active.trail_slug) : null;
 const section = current?.sections.find(([id]) => id === active?.section_id);
 const completed = progress.filter(p => p.status === "concluida" && allowedTrails.includes(p.trail_slug)).length;
 const started = progress.filter(p=>allowedTrails.includes(p.trail_slug)).length;
 const showProgress = !progressUnavailable;
 const next = current ?? (!started && showProgress ? LEARNING_TRAILS.find(t=>allowedTrails.includes(t.slug)) : null);
 const nextSection = current ? section?.[0] ?? "investigacao" : "investigacao";
 const noteDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR",{
   day:"2-digit",month:"short",year:"numeric",timeZone:"America/Sao_Paulo"
 });
 return <section className="personal-learning-home" aria-labelledby="personal-learning-heading">
  <div className="personal-learning-heading">
   <div><span className="dashboard-atm-eyebrow dark">SEU ESPAÇO DE APRENDIZAGEM</span>
    <h2 id="personal-learning-heading">Seu caminho, <em>em perspectiva.</em></h2>
    <p>Continue de onde parou e reencontre as ideias que decidiu guardar.</p>
   </div>
   <Link href="/painel/caderno" className="personal-learning-text-link">Meu caderno ↗</Link>
  </div>
  <div className="personal-learning-layout">
   <div className="personal-learning-primary">
    <div className="personal-learning-metrics" aria-label="Resumo da sua aprendizagem">
     <div><strong>{showProgress ? started : "—"}</strong><span>Trilhas iniciadas</span></div>
     <div><strong>{showProgress ? completed : "—"}</strong><span>Trilhas concluídas</span></div>
     <div><strong>{reflectionsUnavailable ? "—" : reflectionCount ?? 0}</strong><span>Reflexões guardadas</span></div>
    </div>
    <div className="personal-learning-continue">
     <span className="dashboard-atm-eyebrow dark">CONTINUAR JORNADA</span>
     {next ? <>
      <span className="personal-learning-track-no">TRILHA {next.number} / 06</span>
      <h3>{next.title}</h3>
      <p>{current ? `Sua última etapa registrada: ${section?.[1]??"Investigação"}.` :
      "Você pode começar pela primeira trilha ou escolher qualquer tema abaixo."}</p>
      <Link href={`/trilhas/${next.slug}#${nextSection}`} className="personal-learning-cta">{current?"Retomar meus estudos":"Começar a investigar"} <span aria-hidden="true">↗</span></Link>
     </> : <><h3>{progressUnavailable?"Suas trilhas continuam disponíveis.":"Um percurso para celebrar."}</h3>
       <p>{progressUnavailable?"Não foi possível carregar seu progresso neste momento. Escolha uma trilha abaixo para continuar.":"Você concluiu todas as trilhas registradas. Releia suas reflexões ou escolha uma jornada para revisitar."}</p>
       <Link href="#minhas-trilhas" className="personal-learning-cta">Explorar minhas trilhas ↗</Link>
     </>}
    </div>
   </div>
   <div className="personal-learning-notes">
    <div className="personal-learning-notes-head"><span className="dashboard-atm-eyebrow dark">DO SEU CADERNO</span>
     <h3>Reflexões recentes.</h3></div>
    {reflectionsUnavailable?<p>Não foi possível carregar suas reflexões agora.</p>:
     reflections.length? <ul>{reflections.map(note=>{
      const trail=LEARNING_TRAILS.find(t=>t.slug===note.trail_slug);
      return <li key={note.id}><Link href={`/painel/caderno#reflexao-${note.id}`}>
       <span>{trail?.title??"Biblioteca Atemporal"} · {noteDate(note.updated_at)}</span>
       <strong>{note.title}</strong>
       <span className="personal-learning-note-action">Revisitar reflexão ↗</span>
      </Link></li>;
     })}</ul>:
     <p>Seu caderno está pronto para receber a primeira reflexão.</p>}
    <Link href="/painel/caderno" className="personal-learning-text-link">{reflections.length?"Ver meu caderno completo":"Escrever minha primeira reflexão"} ↗</Link>
   </div>
  </div>
  <p className="personal-learning-privacy">Este resumo é pessoal. Progresso e anotações são recuperados apenas para sua conta autenticada.</p>
 </section>;
}
