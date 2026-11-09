"use client";

import { useState } from "react";

type PerguntaId = "acontecimento" | "corpo" | "gatilho" | "narrativa" | "valor" | "escolha" | "retorno";
type Respostas = Record<PerguntaId, string>;

const perguntas: Array<{
  id: PerguntaId;
  fase: string;
  titulo: string;
  orientacao: string;
  exemplo: string;
}> = [
  {
    id: "acontecimento",
    fase: "01 / OBSERVAR",
    titulo: "O que realmente aconteceu?",
    orientacao: "Descreva apenas aquilo que uma câmera poderia observar. Evite nomes, detalhes sigilosos e interpretações sobre intenções de outras pessoas.",
    exemplo: "Ex.: Uma pessoa discordou da minha proposta durante uma reunião.",
  },
  {
    id: "corpo",
    fase: "02 / OBSERVAR",
    titulo: "O que mudou em você?",
    orientacao: "Observe respiração, ritmo, tensão, vontade de falar ou de se retirar. Não é preciso explicar ou avaliar essas percepções.",
    exemplo: "Ex.: Senti o peito contraído, acelerei a fala e quis responder na mesma hora.",
  },
  {
    id: "gatilho",
    fase: "03 / NOMEAR",
    titulo: "Que emoção se aproxima da experiência?",
    orientacao: "Use suas palavras. A emoção selecionada é apenas uma hipótese de observação, não um rótulo de personalidade.",
    exemplo: "Ex.: Senti medo de parecer despreparado, junto com irritação.",
  },
  {
    id: "narrativa",
    fase: "04 / COMPREENDER",
    titulo: "Que história você contou a si mesmo?",
    orientacao: "Diferencie o que ocorreu da interpretação que surgiu. Que outra explicação, ainda não verificada, também seria possível?",
    exemplo: "Ex.: Interpretei a discordância como ataque; talvez fosse apenas uma pergunta legítima.",
  },
  {
    id: "valor",
    fase: "05 / COMPREENDER",
    titulo: "O que essa emoção pode estar sinalizando?",
    orientacao: "Investigue necessidades e valores possíveis: pertencimento, reconhecimento, segurança, justiça, autonomia ou cuidado. Evite presumir uma causa única.",
    exemplo: "Ex.: Quero ser respeitado e preciso de espaço para pensar antes de responder.",
  },
  {
    id: "escolha",
    fase: "06 / ESCOLHER",
    titulo: "Qual resposta pode ser mais consciente?",
    orientacao: "Desenhe um gesto concreto: pedir um intervalo, esclarecer uma dúvida, ouvir a outra perspectiva, admitir um limite ou buscar apoio.",
    exemplo: "Ex.: Perguntar o que está em jogo na objeção antes de defender minha proposta.",
  },
  {
    id: "retorno",
    fase: "07 / CONTINUAR",
    titulo: "Como você vai revisitar essa escolha?",
    orientacao: "Defina um momento breve para observar o impacto de sua ação, sem transformar a prática em cobrança de perfeição.",
    exemplo: "Ex.: Depois da reunião, anotar o que aprendi e perguntar como a conversa foi percebida.",
  },
];

const emocoes = ["Ainda não sei", "Medo", "Raiva", "Alegria", "Tristeza", "Repulsa", "Culpa", "Vergonha", "Outra emoção"] as const;

const cenarios = [
  {
    etiqueta: "SITUAÇÃO 01",
    titulo: "Feedback inesperado",
    texto: "Uma observação sobre seu trabalho aparece em público e desperta vontade imediata de justificar-se.",
    convite: "Qual é o fato e qual é a interpretação que surge?",
  },
  {
    etiqueta: "SITUAÇÃO 02",
    titulo: "Mudança de rota",
    texto: "Uma decisão do time muda de última hora e você percebe resistência antes mesmo de ouvir os motivos.",
    convite: "O que a reação tenta proteger: tempo, confiança, autonomia ou outra coisa?",
  },
  {
    etiqueta: "SITUAÇÃO 03",
    titulo: "Conversas evitadas",
    texto: "Há um assunto importante que ninguém parece querer trazer para a reunião.",
    convite: "Que perguntas ajudariam a abrir espaço sem forçar exposição emocional?",
  },
];

const empty = Object.fromEntries(perguntas.map(({ id }) => [id, ""])) as Respostas;

export default function CadernoEmocoes() {
  const [respostas, setRespostas] = useState<Respostas>(empty);
  const [emocao, setEmocao] = useState<(typeof emocoes)[number]>("Ainda não sei");
  const [mensagem, setMensagem] = useState("");
  const preenchidos = perguntas.filter((p) => respostas[p.id].trim()).length;

  function atualizar(id: PerguntaId, texto: string) {
    setRespostas((anterior) => ({ ...anterior, [id]: texto }));
    setMensagem("");
  }

  function montarArquivo() {
    const linhas = [
      "ESCOLA ATEMPORAL — BIBLIOTECA",
      "TRILHA 02 — EMOÇÕES E AUTOCONSCIÊNCIA",
      "CADERNO DE PRESENÇA — DA REAÇÃO À ESCOLHA",
      "",
      "Material original de reflexão educacional; não é diagnóstico, terapia ou avaliação.",
      "Respostas escritas no navegador, sem envio ou armazenamento no servidor.",
      "",
      "EMOÇÃO OBSERVADA (hipótese): " + emocao,
      "",
      ...perguntas.flatMap((p) => [
        p.fase + " · " + p.titulo,
        p.orientacao,
        "",
        respostas[p.id].trim() || "[Espaço para uma reflexão]",
        "",
        "------------------------------------",
        "",
      ]),
      "Continuar explorando:",
      "https://biblioteca-atemporal-web.onrender.com/trilhas/emocoes-e-autoconsciencia",
      "",
    ];
    return linhas.join("\n");
  }

  function baixar() {
    const blob = new Blob(["\uFEFF" + montarArquivo()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const elemento = document.createElement("a");
    elemento.href = url;
    elemento.download = "caderno-de-presenca-trilha-02.txt";
    document.body.appendChild(elemento);
    elemento.click();
    elemento.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    setMensagem("Arquivo preparado para download. A cópia permanece sob seu controle.");
  }

  function imprimir() {
    window.print();
    setMensagem("Na janela de impressão, escolha “Salvar como PDF” se desejar guardar uma cópia.");
  }

  function limpar() {
    if ((preenchidos > 0 || emocao !== "Ainda não sei") && !window.confirm("Apagar as anotações? Elas não foram armazenadas e não poderão ser recuperadas.")) return;
    setRespostas({ ...empty });
    setEmocao("Ainda não sei");
    setMensagem("Anotações limpas.");
  }

  return (
    <section className="reflection-workbook emotion-workbook" id="caderno-emocoes" aria-labelledby="titulo-caderno-emocoes">
      <div className="reflection-workbook-head">
        <div>
          <span className="eyebrow">EXERCÍCIO ORIGINAL DA BIBLIOTECA · TRILHA 02</span>
          <h2 id="titulo-caderno-emocoes">CADERNO DE <em>PRESENÇA.</em></h2>
          <p>Uma prática breve para observar uma reação, encontrar palavras, revisar a interpretação e escolher o próximo gesto. Não exige estar calmo nem encontrar a resposta perfeita.</p>
        </div>
        <div className="reflection-workbook-seal" aria-hidden="true"><span>02</span><small>SENTIR.<br />PERCEBER.<br />ESCOLHER.</small></div>
      </div>

      <div className="reflection-workbook-security" role="note">
        <strong>Privacidade e cuidado.</strong>
        <p>Este caderno é educativo, não é terapia nem diagnóstico. Suas respostas ficam apenas na memória desta página enquanto ela estiver aberta: não são enviadas ao Render nem à Escola. Não registre nomes, informações de terceiros ou dados confidenciais. Você pode pular qualquer pergunta e parar quando quiser. Se uma reflexão causar sofrimento importante, procure apoio de alguém de confiança ou de um profissional qualificado.</p>
      </div>

      <div className="reflection-scenarios">
        <span className="reflection-scenarios-label">SITUAÇÕES FICTÍCIAS · PARA COMEÇAR SEM EXPOR HISTÓRIAS PESSOAIS</span>
        <div className="reflection-scenarios-grid">
          {cenarios.map((cenario) => (
            <article key={cenario.etiqueta}>
              <span>{cenario.etiqueta}</span>
              <h3>{cenario.titulo}</h3>
              <p>{cenario.texto}</p>
              <p className="scenario-question">{cenario.convite}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="emotion-selector">
        <label htmlFor="emocao-selecionada">
          <span>ANTES DE ESCREVER</span>
          <strong>Existe uma emoção que você gostaria de investigar?</strong>
          <small>A seleção é opcional. Todas as emoções são hipóteses; mais de uma pode estar presente.</small>
        </label>
        <select id="emocao-selecionada" value={emocao} onChange={(e) => {setEmocao(e.target.value as (typeof emocoes)[number]);setMensagem("");}}>
          {emocoes.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="reflection-workbook-progress">
        <div><span>SEU PERCURSO</span><strong>{preenchidos} de {perguntas.length} reflexões exploradas</strong></div>
        <progress value={preenchidos} max={perguntas.length} aria-label="Progresso no caderno de presença" />
        <p>Não há nota, pontuação ou meta. O convite é perceber, não se julgar.</p>
      </div>

      <div className="reflection-workbook-fields">
        {perguntas.map((p) => (
          <div key={p.id} className="reflection-workbook-field">
            <label htmlFor={"presenca-" + p.id}>
              <span className="reflection-step-id">{p.fase}</span>
              <strong>{p.titulo}</strong>
              <span className="reflection-step-help">{p.orientacao}</span>
            </label>
            <textarea
              id={"presenca-" + p.id}
              value={respostas[p.id]}
              onChange={(e) => atualizar(p.id, e.target.value)}
              placeholder={p.exemplo}
              rows={3}
              maxLength={4000}
            />
          </div>
        ))}
      </div>

      <div className="reflection-workbook-actions">
        <div>
          <strong>Uma percepção pode abrir espaço para outra escolha.</strong>
          <p>Se quiser guardar suas notas, baixe um arquivo de texto editável ou salve em PDF pela impressão do navegador. Nada é salvo automaticamente.</p>
        </div>
        <div className="reflection-workbook-buttons">
          <button type="button" className="reflection-download" onClick={baixar}>Baixar caderno (.txt) ↗</button>
          <button type="button" className="reflection-print" onClick={imprimir}>Imprimir / salvar PDF ↗</button>
          <button type="button" className="reflection-reset" onClick={limpar}>Limpar campos</button>
        </div>
      </div>
      <p className="reflection-workbook-status" aria-live="polite" role="status">{mensagem}</p>

      <div className="reflection-workbook-print">
        <p>ESCOLA ATEMPORAL · BIBLIOTECA · TRILHA 02</p>
        <h2>Caderno de Presença — da reação à escolha</h2>
        <p>Emoção observada: {emocao}</p>
        {perguntas.map((p) => (
          <section key={p.id}>
            <h3>{p.fase} · {p.titulo}</h3>
            <p>{p.orientacao}</p>
            <div>{respostas[p.id].trim() || "_________________________________________________________"}</div>
          </section>
        ))}
        <footer>Reflexão educativa e pessoal. Não é avaliação, diagnóstico nem terapia.</footer>
      </div>
    </section>
  );
}
