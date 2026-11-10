import Link from "next/link";
import type { Metadata } from "next";
import BrandLogo from "../../components/BrandLogo";
import BibliografiaTrilha02 from "../../components/BibliografiaTrilha02";
import CadernoEmocoes from "../../components/CadernoEmocoes";
import {
  livrosTrilha02,
  artigosTrilha02,
  videosTrilha02,
  etapasTrilha02,
  referenciasAprofundamentoTrilha02,
} from "../../../data/referencias-trilha-02";

export const metadata: Metadata = {
  title: "Trilha 02 — Emoções e Autoconsciência | Biblioteca Atemporal",
  description: "Observe, nomeie, compreenda e escolha: 8 conteúdos da Escola Atemporal, 10 livros e guias de acesso aberto, 4 vídeos e um Caderno de Presença pessoal.",
};

const lentes = [
  { nome: "Medo", classe: "medo", pergunta: "Que risco ou incerteza você está percebendo?" },
  { nome: "Raiva", classe: "raiva", pergunta: "Que limite ou expectativa parece ter sido atravessado?" },
  { nome: "Alegria", classe: "alegria", pergunta: "O que está despertando energia, gratidão ou interesse?" },
  { nome: "Tristeza", classe: "tristeza", pergunta: "Que perda, ausência ou necessidade pede atenção?" },
  { nome: "Repulsa", classe: "repulsa", pergunta: "De que situação ou experiência você deseja se afastar?" },
  { nome: "Culpa", classe: "culpa", pergunta: "Existe algo que você gostaria de reconhecer ou reparar?" },
  { nome: "Vergonha", classe: "vergonha", pergunta: "Que receio sobre pertencimento ou julgamento surgiu?" },
];

const perguntasFinais = [
  "O que você costuma sentir imediatamente antes de responder a uma discordância?",
  "Que diferença existe entre o fato ocorrido e a história que sua mente construiu sobre ele?",
  "Como uma emoção pode trazer informação sem decidir, sozinha, o próximo comportamento?",
  "O que o outro precisa encontrar em sua escuta para sentir-se seguro o suficiente para falar?",
  "Qual gesto pequeno pode criar espaço entre um impulso e a escolha que você deseja sustentar?",
];

export default function Trilha02Page() {
  return (
    <main className="learning-page emotion-page" id="topo">
      <a className="skip-to-content" href="#investigacao">Ir para a investigação</a>
      <header className="topbar">
        <BrandLogo />
        <nav aria-label="Navegação principal da trilha">
          <Link href="/">Todas as trilhas</Link>
          <Link href="/entrar" className="nav-login">Área de acesso ↗</Link>
        </nav>
      </header>

      <section className="learning-hero emotion-hero" aria-labelledby="titulo-trilha-02">
        <div className="learning-wrap">
          <div className="learning-hero-copy">
            <div className="learning-crumb"><Link href="/">Biblioteca</Link><span>/</span> Trilha 02</div>
            <span className="eyebrow">JORNADA DE INVESTIGAÇÃO · 02 / 06</span>
            <h1 id="titulo-trilha-02">Emoções e <em>Auto<wbr />consciência.</em></h1>
            <p className="learning-lead">O que acontece em você antes de decidir?</p>
            <p className="learning-intro">Uma pausa pode mudar uma conversa. Esta trilha convida a observar emoções, reconhecer gatilhos e ampliar o espaço entre a reação automática e as escolhas que construímos com outras pessoas.</p>
            <div className="learning-hero-links">
              <a href="#investigacao" className="primary">Começar a investigação <span aria-hidden="true">↗</span></a>
              <a href="#livros" className="outline">Explorar livros e e-books ↓</a>
            </div>
          </div>
          <div className="learning-hero-picture emotion-hero-picture">
            <img
              src="https://escolaatemporal.com.br/wp-content/uploads/2026/07/hero.png"
              srcSet="https://escolaatemporal.com.br/wp-content/uploads/2026/07/hero-300x258.png 300w, https://escolaatemporal.com.br/wp-content/uploads/2026/07/hero-768x661.png 768w, https://escolaatemporal.com.br/wp-content/uploads/2026/07/hero.png 922w"
              sizes="(max-width: 700px) 90vw, (max-width: 1200px) 44vw, 520px"
              alt="Arte conceitual publicada pela Escola Atemporal na experiência Emoções em Jogo"
              width="922" height="793" fetchPriority="high" loading="eager" decoding="async"
            />
            <span className="learning-hero-picture-label">ANTES DE AGIR, PERCEBA.</span>
          </div>
          <div className="learning-facts">
            <span>{artigosTrilha02.length} fontes da Escola</span>
            <span>{livrosTrilha02.length} livros e materiais</span>
            <span>{videosTrilha02.length} vídeos selecionados</span>
            <span>04 movimentos</span>
            <span>01 caderno pessoal</span>
          </div>
        </div>
      </section>

      <nav className="learning-nav" aria-label="Seções da Trilha 02">
        <div className="learning-wrap">
          <a href="#investigacao">A investigação</a>
          <a href="#percurso">Percurso</a>
          <a href="#emocao-e-informacao">As emoções</a>
          <a href="#biblioteca">Artigos da Escola</a>
          <a href="#livros">Livros e e-books</a>
          <a href="#videos">Vídeos</a>
          <a href="#pratica">Prática</a>
          <a href="#caderno-emocoes">Caderno</a>
        </div>
        <span className="emotion-nav-hint" aria-hidden="true">Deslize para explorar as seções →</span>
      </nav>

      <section className="learning-section learning-wrap" id="investigacao">
        <div className="learning-two-col">
          <div>
            <span className="eyebrow dark">O PONTO DE PARTIDA</span>
            <h2>Sentir não é o mesmo que <em>reagir.</em></h2>
          </div>
          <div className="reading-copy">
            <p>Uma pergunta inesperada, um feedback ou uma mudança no plano podem despertar emoções muito diferentes em cada pessoa. O acontecimento externo é importante; porém, entre ele e nossa resposta existem percepções, interpretações, experiências e impulsos que nem sempre identificamos.</p>
            <p><strong>Autoconsciência emocional não é eliminar emoções, tampouco demonstrar calma permanente.</strong> É reconhecer o que está presente e investigar como isso influencia a maneira de interpretar e agir. Uma emoção pode oferecer informação relevante sem se transformar em ordem, sentença ou identidade.</p>
            <p>A Escola Atemporal coloca o desenvolvimento de dentro para fora no centro da liderança: observar princípios, crenças e emoções antes de exigir novos comportamentos. Sua experiência <em>Emoções em Jogo</em> transforma essa ideia em quatro movimentos de aprendizagem: observar, nomear, compreender e escolher.</p>
            <p className="source-note">Síntese editorial original da Biblioteca baseada no <a target="_blank" rel="noopener noreferrer" href="https://escolaatemporal.com.br/blog/consciencia-emocional-lideranca-gatilhos-decisoes/">artigo sobre consciência emocional ↗</a>, na <a target="_blank" rel="noopener noreferrer" href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/emocoes-em-jogo-lp/">experiência Emoções em Jogo ↗</a> e na <a target="_blank" rel="noopener noreferrer" href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/">metodologia da Escola ↗</a>.</p>
          </div>
        </div>
        <div className="learning-image-note emotion-image-note">
          <figure><img src="https://escolaatemporal.com.br/wp-content/uploads/2026/07/emocao-e-informacao.png" alt="Ilustração institucional Emoção é Informação, da Escola Atemporal" loading="lazy" width="1100" height="770" /></figure>
          <div className="learning-image-note-copy">
            <span className="eyebrow">NOSSA FONTE INSTITUCIONAL</span>
            <h3>EMOÇÃO NÃO É RUÍDO. <em>É INFORMAÇÃO.</em></h3>
            <p>Quando reconhecemos o que sentimos, podemos questionar interpretações, ampliar a escuta e escolher uma resposta menos automática. A experiência original da Escola aprofunda essa investigação em contextos de liderança e equipes.</p>
            <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/emocoes-em-jogo-lp/" target="_blank" rel="noopener noreferrer">Conhecer Emoções em Jogo na Escola ↗</a>
          </div>
        </div>
        <div className="learning-quote">
          <span>PERGUNTA QUE ATRAVESSA A TRILHA</span>
          <p>Se minha primeira interpretação não for a única possível, o que posso escolher fazer diferente?</p>
        </div>
      </section>

      <section className="learning-section learning-muted" id="percurso">
        <div className="learning-wrap">
          <div className="learning-section-header">
            <div><span className="eyebrow dark">QUATRO MOVIMENTOS</span><h2>Da reação à <em>escolha consciente.</em></h2></div>
            <p>Uma proposta editorial inspirada na lógica da experiência da Escola. Não substitui o jogo, seu assessment ou a facilitação original.</p>
          </div>
          <div className="learning-steps emotion-steps">
            {etapasTrilha02.map((etapa) => (
              <article key={etapa.numero}>
                <span>{etapa.numero}</span>
                <h3>{etapa.titulo}</h3>
                <p className="emotion-stage-label">{etapa.tema}</p>
                <p>{etapa.texto}</p>
                <p className="emotion-stage-question">{etapa.pergunta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="learning-section learning-wrap" id="emocao-e-informacao">
        <div className="learning-section-header">
          <div><span className="eyebrow dark">SETE LENTES DE OBSERVAÇÃO</span><h2>Dar nome é abrir <em>possibilidades.</em></h2></div>
          <p>As sete emoções trabalhadas na experiência institucional podem inspirar perguntas distintas. Estas são pistas reflexivas, não diagnósticos nem definições universais.</p>
        </div>
        <div className="emotion-lenses">
          {lentes.map((lente, i) => (
            <article className={"emotion-lens emotion-lens-" + lente.classe} key={lente.nome}>
              <span>{String(i + 1).padStart(2, "0")} / EMOÇÃO</span>
              <h3>{lente.nome}</h3>
              <p>{lente.pergunta}</p>
            </article>
          ))}
        </div>
        <p className="emotion-lenses-caption">É possível sentir mais de uma emoção ao mesmo tempo. Não existe obrigação de escolher um rótulo, expor a própria história ou encontrar uma interpretação definitiva.</p>
      </section>

      <section className="learning-section learning-wrap" id="biblioteca">
        <div className="learning-section-header">
          <div><span className="eyebrow dark">CURADORIA DA ESCOLA ATEMPORAL</span><h2>Para ler e <em>se reconhecer.</em></h2></div>
          <p>Artigos e experiências publicados pela Escola. A Biblioteca apresenta perguntas e sínteses originais, preservando os textos completos nos links institucionais.</p>
        </div>
        <div className="learning-articles">
          {artigosTrilha02.map((artigo, i) => (
            <article className={"learning-article" + (artigo.destaque ? " emotion-article-featured" : "")} key={artigo.href}>
              <div className="learning-article-number">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <span className="learning-source-label">{artigo.tipo}</span>
                <h3>{artigo.titulo}</h3>
                <p>{artigo.descricao}</p>
                <p className="learning-prompt"><strong>Para refletir:</strong> {artigo.pergunta}</p>
              </div>
              <a href={artigo.href} target="_blank" rel="noopener noreferrer" className="learning-source-link" aria-label={"Ler fonte: " + artigo.titulo}>
                Ler fonte <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-section learning-books" id="livros">
        <div className="learning-wrap">
          <div className="learning-section-header">
            <div><span className="eyebrow dark">BIBLIOTECA TEMÁTICA · TRILHA 02</span><h2>Livros para ampliar o <em>vocabulário interior.</em></h2></div>
            <p>Guias institucionais, e-books e livros de psicologia e comportamento, com indicação de acesso gratuito pelas fontes originais.</p>
          </div>
          <div className="learning-books-intro emotion-book-intro">
            <div>
              <span className="learning-books-preamble">CONHECER · QUESTIONAR · EXPERIMENTAR</span>
              <h3>Sentir faz parte. <em>Perceber amplia a escolha.</em></h3>
              <p>Cada material foi selecionado para acrescentar uma perspectiva. O caminho de leitura é opcional e os contextos originais das publicações — acadêmico, educativo ou organizacional — estão identificados.</p>
            </div>
            <div className="learning-books-count"><strong>{livrosTrilha02.length}</strong><span>OBRAS<br/>E MATERIAIS</span></div>
          </div>
          <nav className="learning-books-jump" aria-label="Navegação pela bibliografia da Trilha 02">
            <a href="#roteiro-leitura-02">Quatro leituras para começar <span>04 ↘</span></a>
            <a href="#bibliografia-filtros">Buscar no acervo <span>{livrosTrilha02.length} ↘</span></a>
            <a href="#referencias-academicas-02">Aprofundamentos <span>03 ↘</span></a>
          </nav>

          <div className="learning-reading-route" id="roteiro-leitura-02">
            <div className="learning-book-group-head">
              <div><span className="learning-book-group-number">UM COMEÇO POSSÍVEL</span><h3>QUATRO LEITURAS, QUATRO MOVIMENTOS</h3></div>
              <p>Um caminho leve: não é preciso completar todo o acervo nem seguir esta ordem para aproveitar a trilha.</p>
            </div>
            <ol className="reading-route-grid">
              <li><span>01 / OBSERVAR</span><h4>Reconhecer a emoção</h4><p>Comece com <strong>A influência da inteligência emocional...</strong> e observe como os conceitos aparecem em seu cotidiano.</p><a href="#emo-inteligencia-trabalho">Ver leitura ↗</a></li>
              <li><span>02 / NOMEAR</span><h4>Encontrar palavras</h4><p>Use <strong>Um olhar sobre as emoções</strong> como convite para ampliar as palavras disponíveis para falar do que se sente.</p><a href="#emo-olhar-emocoes">Ver leitura ↗</a></li>
              <li><span>03 / COMPREENDER</span><h4>Cuidar da atenção</h4><p>Experimente uma prática do guia <strong>Fazer o que importa em tempos de stress</strong>, sem expectativas de perfeição.</p><a href="#emo-oms-stress">Ver leitura ↗</a></li>
              <li><span>04 / ESCOLHER</span><h4>Levar à relação</h4><p>Leia <strong>Relacionamento interpessoal e inteligência emocional no trabalho</strong> pensando em uma conversa real.</p><a href="#emo-relacoes-trabalho">Ver leitura ↗</a></li>
            </ol>
          </div>

          <BibliografiaTrilha02 />

          <div className="learning-biblio-note">
            <span className="learning-biblio-note-icon" aria-hidden="true">i</span>
            <div>
              <strong>O que significa download autorizado?</strong>
              <p>Os arquivos são disponibilizados pelas próprias instituições ou editoras e abertos em suas páginas oficiais. Esta Biblioteca não faz cópias, distribuição ou armazenamento desses PDFs. Alguns materiais têm licença Creative Commons e outros apenas acesso gratuito — isso não significa autorização irrestrita para redistribuir ou modificar. Verifique sempre as condições originais de uso e a adequação do material ao seu contexto.</p>
            </div>
          </div>

          <div className="learning-essays" id="referencias-academicas-02">
            <div className="learning-book-group-head">
              <div><span className="learning-book-group-number">C / 03</span><h3>PARA APROFUNDAR</h3></div>
              <p>Capítulos e referências de acesso aberto para enriquecer a conversa entre experiência humana e pesquisa.</p>
            </div>
            <div className="learning-essays-grid">
              {referenciasAprofundamentoTrilha02.map((ref, i) => (
                <article className="learning-essay" key={ref.href}>
                  <span className="learning-essay-num">{String(i + 1).padStart(2, "0")} / REFERÊNCIA ONLINE</span>
                  <h4>{ref.titulo}</h4>
                  <p className="learning-essay-author">{ref.fonte}</p>
                  <p>{ref.assunto}</p>
                  <p className="learning-essay-prompt"><strong>Investigue:</strong> {ref.pergunta}</p>
                  <a href={ref.href} target="_blank" rel="noopener noreferrer">Abrir leitura original ↗</a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="videos" className="learning-section learning-muted">
        <div className="learning-wrap">
          <div className="learning-section-header">
            <div><span className="eyebrow dark">REPERTÓRIO AUDIOVISUAL</span><h2>Outras lentes para <em>sentir e refletir.</em></h2></div>
            <p>Duas palestras TED e dois vídeos referenciados nos artigos da Escola. Os links levam às publicações originais no YouTube.</p>
          </div>
          <div className="learning-videos emotion-videos">
            {videosTrilha02.map((video) => (
              <article className="learning-video" key={video.href}>
                <a className="emotion-video-cover" href={video.href} target="_blank" rel="noopener noreferrer" aria-label={"Assistir no YouTube: " + video.titulo}>
                  <div className="learning-video-icon"><img src={video.imagem} alt="" loading="lazy" width="480" height="360" /><span className="learning-video-play" aria-hidden="true"><span>▶</span></span></div>
                </a>
                <div className="learning-video-body">
                  <span>{video.criador}</span>
                  <h3>{video.titulo}</h3>
                  <p className="learning-video-theme">{video.idioma}</p>
                  <p>{video.resumo}</p>
                  <p className="learning-prompt"><strong>Para refletir:</strong> {video.pergunta}</p>
                  <a href={video.href} target="_blank" rel="noopener noreferrer">Assistir na fonte original ↗</a>
                </div>
              </article>
            ))}
          </div>
          <p className="learning-disclaimer">As palestras e os demais vídeos permanecem sob responsabilidade de seus canais. A disponibilidade de legendas e de acesso pode mudar. Não usamos trechos, cópias ou gravações em servidores da Biblioteca.</p>
        </div>
      </section>

      <section id="pratica" className="learning-section learning-wrap">
        <div className="learning-section-header">
          <div><span className="eyebrow dark">LEVE PARA O COTIDIANO</span><h2>Aprender começa quando <em>percebemos.</em></h2></div>
          <p>Uma reflexão é mais potente quando encontramos uma forma segura e concreta de praticá-la.</p>
        </div>
        <div className="learning-questions emotion-questions">
          {perguntasFinais.map((pergunta, i) => (
            <div key={pergunta}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{pergunta}</p>
            </div>
          ))}
        </div>
        <div className="learning-practice emotion-practice">
          <span className="eyebrow">PRÁTICA DE 15–20 MINUTOS</span>
          <h3>A PAUSA ENTRE O IMPULSO E A ESCOLHA.</h3>
          <p>Escolha uma situação cotidiana de intensidade manejável, real ou hipotética. Observe o fato e os primeiros sinais no corpo; experimente dar um nome à emoção; separe o acontecimento da interpretação; pergunte que valor ou necessidade pode estar em jogo. Por fim, imagine um gesto simples que acrescente escuta ou responsabilidade à resposta. Você não precisa contar sua história a ninguém nem reviver situações dolorosas.</p>
          <p>A proposta é aprender com a experiência — não analisar outras pessoas, obter um diagnóstico ou obrigar-se a sentir de determinada forma. Se preferir, use um dos cenários fictícios do caderno abaixo.</p>
          <a href="#caderno-emocoes" className="workbook-cta-link">Abrir o Caderno de Presença ↓</a>
        </div>

        <CadernoEmocoes />
      </section>

      <section className="learning-end emotion-end">
        <div className="learning-wrap">
          <span className="eyebrow">A INVESTIGAÇÃO CONTINUA</span>
          <h2>O QUE VOCÊ SENTE NÃO PRECISA <em>DECIDIR POR VOCÊ.</em></h2>
          <p>Presença não é ausência de emoção. É a possibilidade de reconhecer o que se passa e escolher, com mais consciência, o que queremos levar adiante nas relações e no trabalho.</p>
          <div className="learning-end-actions">
            <Link className="primary light" href="/">Voltar às seis trilhas ↗</Link>
            <Link className="outline" href="/trilhas/principios-e-discernimento">Revisitar a Trilha 01 →</Link>
          </div>
        </div>
      </section>
      <footer>
        <span>© Escola Atemporal · Biblioteca Atemporal</span>
        <a className="learning-top-link" href="#topo">↑ Voltar ao início</a>
        <span>Trilha 02 · Curadoria pública e exercício original</span>
      </footer>
    </main>
  );
}
