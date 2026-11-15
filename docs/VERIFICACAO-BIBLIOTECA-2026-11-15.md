# Biblioteca Atemporal — verificação técnica e visual
**Data:** 15/11/2026

## Situação confirmada
- **Render:** serviço `biblioteca-atemporal-web` em plano Free, não suspenso, último deploy `dep-dbt21blg1s2s738huc7g` em estado `live`.
- **Inicialização:** logs do Render mostraram `Next.js Ready`, porta `10000`, e disponibilidade do endereço primário.
- **URL:** https://biblioteca-atemporal-web.onrender.com/
- **Acesso pela ferramenta externa desta revisão:** indisponível por falha de resolução DNS. Isso **não demonstra** falha do aplicativo ou que o Render esteja dormindo.
- **Navegação:** as seis trilhas foram examinadas no código. Destinos de alguns links são criados por componentes de caderno/bibliografia, por isso a ausência do ID no arquivo de página não significa link quebrado.
- **Trilha 04:** a chamada de livros foi alinhada à seção `#livros`; o componente interno também contém `#livros-referencias`. Os dois são destinos válidos.
- **Autenticação e permissões:** sem mudança nesta verificação.

## Procedimento obrigatório quando Biblioteca não abrir
1. Tentar uma requisição HTTP à URL pública para despertar instância Free.
2. Consultar `get_service` e último deploy do Render: identificar serviço suspenso, implantação com erro, inicialização ou `live`.
3. Conferir logs recentes: eventos de inicialização, `Ready`, falhas de build ou runtime.
4. Repetir o acesso depois de iniciar o serviço. Caso a ferramenta não consiga resolver o domínio, distinguir **falha DNS do ambiente de verificação** de indisponibilidade do Render.
5. Evitar novo deploy ou mudanças de serviço sem evidência. Não modificar contas, permissões ou dados apenas para acordar o serviço.

## QA visual ainda pendente
A validação por navegador desktop/mobile **não foi concluída**, porque o domínio não resolve no ambiente de verificação. Conferir com navegador funcional:
- Larguras 360, 390, 768, 1280 e 1440 px.
- Corte de fotografias oficiais e legibilidade dos títulos em seis trilhas.
- Navegação do cabeçalho e menus em celular.
- Tabela rolável e formulários de permissões.
- Controles de progresso e caderno, sempre com conta autorizada.
- Botões de links internos, incluindo os que entram em componentes dinâmicos.
- Contraste e campos focados por teclado.

## Escopo
Apenas o projeto Biblioteca Atemporal no Render. O WordPress institucional, conteúdos autorais, banco de dados, usuários e permissões não foram alterados.
