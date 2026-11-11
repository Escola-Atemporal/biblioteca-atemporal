import BrandLogo from "../components/BrandLogo";
import Link from "next/link";
import RecoveryForm from "./RecoveryForm";
import {emailConfigured} from "../../lib/email";

export const dynamic="force-dynamic";
export const metadata={title:"Recuperar senha | Biblioteca Atemporal",robots:{index:false,follow:false},referrer:"no-referrer"};

export default function RecoverPage(){
 return(
  <main className="login-atm">
    <header className="topbar login-atm-topbar"><BrandLogo/><nav><Link href="/entrar">Voltar ao login</Link></nav></header>
    <div className="admin-atm-activation">
      <section className="admin-atm-activation-panel" aria-labelledby="recover-title">
        <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · SEGURANÇA</span>
        <h1 id="recover-title">Recuperar <em>seu acesso.</em></h1>
        <p>Informe o e-mail cadastrado. Se houver uma conta ativa, você receberá um link pessoal para criar uma nova senha, sem precisar de WhatsApp.</p>
        {emailConfigured
          ? <RecoveryForm/>
          : <p className="login-atm-notice">A recuperação automática por e-mail ainda está sendo configurada pela Escola.</p>}
        <Link href="/entrar" className="admin-atm-back">← Voltar para entrar</Link>
      </section>
    </div>
  </main>
 );
}
