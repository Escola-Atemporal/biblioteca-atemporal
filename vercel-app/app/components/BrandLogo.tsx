import Link from "next/link";

/**
 * Logotipo horizontal oficial da Escola Atemporal, utilizado no cabeçalho do site institucional.
 * Fonte: https://escolaatemporal.com.br/ (imagem wp-image-4410).
 * O arquivo permanece hospedado pela própria Escola; não é redesenhado nem alterado.
 */
export default function BrandLogo() {
  const base = "https://escolaatemporal.com.br/wp-content/uploads/2026/08";
  return (
    <Link className="brand brand-lockup" href="/" aria-label="Escola Atemporal — Biblioteca Atemporal, página inicial">
      <img
        className="brand-logo"
        src={`${base}/hor-e1787682735563.png`}
        srcSet={`${base}/hor-e1787682735563-300x101.png 300w, ${base}/hor-e1787682735563-768x258.png 768w, ${base}/hor-e1787682735563.png 1350w`}
        sizes="(max-width: 600px) 150px, 206px"
        width={1350}
        height={454}
        alt="Escola Atemporal"
        decoding="async"
      />
      <span className="brand-divider" aria-hidden="true" />
      <span className="brand-library">BIBLIOTECA</span>
    </Link>
  );
}
