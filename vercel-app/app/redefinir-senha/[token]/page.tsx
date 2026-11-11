import {createHash} from "node:crypto";
import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";
import {dbQuery,databaseConfigured} from "../../../lib/database";
import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic="force-dynamic";
export const metadata={title:"Redefinir senha | Biblioteca Atemporal",robots:{index:false,follow:false},referrer:"no-referrer"};
const TOKEN=/^[a-zA-Z0-9_-]{43}$/;
type ValidReset={email:string};

export default async function ResetPasswordPage({params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 let found:ValidReset|undefined;
 if(databaseConfigured&&TOKEN.test(token)){
  try{
   [found]=await dbQuery<ValidReset>(
    `SELECT p.email FROM biblioteca_password_resets p
     JOIN biblioteca_access_accounts a ON a.email=p.email
     WHERE p.token_hash=$1 AND p.used_at IS NULL
       AND p.expires_at>now() AND a.active=true AND a.password_hash IS NOT NULL LIMIT 1`,
    [createHash("sha256").update(token).digest("hex")],
   );
  }catch{}
 }
 return(
  <main className="login-atm">
   <header className="topbar login-atm-topbar"><BrandLogo/><nav><Link href="/entrar">Voltar ao login</Link></nav></header>
   <div className="admin-atm-activation">
    <section className="admin-atm-activation-panel" aria-labelledby="reset-title">
     <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · SEGURANÇA</span>
     {found ? (
      <>
       <h1 id="reset-title">Defina uma <em>nova senha.</em></h1>
       <p>Escolha uma senha com pelo menos 12 caracteres. Este link é pessoal, temporário e só poderá ser usado uma vez.</p>
       <ResetPasswordForm token={token} email={found.email}/>
      </>
     ):(
      <>
       <h1 id="reset-title">Link indisponível.</h1>
       <p>Este link pode ter expirado ou já ter sido utilizado. Solicite outro e-mail de recuperação.</p>
       <Link href="/esqueci-senha" className="admin-atm-primary">Solicitar novo link ↗</Link>
      </>
     )}
     <Link href="/entrar" className="admin-atm-back">← Retornar ao login</Link>
    </section>
   </div>
  </main>
 );
}
