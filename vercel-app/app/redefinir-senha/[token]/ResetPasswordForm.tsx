"use client";

import {useActionState} from "react";
import {finishPasswordReset,type ChangePasswordState} from "./actions";

const initial:ChangePasswordState={ok:false,message:""};
export default function ResetPasswordForm({token,email}:{token:string;email:string}){
 const [state,action,pending]=useActionState(finishPasswordReset,initial);
 return(
  <form action={action} className="admin-atm-activation-form">
   <input name="token" value={token} type="hidden"/>
   <label>E-mail da conta<input type="email" value={email} readOnly/></label>
   <label>Nova senha<input name="password" type="password" placeholder="Pelo menos 12 caracteres" required minLength={12} maxLength={256} autoComplete="new-password"/></label>
   <label>Confirme a nova senha<input name="confirmation" type="password" placeholder="Repita a senha" required minLength={12} maxLength={256} autoComplete="new-password"/></label>
   {state.message && <p className="admin-atm-activation-error" role="alert">{state.message}</p>}
   <button type="submit" disabled={pending} className="admin-atm-primary">
    {pending?"Atualizando senha...":"Salvar nova senha"} <span aria-hidden="true">↗</span>
   </button>
  </form>
 );
}
