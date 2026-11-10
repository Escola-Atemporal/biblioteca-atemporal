"use client";

import { useState } from "react";

type Etapa = "padrao"|"contexto"|"ganho"|"custo"|"valor"|"gesto"|"revisao";
type Respostas = Record<Etapa,string>;
const questoes: {id:Etapa;fase:string;titulo:string;ajuda:string;exemplo:string}[] = [
 {id:"padrao",fase:"01 / PERCEBER",titulo:"Que comportamento aparece repetidamente?",ajuda:"Descreva uma ação concreta, sem rótulos sobre quem você é. Prefira uma situação simples, real ou hipotética.",exemplo:"Ex.: Abro mensagens assim que surge uma pausa no trabalho."},
 {id:"contexto",fase:"02 / CONTEXTUALIZAR",titulo:"O que costuma acontecer antes?",ajuda:"Observe o horário, ambiente, expectativa, emoção ou tarefa anterior. Não é preciso encontrar uma causa única.",exemplo:"Ex.: Quando uma tarefa fica difícil e eu quero aliviar a tensão."},
 {id:"ganho",fase:"03 / COMPREENDER",titulo:"O que esse hábito oferece no curto prazo?",ajuda:"Mesmo um comportamento que queremos mudar pode ter uma função. Qual sensação, resultado ou proteção imediata ele proporciona?",exemplo:"Ex.: Sinto alívio por alguns instantes e adio o desconforto."},
 {id:"custo",fase:"04 / QUESTIONAR",titulo:"O que ele custa hoje?",ajuda:"Investigue o que muda na atenção, nas relações, no tempo, na saúde ou na coerência com seus compromissos. Evite julgamentos.",exemplo:"Ex.: Volto menos concentrado e começo as conversas com pressa."},
 {id:"valor",fase:"05 / DISCERNIR",titulo:"Que princípio ou intenção merece mais espaço?",ajuda:"Nomeie o que importa para você neste contexto. Não precisa ser uma meta de produtividade.",exemplo:"Ex.: Quero estar presente e cumprir o que combinei com a equipe."},
 {id:"gesto",fase:"06 / EXPERIMENTAR",titulo:"Qual pequeno gesto é possível testar?",ajuda:"Proponha uma alteração observável que caiba na rotina, com uma situação que a lembre. Evite promessas absolutas.",exemplo:"Ex.: Quando sentir vontade de abrir o aplicativo, pausar e terminar uma frase do trabalho primeiro."},
 {id:"revisao",fase:"07 / SUSTENTAR",titulo:"Como revisitar a experiência sem se cobrar?",ajuda:"Estabeleça uma forma gentil de observar o que funcionou, as barreiras e o que ajustar. O objetivo é aprender, não manter uma sequência perfeita.",exemplo:"Ex.: Após algumas tentativas, anotar o que facilitou e conversar com alguém da equipe."},
];
const vazio=Object.fromEntries(questoes.map(q=>[q.id,""])) as Respostas;
const observacoes=["Observação 01","Observação 02","Observação 03","Observação 04","Observação 05"] as const;
const cenarios=[
 {numero:"01",titulo:"Sempre disponível",texto:"Ao perceber uma notificação durante uma tarefa, a pessoa interrompe o raciocínio sem decidir se a mensagem é urgente.",pergunta:"O que acontece antes do gesto automático?"},
 {numero:"02",titulo:"A fórmula que funcionava",texto:"Uma liderança continua resolvendo tudo sozinha, apesar de a equipe já precisar de mais autonomia.",pergunta:"Quando uma força do passado se transforma em limite?"},
 {numero:"03",titulo:"O silêncio depois do erro",texto:"Após uma reunião difícil, alguém evita pedir feedback por receio de descobrir como foi percebido.",pergunta:"Que gesto pequeno abriria espaço para aprender?"},
];
export default function CadernoHabitos(){
 const [respostas,setRespostas]=useState<Respostas>(vazio);
 const [registros,setRegistros]=useState<string[]>(["","","","",""]);
 const [mensagem,setMensagem]=useState("");
 const preenchidas=questoes.filter(q=>respostas[q.id].trim()).length;
 const observados=registros.filter(x=>x.trim()).length;
 function atualizar(id:Etapa,texto:string){setRespostas(prev=>({...prev,[id]:texto}));setMensagem("");}
 function registrar(indice:number,texto:string){setRegistros(prev=>prev.map((v,i)=>i===indice?texto:v));setMensagem("");}
 function conteudo(){
  return [
   "ESCOLA ATEMPORAL · BIBLIOTECA",
   "TRILHA 03 — AUTOCONHECIMENTO E HÁBITOS",
   "DIÁRIO DAS PEQUENAS ESCOLHAS",
   "",
   "Material editorial original para reflexão educacional, não um diagnóstico.",
   "Anotações feitas somente nesta página, sem envio ou armazenamento no servidor.",
   "",
   ...questoes.flatMap(q=>[q.fase+" · "+q.titulo,q.ajuda,"",respostas[q.id].trim()||"[Sua reflexão]","","---------------------------------------------",""]),
   "OBSERVAÇÕES OPCIONAIS",
   "Não são dias consecutivos, nem metas de desempenho.",
   ...observacoes.flatMap((titulo,i)=>["",titulo,registros[i].trim()||"[O que percebi? O que poderia ajustar?]"]),
   "","Trilha: https://biblioteca-atemporal-web.onrender.com/trilhas/autoconhecimento-e-habitos","",
  ].join("\n");
 }
 function baixar(){
  const blob=new Blob(["\uFEFF"+conteudo()],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="diario-pequenas-escolhas-trilha-03.txt";
  document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),5000);
  setMensagem("Arquivo disponibilizado para download. A cópia permanece no seu dispositivo.");
 }
 function imprimir(){window.print();setMensagem("Na janela de impressão, escolha 'Salvar como PDF' para guardar o diário.");}
 function limpar(){
  if((preenchidas>0||observados>0)&&!window.confirm("Limpar as reflexões? Não será possível recuperá-las porque não ficam salvas."))return;
  setRespostas({...vazio});setRegistros(["","","","",""]);setMensagem("Campos limpos.");
 }
 return <section id="diario-habitos" className="reflection-workbook habit-workbook" aria-labelledby="titulo-diario">
  <div className="reflection-workbook-head"><div>
   <span className="eyebrow">EXERCÍCIO ORIGINAL DA BIBLIOTECA · TRILHA 03</span>
   <h2 id="titulo-diario">DIÁRIO DAS <em>PEQUENAS ESCOLHAS.</em></h2>
   <p>Um mapa para reconhecer comportamentos repetidos, questionar fórmulas antigas e experimentar gestos de coerência. Não exige compromisso de dias seguidos.</p>
  </div><div className="reflection-workbook-seal" aria-hidden="true"><span>03</span><small>NOTAR.<br/>TESTAR.<br/>APRENDER.</small></div></div>
  <div className="reflection-workbook-security" role="note"><strong>Reflexão pessoal, sem cadastro ou armazenamento.</strong><p>Suas respostas ficam somente na memória desta página enquanto ela estiver aberta. Não são enviadas ao Render, à Escola ou ao GitHub e desaparecem ao atualizar ou sair. Não escreva nomes, dados sigilosos ou informações de terceiros. Você pode deixar qualquer campo vazio, salvar uma cópia ou parar quando quiser.</p></div>
  <div className="reflection-scenarios"><span className="reflection-scenarios-label">EXEMPLOS FICTÍCIOS · NÃO É NECESSÁRIO EXPOR EXPERIÊNCIAS PESSOAIS</span>
   <div className="reflection-scenarios-grid">{cenarios.map(c=><article key={c.numero}><span>{c.numero} / SITUAÇÃO</span><h3>{c.titulo}</h3><p>{c.texto}</p><p className="scenario-question">{c.pergunta}</p></article>)}</div>
  </div>
  <div className="reflection-workbook-progress"><div><span>SEU PERCURSO</span><strong>{preenchidas} de {questoes.length} reflexões exploradas</strong></div>
   <progress value={preenchidas} max={questoes.length} aria-label="Campos explorados no diário de hábitos"/><p>O número é apenas um indicador do preenchimento. Não representa uma pontuação ou avaliação.</p>
  </div>
  <div className="reflection-workbook-fields">{questoes.map(q=><div className="reflection-workbook-field" key={q.id}>
   <label htmlFor={"habito-"+q.id}><span className="reflection-step-id">{q.fase}</span><strong>{q.titulo}</strong><span className="reflection-step-help">{q.ajuda}</span></label>
   <textarea id={"habito-"+q.id} value={respostas[q.id]} onChange={e=>atualizar(q.id,e.target.value)} rows={3} maxLength={4000} placeholder={q.exemplo}/>
  </div>)}</div>
  <div className="habit-journal"><div className="habit-journal-intro">
   <span className="eyebrow dark">REGISTROS OPCIONAIS</span><h3>O QUE APRENDI AO TENTAR?</h3><p>Use até cinco espaços em momentos diferentes. Eles não precisam corresponder a dias consecutivos. Registre uma percepção, uma barreira ou um ajuste, sem cobrar perfeição.</p>
  </div><div className="habit-journal-grid">{observacoes.map((titulo,i)=><label key={titulo} htmlFor={"habit-observacao-"+i}><span>{titulo}</span><textarea id={"habit-observacao-"+i} rows={3} maxLength={1800} value={registros[i]} onChange={e=>registrar(i,e.target.value)} placeholder="O que mudou? O que quero compreender ou ajustar?"/></label>)}</div>
  </div>
  <div className="reflection-workbook-actions"><div><strong>Uma escolha pequena pode abrir outro caminho.</strong><p>Baixe suas anotações em texto editável ou use a impressão para salvar em PDF. O diário não é salvo automaticamente.</p></div>
   <div className="reflection-workbook-buttons"><button type="button" className="reflection-download" onClick={baixar}>Baixar diário (.txt) ↗</button><button type="button" className="reflection-print" onClick={imprimir}>Imprimir / salvar PDF ↗</button><button type="button" className="reflection-reset" onClick={limpar}>Limpar campos</button></div>
  </div>
  <p className="reflection-workbook-status" role="status" aria-live="polite">{mensagem}</p>
  <div className="reflection-workbook-print">
   <p>ESCOLA ATEMPORAL · BIBLIOTECA · TRILHA 03</p><h2>Diário das Pequenas Escolhas</h2>
   {questoes.map(q=><section key={q.id}><h3>{q.fase} · {q.titulo}</h3><p>{q.ajuda}</p><div>{respostas[q.id]||"____________________________________________________"}</div></section>)}
   <h3>OBSERVAÇÕES OPCIONAIS</h3>
   {observacoes.map((titulo,i)=><section key={titulo}><h3>{titulo}</h3><div>{registros[i]||"____________________________________________________"}</div></section>)}
   <footer>Material educativo da Biblioteca Atemporal; sem pontuação, avaliação ou diagnóstico.</footer>
  </div>
 </section>;
}
