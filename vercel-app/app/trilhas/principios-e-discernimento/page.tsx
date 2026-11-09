import { livrosTrilha01, referenciasComplementaresTrilha01 } from "../../../data/referencias-trilha-01";
import type { LivroTrilha01 } from "../../../data/referencias-trilha-01";
import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilha 01 — Princípios e Discernimento | Biblioteca Atemporal",
  description: "Investigue princípios, coerência, integridade e decisões responsáveis. Textos autorais de curadoria, artigos da Escola Atemporal e vídeos de referência.",
};

const artigos = [
  {
    title: "O preço da coerência: quais princípios permanecem quando tudo nos convida a ceder?",
    label: "ARTIGO · ESCOLA ATEMPORAL",
    detail: "Uma investigação sobre ética, transparência, lealdade e decisões nas quais manter um compromisso tem consequências concretas.",
    question: "Que princípio você procura preservar quando isso exige abrir mão de uma vantagem?",
    href: "https://escolaatemporal.com.br/blog/principios-lideranca-preco-coerencia/",
  },
  {
    title: "O custo da incoerência organizacional: quando o discurso não encontra o cotidiano",
    label: "ARTIGO · ESCOLA ATEMPORAL",
    detail: "Uma experiência sobre a distância entre cultura declarada e cultura vivida, e sobre o papel da escuta na reconstrução da confiança.",
    question: "Onde a experiência real das pessoas contradiz aquilo que a organização promete?",
    href: "https://escolaatemporal.com.br/blog/o-custo-da-incoerencia-organizacional-quando-o-discurso-nao-encontra-o-cotidiano/",
  },
  {
    title: "Princípios Norteadores",
    label: "FUNDAMENTOS · ESCOLA ATEMPORAL",
    detail: "A visão institucional que conecta discernimento, presença, ética, responsabilidade, relações de confiança e compromisso com o bem comum.",
    question: "O que precisa permanecer mesmo quando as estratégias mudam?",
    href: "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/",
  },
  {
    title: "Nossa Metodologia",
    label: "METODOLOGIA · ESCOLA ATEMPORAL",
    detail: "O encontro entre resultados sustentáveis, escolhas virtuosas e hábitos coerentes: avaliar não apenas o que se alcança, mas como se alcança.",
    question: "Que efeitos invisíveis o caminho escolhido deixa nas pessoas?",
    href: "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/",
  },
  {
    title: "O papel da liderança na era da IA: como ser farol em tempos de mudança acelerada",
    label: "ARTIGO · ESCOLA ATEMPORAL",
    detail: "Uma reflexão sobre presença, direção, discernimento e a responsabilidade humana diante das decisões apoiadas por tecnologia.",
    question: "O que pode ser automatizado, mas ainda exige nosso julgamento?",
    href: "https://escolaatemporal.com.br/blog/lideranca-com-presenca-na-era-da-ia/",
  },
];

const videos = [
  {
    title: "Our loss of wisdom",
    creator: "Barry Schwartz · TED-Ed",
    topic: "Regras, incentivos e sabedoria prática",
    observation: "Observe por que seguir um procedimento pode ser insuficiente quando a situação exige bom julgamento.",
    question: "Em que momento a regra deixa de ajudar e passa a substituir o discernimento?",
    href: "https://www.youtube.com/watch?v=VYu0kMCxFEE",
    image: "https://img.youtube.com/vi/VYu0kMCxFEE/hqdefault.jpg",
  },
  {
    title: "Why good leaders make you feel safe",
    creator: "Simon Sinek · TED",
    topic: "Responsabilidade, proteção e confiança",
    observation: "Explore a relação entre liderança, segurança e responsabilidade pelas pessoas que são afetadas pelas decisões.",
    question: "O que nossas decisões comunicam sobre quem estamos dispostos a proteger?",
    href: "https://www.youtube.com/watch?v=lmyZMtPVodo",
    image: "https://img.youtube.com/vi/lmyZMtPVodo/hqdefault.jpg",
  },
];

const etapas = [
  {n:"01", title:"Reconhecer o que orienta", body:"Identifique os princípios que costuma defender. Diferencie convicções vividas, preferências e regras que você segue apenas por costume."},
  {n:"02", title:"Observar a tensão", body:"Relembre uma decisão recente com pressões, perdas ou interesses concorrentes. Investigue o que ficou em jogo para você e para os outros."},
  {n:"03", title:"Examinar o caminho", body:"Considere não apenas o resultado esperado, mas também os meios escolhidos, o tratamento dado às pessoas e as consequências de longo prazo."},
  {n:"04", title:"Transformar em prática", body:"Defina um comportamento observável para sua próxima decisão difícil. Retorne a ele depois e perceba o que sua ação revelou."},
];

const perguntas = [
  "Que princípio você considera inegociável — e qual foi a última situação em que ele custou alguma coisa?",
  "Quando adaptar a estratégia é sinal de aprendizagem e quando se transforma em conveniência?",
  "Qual decisão foi bem-sucedida nos números, mas deixou um custo humano pouco reconhecido?",
  "Quem poderia ampliar sua leitura antes de tomar uma decisão difícil?",
  "Que microcomportamento seu ajuda a transformar valores declarados em cultura vivida?",
];

function LivroReferencia({ livro, index }: { livro: LivroTrilha01; index: number }) {
  return (
    <article className="book-reference-card" id={livro.id}>
      <div className={\`book-reference-cover tone-\${livro.tom}\`} aria-hidden="true">
        <span className="book-cover-mark">ESCOLA ATEMPORAL / TRILHA 01</span>
        <span className="book-cover-index">{String(index + 1).padStart(2, "0")}</span>
        <strong>{livro.capa}</strong>
        <span className="book-cover-base">REFERÊNCIA DE LEITURA ↗</span>
      </div>
      <div className="book-reference-info">
        <div className="book-reference-eyebrow">
          <span>{livro.tipo}</span><span>·</span><span>{livro.ano}</span><span>·</span><span>{livro.formato}</span>
        </div>
        <h4>{livro.titulo}</h4>
        <p className="book-reference-author">{livro.autor} <span>· {livro.instituicao}</span></p>
        <div className="book-reference-taxonomy"><span>{livro.categoria}</span><span>{livro.idioma}</span></div>
        <p className="book-reference-summary">{livro.resumo}</p>
        <p className="book-reference-guide"><strong>Por onde começar:</strong> {livro.recomendacao}</p>
        <p className="book-reference-question"><strong>Para refletir:</strong> {livro.pergunta}</p>
        <div className="book-reference-actions">
          {livro.urlDownload && <a className="book-download" href={livro.urlDownload} target="_blank" rel="noopener noreferrer" aria-label={\`Acessar arquivo \${livro.formato}: \${livro.titulo}\`}>{livro.formato === "EPUB" ? "Baixar EPUB" : "Abrir / baixar PDF"} <span aria-hidden="true">↗</span></a>}
          <a className="book-source" href={livro.urlFonte} target="_blank" rel="noopener noreferrer">Fonte e condições de uso <span aria-hidden="true">↗</span></a>
        </div>
        <p className="book-reference-rights">{livro.direitos}</p>
      </div>
    </article>
  );
}

export default function Trilha01Page() {
  return (
    <main className="learning-page">
      <header className="topbar">
        <BrandLogo />
        <nav><Link href="/">Todas as trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav>
      </header>

      <section className="learning-hero">
        <div className="learning-wrap">
          <div className="learning-hero-copy">
          <div className="learning-crumb"><Link href="/">Biblioteca</Link> <span>/</span> Trilha 01</div>
          <span className="eyebrow">JORNADA DE INVESTIGAÇÃO · 01 / 06</span>
          <h1>Princípios e <em>Discernimento.</em></h1>
          <p className="learning-lead">O que orienta nossas escolhas quando não existe uma resposta simples?</p>
          <p className="learning-intro">A liderança é colocada à prova quando interesses, urgências e valores entram em tensão. Esta trilha convida a reconhecer o que permanece, questionar o custo das escolhas e agir com responsabilidade — inclusive quando ninguém está observando.</p>
          <div className="learning-hero-links"><a href="#investigacao" className="primary">Iniciar investigação <span>↗</span></a><a href="#biblioteca" className="outline">Explorar referências ↓</a></div>
          </div>
          <div className="learning-hero-picture"><img src="https://escolaatemporal.com.br/wp-content/uploads/2026/04/Conceitual-Homem-Atemporal-2.png" width="840" height="860" alt="Ilustração conceitual da Escola Atemporal para a página Princípios Norteadores" /><span className="learning-hero-picture-label">O ESSENCIAL PERMANECE</span></div>
          <div className="learning-facts"><span>05 leituras institucionais</span><span>10 livros e materiais</span><span>02 vídeos externos</span><span>05 perguntas essenciais</span><span>01 prática de aplicação</span></div>
        </div>
      </section>

      <nav className="learning-nav" aria-label="Seções da trilha">
        <div className="learning-wrap"><a href="#investigacao">A investigação</a><a href="#percurso">Percurso</a><a href="#biblioteca">Artigos e fontes</a><a href="#livros">Livros e e-books</a><a href="#videos">Vídeos</a><a href="#pratica">Aplicação</a></div>
      </nav>

      <section id="investigacao" className="learning-section learning-wrap">
        <div className="learning-two-col">
          <div><span className="eyebrow dark">O PONTO DE PARTIDA</span><h2>Discernir é mais do que <em>escolher.</em></h2></div>
          <div className="reading-copy">
            <p>É possível conhecer os valores de uma organização e, ainda assim, agir de forma contraditória quando surgem cobranças, riscos ou oportunidades. Nessas horas, a pergunta deixa de ser apenas <strong>“o que queremos alcançar?”</strong> e passa a incluir <strong>“que caminho estamos dispostos a percorrer?”</strong>.</p>
            <p>Os princípios norteadores da Escola Atemporal colocam discernimento, presença, responsabilidade, ética e compromisso com o bem comum no centro do desenvolvimento humano. A metodologia da Escola acrescenta uma ideia decisiva: resultados precisam ser avaliados também pelos efeitos de sua construção sobre pessoas e relações.</p>
            <p>Não se trata de nunca rever uma posição. Discernimento envolve reconhecer novas informações, escutar outras perspectivas e distinguir uma mudança legítima de estratégia de uma concessão que compromete princípios.</p>
            <p className="source-note">Síntese editorial produzida para a Biblioteca a partir de <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/" target="_blank" rel="noopener noreferrer">Princípios Norteadores ↗</a>, <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">Nossa Metodologia ↗</a> e <a href="https://escolaatemporal.com.br/blog/principios-lideranca-preco-coerencia/" target="_blank" rel="noopener noreferrer">O preço da coerência ↗</a>.</p>
          </div>
        </div>
        <div className="learning-image-note"><figure><img src="https://escolaatemporal.com.br/wp-content/uploads/2026/08/2150526023.jpg" width="980" height="690" loading="lazy" alt="Fotografia publicada pela Escola Atemporal na página de Princípios Norteadores" /></figure><div className="learning-image-note-copy"><span className="eyebrow">NOSSOS PRINCÍPIOS NORTEADORES</span><h3>O ESSENCIAL PERMANECE.</h3><p>Na Escola, discernimento, presença, ética, responsabilidade e compromisso com o bem comum não são apenas palavras. São referências para escolher, agir e construir relações de confiança.</p><a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/" target="_blank" rel="noopener noreferrer">Conhecer os princípios da Escola ↗</a></div></div>
        <div className="learning-quote"><span>PERGUNTA QUE ATRAVESSA A TRILHA</span><p>Quando uma escolha parece eficiente, como reconhecemos se ela também é coerente?</p></div>
      </section>

      <section id="percurso" className="learning-section learning-muted">
        <div className="learning-wrap">
          <div className="learning-section-header"><div><span className="eyebrow dark">QUATRO MOVIMENTOS</span><h2>Um percurso da <em>consciência à ação.</em></h2></div><p>Um roteiro orientador, não uma sequência obrigatória. Comece por um dilema que esteja vivo no seu contexto.</p></div>
          <div className="learning-steps">{etapas.map((etapa)=><article key={etapa.n}><span>{etapa.n}</span><h3>{etapa.title}</h3><p>{etapa.body}</p></article>)}</div>
        </div>
      </section>

      <section id="biblioteca" className="learning-section learning-wrap">
        <div className="learning-section-header"><div><span className="eyebrow dark">CURADORIA DA ESCOLA</span><h2>Para ler, relacionar e <em>questionar.</em></h2></div><p>Fontes publicadas pela Escola Atemporal. Os textos completos permanecem no site original, com indicação clara de autoria institucional.</p></div>
        <div className="learning-articles">{artigos.map((artigo,i)=><article className="learning-article" key={artigo.href}><div className="learning-article-number">{String(i+1).padStart(2,"0")}</div><div><span className="learning-source-label">{artigo.label}</span><h3>{artigo.title}</h3><p>{artigo.detail}</p><p className="learning-prompt"><strong>Para refletir:</strong> {artigo.question}</p></div><a target="_blank" rel="noopener noreferrer" href={artigo.href} className="learning-source-link" aria-label={"Ler fonte: "+artigo.title}>Ler fonte ↗</a></article>)}</div>
      </section>

      <section id="livros" className="learning-section learning-books">
        <div className="learning-wrap">
          <div className="learning-section-header">
            <div>
              <span className="eyebrow dark">ACERVO BIBLIOGRÁFICO · TRILHA 01</span>
              <h2>Biblioteca de <em>princípios e escolhas.</em></h2>
            </div>
            <p>Clássicos, livros didáticos, guias institucionais e materiais formativos para aprofundar ética, discernimento e liderança responsável.</p>
          </div>
          <div className="learning-books-intro">
            <div><span className="learning-books-preamble">LEITURAS QUE AMPLIAM O REPERTÓRIO</span>
              <h3>Não basta ter uma resposta. <em>É preciso formar critérios.</em></h3>
              <p>Selecionamos dez obras e materiais de fontes reconhecidas. Cada indicação explica por que ler, o que observar e qual pergunta levar para a prática. Os arquivos são acessados diretamente nos portais de origem.</p>
            </div>
            <div className="learning-books-count" aria-label="Dez obras selecionadas"><strong>10</strong><span>OBRAS<br />E MATERIAIS</span></div>
          </div>

          <nav className="learning-books-jump" aria-label="Navegar pelo acervo bibliográfico">
            <a href="#livros-portugues">Em português <span>05 ↘</span></a>
            <a href="#livros-ingles">Em inglês <span>05 ↘</span></a>
            <a href="#referencias-academicas">Referências acadêmicas <span>03 ↘</span></a>
          </nav>

          <div className="learning-book-group" id="livros-portugues">
            <div className="learning-book-group-head">
              <div><span className="learning-book-group-number">A / 01</span><h3>LEITURAS EM PORTUGUÊS</h3></div>
              <p>Para começar por dilemas reais de liderança, cultura de integridade e ética aplicada às novas tecnologias.</p>
            </div>
            <div className="learning-book-grid">
              {livrosTrilha01.filter(livro => livro.idioma === "Português").map((livro,index) => <LivroReferencia livro={livro} index={index} key={livro.id}/>)}
            </div>
          </div>

          <div className="learning-book-group" id="livros-ingles">
            <div className="learning-book-group-head">
              <div><span className="learning-book-group-number">B / 02</span><h3>CLÁSSICOS E LIVROS EM INGLÊS</h3></div>
              <p>Da ética das virtudes e do estoicismo à filosofia moral contemporânea e à ética empresarial.</p>
            </div>
            <div className="learning-book-grid">
              {livrosTrilha01.filter(livro => livro.idioma === "Inglês").map((livro,index) => <LivroReferencia livro={livro} index={index+5} key={livro.id}/>)}
            </div>
          </div>

          <div className="learning-biblio-note">
            <span className="learning-biblio-note-icon" aria-hidden="true">i</span>
            <div>
              <strong>Downloads e direitos autorais</strong>
              <p>Os botões de PDF e EPUB abrem arquivos disponibilizados pelos próprios autores ou repositórios oficiais; não armazenamos cópias dos livros nesta Biblioteca. Para as obras cuja página de registro não oferece um arquivo direto verificado, usamos somente o link da instituição. Consulte os termos de cada fonte antes de reproduzir, adaptar ou compartilhar. O Project Gutenberg informa domínio público nos Estados Unidos; outros países podem ter condições diferentes.</p>
            </div>
          </div>

          <div id="referencias-academicas" className="learning-essays">
            <div className="learning-book-group-head">
              <div><span className="learning-book-group-number">C / 03</span><h3>REFERÊNCIAS ACADÊMICAS</h3></div>
              <p>Textos de consulta aberta para comparar perspectivas antes de formular um julgamento.</p>
            </div>
            <div className="learning-essays-grid">
              {referenciasComplementaresTrilha01.map((referencia,i) => <article key={referencia.href} className="learning-essay">
                <span className="learning-essay-num">{String(i+1).padStart(2,"0")} / TEXTO ONLINE</span>
                <h4>{referencia.titulo}</h4><p className="learning-essay-author">{referencia.autor} · {referencia.idioma}</p>
                <p>{referencia.tema}</p>
                <p className="learning-essay-prompt"><strong>Investigue:</strong> {referencia.pergunta}</p>
                <a href={referencia.href} target="_blank" rel="noopener noreferrer">Ler referência original ↗</a>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="videos" className="learning-section learning-muted">
        <div className="learning-wrap">
          <div className="learning-section-header"><div><span className="eyebrow dark">REPERTÓRIOS EM DIÁLOGO</span><h2>Vídeos para <em>ampliar a lente.</em></h2></div><p>Referências externas verificadas no YouTube. Os links levam aos vídeos originais dos canais responsáveis; nenhuma gravação é republicada aqui.</p></div>
          <div className="learning-videos">{videos.map(v=><article className="learning-video" key={v.href}><div className="learning-video-icon"><img src={v.image} alt="" loading="lazy" /><span className="learning-video-play" aria-hidden="true"><span>▶</span></span></div><div className="learning-video-body"><span>{v.creator}</span><h3>{v.title}</h3><p className="learning-video-theme">{v.topic}</p><p>{v.observation}</p><p className="learning-prompt"><strong>Pergunta-guia:</strong> {v.question}</p><a href={v.href} target="_blank" rel="noopener noreferrer">Assistir no YouTube ↗</a></div></article>)}</div>
          <p className="learning-disclaimer">Sobre os cortes do podcast da Escola: o artigo “O preço da coerência” menciona trechos com Dagoberto Gabriel e Allan Finkel disponíveis no Drive. Esses materiais não estão incorporados porque não foi verificado um link público autorizado para cada corte. A curadoria pode adicioná-los após a verificação dos links e dos direitos.</p>
        </div>
      </section>

      <section id="pratica" className="learning-section learning-wrap">
        <div className="learning-section-header"><div><span className="eyebrow dark">LEVE PARA A VIDA REAL</span><h2>Uma decisão, <em>cinco perguntas.</em></h2></div><p>Convite original da curadoria. Use individualmente, em uma conversa de liderança ou como abertura de uma roda de aprendizagem.</p></div>
        <ol className="learning-questions">{perguntas.map((q,i)=><li key={q}><span>{String(i+1).padStart(2,"0")}</span><p>{q}</p></li>)}</ol>
        <div className="learning-practice"><div><span className="eyebrow">EXERCÍCIO · 15–20 MINUTOS</span><h3>O mapa de uma escolha real</h3><p>Escolha uma decisão que esteja próxima. Registre: <strong>o resultado desejado</strong>, <strong>as pessoas afetadas</strong>, <strong>o princípio em tensão</strong> e <strong>uma ação observável</strong> que demonstre coerência. Antes de decidir, converse com alguém capaz de oferecer outra perspectiva. Depois, revise o que aconteceu.</p></div><div className="learning-practice-mark" aria-hidden="true">↗</div></div>
      </section>
      <section className="learning-end"><div className="learning-wrap"><span className="eyebrow">A INVESTIGAÇÃO CONTINUA</span><h2>O que você escolhe <em>sustentar?</em></h2><p>Explore as fontes, coloque um princípio à prova do cotidiano e retorne à trilha com novas perguntas.</p><Link href="/" className="primary light">Voltar às seis trilhas ↗</Link></div></section>
      <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><span>Trilha 01 · Curadoria pública de fontes verificadas</span></footer>
    </main>
  );
}
