# Projeto 7 — Checklist de execução e homologação

**Versão:** 1.0  
**Data-base:** 2026-11-05  
**Estado:** planejamento aprovado parcialmente; **nenhuma reorganização aplicada ao ZIP original**.  
**Documento complementar:** `PROJETO_7_CONTROLE_CONTEXTO_REGRESSAO.md`.

## 0. Convenções de acompanhamento

- `[ ]` Pendente; `[x]` realizado e verificado; `[~]` em execução (substituir por `[ ]` ou `[x]` ao finalizar).
- **DECIDIDO** significa aprovado na conversa, não necessariamente implementado.
- **IMPLEMENTADO** exige arquivos atualizados, evidência e testes.
- Cada lote deve ter identificação (`L001`, `L002`, etc.), escopo, arquivos afetados, testes e possibilidade de reversão.
- **Não inventar conteúdo de tela, contrato, componente ou banco.** Lacunas devem ser registradas.

## 1. Decisões de arquitetura já aprovadas (não reabrir sem mudança explícita)

- [x] Manter as oito pastas de módulos: `audit/`, `catalog/`, `database/`, `flow/`, `generator/`, `map/`, `master/`, `prototype/`.
- [x] Módulos independentes, com contratos compartilhados e responsabilidades próprias.
- [x] JSON por tela no catálogo como fonte canônica das informações necessárias aos motores.
- [x] Manter os **17 campos de primeiro nível atualmente presentes nas telas**, ampliando-os progressivamente em vez de redesenhar o formato.
- [x] `identidade.id` como autoridade canônica do contrato.
- [x] Cada tela autocontida: definições dos seus componentes, seus estados e configurações **dentro do JSON da tela**; repetição entre telas é permitida.
- [x] Mesmo componente lógico mantém o mesmo ID entre telas; instâncias devem possuir ID próprio no contexto de uso.
- [x] Primeiro organizar e utilizar o catálogo existente; aprimorar campos e motores em fases posteriores.
- [x] Trabalhar por etapas, preservando o original, com validação antes de substituir artefatos.

## 2. Baseline verificável — ZIP recebido

- [x] Arquivo analisado: `Projeto_7.zip`.
- [x] SHA-256 do ZIP original: `6a9df96edf4d9197d72ca6007e2e087fbbad3878d3291cba5cd0135223d2a329`.
- [x] 125 JSONs em `catalog/catalogo/`; todos puderam ser carregados como JSON.
- [x] 98 contratos com `identidade.tipo = tela` e `schemaVersion = 0.3.0`.
- [x] 19 contratos com `identidade.tipo = componente` e `schemaVersion = 0.3.0`.
- [x] 8 contratos com `identidade.tipo = componente` sem `schemaVersion` de primeiro nível (família diferente; examinar antes de normalizar).
- [x] 125 IDs internos distintos, sem colisões exatas.
- [x] 125/125 nomes físicos diferem de `identidade.id + '.json'`.
- [x] Três IDs sem nome físico correspondente: `admin.administradores`, `admin.administrador_detalhe`, `cabecalho.app.resumido`.
- [x] Três nomes físicos sem ID interno correspondente: `catalogo`, `catalogo_modular_completo_v03`, `popup.status-toast.v01`.
- [x] O `prototype/` ainda possui documentação identificada como **Projeto 6**; requer atualização contextual controlada, sem eliminar seus laboratórios.
- [x] O README raiz explica que a divisão dos módulos não constituiu refatoração do JavaScript interno; os HTMLs retêm código compartilhado e usam a chave `advogadoja.contrato-vivo.v1` no `localStorage`.

## 3. L001 — Inventário e rastreabilidade (primeiro lote de execução)

- [ ] Gerar inventário por arquivo: caminho atual, tipo de contrato, `identidade.id`, versão, `localizacao.arquivoContrato` quando presente, SHA-256 do arquivo e destino proposto.
- [ ] Registrar conexões e referências internas a IDs, nomes físicos e caminhos.
- [ ] Identificar os oito componentes com estrutura distinta e verificar como se conectam às telas.
- [ ] Classificar as três exceções de IDs e as três de nomes físicos; não presumir exclusão ou substituição.
- [ ] Gerar **plano de movimentos**, sem aplicar alterações ao original.
- [ ] Confirmar como a organização física tratará contratos de componentes independentes já existentes: conservar como modelos/fonte de criação ou outro papel, sem torná-los dependência obrigatória de montagem de tela.
- [ ] Revisar o inventário antes de executar a migração.

**Saída esperada:** tabela completa de correspondência + relatório de referências + plano reversível de migração.

## 4. L002 — Alinhamento seguro do catálogo

- [ ] Criar cópia de trabalho; nunca operar no ZIP original.
- [ ] Fixar `identidade.id` como chave lógica de cada contrato.
- [ ] Resolver colisões de nomes com montagem em diretório temporário **vazio**, não renomeações sequenciais sobre arquivos ocupados.
- [ ] Ajustar caminhos e índices de localização **apenas** conforme o mapeamento validado.
- [ ] Preservar integralmente os dados dos 125 contratos; alterações de conteúdo exigem diff justificado.
- [ ] Definir/gerar índice derivado `identidade.id -> arquivo`, sem convertê-lo em segunda fonte de verdade.
- [ ] Verificar a capacidade de reconstruir o índice automaticamente.
- [ ] Comparar contagens, IDs e hashes dos conteúdos não modificados.
- [ ] Auditar referências quebradas, duplicadas e resolvidas.
- [ ] Exportar pacote de teste e relatório de migração; homologar antes de substituir.

**Critério de aceite:** nenhum ID perdido ou duplicado; nenhuma tela trocada; referências resolvidas ou pendências explicitamente classificadas; original intacto.

## 5. L003 — Componentes autocontidos por tela

- [ ] Inventariar os arrays existentes `componentes.definicoesEmbutidas` e `componentes.instancias`.
- [ ] Para cada tela, identificar componentes definidos localmente e dependências externas atuais.
- [ ] Garantir que cada componente necessário à montagem da tela esteja descrito no próprio JSON da tela.
- [ ] Usar identidade de componente compatível com o padrão de identidade da tela, mantendo ID técnico e nome textual.
- [ ] Garantir IDs de instância distintos quando um componente se repete na mesma tela.
- [ ] Preservar múltiplos estados sob o mesmo ID do componente e relacionar seleção de estado à instância/condições existentes.
- [ ] Não presumir que componentes com o mesmo ID tenham bytes idênticos: sinalizar diferenças para revisão.
- [ ] Testar telas com um componente, vários componentes, instâncias repetidas e estados diferentes.

**Critério de aceite:** tela renderizável a partir de seu JSON, sem buscar definições obrigatórias de componentes em arquivos alheios.

## 6. L004 — Organizar `master/` sem reescrever a lógica

- [ ] Inventariar interface, scripts, estilos, dados embutidos, importação/exportação e persistência atuais.
- [ ] Propor árvore interna separando interface, código e dados próprios; preservar `index.html` como entrada se aplicável.
- [ ] Confirmar que o Master **edita/valida os contratos do catálogo**, sem criar cópia paralela autoritativa das telas.
- [ ] Registrar responsabilidades do Master e limites frente a cada motor em `AGENTS.md`.
- [ ] Migrar apenas por lotes verificáveis, garantindo equivalência funcional.
- [ ] Testar edição, importação, exportação, referências e comportamento offline.

## 7. L005–L010 — Demais módulos, individualmente

- [ ] `catalog/`: consumo do catálogo, visualização e montagem usando JSONs próprios; checar origem dos dados e fallback.
- [ ] `flow/`: ler navegação, estados, ações, interações e referências; não inferir conexões inexistentes.
- [ ] `map/`: ler classificação e navegação e representar estrutura prevista, sem manter segundo catálogo manual.
- [ ] `prototype/`: renderizar componentes embutidos, estados, variantes, interações e mocks; conservar os dois laboratórios legados até equivalência comprovada; corrigir referências documentais ao Projeto 6 na fase de migração.
- [ ] `database/`: consumir dados, fontes, vínculos, operações e persistência especificados no JSON; reportar campos não modelados, sem inventar schemas.
- [ ] `generator/`: produzir artefatos a partir dos blocos do contrato; registrar entradas, saídas e versões.
- [ ] `audit/`: validar identidade, referências, completude declarada, estrutura e regressões; alertar sem alterações automáticas.

**Regra de conclusão por módulo:** funciona isoladamente + lê o contrato pretendido + funções existentes preservadas + testes documentados.

## 8. Ampliação posterior dos 17 campos (não bloquear a organização inicial)

- [ ] `schema` / `schemaVersion`: normalizar versões, com migração explícita.
- [ ] `identidade`: integridade e nomes textuais.
- [ ] `classificacao`: perfis, domínio e papéis sem confundir exibição e autorização.
- [ ] `navegacao`: entradas, saídas e condições conhecidas.
- [ ] `estados`: seleção, fallback e estados de componentes.
- [ ] `acoes` / `interacoes`: vínculos e efeitos definidos.
- [ ] `dados`: campos, fontes, operações, vínculos e persistência comprovados.
- [ ] `componentes` / `estrutura`: definições embutidas, instâncias e montagem.
- [ ] `estilos` / `variantes`: regras visuais e variações.
- [ ] `mocks`: cenários de teste separados dos dados de produção.
- [ ] `localizacao`: caminhos coerentes após migração.
- [ ] `proveniencia`: origem e decisões rastreáveis.
- [ ] `politicas`: interpretação e validação determinísticas.

## 9. Checklist obrigatório de regressão em qualquer lote

- [ ] ZIP original continua preservado, com hash registrado.
- [ ] Lista de arquivos adicionados, removidos, movidos e editados anexada ao lote.
- [ ] Nenhuma identidade duplicada, perdida ou alterada sem aprovação explícita.
- [ ] Contratos continuam sendo JSONs válidos.
- [ ] Referências internas e caminhos auditados; pendências expostas.
- [ ] Nenhum componente ou estado perdido durante a montagem.
- [ ] Importação/exportação preserva conteúdo, sem perdas silenciosas.
- [ ] Módulos não dependem de arquivos de outro motor para executar sua função, exceto contratos compartilhados acordados.
- [ ] Navegação do hub, links relativos e inicialização offline verificados.
- [ ] Testados cenários fixos, condicionais, fallback e erros (quando implementados).
- [ ] Documentados riscos, testes executados, testes não executados e resultado.
- [ ] Existe procedimento de rollback (restaurar o ZIP/cópia pré-lote).

## 10. Registro operacional — preencher a cada entrega

| Lote | Escopo | Estado | Artefato | Testes/evidência | Pendências |
|---|---|---|---|---|---|
| L000 | Decisões, inspeção e documentos de controle | Documentado; sem migração | ZIP original + 2 MDs | Inventário inicial do ZIP | L001 ainda não executado |
| L001 | Inventário detalhado e plano de alinhamento | Pendente | — | — | — |

**Próxima ação única:** executar o **L001** em modo somente leitura e apresentar o mapeamento completo antes de modificar os arquivos do catálogo.
