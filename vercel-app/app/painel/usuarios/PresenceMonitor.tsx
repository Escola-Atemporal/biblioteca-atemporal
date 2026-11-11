"use client";
import {useEffect,useState} from "react";
type Person={email:string;name:string;role:string;section:string;lastSeen:string;online:boolean};
type Data={people:Person[];onlineCount:number;recentCount:number;asOf:string};
export default function PresenceMonitor() {
  const [data,setData]=useState<Data|null>(null);
  const [error,setError]=useState(false);
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    let ended=false;
    async function load(){
      if(document.visibilityState!=="visible")return;
      setBusy(true);
      try{
        const res=await fetch("/api/private/presence/online",{cache:"no-store",credentials:"same-origin"});
        if(!res.ok)throw new Error("Unable to refresh presence");
        const result=await res.json() as Data;
        if(!ended){setData(result);setError(false);}
      }catch{if(!ended)setError(true);}
      finally{if(!ended)setBusy(false);}
    }
    void load();
    const timer=window.setInterval(()=>{void load()},60000);
    document.addEventListener("visibilitychange",load);
    return()=>{ended=true;window.clearInterval(timer);document.removeEventListener("visibilitychange",load);};
  },[]);
  const stamp=(iso:string)=>new Date(iso).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short",timeZone:"America/Sao_Paulo"});
  return <section className="admin-atm-people" aria-labelledby="presence-title" id="presenca">
    <div className="admin-atm-section-head"><div><span className="admin-atm-eyebrow">PRESENÇA NA BIBLIOTECA</span><h2 id="presence-title">Quem está online.</h2></div>
    <p>Online = atividade registrada nos últimos 3 minutos. O monitor atualiza automaticamente a cada minuto; abas inativas não mantêm presença.</p></div>
    <div className="admin-atm-facts" style={{marginBottom:24}}>
      <span><strong>{data?.onlineCount ?? "—"}</strong> online agora</span>
      <span><strong>{data?.recentCount ?? "—"}</strong> ativos nas últimas 24 horas</span>
      <span><strong>{busy ? "…" : data ? stamp(data.asOf) : "—"}</strong> última atualização</span>
    </div>
    {error&&<p role="status" className="login-atm-notice">Não foi possível atualizar a presença neste momento.</p>}
    {!data&&!error&&<p>Carregando atividade…</p>}
    {data&&(!data.people.length?<p className="admin-atm-empty">Ainda não há atividade registrada. Os dados começarão a aparecer quando os participantes navegarem após esta atualização.</p>:
    <div className="admin-atm-table-wrap"><table className="admin-atm-table"><thead><tr><th>Pessoa</th><th>Perfil</th><th>Status</th><th>Última atividade</th></tr></thead><tbody>
    {data.people.map(person=><tr key={person.email}>
      <td><strong>{person.name}</strong><span>{person.email}</span></td>
      <td>{person.role}</td><td><span className={`admin-atm-state ${person.online?"is-active":""}`}>{person.online?"● Online":"Ausente"}</span><span>{person.section}</span></td>
      <td>{stamp(person.lastSeen)}</td>
    </tr>)}</tbody></table></div>)}
    <p className="admin-atm-privacy">Dados visíveis somente a administradores. A presença é aproximada, não identifica todas as interações e não representa tempo de leitura.</p>
  </section>;
}
