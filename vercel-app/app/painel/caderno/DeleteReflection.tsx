"use client";
import {useState} from "react";
import {deleteReflection} from "./actions";
export default function DeleteReflection({id}:{id:string}){
 const [confirm,setConfirm]=useState(false);
 return <form action={deleteReflection}>
  <input type="hidden" name="id" value={id}/>
  {!confirm?<button type="button" className="reflection-delete-toggle" onClick={()=>setConfirm(true)}>Excluir reflexão</button>
   :<div className="reflection-delete-confirm"><span>Excluir definitivamente esta reflexão?</span>
     <button type="submit">Confirmar exclusão</button>
     <button type="button" onClick={()=>setConfirm(false)}>Cancelar</button>
   </div>}
 </form>;
}
