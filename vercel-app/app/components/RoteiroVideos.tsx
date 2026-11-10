/* Contexto de aprendizagem original para os vídeos de cada trilha.
   Cada referência abre a gravação na página do criador. */
const orientacoes = {
 "01":{tema:"Princípios e discernimento",inicio:"Observe uma escolha real em que duas alternativas parecem boas por razões diferentes.",contraste:"Compare a decisão dos palestrantes com os princípios e limites da Escola Atemporal.",aplicacao:"Registre uma pergunta que você fará antes de sua próxima decisão difícil."},
 "02":{tema:"Emoções e autoconsciência",inicio:"Identifique como cada vídeo distingue emoção, interpretação e comportamento.",contraste:"Compare perspectivas sem tratar uma fala de palco como diagnóstico pessoal.",aplicacao:"Experimente uma pausa ou uma pergunta de escuta em situação cotidiana de baixo risco."},
 "03":{tema:"Autoconhecimento e hábitos",inicio:"Observe quais sinais, contextos e recompensas mantêm padrões de comportamento.",contraste:"Compare experimentos pequenos com promessas de mudança radical e imediata.",aplicacao:"Escolha um gesto viável para observar por alguns dias, sem transformá-lo em cobrança."},
 "04":{tema:"Confiança e colaboração",inicio:"Repare no que torna mais fácil ou mais difícil falar e ser ouvido em grupo.",contraste:"Relacione confiança, segurança, discordância e acordos concretos, sem confundi-los.",aplicacao:"Convide uma voz pouco ouvida e formule uma pergunta genuína na próxima conversa."},
 "05":{tema:"Paradoxos da liderança",inicio:"Identifique quais dois valores legítimos convivem em cada situação apresentada.",contraste:"Observe os riscos de extremos como firmeza sem cuidado e mudança sem escuta.",aplicacao:"Desenhe um acordo que proteja os dois valores e defina quando será revisitado."},
 "06":{tema:"Resultados e legado",inicio:"Perceba quais resultados são medidos e quais impactos ficam fora da conta.",contraste:"Compare critérios econômicos, humanos, sociais e ambientais de sucesso.",aplicacao:"Defina um compromisso que possa continuar depois do encerramento de uma entrega."}
} as const;

export default function RoteiroVideos({trilha,total}:{trilha:keyof typeof orientacoes;total:number}){
 const o=orientacoes[trilha];
 return <div className="video-estudo" aria-label={"Roteiro de estudo de "+o.tema}>
  <div className="video-estudo-head">
   <div><span className="video-estudo-label">ROTEIRO DE ESCUTA · TRILHA {trilha}</span><h3>Da palestra à prática.</h3></div>
   <p><strong>{total} vídeos</strong> para ampliar o repertório. Escolha um tema, assista na fonte original e transforme a ideia em reflexão.</p>
  </div>
  <div className="video-estudo-steps">
   <div><span>01 / OBSERVAR</span><p>{o.inicio}</p></div>
   <div><span>02 / CONTRASTAR</span><p>{o.contraste}</p></div>
   <div><span>03 / EXPERIMENTAR</span><p>{o.aplicacao}</p></div>
  </div>
 </div>;
}
