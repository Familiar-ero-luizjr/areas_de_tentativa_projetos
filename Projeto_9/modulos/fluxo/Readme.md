# Advogado Já — Contrato de telas, componentes, conexões e visualização do fluxo

**Versão:** 1.0 — consolidação conceitual  
**Data:** 19 de novembro de 2026  
**Status:** decisões conceituais consolidadas; esquema JSON de conexões apresentado como proposta para implementação  
**Escopo:** Motor V4 / módulo Jornadas / catálogo e projeção do Fluxo

> **Princípio central:** a tela descreve o que será exibido; o componente descreve uma peça reutilizável; a conexão descreve de onde se sai, para onde se chega e sob qual condição; o motor interpreta essas referências e desenha/executa o fluxo. **A bifurcação é consequência das conexões — não um desenho cadastrado à parte.**

---

## 1. Para que serve este documento

Este contrato registra, em uma mesma referência, as decisões tomadas sobre:

1. Árvore JSON das **telas** e dos **componentes**;
2. Relação de telas e componentes com **ações, dados, estados e capacidades**;
3. **Entradas, saídas, condições e destinos** que formam o fluxo;
4. Identificação automática de **sequências, bifurcações, junções e conexões pendentes**;
5. Reutilização de uma tela e de um trecho do fluxo sem criar cópias independentes;
6. Comportamento de **onboarding concluído, retorno à Home, menu, Splash e login**;
7. Informações que o construtor deve mostrar quando uma tela ou conexão for selecionada.

O objetivo é ter um modelo **simples e verificável**, que possa crescer sem misturar interface, regra de negócio e desenho de navegação.

### 1.1 Fontes concretamente inspecionadas

- `Projeto_9.zip` → `modulos/jornadas/data/documento.json`: contém **110 telas e 388 componentes**, na forma `telas` e `componentes`. A tela `advogado.home` foi analisada em detalhe.
- `Projeto_9.zip` → `modulos/jornadas/js/motor.js`: referência da implementação do módulo Jornadas, sem que este documento afirme que o novo contrato já é executado por ele.
- `advogadoja-fluxo-projecao (6).json`: catálogo com **78 telas**; árvore do grafo com **197 ocorrências de tela**, **36 bifurcações registradas** (32 `navigation`, 4 `condition`). A Home `advogado.home_advogado` aparece **6 vezes**; o registro `domain.flow.state` ainda possui `nodes`, `paths`, `transitions` e `segments` vazios.

**Cuidado com as versões:** os 110 itens no documento de Jornadas e os 78 itens do catálogo do Fluxo representam acervos diferentes. **Não são contagens que se devam igualar automaticamente.**

---

## 2. Decisões fechadas na conversa

| Nº | Decisão consolidada | Consequência para o motor |
|---|---|---|
| D01 | **Uma tela tem uma definição única.** | A mesma Home pode aparecer diversas vezes em jornadas diferentes. |
| D02 | **Um componente também é reutilizável e referenciado por ID.** | Uma mudança de componente pode refletir em todas as telas que o usam. |
| D03 | **A árvore visual fica separada das conexões do fluxo.** | `estrutura.html`/`estrutura.css` não carregam a jornada inteira. |
| D04 | **Uma conexão tem origem, saída, destino e condição opcional.** | O motor entende a relação entre duas telas por referências, não por posições no desenho. |
| D05 | **Uma saída incondicional resulta em conexão direta.** | O motor desenha uma linha. |
| D06 | **Duas ou mais saídas condicionais para o mesmo evento geram bifurcação automática.** | Não há necessidade de cadastrar manualmente um nó visual de bifurcação. |
| D07 | **Ações distintas (menu, botão, notificação) geram alternativas de navegação.** | O motor não confunde opções de menu com uma condição booleana. |
| D08 | **Várias entradas podem chegar à mesma tela.** | O motor mostra junção ou reaproveitamento, sem duplicar definição de tela. |
| D09 | **O mesmo estado pode afetar diversas telas e jornadas.** | O motor reavalia as condições pertinentes quando os dados mudam. |
| D10 | **Concluir o onboarding não obriga o retorno a ele.** | A navegação de retorno considera etapa concluída, destino da ação e política de histórico. |
| D11 | **Ao mudar uma definição compartilhada, todos os seus consumidores refletem a alteração.** | Alterações são feitas na referência única, não em várias cópias. |
| D12 | **Conexão ausente ou ambígua não pode ser inventada pelo motor.** | A visualização mostra problema de vínculo ou conflito de condições. |
| D13 | **Ao clicar numa tela, o construtor mostra as relações dela.** | Visualização das entradas, saídas, condições, jornadas e dependências. |
| D14 | **Estados visuais não são permissões de segurança.** | A interface reage ao contexto, mas a autorização precisa ser validada na aplicação/backend. |

Estas são **decisões de comportamento e arquitetura**. Os nomes exatos de novos campos (`conexoes`, `quando`, `evento`, `segmentRef` etc.) são **propostas de contrato técnico**, não alterações já aprovadas no código.

---

## 3. Modelo mental: quatro peças e um motor

```text
BIBLIOTECA                                DEFINIÇÕES DE NAVEGAÇÃO
┌──────────────────────┐                  ┌────────────────────────┐
│ TELA                 │                  │ CONEXÃO                │
│ identidade           │                  │ id                     │
│ composição por refs  │                  │ origem + saída         │
│ variações visuais    │                  │ destino + entrada      │
└───────────┬──────────┘                  │ condição opcional      │
            │                             └────────────┬───────────┘
            ▼                                          │
┌──────────────────────┐                ┌──────────────▼─────────┐
│ COMPONENTE           │                │ CONTEXTO / ESTADOS     │
│ identidade           │                │ usuário / capacidades  │
│ elementos e estilos  │                │ onboarding / OAB       │
│ evento de ação       │                │ dados de negócio       │
└───────────┬──────────┘                └──────────────┬─────────┘
            └────────────────┬─────────────────────────┘
                             ▼
                   ┌────────────────────┐
                   │ MOTOR              │
                   │ resolve referências│
                   │ avalia condições   │
                   │ identifica desvios │
                   │ desenha o grafo    │
                   │ apresenta a tela   │
                   └────────────────────┘
```

**Jornada** é a organização de percursos/etapas, usando telas e conexões existentes. Ela pode informar contexto e ponto de entrada, mas não precisa duplicar o HTML nem cada caminho compartilhado.

**Distinção essencial:**

- **Definição da tela:** `advogado.home` no documento de Jornadas.
- **Referência de tela no catálogo do Fluxo:** `advogado.home_advogado`.
- **Ocorrência no grafo:** cada nó com `id` próprio e `entityRef` apontando àquela referência de tela.
- **Estado de execução:** dados atuais de um usuário/sessão, externos à estrutura visual.

Os dois IDs de Home acima devem ter uma **resolução/alias explícito, validado**, antes de serem unidos tecnicamente. Sem esse mapeamento, o motor deve marcar referência não resolvida — não adivinhar que são a mesma definição.

---

## 4. A árvore JSON que existe hoje

### 4.1 Documento do módulo Jornadas

```text
documento.json
├── tipo
├── versao
├── telas
│   └── advogado.home
│       ├── identidade
│       │   ├── id
│       │   ├── tipo
│       │   ├── namespace
│       │   ├── nome / nomeExibicao
│       │   └── descricao
│       ├── classificacao
│       │   ├── localizacao.caminho
│       │   ├── escopo.perfilRef
│       │   └── jornadas[]
│       └── estrutura
│           ├── html
│           │   ├── raizRef
│           │   └── composicao
│           │       ├── screen.root
│           │       ├── screen.header
│           │       ├── screen.titlebar
│           │       ├── screen.hero
│           │       ├── screen.online
│           │       ├── screen.actions
│           │       ├── screen.drawer
│           │       ├── screen.modal
│           │       └── screen.toast
│           └── css
│               ├── tokens
│               └── regras
└── componentes
    ├── advogado.home.layout
    ├── advogado.home.apresentacao
    ├── advogado.home.status_online
    ├── advogado.home.solicitacoes
    └── ui.advogado.menu.principal
        ├── identidade
        ├── classificacao
        └── estrutura
            ├── html.raizRef / html.elementos
            ├── css.regras
            └── estadosVisuais
```

A `composicao` já associa `paiRef`, `slot`, `ordem` e `componenteRef`. **Este mecanismo de referências deve ser preservado.** O que precisa ser acrescentado é a relação formal com ações e conexões, sem misturá-las aos seletores CSS.

### 4.2 Exemplo real da Home

```json
{
  "screen.hero": {
    "paiRef": "layout.main",
    "slot": "main",
    "ordem": 20,
    "componenteRef": "advogado.home.apresentacao"
  },
  "screen.online": {
    "paiRef": "layout.main",
    "slot": "main",
    "ordem": 30,
    "componenteRef": "advogado.home.status_online"
  },
  "screen.actions": {
    "paiRef": "layout.main",
    "slot": "main",
    "ordem": 40,
    "componenteRef": "advogado.home.solicitacoes"
  }
}
```

No arquivo real, a Home contém CSS com seletores baseados em `data-professional-access`, entre eles regras que ocultam o cartão online e solicitações quando o acesso é `restricted`. Isso funciona como apresentação, mas **não é um bom local para definir regra de negócio e conexão de fluxo**.

### 4.3 Exemplo real de componente

O componente `ui.advogado.menu.principal` possui `estrutura.html.elementos` e `estrutura.estadosVisuais` com os eixos **`painel` (`aberto`/`fechado`)** e **`disponibilidade` (`online`/`offline`)**. Isso confirma que os estados de visualização podem permanecer no componente; abrir o menu por si só não significa entrar numa nova tela da jornada.

O componente `advogado.home.status_online` já contém o atributo `data-action="online.toggle"`. Isso é uma evidência de gatilho de ação visual, **não de integração de backend já concluída**.

---

## 5. Árvore-alvo proposta: manter a estrutura, adicionar referências funcionais

Para reduzir migração, **não é necessário renomear agora `estrutura.html` e `estrutura.css`**. A proposta mínima é manter a árvore compatível, fazer as telas referirem componentes e fazer as funcionalidades serem registradas separadamente.

```text
DOCUMENTO MESTRE / ÍNDICES
├── telas
│   └── <screenId>
│       ├── identidade
│       ├── classificacao
│       └── estrutura
│           ├── html.raizRef / html.composicao
│           ├── css.tokens / css.regras
│           └── apresentacao [PROPOSTO]
│               └── variantes (restrita, habilitada, etc.)
├── componentes
│   └── <componentId>
│       ├── identidade
│       ├── classificacao
│       └── estrutura
│           ├── html.raizRef / html.elementos
│           ├── css.regras
│           └── estadosVisuais (quando aplicável)
├── acoes [PROPOSTO: registro funcional]
│   └── <actionId>
│       ├── evento
│       ├── fonte (componente/elemento)
│       └── efeito (estado local / comando / navegação)
├── conexoes [PROPOSTO: registro do fluxo]
│   └── <connectionId>
│       ├── origem: tela + saída/evento
│       ├── destino: tela + entrada
│       ├── condicaoRef? (opcional)
│       └── navegacao? (opcional)
├── condicoes [PROPOSTO: expressões declarativas]
│   └── <conditionId>
│       ├── variavel
│       ├── operador
│       └── valor
├── segmentos [PROPOSTO: trechos compartilhados]
│   └── <segmentId> -> refs de conexões/etapas
└── referencias [PROPOSTO: aliases e índices reversos]
    ├── aliases de IDs
    ├── tela -> conexões de entrada
    ├── tela -> conexões de saída
    ├── tela -> jornadas/ocorrências
    └── componente -> telas consumidoras
```

**Atenção:** a árvore acima é um **modelo de organização lógico**. Não obriga que tudo seja salvo em um único JSON físico. As regras anteriores de isolamento dos módulos podem ser mantidas: o motor recebe índices consolidados ou lê somente suas fontes permitidas.

### 5.1 O que não deve entrar no JSON visual

- Sequência completa de login/cadastro/onboarding;
- Lista de todos os destinos de cada jornada, copiada na tela;
- Expressões de autorização de backend embutidas em CSS;
- Histórico real de navegação de um usuário;
- Repetições da mesma estrutura de menu ou de um mesmo percurso.

### 5.2 O que pode ficar dentro da tela

- `identidade` e `classificacao`;
- Composição (`paiRef`, `slot`, `ordem`, `componenteRef`);
- Variantes **de apresentação**, que não concedem acesso;
- Identificadores estáveis de elementos ou eventos expostos pelos componentes.

---

## 6. Contrato mínimo das conexões — proposta técnica

Uma conexão tem apenas os dados necessários para o motor formar a ligação:

```json
{
  "id": "cx.login.advogado.home",
  "origem": {
    "telaRef": "auth.sessao.entrar",
    "saida": "login.sucesso"
  },
  "destino": {
    "telaRef": "advogado.home_advogado",
    "entrada": "principal"
  },
  "condicaoRef": "cond.advogado.onboardingConcluido",
  "navegacao": "substituir"
}
```

**Campos propostos:** `id`, `origem.telaRef`, `origem.saida`, `destino.telaRef`, `destino.entrada`, `condicaoRef?`, `navegacao?`. Os valores `login.sucesso` e `cond.advogado.onboardingConcluido` são **ilustrativos, não variáveis confirmadas no banco**.

O motor deve buscar os pontos de entrada/saída usando o identificador estável da tela. A tela **não precisa guardar um espelho da conexão**; um índice reverso gerado permite mostrar todas as entradas e saídas ao selecioná-la.

### 6.1 Condição declarativa, não código solto

```json
{
  "id": "cond.advogado.onboardingConcluido",
  "variavel": "conta.onboardingConcluido",
  "operador": "igual",
  "valor": true
}
```

A condição deve ser validada contra um **registro conhecido de variáveis**. Se não existir, o motor informa que ela é desconhecida. Não deve usar `eval` nem executar expressões arbitrárias contidas no JSON.

### 6.2 Política de navegação, separada da conexão

- `avancar` — adiciona a próxima tela ao histórico, quando aplicável;
- `substituir` — substitui a tela/etapa corrente, útil na conclusão de um fluxo;
- `reiniciar` — inicia contexto de navegação novo, quando a jornada assim exigir;
- `voltar` — usa o histórico válido ou um destino de retorno declarado, **não a posição anterior no desenho**.

Estes nomes de política são **sugestões** e precisam ser compatibilizados com a navegação Flutter/React real. A decisão fechada é: **retorno não é inversão automática da última seta do fluxograma**.

---

## 7. Quando o motor cria a bifurcação sozinho

### 7.1 Regras de inferência

| Situação encontrada | Representação gerada | Regra de execução |
|---|---|---|
| Uma saída válida para determinado evento | **Conexão direta** | Segue para o destino. |
| Mesmo evento, múltiplas saídas com condições mutuamente exclusivas | **Bifurcação condicional** | Avalia o contexto e escolhe a saída verdadeira. |
| Ações/eventos diferentes saindo da mesma tela | **Alternativas de navegação** | A ação do usuário define qual conexão utilizar. |
| Várias conexões chegam à mesma tela | **Junção / ponto compartilhado** | Todos apontam para uma única definição de tela. |
| A saída volta a uma tela já visitada | **Retorno/ciclo** | Respeita política de navegação e estado atualizado. |
| Destino inexistente ou referência não resolvida | **Conexão pendente** | Não inventa destino. |
| Nenhuma condição verdadeira | **Condição sem cobertura** | Indica ausência de fallback, salvo encerramento explícito. |
| Duas condições verdadeiras no mesmo evento, sem prioridade definida | **Conflito** | Bloqueia resolução arbitrária e sinaliza ambiguidade. |
| Tela declarada como terminal | **Fim explícito** | A ausência de saída é válida. |

**A regra exata:** bifurcação condicional não é “qualquer tela com várias setas”, e sim **várias alternativas para o mesmo evento de saída**, diferenciadas por condições. Isso evita confundir botões do menu com ramificações de estado.

### 7.2 Exemplo: pós-login, direto ou onboarding

Exemplo **hipotético** para explicar o comportamento, não substitui o fluxo já existente:

```text
Login ── evento: login.sucesso ──◆ cond.advogado.onboardingConcluido
                                  ├─ TRUE  ─> Home advogado
                                  └─ FALSE ─> Onboarding profissional
```

Não existe nó `branch` persistido à mão: o motor pode **gerar o desenho** a partir de duas conexões com o mesmo `origem.saida`, destinos diferentes e condições compatíveis.

### 7.3 Exemplo: Splash no material atual

No `advogadoja-fluxo-projecao (6).json`, o início do grafo registrado é sequencial:

```text
Splash → Boas-vindas → Entrar (Login) → bifurcação "Destino após autenticação"
```

Se posteriormente for decidido que a Splash deve encaminhar para Boas-vindas no primeiro acesso e para Login nos demais, isso é **uma alteração proposta no fluxo**, não uma regra já existente. Bastaria substituir a saída direta por duas conexões condicionais na Splash; o motor desenharia a bifurcação automaticamente.

---

## 8. Tela repetida versus caminho repetido: atualização sem efeitos colaterais

O fluxo possui **seis ocorrências** de `advogado.home_advogado`: entrada profissional direta, retorno pelo menu, pós-onboarding e pós-cadastro. Essas ocorrências compartilham a **mesma definição de tela**, mas não necessariamente o **mesmo caminho de entrada ou saída**.

| Alteração feita em… | O que muda | O que não deve mudar automaticamente |
|---|---|---|
| Definição de um componente | Todas as telas que referenciam o componente | Comportamento de componentes diferentes. |
| Definição visual de uma tela | Todas as ocorrências que usam a tela | Caminhos condicionais e históricos individuais. |
| Uma condição compartilhada | Todas as conexões que a referenciam, na próxima avaliação | Dados históricos já persistidos, sem regra explícita. |
| Uma **conexão compartilhada por ID** | Todos os segmentos/jornadas que referenciam aquela conexão | Conexões que possuem IDs independentes. |
| Um nó/ocorrência específico | Somente aquela posição, se não editar a definição compartilhada | Outras ocorrências da mesma tela. |
| Variável real do usuário | Reavaliação das transições afetadas | Reescrita automática do contrato de fluxo. |

**Limite importante:** o arquivo atual repete estruturalmente alguns caminhos de menu. **Mudar apenas uma cópia de caminho não atualiza as outras por mágica.** Para atingir o resultado desejado, o motor precisa extrair/registrar esses caminhos como um **segmento compartilhado** (`segmentRef`) ou como uma referência única de conexão. Esse é um requisito de migração, não algo já presente.

Exemplo proposto:

```json
{
  "segmentos": {
    "seg.profissional.menu": {
      "entradas": ["menu.abrir"],
      "conexoesRef": [
        "cx.menu.inicio",
        "cx.menu.atendimentos",
        "cx.menu.configuracoes"
      ]
    }
  },
  "jornadas": {
    "profissional.direto": {
      "segmentosRef": ["seg.profissional.menu"]
    },
    "profissional.posOnboarding": {
      "segmentosRef": ["seg.profissional.menu"]
    }
  }
}
```

Esse trecho é **ilustrativo**, não foi encontrado implementado nos arquivos analisados.

---

## 9. Estados: aparência, capacidade, etapa e navegação não são a mesma coisa

### 9.1 Quatro grupos suficientes

| Grupo | Exemplo | Local recomendado |
|---|---|---|
| **Estado visual local** | menu aberto/fechado, modal visível | Componente / apresentação. |
| **Estado de domínio** | OAB pendente/validada, disponibilidade online/offline | Dados/capacidades da aplicação. |
| **Estado de etapa** | onboarding em andamento/concluído | Jornada/executador de etapas, quando houver persistência. |
| **Estado de navegação** | rota atual, histórico, retorno previsto | Navegador/runtime, não no CSS. |

A Home profissional do catálogo do fluxo já apresenta **duas variantes declaradas**: `restricted` (`professionalAccess=restricted`, OAB pendente) e `enabled` (`professionalAccess=enabled`, OAB validada). A descrição de `advogado.home` em Jornadas também diz que a rota `/professional/home` permanece a mesma e que a condição da OAB afeta capacidades e apresentação. Isso **não deve gerar uma tela física nova**.

### 9.2 Exemplo de ciclo correto

```text
Cadastro → Onboarding → Validação → Home → Menu → Início → Home
                                   ^                  |
                                   └──────────────────┘
```

Quando a ação “Início” é acionada, o destino é a Home. O motor não interpreta que o usuário deve percorrer o onboarding outra vez simplesmente porque ele apareceu antes no desenho. Uma nova passagem pelo onboarding dependerá de regra de negócio explícita, por exemplo uma etapa realmente incompleta.

### 9.3 Evento de interface não é mudança de tela obrigatória

- Abrir o menu: muda estado `painel=aberto` do componente.
- Alternar disponibilidade: dispara uma ação (`online.toggle` já existe como atributo no componente), sujeita às regras da aplicação.
- Selecionar “Início”: dispara evento de navegação para a Home.
- Atualizar OAB para `enabled`: modifica contexto/capacidades; a Home existente passa a apresentar outra variante.

---

## 10. Como o motor transforma dados em fluxo e tela

```text
01. LER fontes permitidas: telas + componentes + catálogo/fluxo + registro de variáveis
      ↓
02. INDEXAR identidades, aliases explícitos, refs reversas e versões
      ↓
03. VALIDAR: tela/componentes existem? eventos/destinos/variáveis resolvidos?
      ↓
04. NORMALIZAR referências compartilhadas (sem copiar definições)
      ↓
05. AGRUPAR conexões pela origem + saída/evento
      ↓
06. INFERIR grafo: direta, bifurcação, opções, junção, retorno, fim, pendência
      ↓
07. AO EXECUTAR: ler contexto atual e avaliar condição(s) da ação acionada
      ↓
08. NAVEGAR segundo destino + política de histórico; atualizar contexto necessário
      ↓
09. RENDERIZAR tela: composição de componentes + variante visual + dados
      ↓
10. VISUALIZAR no construtor: desenho, indicadores e relações reversas
```

**Importante:** a geração do **desenho do grafo** pode ser feita mesmo sem usuário logado, exibindo todos os caminhos possíveis. Já a escolha do **caminho real em execução** precisa das variáveis do contexto. São dois momentos distintos.

### 10.1 Responsabilidade de cada camada

- **Biblioteca:** fonte da definição estrutural de telas/componentes.
- **Registro de ações:** traduz eventos de componente em comandos e/ou saídas de navegação.
- **Registro de conexões:** fonte dos vínculos entre telas.
- **Registro de condições/variáveis:** fonte de expressão e contrato de tipos, sem codificação dinâmica arbitrária.
- **Motor:** valida, indexa, resolve e calcula grafo/apresentação.
- **Visualizador de fluxo:** exibe o resultado interpretado pelo motor.
- **Runtime:** executa ações, consulta contexto e aplica política de navegação.

---

## 11. O que deve aparecer na visualização do Fluxo

### 11.1 Indicadores mínimos no desenho

| Indicador | Significado |
|---|---|
| Linha contínua | Conexão direta. |
| Losango / nó de decisão | Bifurcação condicional inferida pelo motor. |
| Saídas rotuladas | `true`, `false`, evento de ação ou identificador legível da condição. |
| Junção de linhas | Diferentes caminhos convergem para a mesma tela. |
| Laço/retorno | Destino aponta para tela já presente naquele percurso. |
| Ícone de vínculo compartilhado | Tela, componente ou segmento reutilizado. |
| Aviso | Referência sem destino, variável inexistente ou conflito entre condições. |
| Marcador de terminal | Fim de percurso declarado, sem erro. |

### 11.2 Painel ao clicar na tela

```text
[ Tela: advogado.home_advogado ]
  Identidade e origem da definição
  Rota: /professional/home
  Alias para documento Jornadas: advogado.home [validar mapeamento]
  Referências de componentes usados
  Estados de apresentação: restricted / enabled
  Ocorrências no fluxo: 6
  Entradas: origem + evento + condição + jornada/contexto
  Saídas: destino + evento + condição + política de navegação
  Dependências: condições, ações, componentes, segmentos
  Validação: referências resolvidas? duplicações? conflitos?
  Prévia visual: escolha do estado simulado
```

Ao clicar numa **conexão**, mostrar: `id`, origem, saída/evento, destino, condição, segmentos/jornadas que a reutilizam e impacto de alteração. Ao clicar num **componente**, mostrar telas consumidoras, estados visuais e eventos emitidos.

### 11.3 Ao editar

O sistema deve oferecer pelo menos duas intenções distintas:

1. **Editar definição compartilhada:** impacta todas as referências que apontam para o mesmo ID.
2. **Editar somente esta ocorrência/conexão local:** altera o vínculo específico, sem modificar a definição reutilizada.

O construtor deve mostrar previamente quais nós/percursos serão afetados, sem exigir que o usuário procure manualmente todos eles.

---

## 12. Exemplo completo de ligação entre componente, ação e conexão

### 12.1 Peça visual (componente já identificado na biblioteca)

```json
{
  "componenteRef": "advogado.home.status_online",
  "elemento": "online_status.e001",
  "atributoExistente": {
    "data-action": "online.toggle"
  }
}
```

### 12.2 Registro funcional (proposto)

```json
{
  "acoes": {
    "online.toggle": {
      "tipo": "comando",
      "capacidadeRequerida": "canActProfessionally",
      "alteraEstado": "professional.availability"
    },
    "menu.inicio": {
      "tipo": "navegacao",
      "saida": "menu.inicio"
    }
  }
}
```

### 12.3 Conexão de navegação (proposta)

```json
{
  "conexoes": {
    "cx.menu.inicio": {
      "origem": {
        "telaRef": "advogado.home_advogado",
        "saida": "menu.inicio"
      },
      "destino": {
        "telaRef": "advogado.home_advogado",
        "entrada": "principal"
      },
      "navegacao": "substituir"
    }
  }
}
```

**Nota de precisão:** `professional.availability`, `canActProfessionally` e `menu.inicio` aqui descrevem como o vínculo poderia ser especificado; os nomes finais e a autorização concreta exigem validação contra o aplicativo e o contrato de banco. No fluxo real há caminhos “Início” retornando à Home, mas ainda não um registro único `cx.menu.inicio`.

---

## 13. Migração mínima sem quebrar o que já existe

**Etapa A — leitura sem alterar:** gerar índice reverso a partir das 78 telas do catálogo e 197 ocorrências do grafo, mais as referências de componentes do documento de Jornadas. Mostrar relações e alertar incompatibilidades.

**Etapa B — normalização de IDs:** declarar aliases entre fontes onde confirmado (`advogado.home` e `advogado.home_advogado` exigem checagem), sem alteração silenciosa do acervo.

**Etapa C — conectividade:** extrair do grafo atual um conjunto de conexões nomeadas com `origem`, `saida`, `destino`, `condicaoRef` opcional; preservar o JSON legado como fonte durante comparação.

**Etapa D — deduplicação de trechos:** identificar menus e percursos repetidos; trocar cópias por `segmentRef` após confirmar equivalência de comportamento.

**Etapa E — inferência e visualização:** gerar os símbolos/linhas automaticamente, com verificações para conflitos, destinos ausentes, nós terminais e condições não cobertas.

**Etapa F — runtime:** vincular ações reais do protótipo/app, registro de variáveis e política de navegação; testar retorno de onboarding e alterações de estado OAB.

**Compatibilidade:** conservar `estrutura.html` e `estrutura.css` no primeiro momento; extrair novas responsabilidades para registros externos. Renomear essas chaves agora não é pré-requisito para a conectividade.

---

## 14. Critérios objetivos de aceite

- [ ] Selecionar `advogado.home_advogado` mostra todas as suas **6 ocorrências** no fluxo atual sem gerar seis definições visuais.
- [ ] Modificar um componente compartilhado atualiza a prévia de todas as telas consumidoras.
- [ ] Duas conexões para o **mesmo evento**, com condições excludentes, geram um **losango automaticamente**.
- [ ] Duas ações distintas em um menu geram **saídas de navegação**, não uma bifurcação booleana artificial.
- [ ] Uma rota inexistente ou variável não reconhecida gera indicador de **pendência**.
- [ ] Duas condições verdadeiras simultaneamente, sem desempate formal, geram indicador de **conflito**.
- [ ] Um final declarado de jornada pode não ter saída e **não é tratado como erro**.
- [ ] Ao concluir onboarding e voltar pela opção “Início”, o usuário é direcionado à Home, sem retorno indevido a etapas concluídas.
- [ ] `restricted` e `enabled` usam a **mesma tela Home**, apenas com apresentação/capacidades diferentes.
- [ ] Alterar uma conexão compartilhada afeta os percursos que a **referenciam por ID**; um percurso independente não muda.
- [ ] Ações de backend são autorizadas no domínio/runtime, não pela presença ou ausência de elementos CSS.
- [ ] O motor não conecta telas por proximidade espacial no diagrama.

---

## 15. O que ainda NÃO está fechado

É importante não transformar os seguintes exemplos técnicos em decisões silenciosas:

1. **Nomes físicos das chaves novas** (`conexoes`, `acoes`, `segmentos`, `condicaoRef`, `entrada`, `navegacao`) e versão final do schema.
2. **Variáveis oficiais de domínio** para primeiro acesso, onboarding concluído, OAB, disponibilidade e assinatura; fonte autoritativa de cada uma.
3. **Mapeamento oficial de IDs** entre as 110 telas do Jornadas e as 78 telas do catálogo de Fluxo, inclusive `advogado.home` ↔ `advogado.home_advogado`.
4. **Política exata de histórico** no Flutter/React e quando usar avançar, substituir, reiniciar ou voltar.
5. **Detecção/migração de segmentos compartilhados** na árvore atual repetida: o motor deve sugerir e validar antes de unificar trajetos que pareçam iguais.
6. **Tratamento específico de condições desconhecidas ou incompletas** no protótipo, além da obrigação de mostrá-las como pendências.
7. **Mudança eventual da Splash**: hoje é Splash → Boas-vindas → Login; desviar diretamente para Login por estado é uma possibilidade, ainda não regra comprovada pelo arquivo.
8. **Lugar físico de armazenamento** dos registros propostos, respeitando o isolamento entre módulos e o motor já existente.

Esses pontos **não impedem documentar e construir a visualização de relações**, mas impedem afirmar que o contrato JSON acima já existe ou está aprovado campo a campo.

---

## 16. Regra canônica final

> **Uma tela é uma definição; um componente é uma definição; uma conexão é uma referência; uma jornada é um percurso; um estado é um dado; o motor interpreta essas peças e gera a visualização.**
>
> **O motor não exige bifurcações desenhadas manualmente: ele identifica conexões diretas, alternativas condicionais, opções de navegação, junções e retornos a partir das referências, eventos e variáveis.**
>
> **Alterar o que é compartilhado altera seus consumidores; alterar uma ocorrência local não reescreve o restante do sistema.**

### Referências de origem

- `Projeto_9.zip` — `modulos/jornadas/data/documento.json` (`telas.advogado.home`, `componentes.*`).
- `Projeto_9.zip` — `modulos/jornadas/js/motor.js` (implementação existente, sem implementação garantida da nova proposta).
- `advogadoja-fluxo-projecao (6).json` — `catalog.entries`, `domain.flow.graph.root`, `domain.flow.state`.

