"use client";
import { useActionState } from "react";
import { saveIndividualAccess, type AccessUpdateState } from "./individual-actions";
import type { AccessResource } from "../../../lib/individual-access";

const initial: AccessUpdateState={ok:false,message:""};
export default function PermissionControl({email,resource,label,mode}:{email:string;resource:AccessResource;label:string;mode:"inherit"|"allow"|"deny"}){
 const [state,action,pending]=useActionState(saveIndividualAccess,initial);
 return <form action={action} className="access-override-form">
  <input type="hidden" name="email" value={email}/>
  <input type="hidden" name="resource" value={resource}/>
  <label>{label}
    <select name="mode" defaultValue={mode} key={email+resource+mode} aria-label={`Acesso ${label} de ${email}`}>
      <option value="inherit">Padrão do perfil</option>
      <option value="allow">Liberar</option>
      <option value="deny">Bloquear</option>
    </select>
  </label>
  <button type="submit" disabled={pending}>{pending?"Salvando...":"Aplicar"}</button>
  {state.message&&<span role="status" className={state.ok?"access-override-success":"access-override-error"}>{state.message}</span>}
 </form>;
}
