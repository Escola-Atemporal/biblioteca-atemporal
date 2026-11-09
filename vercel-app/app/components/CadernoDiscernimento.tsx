"use client";

import { useState } from "react";

type CampoId = "dilema" | "alternativas" | "principios" | "pessoas" | "consequencias" | "decisao" | "revisao";
type Respostas = Record<CampoId, string>;

const vazias: Respostas = {
  dilema: "",
  alternativas: "",
  principios: "",
  pessoas: "",
  consequencias: "",
  decisao: "",
  revisao: "",
};

const perguntas: Array<{
  id: CampoId;
  etapa: string;
  titulo: string;
  orientacao: string;
  exemplo: string;
}> = [
  {
    id: "dilema",
    etapa: "01 / RECONHECER",
    titulo: "Qual decisão está em jogo?",
    orientacao: "Descreva o contexto em poucas linhas. Qual necessidade, pressão ou tensão torna essa decisão difícil?",
    exemplo: "Ex.: Nossa equipe recebeu uma meta ambiciosa, mas os prazos podem comprometer a qualidade do trabalho.",
  },
  {
    id: "alternativas",
    etapa: "02 / AMPLIAR",
    titulo: "Quais caminhos são possíveis?",
    orientacao: "Liste pelo menos duas alternativas. Considere também a possibilidade de construir uma terceira opção com outras pessoas.",
    exemplo: "Ex.: Manter o prazo original; renegociar entregas; envolver o time para redesenhar as prioridades.",
  },
  {
    id: "principios",
    etapa: "03 / DISCERNIR",
    titulo: "Que princípios precisam permanecer?",
    orientacao: "Escolha os princípios mais relevantes e identifique onde estão em tensão: presença, ética, responsabilidade, confiança, discernimento ou bem comum.",
    exemplo: "Ex.: Coerência entre a promessa feita ao cliente e o cuidado que devemos às pessoas da equipe.",
  },
  {
    id: "pessoas",
    etapa: "04 / ESCUTAR",
    titulo: "Quem será afetado e quem ainda não foi ouvido?",
    orientacao: "Pense nas pessoas e grupos impactados. Não inclua nomes ou dados confidenciais no exercício.",
    exemplo: "Ex.: Pessoas da equipe, clientes, parceiros e aqueles que executarão a decisão depois.",
  },
  {
    id: "consequencias",
    etapa: "05 / PROJETAR",
    titulo: "O que cada caminho deixa como consequência?",
    orientacao: "Diferencie resultados imediatos e efeitos de longo prazo sobre confiança, autonomia, relações e cultura.",
    exemplo: "Ex.: No curto prazo, manter o cronograma; no longo, desgaste do time e perda de confiança.",
  },
  {
    id: "decisao",
    etapa: "06 / AGIR",
    titulo: "Qual é o próximo gesto de coerência?",
    orientacao: "Registre uma decisão provisória ou compromisso concreto e observável. Não precisa ser a resposta definitiva.",
    exemplo: "Ex.: Reunir as partes envolvidas para rever o escopo antes de assumir novos compromissos.",
  },
  {
    id: "revisao",
    etapa: "07 / APRENDER",
    titulo: "Como você saberá que agiu de acordo com seus princípios?",
    orientacao: "Defina o que observar e quando revisitar a decisão. Considere sinais de aprendizado, não apenas indicadores de desempenho.",
    exemplo: "Ex.: Revisitar a decisão em duas semanas e ouvir se as pessoas perceberam mais transparência.",
  },
];

const roteiro = [
  {
    titulo: "Prazos e pessoas",
    texto: "Uma entrega importante está atrasada. Cumprir a data pode exigir sobrecarga repetida da equipe.",
    pergunta: "Que alternativas preservariam a responsabilidade pelo resultado sem normalizar o desgaste?",
  },
  {
    titulo: "Coerência e reputação",
    texto: "A organização comunica transparência, mas uma informação relevante pode gerar desconforto na liderança.",
    pergunta: "Quais consequências surgem ao priorizar a aparência de confiança em vez de práticas confiáveis?",
  },
  {
    titulo: "Decidir com tecnologia",
    texto: "Um sistema recomenda uma decisão eficiente, mas seus critérios e impactos ainda não estão claros.",
    pergunta: "O que precisa ser questionado antes de transformar a recomendação em ação?",
  },
];

export default function CadernoDiscernimento() {
  const [respostas, setRespostas] = useState<Respostas>(vazias);
  const [status, setStatus] = useState("");
  const preenchidos = perguntas.filter(p => respostas[p.id].trim().length > 0).length;

  function atualizar(id: CampoId, value: string) {
    setRespostas(prev => ({ ...prev, [id]: value }));
    if (status) setStatus("");
  }

  function montarCaderno() {
    const cabecalho = [
      "ESCOLA ATEMPORAL / BIBLIOTECA",
      "TRILHA 01 — PRINCÍPIOS E DISCERNIMENTO",
      "CADERNO DE REFLEXÃO: O MAPA DE UMA ESCOLHA REAL",
      "",
      "Este caderno foi escrito por você e não foi enviado nem armazenado pela Biblioteca.",
      "A reflexão é pessoal; evite incluir dados sensíveis, nomes e informações confidenciais.",
      "",
      "—".repeat(38),
    ];
    const respostasFormatadas = perguntas.flatMap((p, index) => [
      "",
      p.etapa + " — " + p.titulo,
      p.orientacao,
      "",
      respostas[p.id].trim() || "[Espaço reservado para a reflexão]",
      "",
      index < perguntas.length - 1 ? "—".repeat(38) : "",
    ]);
    return [...cabecalho, ...respostasFormatadas, "", "FONTE E PERCURSO:", "https://biblioteca-atemporal-web.onrender.com/trilhas/principios-e-discernimento", ""].join("\n");
  }

  function baixar() {
    const arquivo = new Blob(["\uFEFF" + montarCaderno()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "caderno-de-discernimento-escola-atemporal.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    setStatus("Arquivo preparado para download. Ele fica sob seu controle no seu dispositivo.");
  }

  function imprimir() {
    window.print();
    setStatus("Use a opção “Salvar como PDF” da janela de impressão, caso queira guardar uma cópia.");
  }

  function limpar() {
    if (preenchidos > 0 && !window.confirm("Apagar as respostas preenchidas? Elas não foram armazenadas e não poderão ser recuperadas.")) return;
    setRespostas({ ...vazias });
    setStatus("Campos limpos.");
  }

  return (
    <section id="caderno" className="reflection-workbook" aria-labelledby="caderno-titulo">
      <div className="reflection-workbook-head">
        <div>
          <span className="eyebrow">LABORATÓRIO DE DISCERNIMENTO · TRILHA 01</span>
          <h2 id="caderno-titulo">CADERNO DE <em>UMA ESCOLHA REAL.</em></h2>
          <p>Uma prática para atravessar dúvidas, ouvir perspectivas e transformar princípios em gestos observáveis. Use um dilema real ou comece por uma situação hipotética.</p>
        </div>
        <div className="reflection-workbook-seal" aria-hidden="true"><span>01</span><small>PAUSA.<br />ESCOLHA.<br />AÇÃO.</small></div>
      </div>

      <div className="reflection-workbook-security" role="note">
        <strong>Um espaço pessoal, sem cadastro.</strong>
        <p>As respostas ficam apenas nesta página enquanto ela estiver aberta. Não são enviadas ao Render, ao GitHub ou à Escola e desaparecem quando você sai ou atualiza a página. Evite inserir nomes, informações sigilosas ou dados pessoais. Para guardar o conteúdo, baixe seu arquivo ou salve como PDF.</p>
      </div>

      <div className="reflection-scenarios">
        <span className="reflection-scenarios-label">PRECISA DE UM PONTO DE PARTIDA? · CENÁRIOS FICTÍCIOS</span>
        <div className="reflection-scenarios-grid">
          {roteiro.map((cenario, i) => (
            <article key={cenario.titulo}>
              <span>0{i + 1} / SITUAÇÃO</span>
              <h3>{cenario.titulo}</h3>
              <p>{cenario.texto}</p>
              <p className="scenario-question">{cenario.pergunta}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="reflection-workbook-progress">
        <div><span>SEU PERCURSO</span><strong>{preenchidos} de {perguntas.length} campos explorados</strong></div>
        <progress value={preenchidos} max={perguntas.length} aria-label="Progresso no caderno de reflexão" />
        <p>Não há nota nem resposta certa. O objetivo é ampliar o discernimento, não preencher todos os campos.</p>
      </div>

      <div className="reflection-workbook-fields">
        {perguntas.map(p => (
          <div key={p.id} className="reflection-workbook-field">
            <label htmlFor={"caderno-" + p.id}>
              <span className="reflection-step-id">{p.etapa}</span>
              <strong>{p.titulo}</strong>
              <span className="reflection-step-help">{p.orientacao}</span>
            </label>
            <textarea
              id={"caderno-" + p.id}
              value={respostas[p.id]}
              onChange={e => atualizar(p.id, e.target.value)}
              placeholder={p.exemplo}
              rows={3}
              maxLength={4000}
            />
          </div>
        ))}
      </div>

      <div className="reflection-workbook-actions">
        <div><strong>Sua reflexão pode continuar fora da tela.</strong><p>Salve uma cópia para retornar à decisão depois. O download é um texto editável; o PDF é gerado pela função de impressão do seu navegador.</p></div>
        <div className="reflection-workbook-buttons">
          <button type="button" onClick={baixar} className="reflection-download">Baixar caderno (.txt) <span aria-hidden="true">↗</span></button>
          <button type="button" onClick={imprimir} className="reflection-print">Imprimir / salvar PDF ↗</button>
          <button type="button" onClick={limpar} className="reflection-reset">Limpar campos</button>
        </div>
      </div>
      <p className="reflection-workbook-status" role="status" aria-live="polite">{status}</p>

      <div className="reflection-workbook-print" aria-hidden="true">
        <p>Escola Atemporal · Biblioteca · Trilha 01</p>
        <h2>O mapa de uma escolha real</h2>
        {perguntas.map(p => (
          <section key={p.id}>
            <h3>{p.etapa} · {p.titulo}</h3>
            <p>{p.orientacao}</p>
            <div>{respostas[p.id].trim() || "____________________________________________________________"}</div>
          </section>
        ))}
        <footer>Material original de reflexão · Biblioteca Atemporal · Não substitui deliberação coletiva ou aconselhamento profissional.</footer>
      </div>
    </section>
  );
}
