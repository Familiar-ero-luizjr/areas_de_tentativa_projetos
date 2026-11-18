# Projeto 9 — ambientes e documentação

Na versão descrita originalmente neste README, a página inicial `index.html` apresenta somente:
- Árvore modular de contratos (`arvore_modular_de_contratos/index.html`);
- Catálogo de IDs (`catalogo_de_ids/index.html`).

## Arquivos separados

O Catálogo de IDs foi dividido em `index.html`, `estilo.css`, `motor.js` e `documento.json`, extraídos do HTML original. A única adaptação operacional no motor é carregar o JSON local com `fetch` em vez do bloco embutido. O CSS e os dados JSON foram copiados integralmente, sem reserialização.

A Árvore modular de contratos já estava dividida; seus arquivos foram mantidos, inclusive `arvore.json.json`. O diretório `legado` original também foi mantido byte a byte para não remover material do arquivo enviado, mas não aparece no menu.

`Pastas_geradas_arvore_modular/` é somente armazenamento de ZIPs exportados e não está na navegação. Qualquer ZIP colocado ali será preservado, mas não aparecerá no index.

Abra em servidor HTTP local, por exemplo `python -m http.server 8000`, e navegue até `http://localhost:8000/`. A leitura de JSON com `fetch` não funciona de forma confiável via `file://`.


## Terceiro ambiente: Motor V4 (adicionado)

O Motor V4 foi incluído em `Motor_V4/index.html`, com os dados compartilhados fora do Motor em `Dados_Motor_V4/` e o catálogo em `docs/`. O ambiente original de árvore modular e o Catálogo de IDs foram mantidos. Consulte `README_MOTOR_V4.md` para detalhes de uso, contratos e exportação.

## Organização da documentação por área

Este README apresenta a estrutura geral e os ambientes do Projeto 9. Para as regras detalhadas de cada área do Motor V4, consulte [README_MOTOR_V4.md](README_MOTOR_V4.md), organizado em seções independentes:

1. Arquitetura e fontes de dados
2. Biblioteca e índice
3. Identidade de telas e componentes
4. Classificação e catálogo de jornadas
5. Estrutura visual (HTML/CSS declarativos)
6. Estados, variantes e capacidades
7. Interações, ações e navegação
8. Dados, persistência e mocks
9. Contratos mínimos de Tela, Fluxo e Protótipo
10. Visualização e simulação
11. Validação, importação e exportação

**Regra documental:** cada seção distingue o comportamento já descrito na implementação das propostas de evolução. Atualizar um README não significa que o JavaScript ou os arquivos de dados tenham sido migrados automaticamente.
