"use client";

import { useState } from "react";

const questoes = [
 {etapa:"01 / NOMEAR",titulo:"Qual tensão você precisa atravessar?",ajuda:"Descreva a situação sem nomes ou detalhes confidenciais. Evite reduzir o desafio a certo versus errado.",exemplo:"Ex.: A equipe pede autonomia, mas precisamos garantir alinhamento."},
 {etapa:"02 / PRIMEIRO POLO",titulo:"O que o primeiro lado procura proteger?",ajuda:"Reconheça a contribuição legítima desse valor, mesmo que ele esteja sendo praticado em excesso.",exemplo:"Ex.: Alinhamento oferece direção e critérios compartilhados."},
 {etapa:"03 / SEGUNDO POLO",titulo:"O que o outro lado procura proteger?",ajuda:"Investigue o que poderia ser perdido se o segundo polo não tivesse espaço.",exemplo:"Ex.: Autonomia oferece iniciativa, senso de responsabilidade e criatividade."},
 {etapa:"04 / ALERTAS",titulo:"Que sinais mostram excesso ou desequilíbrio?",ajuda:"Observe comportamentos, acordos, qualidade das relações e efeitos sobre o trabalho.",exemplo:"Ex.: Autonomia sem critérios causa retrabalho; controle demais gera dependência."},
 {etapa:"05 / EXPERIMENTAR",titulo:"Qual prática ajuda a sustentar os dois valores?",ajuda:"Imagine uma experiência pequena, proporcional e observável. Não prometa resolver a tensão para sempre.",exemplo:"Ex.: Delegar uma decisão com critérios claros e uma revisão breve."},
 {etapa:"06 / REVISITAR",titulo:"Como e quando a escolha será revisitada?",ajuda:"Escolha sinais de aprendizado e uma conversa de acompanhamento, sem avaliação pessoal ou pontuação.",exemplo:"Ex.: Perguntar após a próxima entrega o que trouxe clareza e o que limitou a iniciativa."},
] as const;

const opcoes = [
 "Autonomia e alinhamento",
 "Resultados e bem-estar",
 "Firmeza e cuidado",
 "Inovação e identidade",
 "Velocidade e profundidade",
 "Outra tensão",
] as const;

export default function CadernoParadoxos(){
 const [escolha,setEscolha] = useState<string>("");
 const [respostas,setRespostas] = useState<string[]>(questoes.map(()=>""));
 const [mensagem,setMensagem] = useState("");
 const total = respostas.filter(x=>x.trim()).length;
 const atualizar = (i:number,valor:string) => {setRespostas(atual=>atual.map((v,j)=>j===i?valor:v));setMensagem("");};
 function exportar(){
  const linhas=[
   "ESCOLA ATEMPORAL | BIBLIOTECA ATEMPORAL",
   "TRILHA 05 — PARADOXOS DA LIDERANÇA",
   "MAPA DE TENSÕES — CADERNO REFLEXIVO ORIGINAL",
   "",
   "Tensão escolhida: "+(escolha||"[não selecionada]"),
   "Atividade editorial educativa, não é diagnóstico.",
   "Respostas preenchidas somente neste dispositivo, sem envio ao servidor.",
   "",
   ...questoes.flatMap((q,i)=>[q.etapa+" — "+q.titulo,q.ajuda,"",respostas[i]||"[Reflexão não preenchida]","","-----------------------------------------------",""]),
   "Fonte: https://biblioteca-atemporal-web.onrender.com/trilhas/paradoxos-da-lideranca",
  ].join("\n");
  const file=new Blob(["\uFEFF"+linhas],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(file);
  const a=document.createElement("a");a.href=url;a.download="mapa-de-tensoes-trilha-05.txt";
  document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),5000);
  setMensagem("Caderno preparado para download. Suas respostas continuam apenas neste navegador.");
 }
 function limpar(){
  if((total>0||escolha)&&!window.confirm("Limpar todas as reflexões? Elas não serão recuperadas."))return;
  setEscolha("");setRespostas(questoes.map(()=>""));setMensagem("Campos limpos.");
 }
 return <section className="paradox-journal" id="mapa-de-tensoes" aria-labelledby="paradox-journal-title">
  <div className="paradox-journal-top">
   <div className="paradox-journal-heading">
    <span className="eyebrow">CADERNO ORIGINAL DA BIBLIOTECA · TRILHA 05</span>
    <h2 id="paradox-journal-title">UM MAPA PARA <em>ATRAVESSAR TENSÕES.</em></h2>
    <p>Seis perguntas para reconhecer valores em aparente oposição e experimentar escolhas mais conscientes. Você pode deixar campos em branco.</p>
   </div>
   <div className="paradox-journal-progress" aria-label={total+" de 6 reflexões preenchidas"}>
    <div><strong>{total}</strong><span> / 6</span></div>
    <small>REFLEXÕES</small>
    <div className="paradox-journal-progress-track" role="progressbar" aria-label="Questões preenchidas" aria-valuemin={0} aria-valuemax={6} aria-valuenow={total}><span style={{width:(total/6*100)+"%"}}/></div>
   </div>
  </div>
  <div className="paradox-journal-privacy" role="note"><span aria-hidden="true">i</span><p><strong>Reflexão pessoal, sem armazenamento.</strong> As respostas ficam apenas na memória desta página: não são enviadas à Escola ou ao Render. Evite informações sigilosas e dados de outras pessoas. Ao sair, as anotações desaparecem, a menos que você baixe uma cópia.</p></div>
  <div className="paradox-journal-picker"><div><span className="paradox-journal-kicker">ESCOLHA UM PONTO DE PARTIDA</span><label htmlFor="paradox-tema">Qual tensão deseja explorar?</label><p>Você pode mudar a tensão sem perder as respostas já escritas.</p></div><select id="paradox-tema" value={escolha} onChange={e=>{setEscolha(e.target.value);setMensagem("");}}><option value="">Selecione uma tensão (opcional)</option>{opcoes.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
  <div className="paradox-journal-fields">{questoes.map((q,i)=><article className={"paradox-journal-card"+(respostas[i].trim()?" has-answer":"")} key={q.etapa}>
   <div className="paradox-journal-card-top"><span>{q.etapa}</span><span>{respostas[i].trim()?"REGISTRADO":"PERGUNTA ABERTA"}</span></div>
   <label htmlFor={"paradox-resposta-"+i}>{q.titulo}</label>
   <p id={"paradox-ajuda-"+i}>{q.ajuda}</p>
   <textarea id={"paradox-resposta-"+i} rows={4} maxLength={1800} aria-describedby={"paradox-ajuda-"+i} placeholder={q.exemplo} value={respostas[i]} onChange={e=>atualizar(i,e.target.value)}/>
  </article>)}</div>
  <div className="paradox-journal-footer"><div><strong>Seu ritmo faz parte do percurso.</strong><p>Registre apenas o que desejar. A atividade não cria notas, perfis ou comparações entre pessoas.</p></div><div className="paradox-journal-buttons"><button type="button" onClick={exportar}>Baixar meu mapa (.txt) ↗</button><button type="button" onClick={limpar}>Limpar respostas</button></div><span role="status" aria-live="polite">{mensagem}</span></div>
 </section>;
}
