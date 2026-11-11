import { can } from "../../../lib/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";
import BrandLogo from "../../components/BrandLogo";
import PresenceHeartbeat from "../../components/PresenceHeartbeat";
import { auth, authConfigured } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { databaseConfigured, dbQuery } from "../../../lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = {
 title: "Indicadores | Biblioteca Atemporal",
 robots: {index:false,follow:false,noarchive:true},
};
type Counts = {
 total:number; active:number; awaiting_password:number; disabled:number;
 experiencialistas:number; curadores:number; administradores:number;
};
type InviteCounts = {pending:number;closed:number;expired:number};
type RequestCounts = {pending:number};
type PresenceCounts = {online:number;recent:number};
type AuditRow={action:string;total:number};

export default async function IntelligencePage(){
 if(!authConfigured)redirect("/entrar");
 const session=await auth();
 if(!session?.user?.email)redirect("/entrar");
 if(!can(await roleForEmailAsync(session.user.email),"analytics:read"))redirect("/painel");
 let metrics:Counts|null=null;
 let invites:InviteCounts|null=null;
 let requests:RequestCounts|null=null;
 let presence:PresenceCounts|null=null;
 let events:AuditRow[]=[];
 let error=false;
 if(!databaseConfigured)error=true;
 else try{
  const [members,i,r,p,a] = await Promise.all([
   dbQuery<Counts>(`SELECT count(*)::int AS total,
      count(*) FILTER(WHERE active AND password_hash IS NOT NULL)::int AS active,
      count(*) FILTER(WHERE password_hash IS NULL)::int AS awaiting_password,
      count(*) FILTER(WHERE NOT active AND password_hash IS NOT NULL)::int AS disabled,
      count(*) FILTER(WHERE role='experiencialista')::int AS experiencialistas,
      count(*) FILTER(WHERE role='curador')::int AS curadores,
      count(*) FILTER(WHERE role='administrador')::int AS administradores
      FROM biblioteca_access_accounts`),
   dbQuery<InviteCounts>(`SELECT count(*) FILTER(WHERE used_at IS NULL AND expires_at>now())::int AS pending,
      count(*) FILTER(WHERE used_at IS NOT NULL)::int AS closed,
      count(*) FILTER(WHERE used_at IS NULL AND expires_at<=now())::int AS expired
      FROM biblioteca_access_invites`),
   dbQuery<RequestCounts>(`SELECT count(*) FILTER(WHERE status='pending')::int AS pending FROM biblioteca_membership_requests`),
   dbQuery<PresenceCounts>(`SELECT count(*) FILTER(WHERE last_seen_at>now()-interval '3 minutes')::int AS online,
      count(*) FILTER(WHERE last_seen_at>now()-interval '24 hours')::int AS recent
      FROM biblioteca_user_presence`),
   dbQuery<AuditRow>(`SELECT action,count(*)::int AS total FROM biblioteca_access_audit
      WHERE created_at>=now()-interval '30 days'
      GROUP BY action ORDER BY total DESC LIMIT 12`)
  ]);
  metrics=members[0]??null;invites=i[0]??null;requests=r[0]??null;presence=p[0]??null;events=a;
 }catch{error=true;}
 const cards=[
  ["Contas cadastradas",metrics?.total],
  ["Contas ativas",metrics?.active],
  ["Aguardando senha",metrics?.awaiting_password],
  ["Contas desativadas",metrics?.disabled],
  ["Convites pendentes",invites?.pending],
  ["Solicitações pendentes",requests?.pending],
  ["Online (3 min)",presence?.online],
  ["Ativos (24 h)",presence?.recent],
 ];
 const eventLabels:Record<string,string>={
  invitation_created:"Convites criados",invitation_accepted:"Ativações de convites",
  account_activated:"Contas ativadas",account_deactivated:"Contas desativadas",
  role_changed:"Perfis alterados",request_approved:"Solicitações aprovadas",
  request_rejected:"Solicitações recusadas",
 };
 return <main className="admin-atm-page">
  <PresenceHeartbeat section="Indicadores administrativos"/>
  <header className="topbar login-atm-topbar">
   <BrandLogo/><nav aria-label="Navegação administrativa"><Link href="/painel/usuarios">Gestão de acessos</Link><Link href="/painel">Meu painel</Link></nav>
  </header>
  <section className="admin-atm-hero"><div className="admin-atm-container">
   <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · INDICADORES</span>
   <h1>Inteligência da <em>Biblioteca.</em></h1>
   <p>Acompanhe a participação, a presença e a gestão de acessos com dados reais. Informações disponíveis apenas à administração.</p>
  </div></section>
  <div className="admin-atm-container admin-atm-main">
   {error?<p className="admin-atm-feedback admin-atm-failure" role="alert">Não foi possível consultar os indicadores no momento. Nenhum número estimado foi exibido.</p>:<>
    <section aria-labelledby="intelligence-summary">
     <div className="admin-atm-section-head"><div><span className="admin-atm-eyebrow">VISÃO GERAL</span><h2 id="intelligence-summary">Participação e acessos.</h2></div>
      <p>Indicadores consultados no banco de dados no momento da abertura desta página.</p></div>
     <div className="admin-atm-facts" style={{display:"flex",flexWrap:"wrap",gap:"12px",marginBottom:"24px"}}>
      {cards.map(([label,value])=><span key={String(label)} style={{minWidth:"190px",flex:"1 1 190px"}}><strong>{value??"—"}</strong> {label}</span>)}
     </div>
    </section>
    <section className="admin-atm-people" aria-labelledby="profiles-title">
     <div className="admin-atm-section-head"><div><span className="admin-atm-eyebrow">COMPOSIÇÃO DA COMUNIDADE</span><h2 id="profiles-title">Perfis cadastrados.</h2></div></div>
     <div className="admin-atm-facts" style={{marginBottom:"24px"}}>
      <span><strong>{metrics?.experiencialistas??0}</strong> experiencialistas</span>
      <span><strong>{metrics?.curadores??0}</strong> curadores</span>
      <span><strong>{metrics?.administradores??0}</strong> administradores cadastrados no banco</span>
     </div>
     <p className="admin-atm-privacy">Os administradores iniciais configurados exclusivamente no Render podem não constar na contagem do banco.</p>
    </section>
    <section className="admin-atm-people" aria-labelledby="audit-summary">
     <div className="admin-atm-section-head"><div><span className="admin-atm-eyebrow">ÚLTIMOS 30 DIAS</span><h2 id="audit-summary">Eventos administrativos.</h2></div>
     <p>Contagens de eventos de acesso registrados no sistema, sem expor senhas ou tokens.</p></div>
     {events.length?<div className="admin-atm-table-wrap"><table className="admin-atm-table">
      <thead><tr><th scope="col">Evento</th><th scope="col">Ocorrências</th></tr></thead>
      <tbody>{events.map(e=><tr key={e.action}><td>{eventLabels[e.action]??e.action}</td><td><strong>{e.total}</strong></td></tr>)}</tbody>
     </table></div>:<p className="admin-atm-empty">Nenhum evento de auditoria registrado nos últimos 30 dias.</p>}
    </section>
   </>}
   <section className="admin-atm-people" aria-labelledby="measurement-limit">
    <div className="admin-atm-section-head"><div><span className="admin-atm-eyebrow">TRANSPARÊNCIA</span><h2 id="measurement-limit">O que ainda não medimos.</h2></div></div>
    <p>Visualizações de cada trilha, downloads e tempo de leitura ainda não são registrados como indicadores confiáveis. Essas métricas só aparecerão após a implantação de eventos próprios, com critérios de privacidade.</p>
   </section>
   <Link className="admin-atm-back" href="/painel/usuarios">← Voltar à gestão de acessos</Link>
  </div>
 </main>;
}
