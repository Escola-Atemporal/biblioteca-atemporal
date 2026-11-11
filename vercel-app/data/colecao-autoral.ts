/* Coleção autoral | Biblioteca Atemporal
 * Arquivos existentes no Drive institucional, sem copiar para o repositório.
 * MINUTAS INTERNAS: links não alteram as permissões do Google Drive.
 * Os números 07-09 são aprofundamentos propostos, não trilhas oficiais.
 */
export type TrilhaNumero = "01" | "02" | "03" | "04" | "05" | "06";

export type EbookAtemporal = {
  numero: string;
  titulo: string;
  subtitulo: string;
  resumo: string;
  pergunta: string;
  categoria: "Volume da trilha" | "Ensaio complementar";
  trilhas: TrilhaNumero[];
  url: string;
};

export const ebooksAtemporais: EbookAtemporal[] = [
  {
    "numero": "01",
    "titulo": "Princípios e Discernimento",
    "subtitulo": "O que permanece quando precisamos escolher?",
    "resumo": "Uma investigação sobre valores, ética, critérios de decisão e responsabilidade no cotidiano da liderança.",
    "pergunta": "Que princípio deve continuar orientando suas escolhas mesmo em situações de pressão?",
    "categoria": "Volume da trilha",
    "trilhas": [
      "01"
    ],
    "url": "https://drive.google.com/file/d/1blmmqZRupmRdPt0E2bl0RwjA7ujcSpq7/view?usp=drivesdk"
  },
  {
    "numero": "02",
    "titulo": "Emoções e Autoconsciência",
    "subtitulo": "Reconhecer o que sentimos amplia nossas possibilidades de resposta.",
    "resumo": "Percepção emocional, escuta de si, relações humanas e escolhas que não dependem apenas do impulso.",
    "pergunta": "Que emoção merece ser compreendida antes de você decidir o próximo passo?",
    "categoria": "Volume da trilha",
    "trilhas": [
      "02"
    ],
    "url": "https://drive.google.com/file/d/1ohja2-zBQ84hD6FD6zFFXuVFtbjqqZBA/view?usp=drivesdk"
  },
  {
    "numero": "03",
    "titulo": "Autoconhecimento e Hábitos",
    "subtitulo": "Pequenas escolhas, mudanças que fazem sentido.",
    "resumo": "Observação de padrões, influência do contexto, autorresponsabilidade e experimentos cotidianos sem rótulos.",
    "pergunta": "Qual hábito você pode investigar sem confundir comportamento com identidade?",
    "categoria": "Volume da trilha",
    "trilhas": [
      "03"
    ],
    "url": "https://drive.google.com/file/d/1nYDv74vQBxk54NfV5S5E-4bv_c9uXXb8/view?usp=drivesdk"
  },
  {
    "numero": "04",
    "titulo": "Confiança e Colaboração",
    "subtitulo": "O que se torna possível quando construímos juntos?",
    "resumo": "Confiança, coerência, discordância respeitosa, acordos e capacidade de aprender com perspectivas diferentes.",
    "pergunta": "Qual atitude concreta poderia tornar uma conversa mais confiável?",
    "categoria": "Volume da trilha",
    "trilhas": [
      "04"
    ],
    "url": "https://drive.google.com/file/d/18PDh63-rAVCyoGsEDt_ATgE1W_xoImNr/view?usp=drivesdk"
  },
  {
    "numero": "05",
    "titulo": "Paradoxos da Liderança",
    "subtitulo": "Encontrar direção sem simplificar o que é complexo.",
    "resumo": "Tensões entre controle e autonomia, firmeza e cuidado, profundidade e velocidade, resultados e pessoas.",
    "pergunta": "Que dois valores legítimos precisam ser considerados na sua próxima decisão?",
    "categoria": "Volume da trilha",
    "trilhas": [
      "05"
    ],
    "url": "https://drive.google.com/file/d/1RjD3-qZnH1EAjlLz1v-VZKrhm2Iuus7Y/view?usp=drivesdk"
  },
  {
    "numero": "06",
    "titulo": "Resultados e Legado",
    "subtitulo": "O resultado importa. O como também.",
    "resumo": "Resultados sustentáveis, autonomia, cultura, critérios de continuidade e aquilo que permanece depois das metas.",
    "pergunta": "O que deve estar mais forte depois que seu trabalho estiver concluído?",
    "categoria": "Volume da trilha",
    "trilhas": [
      "06"
    ],
    "url": "https://drive.google.com/file/d/1h_za6cowBdAeUwowtrA7lAaYxfCWGzov/view?usp=drivesdk"
  },
  {
    "numero": "07",
    "titulo": "A Escuta que Abre Caminhos",
    "subtitulo": "Conversas difíceis podem ampliar a relação.",
    "resumo": "Escuta ativa, presença, coragem de conversar, limites e cuidado com diferentes perspectivas.",
    "pergunta": "O que você poderia compreender se escutasse antes de concluir?",
    "categoria": "Ensaio complementar",
    "trilhas": [
      "02",
      "04"
    ],
    "url": "https://drive.google.com/file/d/1DWHaajaBtAM2m7iTJG0v_O4AOj_I1ZzI/view?usp=drivesdk"
  },
  {
    "numero": "08",
    "titulo": "Inteligência Coletiva e Cultura Viva",
    "subtitulo": "O que construímos entre pessoas pode permanecer na cultura.",
    "resumo": "Pertencimento, acordos compartilhados, aprendizagem coletiva e continuidade para além das pessoas que iniciaram o processo.",
    "pergunta": "Que conhecimento ou decisão ainda depende de uma única voz?",
    "categoria": "Ensaio complementar",
    "trilhas": [
      "04",
      "06"
    ],
    "url": "https://drive.google.com/file/d/1JaAcAJMtT0Tzl8jM1CKr52vmRVgPLlKY/view?usp=drivesdk"
  },
  {
    "numero": "09",
    "titulo": "Presença e Discernimento na Mudança",
    "subtitulo": "Atravessar a transformação sem perder os princípios.",
    "resumo": "Liderança humana diante da mudança e da inteligência artificial: responsabilidade, ética, escuta e decisões contextualizadas.",
    "pergunta": "O que precisa continuar humano quando a tecnologia modifica a maneira de trabalhar?",
    "categoria": "Ensaio complementar",
    "trilhas": [
      "05"
    ],
    "url": "https://drive.google.com/file/d/11LSNi3tstEWeYIV9nb0rd9hYfWDEI_9L/view?usp=drivesdk"
  }
];

export function ebooksDaTrilha(trilha: TrilhaNumero): EbookAtemporal[] {
  return ebooksAtemporais.filter((ebook) => ebook.trilhas.includes(trilha));
}
