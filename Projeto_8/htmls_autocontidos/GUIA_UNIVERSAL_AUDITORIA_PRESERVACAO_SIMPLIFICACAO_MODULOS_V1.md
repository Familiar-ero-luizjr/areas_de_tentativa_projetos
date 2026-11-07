# Guia Universal de Auditoria, Preservação e Simplificação de Módulos

**Versão:** 1.0 — proposta de procedimento  
**Status:** Guia operacional proposto; não homologa automaticamente campos de um contrato JSON existente.  
**Aplicabilidade:** Qualquer módulo, motor, editor, visualizador, protótipo ou sistema, independentemente de nome, linguagem, plataforma ou tecnologia.

## 1. Objetivo

Estabelecer um procedimento reutilizável para analisar um módulo existente, **preservar integralmente seus resultados visuais e funcionais observáveis** e simplificar os **dados de entrada** e o **processamento interno** estritamente necessários para reproduzi-los.

Não pressupor nomes específicos de módulos, funcionalidades ou estruturas de pastas. O procedimento deve funcionar também para módulos futuros, com capacidades diferentes das atuais.

### Regra central

> Preservar o design, as funcionalidades, as interações, as movimentações, a responsividade e os comportamentos da versão de referência. Simplificar as entradas e o motor sem alterar resultados observáveis. Toda diferença deve ser registrada e submetida à aprovação explícita antes de ser considerada mudança intencional.

**Atenção:** a preservação integral é um objetivo e um critério de homologação; ela não pode ser declarada comprovada sem testes de equivalência.

## 2. Princípios obrigatórios

1. **Referência imutável:** manter uma cópia identificável da versão original durante a auditoria e implementação.
2. **Nenhuma exclusão presumida:** algo aparentemente redundante não pode ser removido sem verificar quem o utiliza.
3. **Análise por operações:** descobrir o que cada funcionalidade realmente lê, altera e produz antes de propor campos.
4. **Mínimo suficiente:** a entrada deve conter os dados que não podem ser obtidos com segurança de definições canônicas ou derivados deterministicamente.
5. **Definições por referência:** preferir IDs estáveis e referências a duplicações de dados, respeitando dependências e versionamento.
6. **Sem especialização por nome:** nomes dos módulos são parâmetros, nunca condições embutidas no motor universal.
7. **Separação de responsabilidades:** distinguir dados canônicos, configuração contextual, estado de execução e registro de operações.
8. **Consumo seletivo:** cada consumidor interpreta apenas os campos necessários à sua função.
9. **Preservação visual e comportamental:** considerar desktop, dispositivos móveis, estados alternativos e sequências de ações.
10. **Mudanças rastreáveis:** registrar proposta, justificativa, efeitos, teste e decisão de aprovação.

## 3. Escopo de preservação

A auditoria deve verificar **o que existe**, sem presumir que todos os módulos tenham todos os itens:

| Dimensão | Exemplos de aspectos a registrar |
|---|---|
| Visual | Hierarquia, layout, espaçamento, tipografia, cores, bordas, ícones, imagens, temas, estados visuais e breakpoints |
| Componentes | Estrutura, propriedades, instâncias, slots, reutilização e composição |
| Funcional | Menus, botões, formulários, filtros, comandos, atalhos, controles, importação e exportação |
| Interações | Clique, teclado, toque, foco, seleção, expansão, recolhimento, drag-and-drop e gestos |
| Movimentações | Arraste, soltura, reposicionamento, ordenação, zoom, pan, navegação, transições e animações |
| Estados | Inicialização, condições, mudanças de estado, variantes, fallback e recuperação de erros |
| Dados | Fontes, formatos, vínculos, persistência, valores de entrada e saída |
| Ambiente | Execução local, online/offline, navegadores, dispositivos e restrições técnicas |

**Não confundir:** a posição visual de um item em um editor com sua posição estrutural real. Só vinculá-las quando a funcionalidade original exigir.

## 4. Procedimento universal — passo a passo

### Etapa 1 — Inventariar

1. Receber o nome livre do módulo e a referência exata da versão a auditar.
2. Inventariar arquivos, dependências, formatos, tecnologias e pontos de entrada.
3. Identificar integrações, configurações e fontes de dados.
4. Registrar limitações conhecidas e condições de execução.
5. Congelar a referência para comparações posteriores.

**Saída:** inventário de origem e ambiente de referência.

### Etapa 2 — Capturar a referência visual

1. Abrir todas as áreas e estados visuais relevantes.
2. Registrar componentes, layout, dimensões, tipografia, cores, imagens e estilos.
3. Registrar comportamentos responsivos em tamanhos de tela representativos.
4. Capturar estados antes, durante e depois de interações visuais.
5. Identificar elementos que dependem de contexto, versão ou variante.

**Saída:** inventário visual e evidências comparáveis (capturas, descrições e configurações de teste).

### Etapa 3 — Capturar funcionalidades e comportamentos

1. Listar controles e ações disponíveis.
2. Identificar evento disparador, pré-condições, resultado esperado e efeitos colaterais.
3. Registrar fluxos de sucesso, erro, cancelamento e retorno.
4. Identificar efeitos no estado, na persistência ou em outros elementos.
5. Registrar atalhos, acessibilidade e respostas a teclado/toque quando presentes.

**Saída:** catálogo funcional por operação, sem omitir capacidades pouco visíveis.

### Etapa 4 — Capturar movimentações e interações espaciais

1. Mapear navegações e transições internas/externas.
2. Mapear drag-and-drop, reordenação, zoom, pan, rolagem, expansão e recolhimento quando existirem.
3. Registrar origem, destino, limites, condições, efeitos e persistência da movimentação.
4. Verificar movimentações em diferentes estados e tamanhos de tela.
5. Registrar resultados visuais e estruturais separadamente.

**Saída:** matriz de movimentações e seus resultados observáveis.

### Etapa 5 — Identificar as entradas reais

1. Localizar todo ponto no qual o módulo recebe dados (arquivo, JSON, propriedade, parâmetro, estado ou API).
2. Registrar campo, tipo, origem, valor de exemplo e consumidores efetivos.
3. Rastrear o uso de cada entrada até uma funcionalidade ou saída verificável.
4. Classificar os campos como **necessários**, **condicionais**, **deriváveis**, **redundantes candidatos** ou **não utilizados aparentemente**.
5. Marcar como **pendente** qualquer campo cujo uso não tenha sido comprovado ou descartado.

**Saída:** matriz `entrada → operação → efeito`.

### Etapa 6 — Rastrear dependências e responsabilidades

1. Identificar IDs, referências, versões, instâncias, hierarquia e vínculos.
2. Distinguir definição base, personalização local, estado transitório e contexto de execução.
3. Mapear cálculos e informações que podem ser derivados deterministicamente.
4. Detectar duplicações entre entradas, arquivos e seções.
5. Identificar dependências circulares, conflitos e falhas de resolução.

**Saída:** grafo de dependências e mapa de responsabilidades.

### Etapa 7 — Propor o contrato mínimo de entrada

1. Propor somente os campos essenciais à reprodução das operações existentes.
2. Reutilizar definições canônicas por referência quando houver identidade estável.
3. Manter dados opcionais apenas quando exigidos por uma capacidade real ou extensão aprovada.
4. Definir regras de valores padrão, ausência de campo, resolução de versão e fallback.
5. Registrar cada campo removido, derivado, unificado ou mantido e sua justificativa.
6. Verificar se o contrato preserva todas as capacidades inventariadas.

**Saída:** contrato mínimo proposto, com compatibilidade e rastreabilidade.

### Etapa 8 — Simplificar a implementação, quando necessário

1. Preservar a referência original sem alterações.
2. Isolar carregamento, resolução de referências, composição, atualização de estado e execução de operações genéricas, somente quando isso reduzir a complexidade efetiva.
3. Tirar regras específicas do código se puderem ser descritas declarativamente e validadas.
4. Evitar criar abstrações, camadas ou arquivos que não tragam simplificação demonstrável.
5. Garantir que o módulo continue aceitando as operações originais, diretamente ou por adaptação explícita.

**Saída:** implementação candidata e mapa de correspondência entre entradas antigas e novas.

### Etapa 9 — Comparar e testar equivalência

1. Executar os mesmos cenários na referência e na versão candidata.
2. Comparar visualmente telas, estados, dimensões e responsividade.
3. Comparar eventos, movimentações, navegações, estados finais e dados persistidos.
4. Executar sequências de múltiplas operações, não só ações isoladas.
5. Testar entradas inválidas, referências ausentes e condições de erro.
6. Registrar divergências e corrigir a implementação ou propor mudança explícita.

**Saída:** relatório de equivalência com evidências e regressões abertas/fechadas.

### Etapa 10 — Homologar e documentar

1. Confirmar cobertura do inventário funcional e visual.
2. Revisar todas as divergências e aprovações explícitas.
3. Publicar o contrato de entrada e as regras de compatibilidade.
4. Atualizar documentação de manutenção e testes.
5. Identificar a versão homologada e preservar os artefatos comparados.

**Saída:** decisão documentada de homologação. Sem evidências suficientes, usar status **pendente**, nunca “preservação comprovada”.

## 5. Matriz universal por operação

Preencher uma linha para cada capacidade encontrada:

| Campo de registro | Pergunta |
|---|---|
| `operacaoId` | Qual operação foi identificada? |
| `acionamento` | O que dispara a operação? |
| `preCondicoes` | Em quais condições ela funciona? |
| `entradasLidas` | Quais dados são realmente consumidos? |
| `referencias` | Quais IDs, versões e relacionamentos são necessários? |
| `efeitosVisuais` | O que muda na interface? |
| `efeitosFuncionais` | Que ações, estados ou saídas são produzidos? |
| `movimentacao` | O que muda de posição, ordem, contexto ou destino? |
| `persistencia` | O que precisa ser salvo? |
| `alternativasErros` | Quais falhas, cancelamentos e fallbacks existem? |
| `camposDerivaveis` | Quais dados podem ser calculados de forma confiável? |
| `evidencia` | Como a operação foi observada/testada? |
| `status` | Confirmada, proposta, pendente ou divergente? |

## 6. Classificação dos dados

- **Obrigatório universal:** necessário para identificar e interpretar a definição em todos os consumidores relevantes.
- **Obrigatório por operação:** exigido somente quando determinada operação existe.
- **Condicional:** exigido quando uma condição ou recurso está ativo.
- **Opcional:** acrescenta informação sem ser pré-requisito para a operação básica.
- **Derivável:** obtido de outra informação estável e validada; não precisa ser armazenado repetidamente.
- **Redundante candidato:** aparentemente duplicado; só pode ser eliminado após análise de dependências e regressão.
- **Pendente:** ainda não se conhece com segurança sua necessidade.

A classificação deve vir de evidência do funcionamento, não apenas da aparência do arquivo.

## 7. Registro de auditoria — exemplo genérico

O objeto abaixo é **um formato de trabalho proposto para a auditoria**, não substitui nem altera um contrato JSON canônico preexistente.

```json
{
  "modulo": {
    "nome": "",
    "versaoOriginal": "",
    "referenciaOriginal": "",
    "ambiente": {}
  },
  "preservacao": {
    "visual": {},
    "funcionalidades": {},
    "interacoes": {},
    "movimentacoes": {},
    "responsividade": {},
    "estados": {}
  },
  "operacoes": [],
  "entradas": {
    "atuais": {},
    "necessarias": {},
    "condicionais": {},
    "derivaveis": {},
    "redundantesCandidatas": {},
    "pendentes": {}
  },
  "dependencias": {},
  "simplificacao": {
    "contratoProposto": {},
    "mapeamentoDeCompatibilidade": {},
    "alteracoesInternas": []
  },
  "validacao": {
    "cenarios": [],
    "comparacoes": [],
    "regressoes": [],
    "aprovacoes": [],
    "status": "pendente"
  }
}
```

## 8. Exemplos ilustrativos de inputs mínimos

Estes exemplos **não impõem** funções a qualquer módulo; são hipóteses a validar contra sua implementação original.

| Operação observada | Possíveis entradas mínimas |
|---|---|
| Renderizar elemento | Referência à definição, contexto necessário |
| Inserir instância | Referência à definição, ID da instância, pai, posição |
| Mover instância | ID da instância, novo pai, nova ordem/posição |
| Reordenar | Identificadores envolvidos e regra/posição resultante |
| Alterar propriedade visual | ID do alvo, propriedade e valor |
| Abrir menu | Identificador do menu, evento e estado pertinente |
| Navegar | Origem/contexto, evento, condições e destino |
| Selecionar variante | Referência e contexto que resolve a variante |
| Desfazer/refazer | Registro reversível da operação ou estados necessários à reversão |

Exemplo de comando **transitório**, separado da definição estável:

```json
{
  "operacao": "mover",
  "alvoRef": "instancia.exemplo",
  "destinoPaiRef": "contenedor.exemplo",
  "novaOrdem": 20
}
```

A execução de um comando pode modificar a definição persistida. O histórico operacional não precisa ser incorporado à definição canônica, salvo exigência explícita.

## 9. Critérios de homologação

Uma versão simplificada **não deve ser considerada equivalente** até verificar:

- [ ] Referência original e ambiente registrados.
- [ ] Inventário de todas as áreas e funcionalidades completado.
- [ ] Estados e variantes relevantes cobertos.
- [ ] Layout, visual e responsividade comparados.
- [ ] Interações e movimentações comparadas.
- [ ] Navegação e resultados das operações conferidos.
- [ ] Persistência, importação/exportação e erros conferidos, quando existirem.
- [ ] Cada campo eliminado ou derivado justificado e rastreado.
- [ ] Testes de regressão executados com evidências.
- [ ] Divergências resolvidas ou aprovadas explicitamente.
- [ ] Contrato, compatibilidade e manutenção documentados.

## 10. Artefatos esperados para cada módulo auditado

1. **Inventário de origem:** arquivos, ambiente, dependências e versão original.
2. **Registro visual:** design e estados que devem ser preservados.
3. **Inventário funcional:** operações, interações e movimentações observadas.
4. **Matriz de consumo de dados:** entrada → operação → resultado.
5. **Mapa de referências e dependências:** definição, instância, versão e contexto.
6. **Contrato mínimo proposto:** campos, obrigatoriedade e regras de derivação.
7. **Mapa de compatibilidade:** correspondência entre inputs anteriores e novos.
8. **Relatório de equivalência:** testes, capturas, divergências e aprovação.

## 11. Aplicação a múltiplos módulos

Para vários módulos, repetir as Etapas 1–10 individualmente e depois realizar uma análise transversal:

1. Identificar dados e regras comuns comprovadamente reutilizáveis.
2. Separar capacidades universais de capacidades específicas.
3. Definir serviços de resolução compartilhados somente onde houver ganho verificável.
4. Evitar fazer um consumidor depender de seções exclusivas de outro.
5. Validar o mesmo objeto canônico em mais de um consumidor, quando aplicável.
6. Manter campos de contrato ainda não decididos vazios ou pendentes, sem promover mocks e hipóteses a definições definitivas.

## 12. Limites e decisões em aberto

Este guia define o **método de trabalho**, não os nomes definitivos de chaves ou a implementação de um motor específico. Em particular, ainda exigem decisão fundamentada: estratégia de referência e versionamento, representação de HTML/CSS, regras de interação e navegação, compatibilidade de formatos, persistência e validação técnica. Essas decisões devem surgir das necessidades comprovadas dos consumidores, preservando a documentação canônica existente.

---

**Síntese:** primeiro documentar tudo o que o módulo faz e como se apresenta; depois identificar o mínimo de dados que permite reproduzir cada operação; por último simplificar sua implementação e demonstrar equivalência. **Não simplificar removendo capacidades.**
