# Sistema visual oficial — Biblioteca Atemporal

Atualizado em 12 de novembro de 2026.

## Fonte de verdade
- https://escolaatemporal.com.br/
- https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/
- https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/
- Capturas de referência e o Prompt Mestre de Identidade Visual Digital aprovados pela equipe da Escola.

## Essência
Profundidade com simplicidade; presença humana; inteligência coletiva; consciência e discernimento; coerência entre princípios, hábitos e resultados. Interface editorial, não LMS ou dashboard genérico.

## Tokens de interface
| Uso | Token |
|---|---|
| Fundo institucional | #101011 |
| Preto profundo | #090909 |
| Branco | #FFFFFF |
| Violeta principal | #634995 |
| Hover | #7859A9 |
| Lavanda | #C7B0E9 |
| Amarelo de apoio | #FFD309 |
| Cinza neutro | #D9D6DC |
| Fundo de leitura | #F8F7F9 |
| Texto em superfícies claras | #211C26 |

## Tipos
- Títulos de impacto: Bebas Neue, equivalentes condensadas aprovadas.
- Subtítulos: Montserrat Semibold/Bold.
- Leitura: Montserrat ou Roboto.
- Marcadores funcionais: Roboto Mono quando necessário.

## Composição
- Header preto, logomarca oficial, navegação clara.
- Hero com mensagem forte, contexto real e uma ação prioritária.
- Card somente onde existe função de agrupamento.
- Botão prioritário violeta com texto branco, foco perceptível.
- Conteúdo longo sobre superfície que favoreça leitura.
- Fotos somente do acervo oficial com fonte verificável; não inventar imagens.
- Diagramas conceituais: utilizar, preferencialmente, material original da Escola.
- Não criar estatísticas, casos ou citações fictícias.
- Conferir responsividade em 360, 390, 768, 1280 e 1440 px.

## Onde o sistema está implementado
- `vercel-app/app/institutional-design-2026.css`: capa e regras editoriais iniciais.
- `vercel-app/app/institutional-all-pages.css`: estilos compartilhados e ajustes de acabamento.
- `vercel-app/app/layout.tsx`: imports.
- `vercel-app/data/origens-visuais.json`: fontes de imagens aprovadas.
- Estilos específicos das trilhas permanecem ativos para respeitar sua narrativa.

## Regras de segurança e escopo
- Alterações de design **somente na Biblioteca Atemporal (Next.js/Render)**.
- Não alterar WordPress institucional, credenciais, funções, permissões, SQL, logs de acesso ou conteúdos editoriais durante mudanças exclusivamente visuais.
- Validar compilação e proveniência visual, e revisar visualmente desktop/mobile antes de declarar QA visual concluído.
- Não substituir imagens já aprovadas por fotos genéricas.
