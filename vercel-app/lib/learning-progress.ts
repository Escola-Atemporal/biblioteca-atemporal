export const LEARNING_TRAILS = [
  {number:"01",title:"Princípios e Discernimento",slug:"principios-e-discernimento",sections:[["investigacao","Investigação"],["percurso","Percurso"],["biblioteca","Artigos e fontes"],["livros","Livros e materiais"],["videos","Vídeos"],["pratica","Aplicação"]]},
  {number:"02",title:"Emoções e Autoconsciência",slug:"emocoes-e-autoconsciencia",sections:[["investigacao","Investigação"],["percurso","Percurso"],["biblioteca","Artigos e fontes"],["livros","Livros"],["videos","Vídeos"],["pratica","Aplicação"]]},
  {number:"03",title:"Autoconhecimento e Hábitos",slug:"autoconhecimento-e-habitos",sections:[["investigacao","Investigação"],["movimentos","Movimentos"],["padroes","Padrões"],["biblioteca","Artigos e fontes"],["livros","Livros"],["videos","Vídeos"],["pratica","Aplicação"]]},
  {number:"04",title:"Confiança e Colaboração",slug:"confianca-e-colaboracao",sections:[["investigacao","Investigação"],["movimentos","Movimentos"],["lentes","Lentes"],["escola","Conteúdo da Escola"],["livros","Livros"],["videos","Vídeos"],["pratica","Aplicação"]]},
  {number:"05",title:"Paradoxos da Liderança",slug:"paradoxos-da-lideranca",sections:[["investigacao","Investigação"],["movimentos","Movimentos"],["tensoes","Tensões"],["escola","Conteúdo da Escola"],["leituras","Leituras"],["videos","Vídeos"],["pratica","Aplicação"]]},
  {number:"06",title:"Resultados e Legado",slug:"resultados-e-legado",sections:[["investigacao","Investigação"],["dimensoes","Dimensões"],["ciclo","Ciclo"],["movimentos","Movimentos"],["escola","Conteúdo da Escola"],["bibliografia","Bibliografia"],["videos","Vídeos"],["pratica","Aplicação"]]}
] as const;
export type TrailSlug = (typeof LEARNING_TRAILS)[number]["slug"];
export type LearningStatus = "iniciada" | "em_andamento" | "concluida";
export type ProgressRecord = {trail_slug:TrailSlug;status:LearningStatus;section_id:string;updated_at:string};
export function resolveTrail(slug:string){return LEARNING_TRAILS.find(t=>t.slug===slug);}
export function validSection(slug:string, section:string){const t=resolveTrail(slug);return Boolean(t&&t.sections.some(([id])=>id===section));}
