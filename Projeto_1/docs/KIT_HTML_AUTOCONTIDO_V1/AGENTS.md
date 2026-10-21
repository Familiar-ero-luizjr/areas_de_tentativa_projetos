# AGENTE CANÔNICO — HTML AUTOCONTIDO, MODULAR NA FONTE E AUTÔNOMO NA ENTREGA (V1)

## Missão
Sempre que a solicitação for **criar, alterar, explicar visualmente ou exportar um HTML** — aplicação demonstrativa, árvore de pastas, catálogo, fluxo, mapa, painel, formulário, módulo ou documentação interativa — projetar uma estrutura **compartimentalizada, rastreável, localizável, evolutiva e eficiente**. O tamanho do HTML final não é critério primário; **clareza, identidade estável, autonomia, busca eficiente e segurança na atualização** são.

## Regra máxima: DUAS CAMADAS
1. **Fonte editável e modular por artefato:** dados, esquema, estilos, componentes de interface, estados, comportamentos, buscas/índices, utilitários e integração são arquivos lógicos distintos **dentro da própria pasta de cada artefato**.
2. **Entrega:** compilar essas peças em **UM HTML executável e autocontido por artefato**, com CSS, JS, dados e imagens incorporados, abrindo via `file://`, sem CDN, backend, fetch de arquivo local, import de pacote remoto, fonts remotas ou arquivos comuns obrigatórios.

**Não confundir:** modularizar a fonte não significa entregar uma coleção dependente de CSS/JS externos. Se a solicitação exigir somente um HTML, entregue somente o compilado; mantenha a fonte por responsabilidade quando houver necessidade de revisão posterior. **Não utilizar uma pasta `compartilhado/` como runtime entre módulos.** A mesma estrutura pode ser repetida em módulos autônomos; não reutilizar um motor global por dependência obrigatória.

## Antes de implementar
- Classificar o tipo: `arvore`, `modulos`, `aplicacao`, `fluxo` ou `outro`.
- Inventariar insumos, conteúdo, relações, estados, ações reais e limitações (nunca inventar telas, arquivos, rotas, registros, campos ou conexões sem identificá-los como exemplos).
- Escolher IDs estáveis; definir schema/versionamento e formato de importação/exportação.
- Desenhar a árvore lógica de dados e a estrutura visual separadamente.
- Respeitar o design/regras explícitos do usuário. Alterar somente o escopo pedido.

## Contrato mínimo das fontes por artefato
```text
<nome>/
  projeto.json                 # identidade, modo, versão, ordem de compilação
  dados/conteudo.json          # fonte canônica, IDs estáveis, relacionamentos e valores
  estilos/tema.css             # tokens e layout do artefato
  interface/estrutura.html     # esqueleto sem dados embutidos manualmente
  comportamentos/app.js        # inicialização, render, busca, ações e persistência
  saida/<nome>.html            # artefato final, sem dependências de runtime
```
Subdividir `comportamentos/` e `estilos/` em arquivos menores por responsabilidade, mantendo a ordem explicitamente definida em `projeto.json`. Não criar arquivo vazio só para parecer modular.

## Contrato dos dados
- Guardar conteúdo estruturado em **JSON canônico**, separado das strings de HTML e do CSS; permitir atualização por ID sem reconstrução manual de telas.
- Cada registro: `id` único e imutável, `parentId` quando hierárquico, `titulo`, `tipo`, `descricao`, `campos` e `palavrasChave` apenas quando aplicáveis.
- Metadados distintos de dados operacionais: `schema`, `versao`, `titulo`, `modo`, `itens`.
- Relações referenciam IDs, nunca posição em array; detectar IDs duplicados, pais inexistentes, ciclos e campos inválidos.
- Dados não devem ser espalhados por templates, handlers e CSS; a interface projeta o estado a partir da fonte.
- Importar/exportar com validação, sem apagar silenciosamente dados fora do escopo. Não fazer `eval` de conteúdo.

## Regiões e responsabilidades (contrato lógico)
- `APP`: identidade, layout geral, navegação e semântica responsiva.
- `DADOS`: schema, registros, relações, defaults, importação e exportação.
- `VISUAL`: temas, acessibilidade, cabeçalho, área principal, detalhe e modais.
- `COMPONENTES`: árvore, itens, cards, filtros, formulários, controles.
- `ESTADO`: estado transitório e persistência local com chave por artefato.
- `BUSCA`: normalização, indexação, filtros e navegação de resultados.
- `ACOES`: comportamento de botões, atalhos, validações, mudanças de estado.
- `INICIALIZACAO`: conferência do payload, criação de índices, montagem de listeners.

**Seções identificáveis:** arquivos fonte com nomes explícitos e comentários de seção `@REGIAO` quando necessário. Não misturar renderização, mutação dos dados, CSS e acesso a armazenamento na mesma função.

## Desempenho necessário, não prometido
**Organização ajuda manutenção, mas NÃO garante busca rápida.** A implementação deve de fato:
- Indexar IDs (`Map`), parentIds e textos normalizados; evitar buscar IDs percorrendo toda a coleção.
- Montar ramos de árvore apenas quando abertos; não montar milhares de DOM nodes no carregamento.
- Limitar lotes/resultados apresentados em pesquisas longas, com paginação/mostrar mais, preservando contagem.
- Usar debounce e, se aplicável, buscas chunked/worker para payloads grandes.
- Evitar recomputar CSS/HTML e reformatar payload completo em cada interação.
- Se o conteúdo for gigantesco, avaliar compressão *embarcada* com descompressão sob demanda e índice de busca; testar suporte offline real.
- Medir qualidade real com dados equivalentes ao volume de produção antes de afirmar desempenho.

## Segurança e qualidade
- Renderizar textos do usuário com `textContent`/escaping; nunca interpolar dados não confiáveis em `innerHTML` sem sanitização.
- Respeitar acessibilidade: labels, teclado, `aria-*`, foco de modais, contraste, estados vazios e mensagens de erro.
- Responsividade mobile-first sem destruir navegação desktop.
- Ações simuladas devem ser indicadas como simuladas. Não afirmar persistência em backend quando houver só `localStorage`.
- `script[type="application/json"]` deve embutir JSON seguro (escapar `<`, `>`, `&`, U+2028/U+2029); código JS executável vem separado desse bloco.
- Evitar recursos externos não consentidos e não embutir credenciais ou dados sensíveis reais.

## Regras para HTML autocontido
- Uma cópia única contém tudo necessário para exibir o próprio artefato; nenhuma chamada HTTP obrigatória ou arquivo local obrigatório.
- Tudo interno é identificado e procurável por seção/função/ID; ter um HTML grande **não** justifica um monobloco indecifrável.
- Dados e lógica devem ser substituíveis independentemente na fonte; a compilação deve ser determinística.
- Para imagens/arquivos reais necessários, incorporar `data:` URIs ou SVG seguro na compilação; se proibitivo, avisar e negociar explicitamente outra modalidade.
- Falha de dados deve ser exibida como erro explicativo sem destruir a interface.

## Manutenção de artefatos existentes
1. Ler `projeto.json`, schema e fonte, localizar função/estado/componente pela responsabilidade.
2. Editar apenas arquivo(s) fonte de responsabilidade relevante.
3. Manter IDs, seletores e comportamento existentes, salvo mudança pedida.
4. Recompilar HTML final, validar JSON, links, sintaxe e comportamentos.
5. Reportar o que foi alterado, o que ficou intacto e limites conhecidos.

## Critérios objetivos de aceite
- [ ] Um HTML final por artefato, executável totalmente offline em `file://`.
- [ ] Cada artefato não importa ou depende do código de outro.
- [ ] Dados possuem schema e IDs estáveis; validação de referências.
- [ ] Busca/índices não dependem de procurar conteúdo em milhares de DOM nodes.
- [ ] Hierarquia não materializa toda a árvore de uma vez.
- [ ] Controles funcionam, não são ornamentais.
- [ ] Layout responsivo e teclado utilizável; estado vazio/erro tratado.
- [ ] Sem referências externas obrigatórias, sem segredos e sem dados inventados apresentados como reais.
- [ ] Fonte e HTML estão sincronizados (gerar novamente e comparar o build).
- [ ] Testado no navegador, incluindo cenário grande quando aplicável.

## Padrões de comando
No pacote que acompanha este AGENTS.md: `CRIAR_HTML.cmd exemplos\arvore-repositorio`, `CRIAR_HTML.cmd exemplos\catalogo-modulos` ou `python ferramentas/gerar_html.py <pasta_do_artefato>`.
O comando é um **compilador de exemplo** (árvore/cards/painel), não substitui o agente em aplicações especializadas. Para fluxos, mapas ou apps específicos, adapte os arquivos de cada artefato e preserve estas regras.
