# AdvogadoJá — Módulo Fluxo / visualizacao_fluxo

**Revisão:** 19/11/2026 · **Origem:** `projeto_9.zip` / `modulos/fluxo/visualizacao_fluxo/` · **Escopo:** correções do motor e auditoria de conversão, sem alterar o documento de origem.

## 1. Contrato e isolamento

Este módulo trabalha com **seu próprio** `data/documento.json` (não consulta Jornadas, Protótipo ou outras pastas em execução). O contrato nativo contém exatamente as chaves de raiz:

```text
documento.json
├── tipo
├── versao
├── telas
│   └── <telaId>
│       ├── identidade / classificacao / estrutura
│       └── navegacao
│           ├── entradas
│           ├── saidas
│           ├── bifurcacoes
│           ├── caminhosLineares
│           ├── participacoes
│           ├── ocorrenciasEditoriais / apresentacoesBifurcacoes
│           └── demais metadados nativos existentes
└── componentes
    └── <componenteId>
```

`fluxo` e `catalogo` são estruturas **temporárias de edição na memória**, nunca adicionadas à raiz do JSON exportado. Os componentes e a composição visual são mantidos como no Projeto 9. Não se cria tela nova para representar estado, processo ou opção de menu.

## 2. Preservação e resultados da revisão

| Informação | No documento original | Nesta revisão |
|---|---:|---|
| Telas | 110 | preservadas |
| Componentes | 388 | preservados |
| Relações de `navegacao.saidas` | 163 | preservadas |
| Relações entre telas | 119 | **119 relações independentes por ID** |
| Saídas de estado/processo | 44 | preservadas e inspecionáveis no grafo |
| Agrupamentos que fundiam IDs diferentes | 13 referências antes agrupadas | **nenhuma fusão de identidades** |

As ações diferentes com a mesma origem e destino (ex.: criação de conta de cliente ou advogado) deixam de ser fundidas. O editor pode **agrupar visualmente por evento**, mas editar/desconectar opera sempre sobre a relação identificada.

A visualização mostra saídas de estado/processo em um bloco expansível junto à tela de origem; essas saídas não são tratadas como telas ou conexões para destinos inventados. Bifurcação condicional é diferenciada de opções de ações distintas.

## 3. Edição e exportação

- **Edição por ID:** atualizar uma relação altera apenas seu `navegacao.saidas[id]`, mantendo as outras relações.
- **Relações derivadas:** quando a relação muda, o exportador sincroniza espelhos `entradas` e os vínculos diretos em `bifurcacoes[].caminhos` / `caminhosLineares` que usam `relacaoRef`. Uma mudança de destino invalida explicitamente a participação contextual de destino (`destinoParticipacaoRef` / `destinoNoRef`), pois não é correto adivinhar outra participação.
- **Exclusão:** remover relação identificada retira sua saída e espelhos diretos relacionados, preservando as conexões independentes e os objetos editoriais que não foram selecionados.
- **Sem edição:** o teste de ida e volta (`normalize` → `portableDoc`) preservou integralmente o objeto nativo original, incluindo arrays, componentes, estados e metadados editoriais.
- **Importação rigorosa:** aceita contratos nativos com `tipo`, `versao`, `telas`, `componentes`. Rejeita explicitamente formatos V3 legados e campos extras desconhecidos na raiz quando não houver conversor validado sem perdas. Não elimina IDs desconhecidos silenciosamente.
- **IDs:** referências duplicadas tornam a importação inválida; destinos não resolvidos aparecem na validação e não recebem correção automática.
- **Simulação:** segue apenas relações declaradas; uma ação visual não pode impor um destino arbitrário no iframe sem correspondência na navegação do documento.

**Limite importante:** uma alteração no fluxo não autoriza deduzir regras de domínio, destino de API, dados de sessão ou associação com jornada/subjornada. Ao alterar o destino de uma relação, vínculos editoriais de ocorrência e sequência que dependam de contexto deverão ser revisados no caso concreto. O motor não promete atualizar automaticamente arquivos independentes fora deste módulo.

## 4. Arquivos

```text
visualizacao_fluxo/
├── index.html                 # editor
├── css/style.css             # CSS do editor
├── js/motor.js               # motor, editor e exportador do Fluxo
├── data/documento.json      # coleção completa ORIGINAL do Projeto 9
├── tests/fluxo_integridade.test.js  # testes Node (sem dependências externas)
├── TESTES_E_CONVERSAO.md     # cobertura e limitações comprovadas
└── README.md
```

## 5. Executar

Na raiz do Projeto 9 (a pasta que contém `modulos/`):

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000/modulos/fluxo/visualizacao_fluxo/index.html`. O módulo precisa de um servidor estático para carregar seu JSON; o ZIP não inclui um HTML autocontido duplicando os 10 MB de dados.

Para testar a lógica de conversão e edição:

```bash
node --check modulos/fluxo/visualizacao_fluxo/js/motor.js
node modulos/fluxo/visualizacao_fluxo/tests/fluxo_integridade.test.js
```

## 6. Política de aceitação

A revisão cobre a estrutura de arquivos, leitura, conversão sem edição e mudanças individuais de relações em testes automatizados. **Não significa que todos os percursos de negócio tenham sido homologados**, nem substitui testes funcionais da aplicação. A execução gráfica em navegador completo ainda requer validação no ambiente de integração; o teste de navegação automatizado foi impedido por restrição de acesso do navegador neste ambiente.
