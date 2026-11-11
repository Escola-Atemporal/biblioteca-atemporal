import { ebooksDaTrilha, type TrilhaNumero } from "../../data/colecao-autoral";

/**
 * Complemento autoral no acervo bibliografico.
 * Referencias no Drive institucional, sem publicar os arquivos no site.
 * Nao muda as permissoes de acesso nem o status de revisao editorial.
 */
export default function ColecaoAutoral({ trilha }: { trilha: TrilhaNumero }) {
  const volumes = ebooksDaTrilha(trilha);
  if (!volumes.length) return null;

  return (
    <section className="colecao-autoral" id={`ebooks-escola-${trilha}`} aria-labelledby={`colecao-autoral-titulo-${trilha}`}>
      <div className="colecao-autoral-topo">
        <div className="colecao-autoral-titulos">
          <span className="colecao-autoral-selo">ACERVO AUTORAL · ESCOLA ATEMPORAL</span>
          <h3 id={`colecao-autoral-titulo-${trilha}`}>Ideias da Escola que <em>continuam na leitura.</em></h3>
          <p>Ensaios, perguntas e práticas desenvolvidos a partir da filosofia da Escola Atemporal. Uma leitura para investigar, ampliar perspectivas e conectar conhecimento ao cotidiano.</p>
        </div>
        <span className="colecao-autoral-total" aria-label={`${volumes.length} e-books relacionados a esta trilha`}>
          <strong>{String(volumes.length).padStart(2, "0")}</strong>
          <small>{volumes.length === 1 ? "E-BOOK AUTORAL" : "E-BOOKS AUTORAIS"}</small>
        </span>
      </div>

      <div className="colecao-autoral-aviso" role="note">
        <strong>Minutas internas em revisão editorial.</strong>
        <span>Os PDFs permanecem no Google Drive da Escola e só podem ser abertos por quem já tem permissão. Estes materiais ainda não estão aprovados para distribuição pública.</span>
      </div>

      <ol className="colecao-autoral-lista">
        {volumes.map((volume) => (
          <li key={volume.numero}>
            <article className="colecao-autoral-card">
              <div className="colecao-autoral-capa" aria-hidden="true">
                <span>ESCOLA ATEMPORAL / COLEÇÃO</span>
                <strong>{volume.numero}</strong>
                <span className="colecao-autoral-capa-titulo">{volume.titulo}</span>
                <span className="colecao-autoral-capa-rodape">O QUE PERMANECE IMPORTA.</span>
              </div>
              <div className="colecao-autoral-texto">
                <div className="colecao-autoral-meta">
                  <span>{volume.categoria}</span>
                  <span>PDF · MINUTA INTERNA</span>
                </div>
                <h4>{volume.titulo}</h4>
                <p className="colecao-autoral-subtitulo">{volume.subtitulo}</p>
                <p className="colecao-autoral-resumo">{volume.resumo}</p>
                <p className="colecao-autoral-pergunta"><strong>Para refletir:</strong> {volume.pergunta}</p>
                <a href={volume.url} className="colecao-autoral-link" target="_blank" rel="noopener noreferrer" aria-label={`Consultar PDF em revisão no Drive: ${volume.titulo}`}>
                  Consultar PDF no Drive <span aria-hidden="true">↗</span>
                </a>
                <span className="colecao-autoral-nota">Acesso sujeito às permissões do Google Drive.</span>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
