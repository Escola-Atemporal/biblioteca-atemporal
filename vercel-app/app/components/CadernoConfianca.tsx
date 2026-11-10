"use client";
import { useState } from "react";
const perguntas = [
  {rotulo:"01 / UM DESAFIO REAL",pergunta:"Que situação pede mais confiança ou colaboração?",apoio:"Descreva uma situação sem incluir nomes ou dados confidenciais."},
  {rotulo:"02 / ESCUTA",pergunta:"Que perspectiva ainda não foi escutada?",apoio:"Considere pessoas, experiências e objeções que não chegaram à conversa."},
  {rotulo:"03 / ACORDOS",pergunta:"Que combinado concreto poderia trazer clareza?",apoio:"Pense no propósito, nos papéis, em como decidir e em como pedir ajuda."},
  {rotulo:"04 / GESTO",pergunta:"Qual pequena ação posso experimentar?",apoio:"Escolha algo observável: uma pergunta, uma devolutiva, uma conversa ou um reconhecimento."},
  {rotulo:"05 / REVISÃO",pergunta:"Como saberemos se a relação avançou?",apoio:"Observe sinais de participação e diálogo, sem reduzir confiança a uma nota."},
];
export default function CadernoConfianca(){
  const [respostas,setRespostas]=useState<string[]>(perguntas.map(()=>""));
  const [mensagem,setMensagem]=useState("");
  const total=respostas.filter(x=>x.trim()).length;
  function atualizar(index:number,value:string){setRespostas(old=>old.map((item,i)=>i===index?value:item));setMensagem("");}
  function texto(){
    return ["ESCOLA ATEMPORAL | BIBLIOTECA ATEMPORAL","TRILHA 04 — CONFIANÇA E COLABORAÇÃO","CADERNO DE CONVERSAS QUE CONSTROEM","","Material original de reflexão. Não é um diagnóstico nem um instrumento de avaliação.","",...perguntas.flatMap((p,i)=>[p.rotulo+" — "+p.pergunta,p.apoio,"",respostas[i]||"[Sua reflexão]","","------------------------------------------------",""]),"Fonte: https://biblioteca-atemporal-web.onrender.com/trilhas/confianca-e-colaboracao"].join("\n");
  }
  function salvar(){
    const blob=new Blob(["\uFEFF"+texto()],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");link.href=url;link.download="caderno-confianca-colaboracao-trilha-04.txt";
    document.body.appendChild(link);link.click();link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),5000);
    setMensagem("Arquivo disponibilizado para download no seu dispositivo.");
  }
  function limpar(){
    if(total>0&&!window.confirm("Apagar suas reflexões? Elas não poderão ser recuperadas."))return;
    setRespostas(perguntas.map(()=>""));setMensagem("Campos limpos.");
  }
  return <section className="colab-workbook" id="caderno-confianca" aria-labelledby="colab-workbook-title">
    <div className="colab-workbook-top"><div><span className="eyebrow">PRÁTICA ORIGINAL · TRILHA 04</span><h2 id="colab-workbook-title">CADERNO DE <em>CONVERSAS QUE CONSTROEM.</em></h2><p>Um roteiro pessoal de cinco perguntas para transformar reflexão em pequenas ações de cooperação. Os campos são opcionais.</p></div><span className="colab-workbook-counter" aria-live="polite">{total} / 5 <small>REFLEXÕES</small></span></div>
    <p className="colab-workbook-privacy"><strong>Privacidade:</strong> suas respostas permanecem apenas na memória desta página enquanto ela estiver aberta. Não são enviadas à Escola nem armazenadas no Render. Não registre dados pessoais, sigilosos ou de terceiros. Ao atualizar ou fechar a página, os textos desaparecem, a menos que você baixe uma cópia.</p>
    <div className="colab-workbook-fields">{perguntas.map((p,i)=><div className="colab-workbook-field" key={p.rotulo}>
      <span>{p.rotulo}</span><label htmlFor={"colab-resposta-"+i}>{p.pergunta}</label><p>{p.apoio}</p>
      <textarea id={"colab-resposta-"+i} rows={3} maxLength={1500} placeholder="Sua reflexão (opcional)" value={respostas[i]} onChange={e=>atualizar(i,e.target.value)}/>
    </div>)}</div>
    <div className="colab-workbook-actions"><button type="button" onClick={salvar}>Baixar meu caderno (.txt) ↗</button><button type="button" className="colab-workbook-clear" onClick={limpar}>Limpar respostas</button><span role="status" aria-live="polite">{mensagem}</span></div>
  </section>;
}
