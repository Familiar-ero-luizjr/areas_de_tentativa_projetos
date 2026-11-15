# Protótipo modular — AdvogadoJá

Origem congelada: `prototipo_autocontido.html` fornecido pelo usuário.

## Estrutura
- `PROTOTIPO/index.html`: menu e área central (HTML e CSS próprios); sem JSON ou motor compartilhado.
- `campos_utilizados/`: consulta da estrutura e exemplos de valores declarados.
- `prototipo_interativo/navegacao_livre/`: simulador em modo livre.
- `prototipo_interativo/apresentacoes_jornadas/`: simulador e seus roteiros, bifurcações e apresentação.

Cada submódulo contém `index.html`, `motor.js` e `documento.json`. Cada `documento.json` contém uma cópia local autossuficiente dos recursos de tela necessários. O menu principal lê **somente** o catálogo de jornadas do JSON local de Apresentações para gerar a navegação; os submódulos não consomem arquivos uns dos outros.

## Execução
Extraia o ZIP e, na pasta que contém `PROTOTIPO/`, execute `python -m http.server 8000`. Abra `http://localhost:8000/PROTOTIPO/`.

A leitura por `fetch` de `documento.json` geralmente é bloqueada ao abrir diretamente por `file://`. Não há serviço remoto, CDNs ou dependências de rede externa.

## Preservação e escopo
- Preservados o HTML/CSS do protótipo fornecido, HTML/CSS do simulador interno, seus 63 registros de tela, os 12 roteiros de apresentação, 5 cenários simulados, ações, ramificações e estados declarados.
- Cada modo tem motor e JSON **locais**, sem dependência de pasta irmã.
- Alterações de layout limitam-se ao encaixe do frontend original dentro do shell do módulo, ocultando a navegação interna redundante.
- Não aplicado o recorte de 6 telas do módulo Fluxo: aqui o escopo é o protótipo originalmente fornecido.
- Não houve inclusão de funcionalidades ou rotas inferidas.
