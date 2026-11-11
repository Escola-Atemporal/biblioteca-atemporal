import Link from "next/link";
import {resolveTrail} from "../../lib/learning-progress";

/** Link for authenticated learners; the target rechecks ownership and permission. */
export default function ReflectionQuestionLink({trail,question}:{trail:string;question:string}){
 if(!resolveTrail(trail)||!question.trim())return null;
 const params=new URLSearchParams({trilha:trail,pergunta:question.trim().slice(0,500)});
 return <Link className="learning-reflection-save" href={`/painel/caderno?${params.toString()}#reflection-new-title`}>
  Refletir no meu caderno <span aria-hidden="true">↗</span>
 </Link>;
}
