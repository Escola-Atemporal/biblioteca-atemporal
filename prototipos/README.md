# Curadoria administrativa — protótipo não publicado

Esta pasta contém um **protótipo local de interface**, sem autenticação ou backend.

## Como testar

1. Abra `curadoria.html` localmente em um navegador (não é uma rota publicada no GitHub Pages).
2. Cadastre **apenas dados fictícios e não confidenciais** para testar a experiência.
3. O navegador mantém rascunhos locais via `localStorage`. O botão Exportar gera JSON no dispositivo.
4. Não há envio ao GitHub, ao Google Drive ou a um banco de dados.

## Importante

- O repositório GitHub é **público**. Não adicionar segredos, materiais de clientes ou fichas restritas aos arquivos deste repositório.
- Não existe login, aprovação real, sincronização, auditoria ou autorização por perfil neste protótipo.
- A fila é demonstrativa e **nunca** publica automaticamente.
- Não incluir este arquivo no diretório `_site` do workflow Pages.
- Quando existir um backend autenticado, desenvolver rotas privadas, autorização no servidor, audit log e validação de permissões antes de conectar esta interface a dados reais.

## Fluxo editorial a implementar

Inventariado → Curadoria interna → Validado para perfil específico → Publicado.

O registro `Publicado` deve exigir confirmação de autoria, licença, acesso técnico e duas validações: metodológica/editorial e de direitos, com responsáveis identificados. Na ausência dessas condições, manter o registro como não publicado.
