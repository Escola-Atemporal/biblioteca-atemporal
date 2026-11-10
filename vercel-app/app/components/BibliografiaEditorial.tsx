/** A mesma linguagem editorial dos PDFs das trilhas 02/03.
 * Links de editoras e repositórios NÃO são presumidos links diretos para PDFs.
 * Todas as obras permanecem na sua fonte pública. */
type Obra = {
 id:string; tipo:string; titulo:string; autor:string;
 resumo:string; pergunta:string; acesso:string; href:string;
};
type Guia = {
 capa:string; tema:string; comoLer:string; idioma:"Português"|"Inglês";
 ano:string; formato:string; classe:string;
};
const dados05:Record<string,Guia> = {
 "lideranca-estrategica":{capa:"LIDERAR EM TENSÃO",tema:"Liderança estratégica",comoLer:"Investigue como a liderança muda quando pessoas, contextos e decisões se influenciam.",idioma:"Inglês",ano:"2022",formato:"PDF / EPUB",classe:"tone-graphite"},
 "lideranca-etica":{capa:"ESCOLHAS ÉTICAS",tema:"Ética e liderança",comoLer:"Comece pelos dilemas éticos e observe o que muda quando justiça, cuidado e responsabilidade entram na conversa.",idioma:"Inglês",ano:"2011",formato:"PDF / EPUB",classe:"tone-yellow"},
 "gestao-controle":{capa:"AUTONOMIA E FOCO",tema:"Gestão e autonomia",comoLer:"Leia o capítulo e contraste planejamento e controle com a liberdade necessária para decidir.",idioma:"Inglês",ano:"2019",formato:"TEXTO ONLINE",classe:"tone-charcoal"},
 "lideranca-processo":{capa:"O ATO DE LIDERAR",tema:"Pessoas e liderança",comoLer:"Observe as formas de influência nas equipes e relacione-as à sua prática cotidiana.",idioma:"Inglês",ano:"2019",formato:"TEXTO ONLINE",classe:"tone-deep"},
 "dialeticas":{capa:"PENSAR PARADOXOS",tema:"Paradoxos organizacionais",comoLer:"Identifique as contradições que permanecem vivas mesmo depois de uma decisão.",idioma:"Inglês",ano:"2017",formato:"REPOSITÓRIO",classe:"tone-graphite"},
 "paradoxos-destrutivos":{capa:"LIMITES DE LIDERAR",tema:"Liderança responsável",comoLer:"Leia com atenção crítica: há tensões que não devem ser impostas como exigências impossíveis.",idioma:"Inglês",ano:"2024",formato:"REPOSITÓRIO / PDF",classe:"tone-yellow"},
};
const dados06:Record<string,Guia> = {
 "guia-responsabilidade":{capa:"CUIDAR DO IMPACTO",tema:"Sustentabilidade",comoLer:"Comece pelas perguntas sobre stakeholders e sobre a responsabilidade além dos indicadores de curto prazo.",idioma:"Inglês",ano:"2022",formato:"PDF / EPUB",classe:"tone-graphite"},
 "organizing":{capa:"NOVOS MODELOS",tema:"Modelos sustentáveis",comoLer:"Observe como modelos de negócio podem considerar diferentes formas de criação de valor.",idioma:"Inglês",ano:"2021",formato:"PDF / EPUB",classe:"tone-yellow"},
 "etica":{capa:"ÉTICA E RESULTADO",tema:"Ética empresarial",comoLer:"Investigue a relação entre ética, pessoas afetadas pelas decisões e resultados organizacionais.",idioma:"Inglês",ano:"2018",formato:"TEXTO / PDF",classe:"tone-charcoal"},
 "management":{capa:"GESTÃO E CULTURA",tema:"Gestão e cultura",comoLer:"Explore planejamento, liderança e aprendizagem como práticas que atravessam diferentes ciclos.",idioma:"Inglês",ano:"2019",formato:"TEXTO / PDF",classe:"tone-deep"},
 "planejar-aprender":{capa:"PLANEJAR E REVER",tema:"Melhoria contínua",comoLer:"Relacione o ciclo de planejamento à avaliação e revisão dos compromissos que assumimos.",idioma:"Inglês",ano:"2019",formato:"TEXTO ONLINE",classe:"tone-graphite"},
 "priorizar":{capa:"DECISÕES E PESSOAS",tema:"Stakeholders",comoLer:"Identifique quem é afetado por uma escolha e quem precisa participar da conversa.",idioma:"Inglês",ano:"2018",formato:"TEXTO ONLINE",classe:"tone-yellow"},
};

function Cartao({obra,numero,trilha,info}:{obra:Obra;numero:number;trilha:"05"|"06";info:Guia}) {
 const capitulo=obra.tipo.includes("CAPÍTULO");
 const rotulo=capitulo?"Ler capítulo":"Consultar livro / PDF";
 return <article className="book-reference-card biblioteca-padronizada-card" id={obra.id}>
  <div className={"book-reference-cover "+info.classe} aria-hidden="true">
   <span className="book-cover-mark">ESCOLA ATEMPORAL / TRILHA {trilha}</span>
   <span className="book-cover-index">{String(numero).padStart(2,"0")}</span>
   <strong>{info.capa}</strong>
   <span className="book-cover-base">REFERÊNCIA PARA EXPLORAR ↗</span>
  </div>
  <div className="book-reference-info">
   <div className="book-reference-eyebrow"><span>{obra.tipo}</span><span>·</span><span>{info.ano}</span><span>·</span><span>{info.formato}</span></div>
   <h4>{obra.titulo}</h4>
   <p className="book-reference-author">{obra.autor}</p>
   <div className="book-reference-taxonomy"><span>{info.tema}</span><span>{info.idioma}</span></div>
   <p className="book-reference-summary">{obra.resumo}</p>
   <p className="book-reference-guide"><strong>Por onde começar:</strong> {info.comoLer}</p>
   <p className="book-reference-question"><strong>Para refletir:</strong> {obra.pergunta}</p>
   <div className="book-reference-actions">
    <a className="book-download" href={obra.href} target="_blank" rel="noopener noreferrer" aria-label={rotulo+" na página da fonte: "+obra.titulo}>{rotulo} <span aria-hidden="true">↗</span></a>
    <a className="book-source" href={obra.href} target="_blank" rel="noopener noreferrer" aria-label={"Consultar a fonte e condições de uso de: "+obra.titulo}>Fonte e direitos <span aria-hidden="true">↗</span></a>
   </div>
   <p className="book-reference-rights">{obra.acesso}</p>
  </div>
 </article>;
}

export default function BibliografiaEditorial({trilha,obras}:{trilha:"05"|"06";obras:readonly Obra[]}) {
 const dados=trilha==="05"?dados05:dados06;
 return <div className="learning-book-group biblioteca-padronizada" aria-label={"Bibliografia da Trilha "+trilha}>
  <div className="learning-book-group-head">
   <div><span className="learning-book-group-number">{trilha} / LEITURAS</span><h3>LIVROS, E-BOOKS E CAPÍTULOS</h3></div>
   <p>Selecione uma referência. O botão principal abre a página de origem: quando houver PDF, o download é oferecido pela instituição responsável.</p>
  </div>
  <div className="learning-book-grid">
   {obras.map((o,i)=>{const info=dados[o.id];return info?<Cartao key={o.id} obra={o} numero={i+1} trilha={trilha} info={info}/>:null;})}
  </div>
 </div>;
}
