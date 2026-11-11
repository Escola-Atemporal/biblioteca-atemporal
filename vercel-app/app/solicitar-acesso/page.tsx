import BrandLogo from "../components/BrandLogo";
import Link from "next/link";
import AccessRequestForm from "./AccessRequestForm";
import {emailConfigured} from "../../lib/email";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Solicitar acesso | Biblioteca Atemporal",
  description: "Solicitação de participação na comunidade de aprendizagem da Escola Atemporal.",
  robots: { index: false, follow: false },
};

export default function AccessRequestPage() {
  return (
    <main className="login-atm request-atm-page">
      <header className="topbar login-atm-topbar">
        <BrandLogo />
        <nav aria-label="Navegação">
          <Link href="/entrar">Já tenho acesso</Link>
          <Link href="/">Voltar à Biblioteca</Link>
        </nav>
      </header>
      <div className="request-atm-layout">
        <section className="request-atm-context" aria-labelledby="request-atm-heading">
          <span className="login-atm-eyebrow">BIBLIOTECA ATEMPORAL / EXPERIENCIALISTAS</span>
          <div>
            <span className="request-atm-index" aria-hidden="true">01</span>
            <h1 id="request-atm-heading">Aprender também é <em>construir juntos.</em></h1>
            <p>A Biblioteca é um espaço para ampliar repertórios, trocar experiências e refletir sobre as escolhas que orientam nossas relações, projetos e lideranças.</p>
          </div>
          <span className="request-atm-context-foot">A participação é analisada individualmente pela equipe da Escola Atemporal.</span>
        </section>
        <section className="request-atm-form-panel" aria-labelledby="request-atm-form-heading">
          <div className="request-atm-form-inner">
            <span className="login-atm-form-eyebrow">PARTICIPAÇÃO NA BIBLIOTECA</span>
            <h2 id="request-atm-form-heading">Solicitar acesso.</h2>
            <p>Conte-nos quem você é. Sua solicitação será encaminhada à administração para avaliação. Não é necessário criar senha nesta etapa.</p>
            {emailConfigured
              ? <AccessRequestForm />
              : <p className="login-atm-notice" role="status">O envio por e-mail já foi testado com sucesso. As solicitações públicas permanecem temporariamente suspensas enquanto a Escola conclui a verificação de autorização do Google. Pessoas convidadas devem utilizar o link individual enviado pela administração.</p>}
            <Link href="/entrar" className="login-atm-back">← Já tenho convite ou conta ativa</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
