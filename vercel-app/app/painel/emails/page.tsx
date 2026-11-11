import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";
import {redirect} from "next/navigation";
import {auth,signOut} from "../../../auth";
import {roleForEmailAsync} from "../../../lib/access";
import {dbQuery,databaseConfigured} from "../../../lib/database";
import {emailConfigured} from "../../../lib/email";
import RetryEmails from "./RetryEmails";

export const dynamic="force-dynamic";
export const metadata={title:"E-mails transacionais | Escola Atemporal",robots:{index:false,follow:false}};

type MailRow={id:string;kind:string;recipient:string;subject:string;status:string;attempts:number;last_error:string|null;created_at:string;sent_at:string|null};
type Counter={status:string;total:number};
const names:Record<string,string>={
  request_received:"Recebimento de solicitação",request_admin:"Aviso à administração",
  invitation:"Convite de ativação",request_rejected:"Decisão da solicitação",
  account_activated:"Acesso ativado",password_reset:"Recuperação de senha",
  password_changed:"Senha alterada",access_status:"Situação da conta",role_changed:"Perfil alterado",
};
export default async function EmailAdminPage(){
 const session=await auth();
 if(!session?.user?.email)redirect("/entrar");
 if(await roleForEmailAsync(session.user.email)!=="administrador")redirect("/painel");
 let mails:MailRow[]=[];
 let totals:Counter[]=[];
 let failed=false;
 if(databaseConfigured){
  try{
   [mails,totals]=await Promise.all([
    dbQuery<MailRow>(
      `SELECT id,kind,recipient,subject,status,attempts,last_error,
        created_at::text,sent_at::text
       FROM biblioteca_email_outbox ORDER BY created_at DESC LIMIT 80`,
    ),
    dbQuery<Counter>(
      `SELECT status,count(*)::integer AS total FROM biblioteca_email_outbox GROUP BY status`,
    ),
   ]);
  }catch{failed=true;}
 }
 return(
  <main className="admin-atm-page">
   <header className="topbar login-atm-topbar">
    <BrandLogo/>
    <nav><Link href="/painel/usuarios">Pessoas e convites</Link>
     <form action={async()=>{"use server";await signOut({redirectTo:"/entrar"});}}>
      <button className="dashboard-atm-logout" type="submit">Sair ↗</button>
     </form>
    </nav>
   </header>
   <section className="admin-atm-hero">
    <div className="admin-atm-container">
     <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · COMUNICAÇÕES</span>
     <h1>E-mails <em>transacionais.</em></h1>
     <p>Convites, confirmações e recuperação de senha enviados automaticamente conforme o andamento das solicitações.</p>
     <div className="admin-atm-facts">
      <span><strong>{totals.reduce((n,row)=>n+Number(row.total),0)}</strong> mensagens registradas</span>
      <span><strong>{totals.find(r=>r.status==="sent")?.total??0}</strong> aceitas pelo provedor</span>
      <span><strong>{totals.filter(r=>r.status!=="sent").reduce((n,r)=>n+Number(r.total),0)}</strong> aguardando ou com erro</span>
     </div>
    </div>
   </section>
   <div className="admin-atm-container admin-atm-main">
    <section className="email-atm-config" aria-labelledby="email-ready">
     <span className="admin-atm-eyebrow">SITUAÇÃO DO REMETENTE</span>
     <h2 id="email-ready">{emailConfigured?"Configuração presente no servidor":"Configuração ainda necessária"}</h2>
     <p>{emailConfigured
       ?"A chave e o endereço remetente estão configurados. O envio efetivo depende da aceitação do serviço e da verificação DNS do domínio."
       :"Para ativar o envio automático, configure RESEND_API_KEY e RESEND_FROM_EMAIL na seção Environment do serviço no Render. O domínio do remetente precisa estar verificado no provedor. Até lá, convites e solicitações não são liberados."}</p>
     {emailConfigured?<RetryEmails/>:null}
    </section>
    <section className="admin-atm-people" aria-labelledby="outbox-title">
     <div className="admin-atm-section-head">
      <div><span className="admin-atm-eyebrow">ACOMPANHAMENTO</span><h2 id="outbox-title">Mensagens recentes.</h2></div>
      <p>Os status indicam aceitação pelo serviço, não comprovam leitura ou chegada à caixa de entrada. Links únicos e senhas não aparecem neste painel.</p>
     </div>
     {failed?<p className="admin-atm-feedback admin-atm-failure">Não foi possível consultar a fila de mensagens.</p>
     :mails.length ? (
      <div className="admin-atm-table-wrap">
       <table className="admin-atm-table">
        <thead><tr><th scope="col">Mensagem</th><th scope="col">Destinatário</th><th scope="col">Situação</th><th scope="col">Tentativas</th></tr></thead>
        <tbody>{mails.map(m=>(
         <tr key={m.id}>
          <td><strong>{names[m.kind]??m.kind}</strong><span>{m.subject}</span></td>
          <td>{m.recipient}</td>
          <td><span className={`email-atm-status ${m.status==="sent"?"is-sent":""}`}>{m.status==="sent"?"Aceito":m.status==="failed"?"Falha":m.status==="sending"?"Em processamento":"Aguardando"}</span>
           {m.last_error&&<small className="email-atm-error">{m.last_error}</small>}
          </td>
          <td>{m.attempts}</td>
         </tr>
        ))}</tbody>
       </table>
      </div>
     ):<p className="admin-atm-empty">Nenhum envio registrado. Os e-mails aparecerão aqui quando as primeiras solicitações forem processadas.</p>}
    </section>
    <Link href="/painel/usuarios" className="admin-atm-back">← Voltar à gestão de acessos</Link>
   </div>
  </main>
 );
}
