import Link from "next/link";
import { LEARNING_TRAILS, type ProgressRecord } from "../../lib/learning-progress";
import { saveLearningProgress } from "./progresso/actions";

export default function ProgressCards({progress,unavailable,allowedTrails}:{progress:ProgressRecord[];unavailable:boolean;allowedTrails:readonly string[]}){
  const completed=progress.filter(p=>p.status==="concluida"&&allowedTrails.includes(p.trail_slug)).length;
  return <>
    <section className="learning-progress-overview" aria-label="Seu progresso">
      <div><span className="dashboard-atm-eyebrow dark">ACOMPANHAMENTO INDIVIDUAL</span>
      <h3>Sua jornada, no seu ritmo.</h3><p>Marque onde parou e retome quando desejar. O registro é individual e não altera o conteúdo das trilhas.</p></div>
      <div className="learning-progress-summary"><span><strong>{progress.filter(p=>allowedTrails.includes(p.trail_slug)).length}</strong> iniciadas</span><span><strong>{completed}</strong> concluídas</span></div>
    </section>
    {unavailable && <p role="status" className="learning-progress-warning">O registro de progresso está temporariamente indisponível. Você ainda pode acessar as trilhas normalmente.</p>}
    {!allowedTrails.length&&<p className="learning-progress-warning">Nenhuma trilha está liberada para esta conta. Consulte a administração da Escola.</p>}
    <div className="dashboard-atm-tracks">
      {LEARNING_TRAILS.filter(t=>allowedTrails.includes(t.slug)).map(trilha=>{
        const saved=progress.find(p=>p.trail_slug===trilha.slug);
        const section=trilha.sections.find(([id])=>id===saved?.section_id)?.[0]??"investigacao";
        return <article className="dashboard-atm-track learning-progress-track" key={trilha.number}>
          <span>TRILHA {trilha.number} / 06</span>
          <h3>{trilha.title}</h3>
          <p className="learning-progress-status">{saved?.status==="concluida"?"Concluída":saved?.status==="em_andamento"?"Em andamento":saved?"Iniciada":"Ainda não iniciada"}</p>
          <Link href={`/trilhas/${trilha.slug}#${section}`}>{saved?"Retomar jornada":"Conhecer trilha"} <span aria-hidden="true">↗</span></Link>
          {!unavailable&&<form action={saveLearningProgress} className="learning-progress-form">
            <input type="hidden" name="trail" value={trilha.slug}/>
            <label>Onde você parou
              <select name="section" defaultValue={section} aria-label={`Última seção da trilha ${trilha.title}`}>
                {trilha.sections.map(([id,label])=><option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label>Situação
              <select name="status" defaultValue={saved?.status??"iniciada"} aria-label={`Situação da trilha ${trilha.title}`}>
                <option value="iniciada">Iniciada</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </label>
            <button type="submit">Salvar meu progresso</button>
          </form>}
        </article>;
      })}
    </div>
  </>;
}
