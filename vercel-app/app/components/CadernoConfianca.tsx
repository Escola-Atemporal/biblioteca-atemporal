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
    <div className="colab-workbook-top">
      <div className="colab-workbook-intro">
        <span className="eyebrow">PRÁTICA ORIGINAL · TRILHA 04</span>
        <h2 id="colab-workbook-title">CADERNO DE <em>CONVERSAS QUE CONSTROEM.</em></h2>
        <p>Um roteiro pessoal de cinco perguntas para transformar reflexão em pequenas ações de cooperação. Responda no seu ritmo: todos os campos são opcionais.</p>
      </div>
      <div className="colab-workbook-progress" aria-label={total+" de 5 reflexões preenchidas"}>
        <span className="colab-workbook-counter" aria-live="polite"><strong>{total}</strong><span> / 5</span></span>
        <span className="colab-workbook-progress-label">REFLEXÕES</span>
        <div className="colab-workbook-progress-track" role="progressbar" aria-label="Reflexões preenchidas" aria-valuemin={0} aria-valuemax={5} aria-valuenow={total}>
          <span style={{width: (total*20)+"%"}}/>
        </div>
      </div>
    </div>
    <div className="colab-workbook-privacy" role="note">
      <span className="colab-workbook-privacy-symbol" aria-hidden="true">i</span>
      <p><strong>Suas reflexões são privadas.</strong> As respostas ficam somente nesta página enquanto ela estiver aberta. Não são enviadas à Escola nem armazenadas no Render. Evite dados pessoais ou confidenciais. Antes de sair, baixe uma cópia se desejar guardar suas anotações.</p>
    </div>
    <div className="colab-workbook-fields">
      {perguntas.map((p,i)=><article className={"colab-workbook-field"+(respostas[i].trim()?" colab-workbook-field-done":"")} key={p.rotulo}>
        <div className="colab-workbook-field-meta"><span>{p.rotulo}</span><span>{respostas[i].trim()?"REGISTRADO":"REFLEXÃO LIVRE"}</span></div>
        <label htmlFor={"colab-resposta-"+i}>{p.pergunta}</label>
        <p id={"colab-ajuda-"+i}>{p.apoio}</p>
        <textarea id={"colab-resposta-"+i} aria-describedby={"colab-ajuda-"+i} rows={4} maxLength={1500} placeholder="Escreva aqui a sua reflexão..." value={respostas[i]} onChange={e=>atualizar(i,e.target.value)}/>
      </article>)}
    </div>
    <div className="colab-workbook-actions">
      <div className="colab-workbook-actions-copy"><strong>Seu caderno, suas escolhas.</strong><span>Você pode baixar apenas o que escreveu ou recomeçar quando quiser.</span></div>
      <div className="colab-workbook-buttons"><button type="button" onClick={salvar}>Baixar meu caderno (.txt) ↗</button><button type="button" className="colab-workbook-clear" onClick={limpar}>Limpar respostas</button></div>
      <span className="colab-workbook-message" role="status" aria-live="polite">{mensagem}</span>
    </div>
  </section>;
}
