import { livrosTrilha01, referenciasComplementaresTrilha01 } from "../../../data/referencias-trilha-01";
import BibliografiaTrilha01 from "../../components/BibliografiaTrilha01";
import CadernoDiscernimento from "../../components/CadernoDiscernimento";
import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilha 01 — Princípios e Discernimento | Biblioteca Atemporal",
  description: "Princípios, coerência e decisões responsáveis com 8 leituras da Escola, 17 livros e materiais, vídeos e um caderno pessoal de reflexão.",
};

const artigos = [
  {
    title: "O que não muda quando tudo muda? O que permanece essencial na liderança",
    label: "ARTIGO · ESCOLA ATEMPORAL · 2026",
    detail: "Síntese da investigação da Escola a partir de conversas do podcast Liderança Atemporal. Distingue aquilo que pode mudar — ferramentas, estratégias e práticas — dos fundamentos humanos que precisam orientar as escolhas.",
    question: "Em meio às mudanças do seu contexto, o que você precisa transformar sem abandonar seus princípios?",
    href: "https://escolaatemporal.com.br/blog/o-que-nao-muda-quando-tudo-muda-lideranca/",
  },
  {
    title: "As escolhas que nos tornam quem somos: o que a liderança aprende quando precisa mudar?",
    label: "ARTIGO · ESCOLA ATEMPORAL · 2026",
    detail: "Uma investigação sobre decisões que moldam trajetórias, o custo humano das alternativas e os hábitos que dão continuidade às escolhas importantes.",
    question: "Que escolha marcou você — e qual hábito concreto demonstra o compromisso assumido?",
    href: "https://escolaatemporal.com.br/blog/escolhas-dificeis-lideranca-habitos/",
  },
  {
    title: "Cultura não se implementa, se encarna",
    label: "ARTIGO · ESCOLA ATEMPORAL",
    detail: "Reflexão sobre como a cultura se torna visível em gestos, exemplos, escuta e coerência entre o que se comunica e o que se pratica.",
    question: "Qual comportamento cotidiano de sua liderança confirma — ou contradiz — os valores da equipe?",
    href: "https://escolaatemporal.com.br/blog/cultura-nao-se-implementa/",
  },
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
  {
    title: "Liderança e Legado — conversa com Bruno Stuchi",
    creator: "Podcast Liderança Atemporal · Escola Atemporal",
    topic: "Princípios, cultura e adaptação em tempos de mudança",
    observation: "Neste episódio da Escola, Gabriela Jardim Presto conversa com Bruno Stuchi sobre o desafio de adaptar organizações sem perder os valores que orientam a liderança.",
    question: "Como reconhecer quais práticas podem evoluir e quais princípios precisam permanecer?",
    href: "https://www.youtube.com/watch?v=2vfuWjQ8Ztk",
    image: "https://img.youtube.com/vi/2vfuWjQ8Ztk/hqdefault.jpg",
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

export default function Trilha01Page() {
  return (
    <main className="learning-page" id="topo">
      <a className="skip-to-content" href="#investigacao">Ir para o conteúdo da trilha</a>
      <header className="topbar">
        <BrandLogo />
        <nav aria-label="Navegação principal da trilha"><Link href="/">Todas as trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav>
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
          <div className="learning-hero-picture"><img src="https://escolaatemporal.com.br/wp-content/uploads/2026/04/Conceitual-Homem-Atemporal-2.png" width="840" height="860" alt="Ilustração conceitual da Escola Atemporal para a página Princípios Norteadores" fetchPriority="high" loading="eager" decoding="async" /><span className="learning-hero-picture-label">O ESSENCIAL PERMANECE</span></div>
          <div className="learning-facts"><span>{artigos.length} leituras da Escola</span><span>{livrosTrilha01.length} livros e materiais</span><span>{videos.length} vídeos e episódios</span><span>05 perguntas essenciais</span><span>01 caderno de reflexão</span></div>
        </div>
      </section>

      <nav className="learning-nav" aria-label="Seções da trilha">
        <div className="learning-wrap"><a href="#investigacao">A investigação</a><a href="#percurso">Percurso</a><a href="#biblioteca">Artigos e fontes</a><a href="#livros">Livros e e-books</a><a href="#videos">Vídeos</a><a href="#pratica">Aplicação</a><a href="#caderno">Caderno</a></div>
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
        <div className="learning-section-header"><div><span className="eyebrow dark">CURADORIA DA ESCOLA</span><h2>Para ler, relacionar e <em>questionar.</em></h2></div><p>Artigos e páginas publicados pela Escola Atemporal, organizados para conectar princípios, hábitos e decisões. Os textos completos permanecem no site original, com indicação de autoria.</p></div>
        <div className="learning-articles">{artigos.map((artigo,i)=><article className="learning-article" key={artigo.href}><div className="learning-article-number">{String(i+1).padStart(2,"0")}</div><div><span className="learning-source-label">{artigo.label}</span><h3>{artigo.title}</h3><p>{artigo.detail}</p><p className="learning-prompt"><strong>Para refletir:</strong> {artigo.question}</p></div><a target="_blank" rel="noopener noreferrer" href={artigo.href} className="learning-source-link" aria-label={"Ler fonte: "+artigo.title}>Ler fonte <span aria-hidden="true">↗</span></a></article>)}</div>
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
              <p>Selecionamos obras e materiais de fontes acadêmicas e institucionais reconhecidas. Cada indicação explica por que ler, o que observar e qual pergunta levar para a prática. Os arquivos são acessados diretamente nos portais de origem.</p>
            </div>
            <div className="learning-books-count" aria-label="Quantidade de obras selecionadas"><strong>{livrosTrilha01.length}</strong><span>OBRAS<br />E MATERIAIS</span></div>
          </div>

          <nav className="learning-books-jump" aria-label="Navegar pelo acervo bibliográfico">
            <a href="#roteiro-leitura">Percurso sugerido <span>04 ↘</span></a>
            <a href="#bibliografia-filtros">Buscar materiais <span>{livrosTrilha01.length} ↘</span></a>
            <a href="#referencias-academicas">Artigos acadêmicos <span>03 ↘</span></a>
          </nav>

          <div id="roteiro-leitura" className="learning-reading-route">
            <div className="learning-book-group-head">
              <div><span className="learning-book-group-number">UM COMEÇO POSSÍVEL</span><h3>QUATRO LEITURAS PARA FORMAR CRITÉRIOS</h3></div>
              <p>Não é necessário ler o acervo inteiro. Este percurso conecta fundamentos, decisões concretas e impactos de longo prazo.</p>
            </div>
            <ol className="reading-route-grid">
              <li><span>01 / FUNDAMENTAR</span><h4>De onde vêm nossos critérios?</h4><p>Comece com <strong>Ética e Serviço Público — Conceitos Básicos</strong>, da Enap, para confrontar perspectivas filosóficas.</p><a href="#enap-etica-servico-mod1">Ver leitura ↗</a></li>
              <li><span>02 / QUESTIONAR</span><h4>O que torna uma ação coerente?</h4><p>Leia <strong>Filosofia e Ética</strong>, de Selvino José Assmann, e examine a relação entre convicção e responsabilidade.</p><a href="#uab-filosofia-etica">Ver leitura ↗</a></li>
              <li><span>03 / PROJETAR</span><h4>Que consequências não enxergamos?</h4><p>Explore <strong>Da Técnica à Ética</strong> para investigar responsabilidades que atravessam o tempo.</p><a href="#hans-jonas-responsabilidade">Ver leitura ↗</a></li>
              <li><span>04 / COLOCAR EM PRÁTICA</span><h4>Como valores se tornam cultura?</h4><p>Use o <strong>Manual de Integridade Pública da OCDE</strong> para conectar princípios a comportamentos, padrões e liderança.</p><a href="#ocde-manual-integridade-2022">Ver leitura ↗</a></li>
            </ol>
          </div>

          <BibliografiaTrilha01 />

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
          <div className="learning-section-header"><div><span className="eyebrow dark">REPERTÓRIOS EM DIÁLOGO</span><h2>Vídeos para <em>ampliar a lente.</em></h2></div><p>Um episódio do Podcast Liderança Atemporal e duas referências externas. Os links levam aos vídeos originais de seus canais; nenhum vídeo é republicado aqui.</p></div>
          <div className="learning-videos">{videos.map(v=><article className="learning-video" key={v.href}><div className="learning-video-icon"><img src={v.image} alt="" loading="lazy" /><span className="learning-video-play" aria-hidden="true"><span>▶</span></span></div><div className="learning-video-body"><span>{v.creator}</span><h3>{v.title}</h3><p className="learning-video-theme">{v.topic}</p><p>{v.observation}</p><p className="learning-prompt"><strong>Pergunta-guia:</strong> {v.question}</p><a href={v.href} target="_blank" rel="noopener noreferrer">Assistir no YouTube ↗</a></div></article>)}</div>
          <p className="learning-disclaimer">O episódio com Bruno Stuchi foi divulgado oficialmente pela Escola Atemporal com link para o YouTube. Outros cortes do podcast mencionados nos artigos da Escola não foram incorporados sem um endereço público autorizado e identificado. Nenhum vídeo é baixado ou republicado nesta Biblioteca.</p>
        </div>
      </section>

      <section id="pratica" className="learning-section learning-wrap">
        <div className="learning-section-header"><div><span className="eyebrow dark">LEVE PARA A VIDA REAL</span><h2>Uma decisão, <em>cinco perguntas.</em></h2></div><p>Convite original da curadoria. Use individualmente, em uma conversa de liderança ou como abertura de uma roda de aprendizagem.</p></div>
        <ol className="learning-questions">{perguntas.map((q,i)=><li key={q}><span>{String(i+1).padStart(2,"0")}</span><p>{q}</p></li>)}</ol>
        <div className="learning-practice"><div><span className="eyebrow">EXERCÍCIO · 15–20 MINUTOS</span><h3>O mapa de uma escolha real</h3><p>Escolha uma decisão que esteja próxima. Registre: <strong>o resultado desejado</strong>, <strong>as pessoas afetadas</strong>, <strong>o princípio em tensão</strong> e <strong>uma ação observável</strong> que demonstre coerência. Antes de decidir, converse com alguém capaz de oferecer outra perspectiva. Depois, revise o que aconteceu.</p><a className="workbook-cta-link" href="#caderno">Preencher o Caderno de Discernimento ↓</a></div><div className="learning-practice-mark" aria-hidden="true">↗</div></div>
        <CadernoDiscernimento />
      </section>
      <section className="learning-end"><div className="learning-wrap"><span className="eyebrow">A INVESTIGAÇÃO CONTINUA</span><h2>O que você escolhe <em>sustentar?</em></h2><p>Explore as fontes, coloque um princípio à prova do cotidiano e retorne à trilha com novas perguntas.</p><Link href="/" className="primary light">Voltar às seis trilhas ↗</Link></div></section>
      <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><a className="learning-top-link" href="#topo">↑ Voltar ao início</a><span>Trilha 01 · Curadoria pública de fontes verificadas</span></footer>
    </main>
  );
}
