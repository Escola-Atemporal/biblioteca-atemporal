# Referências visuais oficiais — Biblioteca Atemporal

**Diretriz editorial obrigatória (10 de novembro de 2026):** antes de alterar ou criar uma página, revisitar as páginas correspondentes de [escolaatemporal.com.br](https://escolaatemporal.com.br/) e usar exclusivamente fotografias, imagens, ilustrações e padrões institucionais com origem verificável. **Não inventar fotografias, não criar fotos com IA e não substituir imagens por bancos genéricos.**

## Acervo visual verificado

O registro de URLs, tipos de arquivo, procedência e página institucional de referência está em [data/origens-visuais.json](./data/origens-visuais.json). As páginas oficiais consultadas incluem:

- [Página inicial da Escola](https://escolaatemporal.com.br/)
- [Princípios Norteadores](https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/)
- [Nossa Metodologia](https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/)
- [Emoções em Jogo](https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/emocoes-em-jogo-lp/)
- [Artigo sobre consciência emocional](https://escolaatemporal.com.br/blog/consciencia-emocional-lideranca-gatilhos-decisoes/)
- [O preço da coerência](https://escolaatemporal.com.br/blog/principios-lideranca-preco-coerencia/)

As duas fotografias adicionadas à **Trilha 02** foram encontradas no HTML oficial da página *Emoções em Jogo*:

- `DSC9619-1024x681.jpg` — URL completa registrada no catálogo.
- `DSC9502-1024x681.jpg` — URL completa registrada no catálogo.

A Trilha 02 utiliza ainda a arte original `hero.png` e a arte `emocao-e-informacao.png`, da mesma página. As capas e imagens da Trilha 01 foram verificadas nas páginas institucionais e artigos correspondentes.

## Política para todas as próximas trilhas

1. **Verificar primeiro:** localizar a fotografia, o arquivo ou a arte em página oficial da Escola; não deduzir que uma imagem é oficial pela aparência.
2. **Registrar:** acrescentar o arquivo exato e a página de procedência em `data/origens-visuais.json`.
3. **Usar sem alterar o sentido:** preferir a URL original hospedada pela Escola, o corte publicado oficialmente e texto alternativo factual. Nunca inventar pessoas, situações, eventos ou descrições que a imagem não comprova.
4. **Respeitar os direitos:** a presença no site institucional não torna uma imagem de domínio público. Reutilizar dentro dos projetos autorizados, mantendo a fonte e sem redistribuir arquivos de terceiros.
5. **Vídeos de terceiros:** miniaturas oficiais do YouTube são permitidas exclusivamente para links dos vídeos efetivamente citados, identificadas como prévias de seus canais — **não** são fotografias da Escola.
6. **Quando não houver imagem oficial adequada:** utilizar tipografia, cores, formas geométricas e texturas **já presentes na identidade**, ou apresentar o conteúdo sem fotografia. **Não gerar imagens substitutas.**
7. **Escopo de alterações:** somente o repositório e o site Biblioteca Atemporal, exceto quando o usuário pedir explicitamente alterações no WordPress.

## Verificação automática

O comando `npm run check:imagens` verifica arquivos TS/TSX/CSS e impede a compilação quando encontra novas URLs de imagens não registradas, imagens externas ou caminhos locais sem fonte. O comando é executado também pelo `npm run build`, por meio do `prebuild`, tanto no GitHub Actions quanto no Render.

**Limite do verificador:** não é uma prova de direitos autorais, não substitui a checagem visual humana, e URLs construídas dinamicamente podem exigir revisão manual. A logo responsiva do componente `BrandLogo.tsx` usa o arquivo oficial aprovado e suas variantes, documentadas no catálogo.

Essa diretriz se aplica a futuras revisões das seis trilhas e à página inicial da Biblioteca.
