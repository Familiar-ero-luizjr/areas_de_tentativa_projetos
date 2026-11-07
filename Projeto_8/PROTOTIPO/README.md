# AdvogadoJá — Laboratórios unificados V4

Uma única página `index.html` substitui os três HTMLs de entrada fornecidos. Ela apresenta duas opções dentro da mesma interface: **Cliente V3** e **Modular V2**.

## Execução

Na pasta extraída, execute `python -m http.server 8000` e abra `http://localhost:8000`.

É necessário HTTP local: os dados são carregados via `fetch`; abrir diretamente em `file://` não funciona de forma confiável.

## Organização

- `index.html`: único HTML da distribuição.
- `visualizador/style.css` e `visualizador/app.js`: casca e navegação unificadas.
- `visualizador/cliente_v3.css` e `.js`: apresentação e motor originais do Cliente V3.
- `visualizador/modular_v2.css` e `.js`: apresentação e motor originais do Modular V2.
- `conector/montador.js`: carrega modelos, telas e componentes por ID e monta o documento isolado do laboratório.
- `dados/manifest.json`: caminhos reais do catálogo; não há enumeração de telas dentro dos scripts dos motores.
- `dados/<laboratorio>/modelo.json`: dados gerais, configurações, jornadas, sequências, relações, mocks e documentação originalmente presentes em cada modelo.
- `dados/<laboratorio>/interface.json`: estrutura HTML da interface do laboratório original (sem HTML executável avulso) e CSS de origem de telas quando aplicável.
- `telas/<laboratorio>/<perfil>/<id>.json`: um JSON por tela, conservando integralmente a estrutura original (incluindo HTML/CSS de tela quando assim era definido).
- `componentes/modular_v2/<id>.json`: um JSON por componente do motor modular V2.

## Preservação / decisões

Os modelos de cada laboratório têm contratos diferentes. Telas de mesmo ID permanecem separadas por laboratório. O consolidado não inventa um novo contrato universal e não combina estados das duas simulações. Cada motor é executado em um iframe do mesmo `index.html`, evitando colisões de CSS, IDs DOM e listeners. Alternar de laboratório reinicializa apenas a sessão de execução daquele motor; a persistência local do Cliente V3 continua no próprio código legado.

O HTML de cada laboratório é reconstruído em memória pelo conector, sem criar outros arquivos `.html`. A fonte HTML original foi usada na extração, e o JS de cada motor não foi reescrito funcionalmente.

**Inventário:** Cliente V3: 33 telas; Modular V2: 5 telas, 29 componentes.
