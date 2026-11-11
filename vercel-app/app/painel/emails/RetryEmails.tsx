"use client";

import {useActionState} from "react";
import {retryEmailOutbox,type RetryState} from "./actions";

const initial:RetryState={ok:false,message:""};
export default function RetryEmails(){
 const [state,action,pending]=useActionState(retryEmailOutbox,initial);
 return(
  <form action={action} className="email-atm-retry">
   <button type="submit" className="admin-atm-primary" disabled={pending}>
    {pending?"Reprocessando mensagens...":"Tentar enviar mensagens pendentes"} <span aria-hidden="true">↗</span>
   </button>
   {state.message && <p className={state.ok?"login-atm-notice":"login-atm-error"} role="status">{state.message}</p>}
  </form>
 );
}
