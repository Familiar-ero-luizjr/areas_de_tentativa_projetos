# ESPECIFICAÇÃO MESTRE — CATÁLOGO FUNCIONAL DO ORGANIZADOR DE VIDA

> **Tipo de documento:** requisitos de produto, organização de informação e especificação do HTML de catalogação funcional.  
> **Produto:** Organizador de Vida.  
> **Versão do documento:** 1.0 — base para implementação e refinamento.  
> **Situação:** proposta de arquitetura do catálogo consolidada a partir das definições desta conversa; **não** representa inventário exaustivo e validado de todas as funcionalidades do aplicativo.  
> **Objetivo imediato:** construir um HTML autocontido, editável e navegável que permita descobrir, organizar, especificar e relacionar tudo o que o Organizador de Vida deve fazer, antes de produzir as telas finais em outra aplicação de design.

---

## 1. Visão executiva

O produto a construir **agora** não é o aplicativo final Organizador de Vida: é o **Catálogo Funcional Mestre**, uma ferramenta para documentar a definição funcional do aplicativo.

Sua finalidade é responder, de maneira rastreável:

1. **Quais módulos existem?**
2. **Quais páginas pertencem a cada módulo?**
3. **Quais funcionalidades pertencem a cada página?**
4. **Quais subfuncionalidades, comportamentos, campos, regras e estados pertencem a cada funcionalidade?**
5. **De quais páginas, funcionalidades e dados cada item depende?**
6. **Quais comportamentos são compartilhados entre módulos e quais são especializados?**
7. **O que já foi confirmado, o que está em levantamento e o que é apenas uma proposta?**
8. **O que falta especificar para ser possível implementar a aplicação com segurança?**
9. **Como exportar todo esse conhecimento em um JSON íntegro, legível e reutilizável?**

### Decisão principal

A interface deve seguir **navegação progressiva por profundidade**:

**Catálogo do produto → Módulo → Página → Funcionalidade → Subfuncionalidade → Especificação.**

Cada nível dá acesso ao próximo **sem exibir toda a hierarquia de uma vez**. Os relacionamentos são registrados à parte, associados por IDs estáveis, e podem atravessar módulos e níveis diferentes.

### O que este documento especifica

- Arquitetura de informação, terminologia e distinções entre conceitos.
- Navegação, comportamento visual e princípios de experiência de uso.
- Cadastro, edição, duplicação, ordenação, movimentação e exclusão.
- Profundidade de especificação funcional.
- Modelos universais e especializações por módulo.
- Relações, dependências e contratos de dados.
- Estrutura canônica do JSON, importação, exportação e versionamento.
- Critérios de qualidade, testes e plano de implantação da ferramenta.
- Exemplos, sobretudo Alimentação, Metas e Profissional.

### O que este documento NÃO pretende fazer

- Definir o design final de cada tela do aplicativo de produção.
- Afirmar que exemplos ilustrativos já são funcionalidades aprovadas.
- Decidir backend, banco, autenticação e infraestrutura final do aplicativo.
- Confundir o **editor de catálogo** com o aplicativo que será criado a partir dele.
- Inventar requisitos de módulos ainda não levantados.

---

## 2. Problema que o novo HTML precisa resolver

O HTML anterior apresentava simultaneamente lista de módulos, extensa árvore de páginas e funções, métricas, abas técnicas, relacionamentos e um inspetor distante do item selecionado. A proposta acumulava informações de naturezas diferentes em uma mesma superfície.

### 2.1. Diagnóstico dos principais problemas

| Problema observado | Consequência | Solução prescrita |
|---|---|---|
| Tudo aparece ao mesmo tempo | Sobrecarga cognitiva e pouca clareza | Apresentar um nível por vez |
| Módulos de vida e técnicos têm o mesmo peso visual | Confusão sobre responsabilidades | Separar por natureza/contexto |
| Páginas, funções e subfunções são visualmente parecidas | Dificuldade de entender hierarquia | Tipos explícitos, títulos e breadcrumbs |
| Inspetor aparece longe da seleção | Rolagem excessiva | Detalhe contextual na própria etapa ou painel próximo |
| Árvore cresce indefinidamente | Navegação e manutenção difíceis | Visão por nível + busca + filtros |
| Dependência e parentesco podem ser confundidos | Estrutura técnica incorreta | Modelar hierarquia e relação como conceitos separados |
| Modelos universais aparecem como termos abstratos | Dificuldade de compreender o reuso | Exibir funcionalidades herdadas e especializações reais |
| Status pouco elucidativos | Propostas podem parecer aprovadas | Status de decisão e de especificação distintos |
| Importação/exportação pouco orientadas | Risco de perda de dados | Prévia, validação, cópia de segurança e confirmação |
| Mobile tenta compactar o desktop | Baixa legibilidade | Navegação de uma coluna, ações contextuais |

### 2.2. Objetivo de usabilidade

Uma pessoa deve conseguir, sem treinamento técnico:

1. Abrir **Alimentação**.
2. Ver imediatamente as **páginas** do módulo.
3. Abrir **Receitas**.
4. Ver as **funcionalidades** da página.
5. Abrir **Cadastrar receita**.
6. Ler ou editar campos, validações, regras, estados, fluxos e dependências.
7. Voltar até qualquer ponto pelo caminho visível.
8. Exportar tudo para um JSON, sem perder referências.

A ferramenta deve comportar poucas páginas e também centenas delas sem exigir que o usuário leia uma árvore gigantesca.

---

## 3. Princípios obrigatórios

1. **Um foco por vez:** cada tela de trabalho deve dar prioridade ao nível selecionado.
2. **Profundidade quando necessária:** nenhum item precisa ter obrigatoriamente cinco níveis; a profundidade pode variar.
3. **IDs estáveis:** nomes e posições podem mudar sem invalidar relações.
4. **Hierarquia não é dependência:** estar dentro de uma página não equivale a depender dela operacionalmente.
5. **Modelo universal sem duplicação:** definição compartilhada fica em uma biblioteca central; módulo guarda referência e especialização.
6. **Escopo próprio por módulo:** um painel profissional não deve listar categorias exclusivas de Alimentação ou Financeiro.
7. **Separação entre definido e sugerido:** toda informação tem grau de validação e origem.
8. **Edição intuitiva:** adicionar, editar, mover, reordenar e remover devem estar acessíveis no contexto do item.
9. **Integridade referencial:** importação, movimentação e exclusão não podem deixar links silenciosamente quebrados.
10. **JSON como contrato portátil:** a versão exportada precisa permitir reconstruir todo o inventário e as relações.
11. **Acessibilidade e responsividade:** a ferramenta deve funcionar em celular e desktop sem texto minúsculo.
12. **Previsibilidade:** operações importantes devem oferecer prévia, confirmação quando destrutivas e feedback claro.
13. **Rastreabilidade:** cada decisão pode indicar fonte, justificativa e status de revisão.
14. **Neutralidade visual:** a ferramenta documenta funcionalidades; não força o design que será usado no produto final.
15. **Evolução controlada:** alterações de modelos compartilhados devem indicar quais módulos/páginas são afetados.

---

## 4. Vocabulário e modelo mental

**Produto:** Organizador de Vida, o sistema completo a ser construído.

**Contexto central:** conjunto de painéis que consolidam informações vindas de diferentes módulos; não deve ser confundido com um módulo de vida.

**Módulo:** domínio ou área funcional, por exemplo, Alimentação ou Profissional.

**Página:** local de navegação/experiência do aplicativo final, por exemplo, Receitas ou Cardápio. Uma página pode conter várias funcionalidades.

**Funcionalidade:** capacidade observável pelo usuário ou pelo sistema, por exemplo, cadastrar receita ou concluir atividade.

**Subfuncionalidade:** decomposição de uma funcionalidade em comportamentos menores, quando isso melhora a clareza; pode ter outras subfuncionalidades.

**Especificação:** descrição estruturada do comportamento e dos requisitos de um item, incluindo dados, regras, estados, ações, restrições, cenários e critérios de aceite. **Especificação não precisa ser um novo nível de navegação do aplicativo final.**

**Entidade/contrato de dados:** informação persistida ou transmitida, como Receita, Meta, Atividade ou Cardápio, com seus campos e relações.

**Taxonomia/subcategoria:** conjunto controlado de classificações que organiza registros, por exemplo, Reunião, Entrega ou Documentação no módulo Profissional. **Categoria não é automaticamente uma página.**

**Modelo universal:** definição de funcionalidade ou página comum, como Metas, Dashboard ou Painel de Atividades.

**Especialização:** regras, dados, componentes ou comportamentos próprios de um módulo sobre um modelo universal.

**Relacionamento:** vínculo entre dois itens identificados por IDs, como `usa`, `depende de`, `contribui para`, `navega para`, `especializa` ou `compartilha dados com`.

**Hierarquia:** vínculo de contenção/organização (pai/filho), separado dos relacionamentos operacionais.

**Origem/proveniência:** fonte de uma definição: decisão aprovada, HTML existente, código revisado, documentação, proposta, inferência a validar etc.

**Estado de definição:** nível de aprovação da ideia; diferente do estado de implementação em código.

---

## 5. Estrutura geral do Organizador de Vida

### 5.1. Contextos centrais

Os painéis transversais consolidados são:

- **Dashboard Geral:** indicadores e resumos intermodulares.
- **Painel de Atividades Geral:** atividades de múltiplos módulos, preservando a origem de cada registro.
- **Metas Geral:** visão integrada das metas vinculadas aos diversos módulos.

Devem ficar visualmente agrupados como **Painéis Gerais**, e não como um décimo módulo de vida.

### 5.2. Módulos de vida predefinidos

| # | Módulo | Situação de inventário neste documento |
|---|---|---|
| 1 | 🍽️ Alimentação | Há exemplos conhecidos; levantamento exaustivo pendente |
| 2 | ❤️ Saúde | Páginas específicas a levantar |
| 3 | 💰 Financeiro | Há exemplos/candidatos; levantamento exaustivo pendente |
| 4 | 💼 Profissional | Painel de Atividades e taxonomia conhecidos; demais páginas a levantar |
| 5 | 🧘 Espiritualidade | Páginas específicas a levantar |
| 6 | 🏠 Casa e Vida Doméstica | Páginas específicas a levantar |
| 7 | 🌿 Lazer e Bem-Estar | Páginas específicas a levantar |
| 8 | 🤝 Relacionamentos | Páginas específicas a levantar |
| 9 | ⚖️ Cidadania e Responsabilidades | Páginas específicas a levantar |

**Regra de arquitetura do aplicativo futuro:** Alimentação e Financeiro são módulos **fixos de tratamento técnico explícito**. Os demais módulos de vida devem seguir lógica **extensível/dinâmica**, mesmo quando aparecem como opções predefinidas de produto. Essa distinção é técnica e não deve tornar a interface do catálogo desigual.

### 5.3. Módulos personalizados

O catálogo admite módulos criados e configurados pelo usuário do editor. Um módulo personalizado pode conter páginas, funcionalidades, entidades, categorias e relações sem alterar a lista oficial de módulos fixos.

### 5.4. Áreas técnicas e estruturais

- Administração.
- Inteligência Artificial (IA).
- Integrações.
- Notificações.
- Usuário.
- Sistema.

Essas áreas devem ter **aba ou agrupamento próprios**, pois não representam áreas da vida.

### 5.5. Modelos transversais iniciais

A biblioteca universal começa com **Dashboard**, **Painel de Atividades** e **Metas**, mantendo a possibilidade de cadastrar outros modelos **somente após identificação real de reuso**.

**Atenção:** ter uma página com o mesmo nome em dois módulos não prova que tudo nela é idêntico. O contrato comum precisa ser explicitado; o restante é especialização.

---

## 6. Arquitetura de navegação progressiva

### 6.1. Fluxo principal

```text
CATÁLOGO DO ORGANIZADOR DE VIDA
│
├── Painéis Gerais
├── Áreas da Vida
│   ├── Alimentação
│   ├── Saúde
│   ├── Financeiro
│   ├── Profissional
│   └── ...
├── Módulos Personalizados
└── Áreas Técnicas

Selecionar: Alimentação
    ↓
PÁGINAS DO MÓDULO
    ├── Dashboard
    ├── Cardápio (Painel de Atividades)
    ├── Metas
    ├── Receitas
    └── Planejamento Alimentar

Selecionar: Receitas
    ↓
FUNCIONALIDADES DA PÁGINA
    ├── Cadastrar receita
    ├── Editar receita
    ├── Consultar receitas
    └── Selecionar receita

Selecionar: Cadastrar receita
    ↓
SUBFUNCIONALIDADES (QUANDO EXISTIREM)
    ├── Informar ingredientes
    ├── Definir quantidades/unidades
    ├── Registrar modo de preparo
    └── Validar e salvar

Selecionar: Validar e salvar
    ↓
ESPECIFICAÇÃO DO COMPORTAMENTO
    ├── Entradas e campos
    ├── Validações
    ├── Estados e exceções
    ├── Dados e integrações
    ├── Dependências
    ├── Regras e permissões
    └── Critérios de aceite
```

**A árvore acima é um exemplo conceitual de aprofundamento.** Nem todas as páginas/funcionalidades listadas estão aprovadas. Em particular, o desdobramento fino do cadastro de receita deverá ser validado no levantamento.

### 6.2. Breadcrumbs (caminho de navegação)

Exemplo:

`Organizador de Vida / Alimentação / Receitas / Cadastrar receita / Validar e salvar`

Regras:

- Cada trecho deve ser clicável, exceto o trecho atual.
- Voltar ao nível pai não perde alterações já salvas.
- Voltar não exclui nem altera vínculos.
- Nomes podem mudar; os IDs sustentam a navegação.
- A URL interna pode representar o item aberto, mas a estrutura de URL do **editor** não obriga a mesma rota no **aplicativo final**.

### 6.3. Comportamento de cada nível

| Nível | Conteúdo principal | Ações principais |
|---|---|---|
| Catálogo | Cartões/lista de módulos agrupados | Abrir, buscar, cadastrar módulo autorizado |
| Módulo | Lista de páginas e resumo do módulo | Criar, editar, reordenar página; ver relações |
| Página | Lista de funcionalidades e informações da página | Criar função, abrir detalhe, editar, mover |
| Funcionalidade | Subfunções, descrição, ações e vínculos | Detalhar, adicionar subfunção, editar, relacionar |
| Subfuncionalidade | Subníveis opcionais e requisitos particulares | Reordenar, aprofundar, documentar |
| Especificação | Formulário/seções estruturadas | Editar, validar, revisar, anexar referência |

### 6.4. Profundidade flexível

Uma funcionalidade simples pode ir diretamente a **Especificação**, sem criar subfunções artificiais. Outra pode conter diferentes níveis de decomposição. O editor não deve impor uma profundidade fixa ou obrigar filhos vazios.

### 6.5. Visão de conjunto sem poluição

Manter uma opção separada **“Ver árvore completa”** para auditoria, busca geral e exportação, **não como área de trabalho inicial**. Nessa visão deve ser possível recolher nós, filtrar tipos e localizar o item na navegação progressiva.

---

## 7. Layout recomendado do HTML

### 7.1. Tela inicial — Catálogo

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Organizador de Vida      Buscar no catálogo      Importar  Exportar │
├─────────────────────────────────────────────────────────────────────┤
│ CATÁLOGO  |  RELACIONAMENTOS  |  BIBLIOTECA  |  DADOS E CONTROLE   │
├─────────────────────────────────────────────────────────────────────┤
│ MÓDULOS DE VIDA                                                       │
│ [🍽️ Alimentação] [❤️ Saúde] [💰 Financeiro] [💼 Profissional] ...      │
│                                                                      │
│ PAINÉIS GERAIS                                                       │
│ [Dashboard Geral] [Atividades Geral] [Metas Geral]                   │
│                                                                      │
│ ÁREAS TÉCNICAS             MÓDULOS PERSONALIZADOS                    │
│ [Administração] [...]      [+ Novo módulo]                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2. Tela de módulo — Lista de páginas

```text
Organizador de Vida / Alimentação

🍽️ ALIMENTAÇÃO                                 [+ Página] [Editar módulo]
Páginas deste módulo

[Dashboard]                   [Universal]       [Abrir] [⋯]
[Cardápio]                    [Especializada*]  [Abrir] [⋯]
[Metas]                       [Universal]       [Abrir] [⋯]
[Receitas]                    [Especializada]   [Abrir] [⋯]
[Planejamento Alimentar]      [Em levantamento] [Abrir] [⋯]

*Utiliza contrato de Painel de Atividades com experiência de Cardápio.
```

### 7.3. Tela de página — Funcionalidades

```text
Organizador de Vida / Alimentação / Receitas

RECEITAS                                          [+ Funcionalidade]
Descrição curta da responsabilidade da página

FUNCIONALIDADES
[ Cadastrar receita              ] [Abrir] [⋯]
[ Editar receita                 ] [Abrir] [⋯]
[ Consultar receitas             ] [Abrir] [⋯]
[ Selecionar receita             ] [Abrir] [⋯]

Relacionamentos:  Cardápio → usa → Receitas   [Ver relações]
Dados:            Entidade Receita            [Ver contrato]
```

### 7.4. Detalhe da funcionalidade

```text
Organizador de Vida / Alimentação / Receitas / Cadastrar receita

CADASTRAR RECEITA                       [Editar] [Mover] [Mais ações]
O que faz • status • origem • versão

[Visão geral] [Subfuncionalidades] [Regras] [Dados] [Relações] [Aceite]

Objetivo           Criar um registro reutilizável de receita.
Entradas           Nome, ingredientes ... (campos a confirmar)
Saídas             Receita salva / validação apresentada
Dependências       Contrato de dados Receita
Exceções           Dados inválidos, falha de salvamento...

SUBFUNCIONALIDADES
[Informar ingredientes] [...]  [+ Nova subfuncionalidade]
```

### 7.5. Ações contextuais

A tela principal apresenta **Abrir** e **Adicionar**. Ações menos frequentes ficam em menu `⋯` com: Editar, Duplicar, Mover, Reordenar, Relacionar, Arquivar e Remover, conforme as permissões e o tipo de item.

### 7.6. Métricas

Indicadores como `5 páginas`, `8 funcionalidades`, `3 modelos reutilizados` e `% especificado` podem aparecer em cabeçalho resumido **recolhível**, sem dominar a tela.

### 7.7. Desktop, tablet e celular

**Desktop:** largura confortável, lista de itens como elemento principal; painel de detalhes lateral apenas quando houver espaço e sem afastar demais a seleção.  
**Tablet:** lista e detalhe alternáveis, sem compressão de texto.  
**Celular:** navegação em uma coluna; selecionar item **abre uma nova etapa**, com voltar e breadcrumbs compactos. Ações em menu contextual; formulários em página/modal integral.

**Não** reproduzir sidebar desktop minúscula no celular. Garantir controles clicáveis, contraste, tipografia legível, navegação por teclado, foco visível e rótulos acessíveis. Recomenda-se área de toque de aproximadamente 44 × 44 px.

---

## 8. As quatro grandes áreas de trabalho

### 8.1. Catálogo

Reúne a hierarquia organizacional:

**Módulos → Páginas → Funcionalidades → Subfuncionalidades → Especificações.**

É a área padrão para leitura, criação, ordenação e edição contextual.

### 8.2. Relacionamentos

Mostra vínculos **entre quaisquer itens**, inclusive de módulos distintos. Deve oferecer:

- Lista de relações com busca e filtros por origem, destino, tipo e módulo.
- Visão gráfica opcional (mapa de dependências) — complementar, não obrigatória para registrar um vínculo.
- Relações de entrada e saída de um item.
- Impacto de mover, arquivar ou excluir itens relacionados.
- Detecção de referências ausentes e ciclos inválidos para relações que exijam aciclicidade.

### 8.3. Biblioteca Universal

Centraliza contratos de comportamentos comuns, evitando copiar a mesma definição em cada módulo.

Ao abrir `Metas`, por exemplo, o editor precisa exibir:

1. O que pertence ao modelo universal.
2. Quais módulos utilizam esse modelo.
3. Quais especializações cada módulo adicionou.
4. Quais funcionalidades foram alteradas em uma nova versão do modelo.
5. Quais instâncias precisam revisar o impacto da atualização.

### 8.4. Dados e Controle

Área técnica de manutenção do catálogo:

- Entidades e contratos de dados.
- Exportação/importação do JSON mestre.
- Visualização de subconjunto por módulo (sem confundir com exportação completa).
- Backup e restauração.
- Validação de estrutura e referências.
- Relatórios de completude, alterações e pendências.
- Versão do catálogo e histórico de decisões.

**Não transformar cada área técnica em uma aba dentro de toda página.** A página pode expor links contextuais, enquanto o gerenciamento completo fica na área apropriada.

---

## 9. Especificação detalhada dos itens

Cada item tem uma parte **comum** e uma parte **própria do seu tipo**. O formulário apresenta primeiro o essencial, depois seções avançadas expansíveis.

### 9.1. Campos comuns mínimos

| Campo | Função |
|---|---|
| `id` | Identificador estável e único |
| `type` | module, page, feature, entity, template, category etc. |
| `name` | Nome para leitura humana |
| `description` | Explicação objetiva do item |
| `parentId` | Pai de hierarquia, quando existir |
| `order` | Posição entre irmãos; não deve fazer parte do ID |
| `decisionStatus` | Definido, em levantamento, proposto, a revisar etc. |
| `specStatus` | Não iniciado, parcial, completo, validado |
| `source` | Referência de onde a informação veio |
| `notes` | Observações, perguntas e decisões pendentes |
| `version` / `updatedAt` | Revisão e rastreabilidade |

### 9.2. Especificação de módulo

- Identidade, código, descrição e objetivo.
- Natureza: vida, central, técnico ou personalizado.
- Estratégia: fixo ou extensível, conforme a arquitetura.
- Páginas existentes, relações e modelos utilizados.
- Restrições de escopo e taxonomias permitidas.
- Regras de acesso, caso já documentadas — sem presumir implementação de autenticação.
- Questões abertas e fontes das definições.

### 9.3. Especificação de página

- Responsabilidade funcional e público/escopo.
- Rota **proposta ou confirmada** do aplicativo final.
- Forma de acesso/navegação e estados de disponibilidade.
- Funcionalidades filhas e modelo universal utilizado.
- Dados lidos e escritos; páginas relacionadas.
- Estados: vazio, carregando, erro, sem permissão, com dados etc.
- Ações principais, filtros, busca e comportamentos.
- Critérios de aceite da experiência da página.

### 9.4. Especificação de funcionalidade ou subfuncionalidade

Uma funcionalidade deve poder registrar:

1. **Objetivo:** por que existe e qual resultado entrega.
2. **Ator e permissão:** quem pode acioná-la.
3. **Gatilho:** clique, evento, horário, integração, alteração de estado etc.
4. **Pré-condições:** o que precisa existir ou estar válido.
5. **Entradas:** dados, campos e parâmetros.
6. **Ações/etapas:** sequência normal de execução.
7. **Regras de negócio:** limites, cálculos, bloqueios e exceções.
8. **Validações:** obrigatoriedade, formatos, intervalos e mensagens.
9. **Saídas:** registros, eventos, estado de tela e mensagens.
10. **Estados:** rascunho, agendado, em andamento, concluído etc., **quando pertinentes**.
11. **Exceções:** falha de rede, ausência de dependência, permissão negada e outros casos.
12. **Dependências:** outras funções, páginas, entidades e serviços.
13. **Efeitos colaterais:** o que muda em outros pontos.
14. **Recorrência/temporalidade:** somente quando aplicável.
15. **Auditoria:** eventos que precisam de histórico.
16. **Critérios de aceite:** condições objetivas para considerar funcionalidade implementada.
17. **Cenários de teste:** fluxo feliz e casos negativos.
18. **Questões pendentes:** decisões ainda não tomadas.

**Regra:** campos não aplicáveis devem ser omitidos ou marcados como `não se aplica`; não inventar conteúdo para preencher formulário.

### 9.5. Campos, contratos e dados

Distinguir:

- **Campo de interface:** apresentado ou editado em tela.
- **Campo persistido:** armazenado na entidade.
- **Dado derivado:** calculado a partir de outros dados.
- **Validação:** condição de aceitação.
- **Dependência de dados:** referência por ID, e não cópia indiscriminada.

Exemplo em Receita: `nome` pode ser campo de entrada e campo persistido; `ingredientes[]` é estrutura de dados; `rendimento` pode influenciar cálculos. A definição exata ainda deve ser aprovada no levantamento.

---

## 10. Regras de criação, edição e organização

### 10.1. Ações obrigatórias

O editor deve permitir, para tipos compatíveis:

- **Adicionar:** criar novo módulo autorizado, página, função, subfunção, entidade ou vínculo.
- **Abrir:** navegar até o conteúdo do item.
- **Editar:** nome, descrição e especificações.
- **Duplicar:** copiar um item e, opcionalmente, sua subárvore com **novos IDs**, sem copiar relações externas inadvertidamente.
- **Reordenar:** mover para cima/baixo entre irmãos; drag-and-drop pode complementar, nunca ser a única opção.
- **Mover:** mudar de pai, página ou módulo, respeitando regras e impacto.
- **Arquivar:** retirar de uso sem destruir o histórico.
- **Remover:** excluir após conferir filhos e relações.
- **Relacionar/desvincular:** criar ou remover dependência independentemente da hierarquia.

### 10.2. Regras da hierarquia

- Módulo contém páginas.
- Página contém funcionalidades e, se validado pelo catálogo, pode conter subpáginas; essa opção deve ser explícita.
- Funcionalidade contém subfuncionalidades do mesmo tipo lógico.
- Entidades e modelos universais vivem em coleções próprias e são **referenciados**, não filhos obrigatórios da página.
- Não permitir que um item seja ancestral de si mesmo.
- Impedir pai incompatível com o tipo (por exemplo, categoria como pai de uma página, salvo decisão futura explícita de nova modelagem).
- Mudanças de hierarquia devem alterar `parentId` e `order`, mas **preservar o ID** do item.

### 10.3. Mover entre páginas ou módulos

Antes de confirmar:

1. Exibir origem e novo destino.
2. Informar quais filhos serão movidos junto.
3. Verificar se há categoria/taxonomia incompatível com o módulo de destino.
4. Verificar modelos universais e escopos afetados.
5. Verificar vínculos externos; manter os válidos e sinalizar os inválidos.
6. Confirmar a movimentação e registrar histórico.

**Exemplo:** mover uma atividade documentada no Profissional para Alimentação não pode manter uma subcategoria exclusiva como `Workshop` sem revisão; a ferramenta deve bloquear ou solicitar remapeamento, nunca ajustar silenciosamente.

### 10.4. Exclusão com segurança

Quando um item tem filhos ou dependentes, mostrar:

- Quantidade de descendentes.
- Relações externas que apontam para ele.
- Modelos e páginas impactados.
- Opções permitidas: cancelar, arquivar, mover filhos ou excluir em cascata **apenas após confirmação explícita**.

Nenhuma referência órfã deve ficar no JSON aceito como íntegro.

### 10.5. Salvamento

- Salvar alterações localmente após edição confirmada (por exemplo, `IndexedDB` ou `localStorage` conforme tamanho e complexidade).
- Exibir indicador de `Salvo`, `Alterações não salvas` ou `Erro ao salvar`.
- Permitir backup/exportação manual sempre.
- Oferecer desfazer quando factível, ao menos para operações comuns e não destrutivas.
- Não afirmar que há sincronização em nuvem sem backend configurado.

---

## 11. Hierarquia versus relacionamento: diferença decisiva

### 11.1. Exemplo de hierarquia

```text
Alimentação
  └── Receitas
       └── Cadastrar receita
            └── Informar ingredientes
```

Aqui a relação é de **organização documental**: `Receitas` é a página que abriga `Cadastrar receita`.

### 11.2. Exemplo de relacionamento independente

```text
Cardápio ──usa──> Receitas
Cardápio ──persiste em──> Entidade Cardápio
Receitas ──persiste em──> Entidade Receita
Atividade ──contribui para──> Meta
Metas de Alimentação ──especializam──> Modelo Universal de Metas
```

Um item pode depender de vários outros itens em módulos distintos, sem precisar ser filho deles.

### 11.3. Tipos iniciais de vínculo

| Tipo | Significado | Exemplo |
|---|---|---|
| `depends_on` | Requer outra capacidade/dado | Cardápio depende de seleção de Receitas |
| `uses_data` | Lê ou escreve entidade | Cadastrar receita usa entidade Receita |
| `navigates_to` | Permite acesso a outra página | Cardápio abre Receitas |
| `specializes` | Estende contrato compartilhado | Cardápio especializa Painel de Atividades |
| `contributes_to` | Influencia progresso/resultado | Atividade contribui para Meta |
| `triggers` | Aciona outro processo | Conclusão aciona cálculo — se regra aprovada |
| `shares_with` | Compartilha informação controlada | Metas de módulo com Metas Geral |
| `related_to` | Associação informativa sem dependência | Página ligada a referência documental |

Cada relação precisa de `fromId`, `toId`, `type`, justificativa e, quando aplicável, condições. A semântica deve estar clara: `A depends_on B` significa que **A depende de B**.

### 11.4. Validação dos vínculos

- IDs de origem e destino precisam existir.
- Tipos precisam pertencer ao catálogo controlado de relações.
- Vínculos podem atravessar módulos se permitidos.
- Dependências circulares **operacionais** devem ser destacadas e avaliadas; a regra de proibição precisa ser definida por tipo de vínculo. Não proibir automaticamente relações legítimas de navegação bidirecional.
- Ao editar um item, mostrar: **“Depende de”**, **“É utilizado por”**, **“Navega para”** e **“É especializado por”**.

### 11.5. Visão de impacto

Selecionar `Receitas` deve permitir ver rapidamente:

- Páginas/funcionalidades que utilizam receitas.
- Entidades associadas.
- Modelos e regras impactados.
- Referências recebidas.

Isso torna a refatoração documental e depois técnica muito mais segura.

---

## 12. Biblioteca universal e especialização por módulo

### 12.1. Regra fundamental

A **biblioteca universal define o contrato mínimo comum**. Cada módulo a utiliza por referência e adiciona apenas o que for próprio.

Exemplo:

```text
Biblioteca Universal
  └── Painel de Atividades (contrato comum)
       ├── Visualizar atividades por período
       ├── Criar, editar, concluir e adiar (onde aplicável)
       ├── Filtrar por contexto
       ├── Relacionar tarefas e metas
       └── Tratar estado/recorrência (se aplicável)

Instância no módulo Alimentação
  └── Cardápio
       ├── Usa contrato do Painel de Atividades
       └── Especializa: refeições, receitas e período alimentar

Instância no módulo Profissional
  └── Painel de Atividades Profissional
       ├── Usa contrato do Painel de Atividades
       ├── Especializa: subcategorias profissionais
       └── Layout: accordion + Big Calendar
```

A definição exata do contrato comum deve ser refinada para evitar forçar ações impróprias a certos tipos de ocorrência.

### 12.2. Como mostrar na interface

Na página que reutiliza um modelo, exibir duas seções separadas:

- **Herdado da Biblioteca Universal:** itens somente leitura no contexto local, com link para sua definição de origem.
- **Especializações deste módulo:** itens editáveis do módulo (adicionar/alterar/remover conforme permissão).

Alterações no modelo original devem gerar aviso de impacto sobre as páginas consumidoras.

### 12.3. Evitar duplicidade

Não criar versões independentes de `Cadastrar meta` em todos os módulos só porque cada um tem uma tela Metas. Em vez disso, reutilizar a definição universal e registrar campos/regras particulares quando necessários.

### 12.4. Controle de exceções

Se um módulo não suportar uma capacidade universal, **registrar a exceção e sua justificativa**, em vez de apagar silenciosamente a funcionalidade universal ou manter um botão impossível de executar.

---

## 13. Exemplo aprofundado — Metas

### 13.1. Conceito

Metas constituem uma capacidade transversal, podendo ter instância Geral e visões por módulo. **A hierarquia de metas não é a mesma hierarquia de páginas do catálogo.** O catálogo documenta a funcionalidade; o produto final armazena metas reais em uma hierarquia de dados.

### 13.2. Capacidades a especificar

| Capacidade | Perguntas e regras a definir |
|---|---|
| Criar meta | Nome, descrição, prazo, escopo, estado e responsável? |
| Horizonte | Curto, médio e longo prazo: quais limites temporais? |
| Hierarquia de metas | Uma meta pode conter submetas? Quantas camadas? |
| Planejamento | Etapas, marcos e períodos relacionados? |
| Vincular atividades | Uma atividade pode contribuir para uma ou várias metas? |
| Progresso | Manual, por tarefas, ponderado ou combinação? |
| Acompanhamento | Indicadores, alertas, histórico e revisão? |
| Conclusão | Como validar uma meta atingida? |
| Replanejamento | O que acontece ao adiar ou alterar prazo? |
| Generalização | Como a visão Geral agrega metas sem duplicar dados? |

Os itens acima são a **estrutura de levantamento funcional**, e não decisões detalhadas já aprovadas sobre cálculos, prazos ou permissões.

### 13.3. Exemplo de hierarquia de metas do aplicativo final

```text
Meta de longo prazo: Evolução profissional
  ├── Meta de médio prazo: Obter uma certificação
  │     ├── Meta de curto prazo: Concluir módulo de estudos
  │     └── Meta de curto prazo: Fazer simulados
  └── Meta de médio prazo: Consolidar portfólio
        └── Meta de curto prazo: Documentar projeto
```

**Exemplo ilustrativo**, não cadastro de metas do usuário.

### 13.4. Regras funcionais a especificar

- Identificador próprio por meta (`metaId`) e vínculo opcional à meta pai (`parentMetaId`).
- Prevenir ciclos de meta pai/filha.
- Permitir metas sem filhas.
- Manter origem do módulo.
- Definir explicitamente cálculo e arredondamento de progresso; **não assumir que a média das filhas é sempre correta**.
- Registrar regras para uma meta concluída com filha pendente, exclusão de uma submeta e alteração de prazo.
- Considerar histórico das mudanças importantes e efeitos em atividades vinculadas.

### 13.5. Relação com o Painel de Atividades

Uma atividade pode estar vinculada a uma meta. O catálogo deve descrever se e como `Concluir atividade` altera o progresso da meta. Se o avanço depender de confirmação manual ou pesos, isso precisa ficar declarado.

### 13.6. Especialização por módulo

`Metas Geral` é uma visão consolidada. `Metas de Alimentação`, `Metas Profissionais` e outras instâncias utilizam a mesma entidade ou contrato comum com filtros e extensões próprias. **Evitar cadastrar a mesma meta duas vezes** em bancos lógicos diferentes só porque ela aparece em duas páginas.

---

## 14. Exemplo aprofundado — Alimentação

### 14.1. Módulo e páginas identificadas como ponto de partida

- **Dashboard** — visão do módulo, de origem universal.
- **Cardápio** — especialização do Painel de Atividades.
- **Metas** — visão de metas do módulo, de origem universal.
- **Receitas** — página especializada, detalhes em levantamento.
- **Planejamento Alimentar** — página citada na versão inicial do catálogo; responsabilidade e possível sobreposição com Cardápio ainda precisam ser validadas.

**Importante:** `Cardápio` e `Planejamento Alimentar` podem acabar sendo uma única página ou telas distintas. O catálogo deve registrar a decisão, não supor que ambas precisam existir.

### 14.2. Por que Cardápio não é apenas uma lista de tarefas

O **Painel de Atividades universal** representa ações e ocorrências ao longo do tempo. Na Alimentação, a visualização é especializada como **Cardápio**, organizada por refeições/dias/períodos e vinculada às receitas. O usuário percebe o planejamento alimentar, e não um calendário profissional com nomes trocados.

### 14.3. Página Receitas — estrutura de levantamento

```text
Alimentação / Receitas
  ├── Cadastrar receita
  │   ├── Dados básicos
  │   ├── Ingredientes e quantidades
  │   ├── Modo de preparo
  │   └── Validação e salvamento
  ├── Editar receita
  ├── Consultar receitas
  └── Selecionar receita para uso no Cardápio
```

Os desdobramentos são **exemplos de especificação**; campos e fluxos precisam de validação.

### 14.4. Dependências ilustrativas

```text
Cardápio ──usa──> Receitas
Cardápio ──usa_dados──> Entidade Cardápio
Receitas ──usa_dados──> Entidade Receita
Cardápio ──especializa──> Painel de Atividades Universal
Metas de Alimentação ──especializa──> Metas Universal
```

### 14.5. Exemplo de especificação de uma funcionalidade

**Nome:** Selecionar receita para Cardápio.  
**Objetivo:** associar um registro de receita existente a uma posição planejada no cardápio.  
**Pré-condição candidata:** receita válida já cadastrada.  
**Entrada candidata:** receita selecionada, dia/período/refeição de destino.  
**Saída esperada:** vínculo entre programação alimentar e receita.  
**Dependência:** entidade Receita e funcionalidade Cardápio.  
**Perguntas pendentes:** receita pode ser reutilizada várias vezes? Como lidar com edição posterior ou remoção de receita? Existem porções ajustáveis? Quem calcula ingredientes?  
**Status:** exemplo para validação, não decisão final.

---

## 15. Exemplo aprofundado — Profissional

### 15.1. O que já foi definido para o Painel de Atividades

Na visualização web em tela grande:

- **Accordion à esquerda** para estrutura/execução detalhada.
- **Big Calendar à direita** como visão temporal.

Ao estreitar a tela:

- **Big Calendar acima do accordion**.
- Accordion abaixo, mantendo acesso aos mesmos registros.
- Não misturar categorias de outros módulos.

Esse layout é requisito do **aplicativo final** do módulo Profissional; o HTML do **catálogo funcional** apenas registra e especifica essa decisão.

### 15.2. Taxonomia oficial do módulo Profissional

A categoria-pai é **Profissional**. As **19 subcategorias permitidas** são:

| # | Subcategoria | Ícone |
|---|---|---|
| 1 | Desenvolvimento | 📘 |
| 2 | Producao Conteudo | 📂 |
| 3 | Escrita | 🗃️ |
| 4 | Trabalho | 📂 |
| 5 | Organização | 🗃️ |
| 6 | Treinamento | 📈 |
| 7 | Mentoria | 👨‍🏫 |
| 8 | Workshop | 🛠️ |
| 9 | Certificação | 🎓 |
| 10 | Projeto Pessoal | 📌 |
| 11 | Reunião | 📅 |
| 12 | Entrega | 📦 |
| 13 | Apresentação | 🖥️ |
| 14 | Planejamento | 🗂️ |
| 15 | Follow-up | 🔍 |
| 16 | Revisão de Tarefas | ✅ |
| 17 | Organização de Backlog | 📝 |
| 18 | Definição de Metas | 🎯 |
| 19 | Documentação | 📚 |

**Regra vinculante:** no painel específico Profissional, a classificação deve ficar restrita a essas entradas, salvo mudança posterior formalmente aprovada. `Alimentação`, `Financeiro`, `Saúde` e categorias genéricas de outros módulos não podem ser acrescentadas à lista profissional.

**Observação de modelagem:** `Reunião`, `Entrega` e `Apresentação` são subcategorias da taxonomia; sua presença **não obriga**, por si só, que existam três páginas independentes com esses nomes.

### 15.3. Exemplo de página no catálogo

```text
Profissional
  └── Painel de Atividades Profissional
       ├── Visualização Big Calendar
       │    ├── Exibir atividades por período
       │    ├── Selecionar atividade
       │    └── Exibir conflitos (regra a validar)
       ├── Accordion de atividades
       │    ├── Agrupar por subcategoria profissional
       │    ├── Expandir/recolher grupos
       │    └── Abrir detalhe da atividade
       ├── Filtros
       │    └── Filtrar pela taxonomia profissional
       └── Responsividade
            ├── Desktop: esquerda/direita
            └── Estreito: calendário acima
```

Os elementos de interação acima incluem comportamentos inferidos do protótipo para especificação; serão confirmados na auditoria de funcionalidades.

---

## 16. Exemplo — Financeiro e diferenças entre módulos

Financeiro tem **tratamento fixo e explícito** na arquitetura pretendida. No catálogo inicial aparecem **Lançamentos** e **Planejamento e Orçamento** como candidatos, com ações como registrar entrada/saída e comparar valores previstos e realizados.

Não converter esses exemplos em especificação aprovada sem inventário do código e das telas do Financeiro.

### Comparação de escopo

| Conceito transversal | Alimentação | Financeiro | Profissional |
|---|---|---|---|
| Dashboard | Indicadores alimentares a levantar | Indicadores financeiros a levantar | Indicadores profissionais a levantar |
| Painel de Atividades | **Cardápio** | Tipo/visão financeira a definir | **Accordion + Big Calendar** |
| Metas | Metas alimentares | Metas financeiras | Metas profissionais |
| Dados especializados | Receitas, cardápios | Lançamentos e orçamento (candidatos) | Atividades tipificadas pela lista oficial |
| Taxonomia | Própria, a levantar | Própria, a levantar | **Lista fechada de 19 entradas** |

**Regra:** a coerência é obtida por contratos compartilhados e especialização consciente — **não** obrigando que toda página e função de um módulo seja copiada para todos os outros sem pertinência de domínio.

---

## 17. Estrutura JSON recomendada

### 17.1. Princípio

O JSON exportado deve representar o **estado completo** do catálogo, não somente os itens visíveis na tela no momento da exportação. Deve preservar:

- Versão do formato.
- Identidade do produto.
- Módulos e contextos centrais.
- Páginas, funções e subfunções com seus pais e ordens.
- Modelos universais.
- Entidades, campos e contratos.
- Subcategorias e regras de escopo.
- Relacionamentos por IDs.
- Status, proveniência e pendências.
- Metadados necessários para reimportar o catálogo.

### 17.2. Proposta de coleções

```text
catalog
├── schemaVersion
├── product
├── metadata
├── modules[]
├── centralContexts[]
├── pages[]
├── features[]
├── templates[]
├── entities[]
├── categories[]
├── relations[]
└── decisions[]
```

**Nota:** esta é a proposta para a próxima versão do catálogo, não o esquema final já implantado no HTML anterior. A migração entre formatos precisará ser testada.

### 17.3. Exemplo de JSON reduzido

> Exemplo ilustrativo de contrato. Apenas demonstra estrutura e referências, não substitui um inventário real nem representa todos os módulos.

```json
{
  "schemaVersion": "1.0.0",
  "product": {
    "id": "organizador-de-vida",
    "name": "Organizador de Vida"
  },
  "metadata": {
    "status": "em-levantamento",
    "exportedAt": "2026-10-20T00:00:00Z"
  },
  "modules": [
    {
      "id": "mod_alimentacao",
      "name": "Alimentação",
      "kind": "life",
      "implementationMode": "fixed",
      "decisionStatus": "defined",
      "specStatus": "partial"
    }
  ],
  "centralContexts": [],
  "pages": [
    {
      "id": "page_receitas",
      "moduleId": "mod_alimentacao",
      "parentId": null,
      "name": "Receitas",
      "order": 10,
      "pageKind": "specialized",
      "decisionStatus": "in-review",
      "specStatus": "partial",
      "templateRefs": [],
      "route": { "value": "/app/alimentacao/receitas", "status": "proposed" }
    },
    {
      "id": "page_cardapio",
      "moduleId": "mod_alimentacao",
      "parentId": null,
      "name": "Cardápio",
      "order": 20,
      "pageKind": "specialized",
      "decisionStatus": "defined",
      "specStatus": "partial",
      "templateRefs": ["tpl_activities"]
    }
  ],
  "features": [
    {
      "id": "feat_cadastrar_receita",
      "moduleId": "mod_alimentacao",
      "pageId": "page_receitas",
      "parentFeatureId": null,
      "name": "Cadastrar receita",
      "order": 10,
      "decisionStatus": "in-review",
      "specStatus": "partial",
      "specification": {
        "purpose": "Cadastrar um registro de receita reutilizável.",
        "inputs": [],
        "outputs": [],
        "businessRules": [],
        "acceptanceCriteria": [],
        "openQuestions": ["Quais campos são obrigatórios?"]
      }
    }
  ],
  "templates": [
    {
      "id": "tpl_activities",
      "name": "Painel de Atividades",
      "version": 1,
      "featureIds": []
    }
  ],
  "entities": [],
  "categories": [],
  "relations": [
    {
      "id": "rel_cardapio_receitas",
      "fromId": "page_cardapio",
      "toId": "page_receitas",
      "type": "depends_on",
      "reason": "O cardápio utiliza receitas cadastradas.",
      "decisionStatus": "in-review"
    }
  ],
  "decisions": []
}
```

### 17.4. Por que separar coleções

`modules[]`, `pages[]` e `features[]` em coleções distintas permitem buscas, validações e referências cruzadas. A navegação é reconstruída a partir de `moduleId`, `parentId`, `pageId`, `parentFeatureId` e `order`, não pela posição física no arquivo.

### 17.5. IDs versus nomes

- Nome pode ser alterado.
- Ordem pode ser alterada.
- Página pode migrar de módulo após validações.
- Referências continuam apontando para o **mesmo ID**.
- IDs não devem ser reutilizados após exclusão de outro item.

### 17.6. Status separados

**Decisão funcional (`decisionStatus`)** — por exemplo:

- `defined`: aprovado/definido.
- `proposed`: proposta a avaliar.
- `in-review`: em levantamento ou revisão.
- `rejected`: rejeitado, preservado para histórico quando necessário.

**Completude da especificação (`specStatus`)** — por exemplo:

- `not-started`.
- `partial`.
- `complete`.
- `validated`.

**Status de implementação (`implementationStatus`)**, se vier a ser usado após confrontar o código real, deve ser **um terceiro atributo independente**. Uma ideia aprovada não implica que o código exista.

### 17.7. Fonte de cada afirmação

Atribuir, sempre que possível:

```json
{
  "source": {
    "kind": "decision|uploaded-file|code-audit|prototype|proposal",
    "reference": "Documento, arquivo ou decisão rastreável",
    "notes": "Justificativa ou divergência encontrada"
  }
}
```

Assim, o leitor sabe se um requisito foi herdado de um protótipo, aprovado em conversa ou apenas sugerido na catalogação.

---

## 18. Importação, exportação e persistência

### 18.1. Exportar JSON mestre

- Um botão inequívoco: **Exportar catálogo completo**.
- Nome sugerido: `organizador-de-vida_catalogo_YYYY-MM-DD.json`.
- JSON legível, UTF-8, com versão e metadados.
- Incluir **todas** as coleções do catálogo, independentemente de filtros ou página selecionada.
- Não incluir dados pessoais reais ou segredos de produção.

### 18.2. Exportações opcionais

- **Exportar apenas módulo** para leitura, compartilhamento ou revisão.
- **Exportar relatório de pendências**, como JSON ou Markdown.
- **Exportar mapa de dependências** para outra ferramenta.

**A exportação parcial não deve ser confundida com backup completo** e deve incluir metadados informando seu escopo.

### 18.3. Importar JSON

Fluxo recomendado:

1. Selecionar arquivo.
2. Analisar `schemaVersion` e estrutura.
3. Validar obrigatoriedade e tipos.
4. Verificar unicidade de IDs.
5. Verificar pais e relações apontando para itens existentes.
6. Verificar regras de taxonomia e integridade dos módulos oficiais.
7. Mostrar **prévia de alterações**: módulos, páginas, funções, relações, conflitos.
8. Permitir **substituir** o catálogo atual com backup prévio; mesclar somente em operação separada, definida e testada.
9. Solicitar confirmação.
10. Persistir de forma atômica, com possibilidade de recuperar a versão anterior.

### 18.4. Mesclagem

Importar e **mesclar** é mais complexo que importar e substituir, pois exige política para IDs iguais, versões divergentes, itens removidos e relacionamentos. Na primeira versão, é aceitável oferecer **somente substituição segura**, deixando mesclagem para uma etapa posterior documentada.

### 18.5. Persistência local

Um HTML autocontido pode persistir usando recursos do navegador. Para maior volume e versões, **IndexedDB** tende a ser preferível; `localStorage` é suficiente apenas para cenários pequenos e simples. Exportação manual continua indispensável.

O catálogo deve distinguir:

- **Salvo neste navegador**: persistência local.
- **Arquivo exportado**: cópia portátil.
- **Sincronizado na nuvem**: somente se for construída infraestrutura própria.

Recarregar a página não deve descartar alterações confirmadas.

### 18.6. Migração de esquema

Se o JSON antigo não seguir o contrato novo, o editor deve migrá-lo de maneira controlada, preservando IDs quando possível, registrando incompatibilidades e bloqueando importação destrutiva em caso de erro. Nunca fingir compatibilidade silenciosa.

---

## 19. Busca, filtros, rastreabilidade e relatórios

### 19.1. Busca global

Buscar por:

- Nome de módulo, página, funcionalidade ou entidade.
- Descrição e palavras-chave.
- ID.
- Status.
- Relações e referências.

O resultado deve indicar o caminho completo e permitir **Abrir neste contexto**, por exemplo: `Alimentação › Receitas › Cadastrar receita`.

### 19.2. Filtros úteis

- Apenas páginas, funcionalidades, entidades ou relações.
- Módulo.
- Definido / em levantamento / proposto.
- Especificação completa/incompleta.
- Com ou sem dependências.
- Com perguntas pendentes.
- Universal ou especializado.

### 19.3. Relatório de completude

Por módulo, página e funcionalidade, mostrar:

- Quantos itens existem.
- Quantos estão aprovados.
- Quantos têm descrição objetiva.
- Quantos têm regras e critérios de aceite quando necessários.
- Quantos referenciam dados e relações válidos.
- Quantos têm perguntas em aberto.
- Quantos dependem de definições ainda não aprovadas.

**Evitar percentuais ilusórios.** A regra de cálculo da completude deve ser documentada, sensível ao tipo de item e a campos não aplicáveis.

### 19.4. Histórico e decisões

Idealmente cada alteração relevante registra: quando, tipo de mudança, item afetado, valor anterior/novo, justificativa e origem. Em HTML somente local, isso não equivale a auditoria imutável de servidor; ainda assim é útil para rastrear decisões.

---

## 20. Permissões e limites da ferramenta

O catálogo deve documentar **permissões do aplicativo final**, mas essas regras não devem ser confundidas com a segurança real do **editor HTML**.

Caso o catálogo seja usado por várias pessoas no futuro, prever papéis como leitor, editor e aprovador. Entretanto:

- Um HTML local não é controle de acesso seguro para dados compartilhados.
- Esconder botão não substitui autorização em backend.
- Aprovar ou bloquear edição de requisitos oficiais requer uma política de produto explícita.
- As listas fixas/taxonomias oficiais devem ter alteração intencional, registrada e revisável.

Na primeira versão local, o mínimo é impedir modificações **acidentais** em itens protegidos, sinalizando claramente os motivos.

---

## 21. Critérios de aceitação do novo HTML

O novo arquivo só deve ser considerado funcionalmente satisfatório quando os cenários abaixo funcionarem:

### 21.1. Navegação

- [ ] Entrar no catálogo e identificar imediatamente módulos de vida, painéis gerais e áreas técnicas.
- [ ] Abrir Alimentação e ver suas páginas **sem mostrar todas as funções de todas as páginas**.
- [ ] Abrir Receitas e ver apenas suas funcionalidades.
- [ ] Abrir Cadastrar receita e acessar especificação e subfunções.
- [ ] Navegar pelo breadcrumb sem perder o estado salvo.
- [ ] Encontrar item via busca global e abrir no contexto correto.

### 21.2. CRUD e hierarquia

- [ ] Adicionar uma página ao módulo.
- [ ] Adicionar uma função à página.
- [ ] Adicionar uma subfunção à função.
- [ ] Editar nomes, descrições, status e detalhes.
- [ ] Reordenar sem alterar IDs.
- [ ] Mover para outro pai válido, preservando vínculos compatíveis.
- [ ] Bloquear ciclo hierárquico.
- [ ] Duplicar gerando novos IDs.
- [ ] Tratar exclusão/arquivamento com aviso de impacto.

### 21.3. Relações e modelos

- [ ] Registrar `Cardápio → depende de → Receitas`.
- [ ] Ver relações recebidas e enviadas de Receitas.
- [ ] Alterar ordem visual sem quebrar relações.
- [ ] Abrir definição universal de Metas a partir de um módulo.
- [ ] Diferenciar o que foi herdado e o que foi especializado.
- [ ] Impedir mistura silenciosa de categorias alheias no Profissional.

### 21.4. Persistência e JSON

- [ ] Exportar catálogo integral.
- [ ] Validar JSON exportado e reimportá-lo.
- [ ] Reconstruir após importação as mesmas páginas, funções, relações e status.
- [ ] Rejeitar arquivo com relação apontando para ID inexistente (ou oferecer reparo explícito).
- [ ] Recarregar HTML sem perder alterações salvas.
- [ ] Manter cópia recuperável antes de importação por substituição.
- [ ] Distinguir claramente exportação parcial e integral.

### 21.5. Interface e responsividade

- [ ] Desktop apresenta textos legíveis e ações contextuais claras.
- [ ] Celular utiliza uma coluna e permite navegar todos os níveis.
- [ ] Ações perigosas não ficam escondidas em gestos sem alternativa.
- [ ] Formulários e menus funcionam com teclado e toque.
- [ ] Estados vazios, erros e confirmações são compreensíveis.

---

## 22. Plano de construção em fases

### Fase 1 — Estrutura canônica

1. Consolidar contrato JSON, tipos, IDs, hierarquia e relações.
2. Criar validador de esquema e integridade referencial.
3. Preparar migração do arquivo HTML/JSON inicial.
4. Preservar conteúdo já catalogado e sinalizar possíveis divergências.

**Saída:** dados confiáveis, sem interface complexa.

### Fase 2 — Navegação progressiva

1. Página Catálogo com cards por grupo.
2. Página de Módulo com lista de páginas.
3. Página com lista de funcionalidades.
4. Funcionalidade com subfunções e especificações.
5. Breadcrumbs, voltar, busca e estado vazio.
6. Interface responsiva real para mobile.

**Saída:** fluxo principal claro e utilizável.

### Fase 3 — Editor e operações

1. CRUD contextual.
2. Movimentação e reordenação seguras.
3. Duplicação, arquivamento e exclusão com análise de impacto.
4. Persistência local.
5. Importação/exportação integral com validação e backup.

**Saída:** catálogo editável sem perda silenciosa de dados.

### Fase 4 — Conhecimento funcional profundo

1. Especificações completas por tipo.
2. Biblioteca Universal e especializações.
3. Entidades e contratos.
4. Mapa de relações.
5. Proveniência, estados e decisões.

**Saída:** conteúdo utilizável como contrato para desenvolvimento.

### Fase 5 — Inventário completo por módulo

Ordem sugerida, **não obrigatória**:

1. Alimentação: resolver Cardápio, Receitas, Planejamento e Metas.
2. Financeiro: auditar páginas e funcionalidades existentes no projeto real.
3. Profissional: documentar o Painel, as 19 subcategorias e restantes páginas.
4. Demais módulos de vida.
5. Contextos gerais.
6. Áreas técnicas e módulos personalizados.
7. Auditoria final de reuso, cobertura e dependências.

Para cada módulo, confrontar protótipos, código, rotas e decisões disponíveis. Marcar explicitamente os itens sem prova de implementação ou sem aprovação funcional.

### Fase 6 — Entrega para a ferramenta de design/desenvolvimento

Produzir:

- JSON mestre validado.
- Relatório de páginas e funcionalidades por módulo.
- Contratos universais e especializações.
- Mapa de dependências.
- Pendências e decisões ainda abertas.
- Guia de interpretação do catálogo.

A outra aplicação poderá utilizar esse material para produzir design e código **sem confundir exemplos de protótipo com requisitos confirmados**.

---

## 23. Regras para manter a documentação coerente no futuro

1. **Nova página:** sempre pertence a um módulo/contexto explícito, tem ID, responsabilidade, status e origem.
2. **Nova funcionalidade:** sempre pertence a uma página/função, tem resultado esperado e pode receber especificação progressiva.
3. **Nova subcategoria:** deve pertencer à taxonomia autorizada daquele módulo.
4. **Novo comportamento universal:** só deve ser promovido à biblioteca após confirmar reuso real entre módulos relevantes.
5. **Nova especialização:** fica no módulo consumidor; não altera silenciosamente o contrato central.
6. **Mudança de dependência:** registrar relação tipada, com motivo e IDs válidos.
7. **Exclusão:** verificar descendentes e dependentes.
8. **Mudança de nome ou ordem:** não recriar IDs.
9. **Novo dado:** descrever entidade e contrato; evitar duplicação de registros em diferentes páginas.
10. **Importação:** validar e comparar antes de substituir.
11. **Aprovação:** status só muda mediante revisão explícita; não confundir “preenchido” com “aprovado”.
12. **Entrega:** catálogo sem referências órfãs, com relatório de pendências e backup exportado.

---

## 24. Decisões consolidadas e decisões ainda abertas

### 24.1. Decisões consolidadas nesta especificação

- O HTML será um **Catálogo Funcional Mestre**, não a interface final do aplicativo.
- Navegação **por profundidade progressiva**, evitando árvore integral permanente.
- Organização por módulos, páginas, funcionalidades, subfuncionalidades e especificações.
- Hierarquia e dependências são estruturas independentes.
- CRUD completo, movimentação e reordenação sem perda de IDs.
- Importação/exportação JSON como recurso fundamental.
- Biblioteca de modelos universais com extensões por módulo.
- Painéis gerais separados dos módulos de vida.
- Alimentação e Financeiro com tratamento técnico fixo; demais módulos com arquitetura extensível.
- Cardápio como especialização do Painel de Atividades em Alimentação.
- Painel Profissional: accordion à esquerda e Big Calendar à direita no desktop; calendário acima ao estreitar.
- Taxonomia do Profissional restrita às 19 subcategorias informadas.
- Exemplos em levantamento não devem ganhar status de aprovados automaticamente.

### 24.2. Decisões abertas para a etapa seguinte

1. Inventário realmente completo de páginas por módulo, a partir de arquivos/código.
2. Definição final de sobreposição entre `Cardápio` e `Planejamento Alimentar`.
3. Campos obrigatórios e regras detalhadas de Receita, Cardápio e demais entidades.
4. Critérios temporais oficiais de curto, médio e longo prazo em Metas.
5. Algoritmo de cálculo/propagação de progresso das metas.
6. Contratos e exceções definitivos de cada modelo universal.
7. Páginas especializadas do Financeiro, sem assumir candidatas como confirmadas.
8. Regras formais de permissão e aprovação dentro do catálogo compartilhado.
9. Política de migração/mesclagem de catálogos independentes.
10. Rotas definitivas do aplicativo final, distintas das rotas internas do editor.
11. Se haverá auditoria colaborativa ou apenas histórico local.
12. Estilo visual definitivo do **editor**; o padrão pode se inspirar no Organizador de Vida Web Unificado, sem comprometer usabilidade e legibilidade.

---

## 25. Entregável final esperado

O resultado deverá ser um **HTML autocontido e operacional** que permita administrar o conhecimento funcional do Organizador de Vida com:

- Visão inicial simples dos módulos e contextos.
- Navegação progressiva até qualquer detalhe de uma funcionalidade.
- CRUD e organização flexível, com controles de integridade.
- Relações e dependências consultáveis de qualquer nível.
- Biblioteca universal, especializações e contratos de dados.
- Evidência do que está definido e do que ainda não está.
- Importação, exportação, backup e validação JSON.
- Comportamento adequado no desktop e no celular.
- Estrutura pronta para servir de insumo ao desenvolvimento futuro.

### Síntese final

**O Organizador de Vida deve ser compreendido de fora para dentro: do módulo à menor regra funcional necessária.** A navegação visual pode permanecer simples porque o modelo de dados preservará toda a profundidade, as relações, as especializações e as evidências.

> **A meta é entender e especificar a aplicação inteira, sem transformar sua documentação numa aplicação mais difícil de usar do que o produto que ela pretende organizar.**

---

## Apêndice A — Checklist de levantamento de uma página

Para cada página do aplicativo final, responder:

- [ ] Qual o módulo e qual o nome da página?
- [ ] Qual problema ela resolve?
- [ ] É universal, especializada ou independente?
- [ ] Quais funcionalidades contém?
- [ ] Quais funcionalidades admitem subfuncionalidades?
- [ ] Quais são entradas, saídas e regras de cada funcionalidade?
- [ ] Quais são seus estados e situações excepcionais?
- [ ] Quais dados e entidades utiliza?
- [ ] Quais páginas/funcionalidades utiliza ou aciona?
- [ ] Quais itens de outros módulos consomem seus dados?
- [ ] Há regras específicas de permissão ou privacidade?
- [ ] Há requisitos de calendário, recorrência, notificações ou metas?
- [ ] Quais são os critérios de aceite?
- [ ] Qual a origem de cada informação?
- [ ] O que está confirmado e o que falta validar?

## Apêndice B — Checklist de auditoria antes de gerar a aplicação

- [ ] Todos os módulos e contextos centrais foram inventariados.
- [ ] Todas as páginas relevantes foram identificadas.
- [ ] Funções e subfunções estão discriminadas adequadamente.
- [ ] Contratos universais e especializações não estão duplicados.
- [ ] Todas as dependências por ID são válidas.
- [ ] Entidades e campos indispensáveis estão especificados.
- [ ] Regras, exceções e estados necessários foram definidos.
- [ ] Não existem categorias indevidas entre módulos.
- [ ] Não existem itens rejeitados tratados como ativos.
- [ ] Itens em levantamento estão claramente sinalizados.
- [ ] Critérios de aceite críticos foram revisados.
- [ ] A exportação integral foi validada por reimportação.
- [ ] O relatório de pendências foi entregue junto do JSON.

**Fim da especificação — versão 1.0.**
