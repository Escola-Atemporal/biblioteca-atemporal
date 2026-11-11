"use client";

import {useActionState} from "react";
import {requestPasswordReset,type PasswordRecoveryState} from "./actions";

const initial:PasswordRecoveryState={ok:false,message:""};
export default function RecoveryForm(){
  const [state,action,pending]=useActionState(requestPasswordReset,initial);
  return (
    <form action={action} className="login-atm-form">
      <label htmlFor="recovery-email">E-mail cadastrado</label>
      <input id="recovery-email" type="email" name="email" autoComplete="email"
        placeholder="voce@exemplo.com" required maxLength={254}/>
      <div className="request-atm-honeypot" aria-hidden="true">
        <label htmlFor="recovery-website">Website</label>
        <input name="website" id="recovery-website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.message && <p className={state.ok?"login-atm-notice":"login-atm-error"} role="status">{state.message}</p>}
      {!state.ok && <button type="submit" className="login-atm-submit" disabled={pending}>
        {pending?"Solicitando...":"Receber link por e-mail"} <span aria-hidden="true">↗</span>
      </button>}
    </form>
  );
}
