# AGENTS.md — Projeto 5 (Advogado Já)

## Escopo e ordem de leitura
1. Ler [README](./README.md) e este documento.
2. Ler [README do Workspace V6](./AdvogadoJa_Workspace_Modular_V6/README.md) e [AGENTS do Workspace](./AdvogadoJa_Workspace_Modular_V6/AGENTS.md).
3. Antes de modificar um módulo, ler `modulos/<area>/<modulo>/README.md` e `AGENTS.md`.
4. Consultar `documentacao/` e os JSONs de `catalogo/` necessários ao trabalho.

## Arquitetura e contratos
- Trabalhar dentro de `Projeto_5/`, sem afetar os projetos 1–4.
- Cada módulo contém HTML, CSS, app, motor e auxiliares próprios. Não criar dependência de JS/CSS entre módulos ou uma pasta `nucleo/`.
- A única fonte compartilhada dos dados de tela/componente é `catalogo/indice.json` e os JSONs ativos de telas/componentes.
- `acervo_pendente/` é somente arquivo histórico. Não carregar nem transformar sem solicitação.
- `navegacao` identifica participações e entradas; `acoes` define efeitos, decisões e destinos. Ordem editorial não gera ação. Não reintroduzir `flow` nem coordenadas x/y nos JSONs de tela.
- Estados, dados, mocks, estrutura, estilos e componentes têm responsabilidades próprias; o menu/estilo base é reutilizado e variantes só modificam o necessário.
- Não criar segundo JSON mestre para cada motor. Projeções são derivadas.
- Modificações em contratos compartilhados exigem validação de conformidade dos consumidores. Código de um módulo não deve modificar código de outro.
- Importação por ID exige revisão e análise de impacto; registro ausente no pacote não implica exclusão.
- Herança visual entre jornadas não concede autorização. Não publicar segredos, credenciais ou dados pessoais reais.

## Testes e documentação
- Servir por HTTP a partir da raiz do Workspace; `file://` costuma bloquear fetch.
- `iniciar.py` é infraestrutura de arquivos e gravação validada, não um motor central.
- GitHub Pages só permite leitura estática; não prometer gravação persistente.
- Documentar claramente o que está implementado versus requisito futuro ou recomendação provisória.


## Navegação do Workspace

- O ponto de entrada oficial `Projeto_5/index.html` deve encaminhar diretamente ao módulo inicial (Catálogo), sem portal de cartões intermediário.
- O alias `AdvogadoJa_Workspace_Modular_V6/index.html` existe apenas para preservar links anteriores e deve apontar à mesma entrada.
- Cada módulo mantém seu **menu de navegação próprio** em `index.html` e estilos correspondentes em `style.css`. Não importar menu JS/CSS de outro módulo; manter destinos relativos válidos.
- Ao incluir/remover um módulo, revisar os menus locais e seus links, sem criar um componente de código global.
- Conferir navegação no celular: menu ☰ compacto, conteúdo da tela visível, foco de teclado, fechamento por Escape e clique fora.
