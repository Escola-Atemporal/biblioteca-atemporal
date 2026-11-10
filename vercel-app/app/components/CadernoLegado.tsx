"use client";
import { useState } from "react";

const questoes = [
  {etapa:"01 / RESULTADO",titulo:"Que resultado queremos reconhecer?",apoio:"Descreva o que foi realizado, de modo observável, sem dados sensíveis.",exemplo:"Qual mudança aconteceu e como sabemos?"},
  {etapa:"02 / COMO",titulo:"Como chegamos até aqui?",apoio:"Considere decisões, valores, práticas e acordos que influenciaram a entrega.",exemplo:"Que escolha ou comportamento tornou o resultado possível?"},
  {etapa:"03 / PESSOAS",titulo:"Quem foi afetado pelo caminho?",apoio:"Inclua participantes, pessoas menos visíveis e possíveis consequências não planejadas.",exemplo:"O que as pessoas ganharam, perderam ou precisaram sustentar?"},
  {etapa:"04 / CONTINUIDADE",titulo:"O que merece permanecer?",apoio:"Escolha hábitos, relações e práticas capazes de continuar além de uma pessoa ou projeto.",exemplo:"Qual pequeno ritual deveria seguir vivo?"},
  {etapa:"05 / REPARAÇÃO",titulo:"O que precisamos rever ou reparar?",apoio:"Reconheça um custo ou impacto que exija acompanhamento, sem atribuir culpa.",exemplo:"Que efeito colateral não queremos repetir?"},
  {etapa:"06 / COMPROMISSO",titulo:"Qual ação concreta conecta resultado e legado?",apoio:"Defina um gesto observável e como será revisitado, de preferência com quem é afetado.",exemplo:"O que faremos, com quem e quando voltaremos a conversar?"},
] as const;

const dimensoes = ["Entrega","Relações","Cultura","Continuidade"] as const;

export default function CadernoLegado(){
  const [foco,setFoco]=useState<string>("");
  const [respostas,setRespostas]=useState<string[]>(questoes.map(()=>""));
  const [mensagem,setMensagem]=useState("");
  const preenchidos=respostas.filter(r=>r.trim().length>0).length;
  const atualizar=(i:number,v:string)=>{setRespostas(prev=>prev.map((r,j)=>i===j?v:r));setMensagem("");};
  function texto(){
    return ["ESCOLA ATEMPORAL | BIBLIOTECA ATEMPORAL",
      "TRILHA 06 — RESULTADOS E LEGADO",
      "CADERNO DE CONTINUIDADE | REFLEXÃO AUTORAL",
      "",
      "Dimensão inicial: "+(foco||"[não selecionada]"),
      "O material é reflexivo, não é diagnóstico nem avaliação de pessoas.",
      "",
      ...questoes.flatMap((q,i)=>[q.etapa+" — "+q.titulo,q.apoio,"",respostas[i]||"[Não preenchida]","","------------------------------------------------",""]),
      "Fonte: https://biblioteca-atemporal-web.onrender.com/trilhas/resultados-e-legado"].join("\n");
  }
  function baixar(){
    const blob=new Blob(["\uFEFF"+texto()],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="caderno-resultados-e-legado-trilha-06.txt";
    document.body.appendChild(a);a.click();a.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),5000);
    setMensagem("Arquivo disponibilizado para download neste dispositivo.");
  }
  function limpar(){
    if((preenchidos>0||foco)&&!window.confirm("Apagar as respostas? Elas não poderão ser recuperadas."))return;
    setRespostas(questoes.map(()=>""));setFoco("");setMensagem("Campos limpos.");
  }
  return <section className="legacy-journal" id="caderno-legado" aria-labelledby="legacy-journal-title">
    <div className="legacy-journal-heading">
      <div>
        <span className="eyebrow">PRÁTICA ORIGINAL · TRILHA 06</span>
        <h2 id="legacy-journal-title">CADERNO DE <em>CONTINUIDADE.</em></h2>
        <p>Um percurso de seis perguntas para olhar resultados, reconhecer consequências e transformar reflexões em um compromisso com o futuro. Não há resposta certa.</p>
      </div>
      <div className="legacy-journal-progress" aria-label={preenchidos+" de 6 reflexões preenchidas"}>
        <span><strong>{preenchidos}</strong> / 6</span>
        <small>REFLEXÕES</small>
        <div className="legacy-journal-track" role="progressbar" aria-label="Reflexões preenchidas" aria-valuemin={0} aria-valuemax={6} aria-valuenow={preenchidos}><span style={{width:(preenchidos/6*100)+"%"}}/></div>
      </div>
    </div>
    <div className="legacy-journal-privacy" role="note">
      <span aria-hidden="true">i</span><p><strong>Suas respostas ficam com você.</strong> Elas não são enviadas para a Escola e não são gravadas no servidor. Permanecem somente enquanto esta página estiver aberta; baixe o arquivo para guardá-las. Não inclua informações confidenciais nem dados pessoais de outras pessoas.</p>
    </div>
    <div className="legacy-journal-focus">
      <div><span>UM PONTO DE PARTIDA</span><label htmlFor="legacy-foco">Que dimensão deseja observar primeiro?</label><p>Esta escolha é opcional e não limita suas próximas respostas.</p></div>
      <select id="legacy-foco" value={foco} onChange={e=>setFoco(e.target.value)}>
        <option value="">Escolha uma dimensão (opcional)</option>{dimensoes.map(d=><option key={d} value={d}>{d}</option>)}
      </select>
    </div>
    <div className="legacy-journal-fields">
      {questoes.map((q,i)=><article key={q.etapa} className={"legacy-journal-card"+(respostas[i].trim()?" answered":"")}>
        <div className="legacy-journal-meta"><span>{q.etapa}</span><span>{respostas[i].trim()?"REGISTRADA":"REFLEXÃO LIVRE"}</span></div>
        <label htmlFor={"legacy-resposta-"+i}>{q.titulo}</label>
        <p id={"legacy-ajuda-"+i}>{q.apoio}</p>
        <textarea id={"legacy-resposta-"+i} aria-describedby={"legacy-ajuda-"+i} maxLength={1800} rows={4} placeholder={q.exemplo} value={respostas[i]} onChange={e=>atualizar(i,e.target.value)}/>
      </article>)}
    </div>
    <div className="legacy-journal-actions">
      <div><strong>O legado começa nas escolhas de hoje.</strong><p>Guarde suas anotações e revisite os compromissos quando fizer sentido.</p></div>
      <div className="legacy-journal-buttons"><button type="button" onClick={baixar}>Baixar meu caderno (.txt) ↗</button><button type="button" onClick={limpar}>Limpar respostas</button></div>
      <span role="status" aria-live="polite">{mensagem}</span>
    </div>
  </section>;
}
