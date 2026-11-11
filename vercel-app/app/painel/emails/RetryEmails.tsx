"use client";

import {useActionState} from "react";
import {retryEmailOutbox,sendTestEmail,type RetryState} from "./actions";

const initial:RetryState={ok:false,message:""};
export default function RetryEmails(){
 const [state,action,pending]=useActionState(retryEmailOutbox,initial);
 const [testState,testAction,testPending]=useActionState(sendTestEmail,initial);
 return(
  <form action={action} className="email-atm-retry">
   <button type="submit" className="admin-atm-primary" disabled={pending}>
    {pending?"Reprocessando mensagens...":"Tentar enviar mensagens pendentes"} <span aria-hidden="true">↗</span>
   </button>
   {state.message && <p className={state.ok?"login-atm-notice":"login-atm-error"} role="status">{state.message}</p>}
    <div className="email-atm-test">
    <button className="admin-atm-primary" type="submit" formAction={testAction} disabled={testPending || pending}>
      {testPending?"Enviando teste...":"Enviar teste para meu e-mail"} <span aria-hidden="true">↗</span>
    </button>
    {testState.message && <p className={testState.ok?"login-atm-notice":"login-atm-error"} role="status">{testState.message}</p>}
   </div>
  </form>
 );
}
