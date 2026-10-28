# Advogado Já — Definições consolidadas após a auditoria V3

**Data da consolidação:** 27/10/2026  
**Marco inicial:** auditoria e entrega de `AdvogadoJa_Workspace_Auditado_Jornada_Cliente_V3.html`.  
**Escopo:** decisões e requisitos discutidos **após** essa auditoria, até a discussão sobre uma seção compartilhada de navegação entre os motores.  
**Natureza:** documento de decisões de produto e arquitetura; **não** equivale a migração de JSONs, atualização de motores ou homologação técnica de funcionalidades.  
**Situação:** consolidado para continuidade das discussões.

> **Como interpretar este documento:**
> - **APROVADO:** decisão expressamente confirmada pelo usuário.
> - **REQUISITO EXPRESSO:** comportamento ou objetivo explicitamente solicitado, ainda que o contrato técnico exato não esteja definido.
> - **PROPOSTO / PENDENTE:** alternativa apresentada na conversa, sem aprovação definitiva ou ainda sujeita a detalhamento.
> - **EXEMPLO:** ilustração de comportamento, **não** nome de campo ou ID já homologado.
>
---

## 1. Referência de partida: última auditoria

A V3 é um **laboratório autocontido de trabalho com a jornada Cliente**, não uma atualização do catálogo completo de produção. Conforme o relatório da auditoria, contém:

| Característica | Situação na V3 auditada |
|---|---|
| JSONs de tela embutidos | 31, incluindo telas comuns utilizadas pelo Cliente |
| Componentes embutidos | 32, apenas os referenciados pelas telas desse recorte |
| Registros de catálogo no HTML | 63 |
| Recorte do Flow testado | 31 ocorrências, 1 bifurcação, 1 caminho |
| Montagens verificadas | 31/31 |
| Referências de componentes ausentes no recorte | 0 |
| Destinos de ações ausentes no recorte | 0 |
| Projeção preliminar de Banco | 17 entidades, 33 relações declaradas |
| Projeção preliminar de Interações | 80 itens declarados |

A origem corrigida mais ampla utilizada na auditoria tinha **106 telas e 142 componentes**, mas **não foi incorporada integralmente** ao HTML V3. A auditoria informou que o teste visual completo em navegador não foi homologado. Esses números são **baseline da auditoria** e não devem ser confundidos com resultados das novas funcionalidades discutidas a seguir.

**Arquivos de referência:**
- `AdvogadoJa_Workspace_Auditado_Jornada_Cliente_V3.html`
- `AUDITORIA_WORKSPACE_HTML_JORNADA_CLIENTE_V3.md`
- `ADVOGADOJA_CATALOGO_RECORTADO_CLIENTE_V3.zip`

**Limite de escopo:** nenhuma das decisões posteriores já foi aplicada automaticamente nesses arquivos apenas por ter sido discutida ou aprovada.

---

## 2. Decisões expressamente aprovadas

### D01 — Mapa integrado → Mapa de Interações **[APROVADO]**

A antiga visão do Mapa, predominantemente uma representação de telas, raias e conexões, **deixa de ser sua responsabilidade principal**. A área passa a ser um **Mapa de Interações**, para esclarecer **em qual tela, em que momento, por qual gatilho e com qual resultado** ocorrem operações do aplicativo.

O mapa deverá permitir inspecionar, por exemplo:

- Em qual tela o aplicativo aciona Google Maps ou outra API externa.
- Quando os dados de um usuário são carregados: na tela Entrar, na tela seguinte, ou após outra condição.
- Em qual evento os dados de um formulário são enviados; por exemplo, no último passo de cadastro.
- Qual operação, serviço ou fonte de dados é utilizado.
- Quais estados visuais acompanham a operação: carregando, sucesso, erro, bloqueio etc., conforme aplicável.
- Como o resultado da operação interfere na continuidade do percurso.

**Fronteira funcional:** o **Flow** define/mostra percursos e bifurcações; o **Mapa de Interações** explica ações, efeitos, serviços e transições de estado vinculados às telas. Não deve apenas repetir o desenho do Flow.

**PENDENTE:** forma definitiva do contrato dos eventos, operações, serviços, parâmetros, respostas e erros; mecanismo de inspeção e disposição visual do mapa.

### D02 — Banco como projeção dos contratos das telas **[APROVADO]**

Cada JSON de tela declara **suas necessidades de dados, operações e relações**. O motor Banco lê essas declarações e produz **uma projeção consolidada** das entidades/tabelas, campos e relacionamentos necessários ao aplicativo, **sem manter uma fonte mestre paralela**.

Consequências aprovadas:

1. A tela de cadastro declara os dados coletados e as operações necessárias.
2. Telas de perfil, solicitações e administração declaram o que leem, criam, alteram ou relacionam.
3. O Banco agrega informações repetidas referentes às mesmas entidades e sinaliza divergências para análise.
4. A projeção do Banco deriva dos contratos canônicos: o motor não inventa entidades que não estejam fundamentadas nos requisitos declarados.
5. **Mocks não definem o esquema do banco.** Servem à simulação e, se necessário, à verificação de cenários.

**PENDENTE:** estrutura tipada definitiva das declarações, cardinalidade, índices, segurança/permissões, regras de integridade e como consolidar campos conflitantes antes de qualquer geração real de banco.

### D03 — Protótipo com três subabas **[APROVADO]**

1. **Experiência:** navegação simulada do aplicativo/jornada, utilizando as telas e ações declaradas.
2. **Estados e Cenários:** seleção de estados previstos e de dados simulados sem depender do backend real.
3. **Motor / JSON:** inspeção dos campos lidos, dos componentes resolvidos, do estado/cenário escolhido e da montagem/projeção produzida.

**Diretriz:** o Protótipo utiliza as definições canônicas; não cria cópias próprias das telas ou dos componentes. A simulação não equivale à execução de autenticação, cobrança ou outras operações reais.

### D04 — Catálogo com três subabas **[APROVADO]**

1. **Árvore e JSON:** localizar, examinar, editar, validar, criar e importar registros de tela e componente; permitir organização legível.
2. **Montagem visual:** renderizar a tela e seus componentes, layout, estilos e estados para inspeção.
3. **Motor / JSON de uso:** apresentar as entradas consultadas, referências resolvidas, montagem transitória gerada e diagnósticos/pendências.

O **Motor de Montagem** permanece como serviço reutilizável, mas sua inspeção é integrada ao Catálogo, em vez de exigir uma aba principal independente.

### D05 — Importação/atualização pelo ID, com decisão caso a caso **[REQUISITO EXPRESSO]**

O usuário confirmou que a atualização deve identificar registros **pelo mesmo ID**, mas **não** aprova substituição global cega.

Ao importar uma jornada, o Workspace precisa abrir uma experiência de revisão (por exemplo, modal) que:

- Apresente **registro por registro** e, quando necessário, **campo por campo**, o que foi alterado.
- Ofereça **opções de tratamento por caso** (por exemplo, adicionar, manter atual, substituir, mesclar, criar variante, ignorar, inspecionar diferenças), de acordo com o tipo de conflito.
- Permita **múltiplas escolhas** e aplicação das decisões escolhidas pelo usuário.
- Indique quando um componente é **compartilhado** e quais outras telas/jornadas podem ser afetadas.
- Aplique somente as mudanças autorizadas, sem criar duplicatas por padrão.

**Não foi aprovada a regra de “substituir globalmente tudo” sem revisão.** A opção de atualizar um componente compartilhado preservando seu ID pode existir, mas seu impacto deve estar visível e sujeito à escolha do usuário.

**PROPOSTO / PENDENTE:** confirmação transacional do lote (validar tudo e aplicar de forma atômica), resolução de conflitos por campo, política de exclusões e semântica de mesclagem. São salvaguardas recomendadas, ainda a detalhar.

### D06 — Subjornadas sempre herdam o visual da jornada principal **[APROVADO]**

Quando uma jornada ou trecho dela é incorporado em outra, a subjornada deve **sempre herdar o contexto visual global da jornada principal**: menu, cabeçalho, tema e navegação global.

- **Mantém:** conteúdo específico das telas incorporadas, seus dados, estados, ações e identidade de tela.
- **Herda da principal:** o invólucro visual/global, evitando dois menus ou dois cabeçalhos sobrepostos.
- **Não exige:** renomear todos os IDs, clonar telas ou criar cópias dos componentes.
- **Não implica:** concessão automática de permissões funcionais de outra persona; controle de acesso precisa ser tratado separadamente.

**PENDENTE:** distinguir formalmente os componentes de **estrutura global** dos componentes de **conteúdo da tela** e definir como o motor remove/substitui a estrutura global da subjornada na renderização incorporada.

---

## 3. Jornada como unidade de trabalho editável — não apenas visualizador

**[REQUISITO EXPRESSO]** O usuário esclareceu que Jornadas deve ser uma das ferramentas centrais de **construção em lote**.

### 3.1 Exportar uma jornada completa

Deve ser possível exportar uma jornada para discutir e alterar **fora do Workspace** — inclusive em outra conversa do ChatGPT, em outro HTML ou em uma ferramenta offline. O pacote precisa ser suficientemente completo para que se possa:

- Consultar e modificar **todas as telas que compõem o escopo exportado**.
- Adicionar novas telas e modificar telas existentes.
- Modificar componentes, inclusive componentes reutilizados em várias telas.
- Revisar estados, mocks, dados, operações e interações.
- Alterar relações, ações, sequência, ramificações e entradas/saídas.
- Gerar um **novo JSON da jornada** e reimportá-lo.

**Princípio de integridade:** o JSON exportado para intercâmbio é um **pacote de trabalho**, não uma nova fonte mestre persistente concorrente com os JSONs individuais.

### 3.2 Importar e atualizar em lote

Ao importar a versão modificada, o Workspace deve reconciliar o pacote com o Catálogo canônico:

1. Identificar registros pelo ID estável.
2. Detectar registros novos, alterados, iguais e eventualmente conflitantes.
3. Comparar relações e dependências dos componentes.
4. Apresentar opções de atualização **caso a caso**, com seleção múltipla.
5. Validar referências antes de confirmar a atualização escolhida.
6. Atualizar os JSONs canônicos de telas/componentes e recalcular as projeções pertinentes dos motores.
7. Permitir exportar novamente o catálogo consolidado ou outra jornada atualizada.

**Nota:** os passos 4 e 6 expressam a finalidade requerida; o desenho exato da operação em lote e sua segurança transacional ainda carecem de contrato.

### 3.3 Exportação por jornada ou por recorte de Flow

O usuário indicou que também deseja **poder atualizar a partir de um fluxo ou trecho**, além da jornada inteira. A possibilidade foi discutida, mas o **formato e a granularidade da exportação de Flow** ainda não foram definidos.

### 3.4 Subabas de Jornadas — proposta ainda não formalmente homologada

A organização sugerida, após esclarecer sua função, é:

1. **Telas e Etapas:** inventário, abrangência e visualização dos blocos da jornada.
2. **Importação e Exportação:** pacote integral, comparação, escolhas e atualização em lote.
3. **Motor / JSON de uso:** inspeção da seleção dos registros, resolução de dependências e projeções de saída.

**Status:** proposta coerente com os requisitos do usuário, mas não houve aprovação literal dessas três subabas antes de a discussão evoluir para a modularidade das jornadas.

---

## 4. Mobilidade de jornadas e incorporação de subjornadas

### D07 — Incorporar uma jornada em outra por referência **[REQUISITO EXPRESSO]**

O usuário quer uma arquitetura que permita **mover, reutilizar ou incorporar um percurso inteiro** com alterações mínimas, sem reconstruir tela por tela.

**Exemplo trazido na conversa:** utilizar o trecho da jornada **Estudante, da Home em diante**, dentro de um **item no menu do Cliente**. Nesse contexto, a sequência de Estudante passa a funcionar como **subjornada da Cliente**.

Requisitos decorrentes:

- A identidade de uma tela não pode ficar rigidamente presa à jornada que a originou.
- A mesma tela/componente pode participar de diferentes percursos sem clonagem.
- Um destino de navegação poderá apontar não só para uma **tela**, mas também para uma **entrada reutilizável de percurso/subjornada**.
- É preciso delimitar a entrada e a abrangência da subjornada; por exemplo, incluir **Home Estudante em diante** sem importar indevidamente o cadastro/login da jornada Estudante.
- As relações internas da sequência devem acompanhar sua incorporação.
- A aparência global incorporada deve ser **a da jornada principal** (D06).
- Os dados e as regras de autorização necessários à operação não podem ser inventados pelo motor.

**PENDENTE:** formato definitivo dessa referência, definição formal de saída/retorno, composição aninhada de subjornadas e prevenção de ciclos/rotas indevidas.

### Identificadores — separação de responsabilidades **[PROPOSTO]**

Na conversa foram diferenciados três tipos de identidade:

| Conceito | Uso proposto | Observação |
|---|---|---|
| Identificador da tela | Chave estável da definição da tela | Deve sobreviver à mudança de jornada |
| Identificador da sequência/subjornada | Chave estável do trecho reutilizável | Não precisa ser o nome de uma pasta |
| Identificador do vínculo/incorporação | Contexto específico em que uma subjornada aparece em outra | Permite múltiplos pontos de inserção |

A distinção conceitual é útil, mas **os nomes concretos dos campos** (`telaId`, `subjornadaId`, `vinculoId` etc.) **não foram aprovados**.

---

## 5. Navegação compartilhada: questão arquitetural aberta

### 5.1 Debate sobre `flow.publicacao` e `sequenceId`

Foi proposta uma solução inicial de publicar uma sequência por `flow.publicacao` usando um `sequenceId` já conhecido pelo editor de Flow. **O usuário questionou essa localização**, porque a mesma informação precisa ser lida pelo **Flow, Protótipo, Jornadas e, potencialmente, Mapa de Interações**.

**Consequência:** `flow.publicacao` **não deve ser tratado como contrato aprovado**. Não se deve implementar esse nome/caminho apenas com base no exemplo anterior.

### 5.2 Proposta posterior: seção canônica compartilhada `navegacao` **[PROPOSTO / NÃO APROVADO]**

Foi apresentada a alternativa de colocar regras de percurso e composição numa **seção compartilhada do JSON da tela**, acessível por todos os motores consumidores.

Possíveis responsabilidades, **ainda não homologadas**:

- **Ocorrências:** a mesma tela pode aparecer em mais de um percurso/contexto.
- **Sequências:** organização dos percursos reutilizáveis.
- **Entradas:** pontos de acesso a telas e subjornadas.
- **Saídas:** continuação, encerramento ou retorno de percurso.
- **Condições:** bifurcações automáticas e alternativas declaradas.
- **Contexto:** associação da subjornada à principal e sua composição.

Foi igualmente discutido **não duplicar em `navegacao` aquilo que já pertence a `acoes`**, como o destino real de uma ação. A lista de campos acima serve apenas para investigação.

### 5.3 Fronteira de propriedade sugerida **[PROPOSTO]**

**Dados do produto — compartilhados:** identidade, conteúdo visual, estados, dados, eventos, operações e navegação operacional.  
**Dados exclusivos das ferramentas:** posições gráficas de nós, zoom, filtros e preferências de visualização, quando realmente necessários.

Em particular:

- **Flow:** edita ou projeta as sequências e bifurcações declaradas, em vez de ser o proprietário exclusivo das regras do aplicativo.
- **Protótipo:** lê as mesmas definições de navegação; acrescenta renderização, estados e mocks para simulação.
- **Jornadas:** organiza, exporta, importa e reutiliza conjuntos de telas/relações.
- **Mapa de Interações:** identifica os eventos e operações associados aos pontos do percurso.

**Decisão em aberto:** aprovar ou ajustar o princípio da seção compartilhada `navegacao`; **depois** decidir, campo por campo, o que migrará de `acoes`, `classificacao.jornadas` e `flow.editor`, o que continuará exclusivo e o que poderá ser eliminado. Nenhuma migração foi aprovada ainda.

---

## 6. Uso esperado dos motores — síntese do desenho discutido

| Motor/área | Fontes canônicas necessárias (conceitualmente) | Saída/finalidade | Situação |
|---|---|---|---|
| **Catálogo** | Identidade da tela/componente, instâncias por `ref`, estrutura, CSS, estados | Registro, edição, montagem visual e JSON de uso | Subabas aprovadas |
| **Montagem** | Tela + componentes referenciados + layout + props + estado/contexto | Renderização temporária, sem clonagem | Integração ao Catálogo aprovada; contrato fino pendente |
| **Jornadas** | Telas e componentes do escopo, conexões, sequências e contexto | Inventário e **pacote editável completo**; reconciliação em lote | Finalidade de edição em lote expressa; subabas pendentes |
| **Flow** | Regras de navegação, sequências, bifurcações e ocorrências | Diagrama e edição de percursos | Propriedade dos campos ainda em definição |
| **Protótipo** | Montagem, navegação, estados, cenários e mocks | Simulação de navegação e estados | Três subabas aprovadas |
| **Banco** | Dados, operações, entidades e relacionamentos declarados nas telas | Projeção unificada de esquema e vínculos | Princípio aprovado |
| **Mapa de Interações** | Eventos/ações, operações, serviços/fontes, estados e efeitos | Visualização de onde/quando/como interações ocorrem | Nova função aprovada |

### Princípios transversais que apareceram nas definições

- **Fonte canônica única:** cada tela e cada componente mantêm sua definição própria; os motores geram visões derivadas.
- **Reuso por identificador:** telas referenciam o mesmo componente sem criar um novo registro para cada uso.
- **Jornadas exportadas não viram mestres paralelos:** funcionam como pacotes transportáveis e editáveis para reconciliação posterior.
- **Compatibilidade entre motores:** um dado compartilhado deve ter **um proprietário canônico lógico**, mesmo quando vários motores o utilizam.
- **Inspeção do motor:** quando uma subaba diz “Motor / JSON”, o objetivo é enxergar entrada, transformação, saída e problemas; o contrato exato do rastreamento ainda precisa ser finalizado.
- **Evolução controlada:** primeiro fixar os contratos de dados; depois refatorar leitores/motores; só então migrar os registros reais.

---

## 7. Exemplos discutidos — ilustrativos, não schemas homologados

### 7.1 Menu Cliente inicia a Área de Estudos

**EXEMPLO CONCEITUAL (não implementar literalmente sem aprovação):**

```json
{
  "evento": "menu.estudos",
  "destino": {
    "tipo": "subjornada",
    "ref": "estudante.pos_home"
  }
}
```

A referência deve resolver o trecho de Estudante da Home em diante, preservando telas e relações internas e aplicando o invólucro visual global do Cliente.

**Em aberto:** se a chave do destino será `destino.ref`, como se declara entrada/retorno e qual seção contém a definição da sequência reutilizável.

### 7.2 Jornada exportada para edição externa

**EXEMPLO CONCEITUAL de conteúdo de intercâmbio:**

```json
{
  "tipoPacote": "jornada-completa",
  "jornadaRef": "cliente",
  "telas": ["... definicoes completas ..."],
  "componentes": ["... definicoes reutilizaveis necessarias ..."],
  "relacoes": ["... relacoes representadas pelas fontes canônicas ..."]
}
```

**Atenção:** `tipoPacote`, `jornadaRef` e os arrays acima são **nomes demonstrativos**. O formato oficial, a maneira de carregar dependências, a versão do contrato e a estratégia de reconciliação ainda precisam ser definidos. `relacoes` não deve originar uma segunda fonte concorrente às ações/navegação das telas.

### 7.3 Importação com múltiplas escolhas

Exemplos de decisões por registro:

| Diferença identificada | Possíveis opções — **a detalhar** |
|---|---|
| Tela nova | Adicionar / ignorar |
| Tela existente modificada | Substituir / mesclar campos / manter |
| Componente compartilhado modificado | Atualizar o ID existente após impacto / manter / criar variante |
| Relação ou entrada de subjornada alterada | Aplicar vínculo / manter vínculo / inspecionar dependências |
| Registro ausente no pacote | **Não presumir exclusão**; solicitar regra explícita |

Os exemplos acima registram a intenção do usuário de decidir **caso a caso**; não homologam todos os rótulos ou algoritmos de mesclagem.

---

## 8. O que **não** foi aprovado ou implementado

Para impedir que propostas retornem como “legado” ou sejam confundidas com decisões, ficam explicitamente **não homologados**:

1. O uso de `flow.publicacao` como localização definitiva da declaração de subjornada.
2. A escolha definitiva do campo/namespace `navegacao` e de seus subcampos.
3. A migração imediata de `flow.editor`, `acoes` ou `classificacao.jornadas` para outro lugar.
4. Usar `sequenceId` como identificador canônico universal de jornada/subjornada, sem separar seu papel editorial do operacional.
5. Os nomes concretos de `telaId`, `subjornadaId`, `vinculoId` ou os exemplos `destino.ref` e `tipo: subjornada` como contratos finais.
6. O formato definitivo de pacote de importação/exportação e o comportamento detalhado de mesclagem.
7. A remoção automática de arquivos ausentes de um pacote importado.
8. A aplicação de alterações em componentes compartilhados sem revisão de impacto.
9. A autorização automática de acesso funcional por herança de jornada.
10. A substituição/migração do catálogo V3 apenas por decisão conceitual neste chat.
11. A homologação visual e funcional integral do HTML V3 após essas discussões.

---

## 9. Próximas definições recomendadas — ordem de trabalho

Estas são **tarefas propostas**, não decisões já tomadas:

1. **Fechar a propriedade dos campos compartilhados.** Comparar `acoes`, `classificacao.jornadas` e `flow.editor`; decidir se haverá `navegacao` e quais campos ela terá.
2. **Definir jornada/subjornada reutilizável.** Identificador, ponto de entrada, limites do recorte, vínculos múltiplos, retorno, condições e contexto de herança visual.
3. **Separar visual global e conteúdo local.** Contrato do shell principal e regra de composição sem cabeçalho/menu duplicado.
4. **Homologar o formato de exportação completa.** Dependências, referências, versão do pacote, escopo (jornada inteira ou trecho) e possibilidade de edição offline.
5. **Projetar o modal de reconciliação.** Comparação, escolhas individuais/múltiplas, análise de impacto, validação do conjunto e confirmação.
6. **Definir eventos e interações.** Gatilhos, momento de chamada, serviço, dados enviados, respostas, estados e tratamento de falhas para o Mapa.
7. **Fechar o contrato de dados do Banco.** Entidades, campos, operações e relações por tela com unificação e detecção de divergências.
8. **Aprimorar a inspeção técnica dos motores.** Mostrar, com fidelidade, campos efetivamente lidos, resoluções por ID, transformações e saída.
9. **Só então migrar JSONs e otimizar os motores.** Validação regressiva das telas da jornada Cliente; expansão às demais jornadas quando o formato estiver estável.

### Critérios mínimos de validação futura (propostos)

- O mesmo componente referenciado em várias telas continua sendo **um único registro canônico**.
- Exportar e reimportar uma jornada sem alterações não modifica seus JSONs.
- Importar alterações apresenta uma comparação antes da aplicação e respeita as escolhas individuais.
- Uma subjornada pode ser incorporada por referência **sem renomear telas**, sem clonar componentes e **herdando o visual da principal**.
- O Flow e o Protótipo interpretam **as mesmas definições operacionais de navegação**, sem duas verdades divergentes.
- O Banco e o Mapa de Interações mostram **projeções derivadas**, identificando dados insuficientes em vez de inventá-los.
- A exportação integral do Catálogo após uma importação reflete exatamente as alterações aprovadas.

---

## 10. Ponto exato para retomar a conversa

**Última questão levantada pelo usuário:** se uma definição é usada pelo Flow e pelo Protótipo, ela não deveria morar em uma seção pertencente apenas ao Flow.

**Última resposta/proposta do assistente:** estudar uma seção canônica compartilhada chamada provisoriamente `navegacao`, sem fixar ainda seus campos, confrontando-a com as seções atuais `acoes`, `classificacao.jornadas` e `flow.editor`.

**Próxima pergunta objetiva a resolver:**

> **Aprovamos o princípio de uma área compartilhada para as regras operacionais de navegação, independente dos motores, deixando `flow` apenas com informações exclusivas do editor visual?**
>
> Se sim, revisar os campos existentes antes de escolher nomes e realizar qualquer migração.

---

**Controle de mudança:** este arquivo documenta decisões e propostas. **Não altera** o HTML V3, os 31 JSONs da amostra Cliente, os 32 componentes, o ZIP corrigido completo nem o GitHub.

---

# ADENDO V2 — Definições posteriores à primeira consolidação

**Atualização da conversa:** 27/10/2026.  
**Natureza:** continuação detalhada e cumulativa do documento original, preservado integralmente acima.  
**Marco deste adendo:** do debate sobre as seções do JSON canônico de tela até a proposta de indicadores de jornada/subjornada por tela.  
**Escopo de execução:** nenhuma mudança de catálogo, de motor ou de HTML é executada por este documento; é uma especificação em construção.

> **Regra de leitura e precedência:** os itens 1–10 acima foram preservados como registro integral do que estava definido na primeira consolidação. Onde uma decisão explícita posterior substitui uma alternativa ou pendência anterior, **a decisão posterior prevalece**. Isso não autoriza apagar o texto histórico ou interpretar exemplos como schemas aprovados. Os marcadores **[APROVADO]**, **[REQUISITO EXPRESSO]**, **[PROPOSTO]**, **[PENDENTE]** e **[EXEMPLO]** permanecem com o sentido estabelecido na abertura original.

## 11. Atualização expressa das decisões anteriores — quadro de precedência

| Tema | Situação na primeira consolidação | Definição atual | Natureza |
|---|---|---|---|
| Campo exclusivo `flow` | Debatia-se manter apenas informações editoriais ou migrar seus dados | **Eliminar `flow` do JSON canônico de tela**; o motor Flow lê `navegacao` e `acoes` | **APROVADO** |
| Área compartilhada de navegação | `navegacao` aparecia como proposta sem homologação | **Utilizar a seção compartilhada `navegacao`**, junto com `acoes`, para o Flow e outros consumidores; subcampos ainda não homologados | **APROVADO — princípio; PENDENTE — campos** |
| Estratégia de adoção | Falava-se em migrar o catálogo V3, com regressão posterior | **Não tratar os JSONs antigos como padrão nem executar migração deles**: construir o contrato novo diretamente usando cinco telas de referência; padronizar as demais só depois | **REQUISITO EXPRESSO** |
| Amostra de referência | V3 auditada: 31 telas e 32 componentes da jornada Cliente | **Laboratório de definição com 5 telas**: Splash, Boas-vindas, Entrar, Home Cliente e Home Advogado | **REQUISITO EXPRESSO** |
| Posições dos nós no Flow | Preferências gráficas ainda indefinidas | **Layout automático calculado pelas conexões, sem posições gravadas nos JSONs de tela** | **APROVADO** |
| Participação de telas em jornadas | Pensava-se em descobrir abrangência exclusivamente percorrendo ações | O usuário indicou que **cada tela deve ter indicadores simples de jornada/subjornada**, para permitir agrupamento explícito | **REQUISITO EXPRESSO — conceito; PENDENTE — forma** |
| `flow.editor` e `flow.publicacao` | Apareciam em exemplos e opções históricas | **Não devem compor o novo contrato canônico**; funcionalidades correspondentes precisam ser distribuídas em seções próprias ou derivadas | **DECORRÊNCIA da retirada de `flow`** |
| Importação e exportação de jornada | Editar em lote com decisão caso a caso | **Permanece integralmente válido**, sem simplificações: pacote completo, diffs, escolhas, referências, impactos e reconciliação | **MANTIDO** |
| Subjornada incorporada | Reutilização por referência e herança do visual principal | **Permanece integralmente válido**; indicadores de participação devem facilitar encontrar o conjunto de telas | **MANTIDO** |
| Mapa de Interações, Banco, Protótipo e Catálogo | Funções e subabas aprovadas | **Mantidas, sem mudanças** por este adendo | **MANTIDO** |

**Correção de leitura dos itens 8–10 do documento original:** o registro antigo de que `navegacao` não estava aprovada e de que o próximo passo seria uma migração tornou-se **histórico**. As decisões atuais estão no quadro acima. Do mesmo modo, qualquer exemplo antigo com `flow.editor` ilustra apenas o formato que estamos abandonando, não o novo contrato.

## 12. Novo método de padronização: cinco telas, sem migração do padrão antigo

### 12.1 Escopo inicial **[REQUISITO EXPRESSO]**

A definição do novo contrato não deve ser condicionada à forma como as 31 telas do recorte Cliente ou as 106 telas do catálogo anterior foram estruturadas. O usuário afirmou que essas telas **estão despadronizadas** e que usá-las como referência normativa criaria retrabalho e preservaria estruturas legadas desnecessárias.

Trabalharemos **diretamente no padrão novo**, com as cinco telas de laboratório:

| Tela de referência | Principal capacidade que ajuda a definir | Atenção |
|---|---|---|
| **Splash** | Ponto de entrada do aplicativo, inicialização, decisões automáticas e estados de carregamento | Não presumir automaticamente o destino final ou as consultas sem declarar regras |
| **Boas-vindas** | Navegação provocada por ação explícita de usuário, apresentação inicial | Clique é diferente de transição automática |
| **Entrar** | Formulário, login, comunicação com serviço, estados de processamento, resultado e decisões condicionais | Não homologar por exemplo o fluxo completo de autenticação/seleção de perfil |
| **Home Cliente** | Entrada ou trecho principal Cliente, menu, componentes globais compartilhados e navegação | Permite estudar herança visual e associação com outras subjornadas |
| **Home Advogado** | Segundo contexto de jornada, tema/menu distintos e componentes reutilizáveis | Permite testar a mesma tela compartilhada de Entrar com saídas diferentes |

Essas cinco telas formam **um laboratório de contrato**, não uma declaração de que o produto completo tenha apenas cinco telas. As demais serão padronizadas **depois** que o contrato estiver fechado. Não foi autorizada a exclusão das demais telas do projeto em definitivo.

### 12.2 O que significa “não migrar” **[REQUISITO EXPRESSO]**

- **Não** criar um conversor do formato antigo como pré-requisito para aceitar o novo contrato.
- **Não** reproduzir os campos antigos só por compatibilidade histórica.
- **Não** manter `flow.editor`, `flow_master.json` ou seções antigas como segunda fonte de verdade.
- **Não** herdar automaticamente identificadores, campos redundantes ou regras inconsistentes dos JSONs anteriores.
- **Sim** criar as cinco definições diretamente segundo o contrato novo, assim que seus campos forem homologados.
- **Sim** ampliar a padronização para o restante do catálogo posteriormente, com trabalho próprio — sem confundir essa futura expansão com uma migração de modelo obrigatória.

**Estado de implementação:** o contrato das cinco telas ainda está em discussão; este arquivo não afirma que novos JSONs já tenham sido criados.

## 13. Seções do JSON canônico de tela — situação após as decisões novas

O usuário pediu expressamente a revisão da lista original:

```text
schema
identidade
classificacao
estados
componentes
estrutura
estilos
acoes
dados
mocks
flow
```

A orientação adotada é **não redesenhar tudo indiscriminadamente**, mas garantir que cada responsabilidade exista **uma única vez** e seja lida por quantos motores precisarem. O quadro abaixo distingue uma seção considerada necessária conceitualmente de campos internos ainda em análise.

| Seção | Papel no contrato novo | Situação / observações |
|---|---|---|
| `schema` | Identificar e permitir validar a versão do contrato | **PROPOSTO manter**; formato/versão definitivos não aprovados |
| `identidade` | Chave e identificação estável da tela | **Princípio preservado**: identidade não muda para incorporar uma subjornada |
| `classificacao` | Organização editorial do registro no Catálogo | **PROPOSTO simplificar**; não deve ser outra fonte de participação operacional |
| `estados` | Declarar os estados possíveis e condições pertinentes da tela | **Mantido em princípio**; biblioteca padronizada + estados específicos já haviam sido aprovados anteriormente |
| `componentes` | Declarar instâncias e referências por ID para montagem/reuso | **Mantido em princípio**; sem duplicar a definição do componente |
| `estrutura` | Layout/encaixe da tela e composição de conteúdo | **PROPOSTO simplificar**; distinguir invólucro global herdável de conteúdo local |
| `estilos` | Estilos da tela/tema e regras visuais pertinentes | **PROPOSTO simplificar**; evitar replicar CSS de componentes globais |
| `acoes` | Eventos, operações, transições, mudanças de estado, destinos e condições | **Responsabilidade compartilhada aprovada em princípio**; formato tipado interno ainda por definir |
| `dados` | Fontes, requisitos de dados, operações e persistência usados também pelo Banco | **Ampliar quando homologado**; mocks não definem o banco |
| `mocks` | Cenários simulados para Protótipo e testes | **Preservar como dados de simulação**, não autoritativos |
| `navegacao` | Identificar jornadas/subjornadas, participações e entradas reutilizáveis | **Seção compartilhada adotada em princípio**; campos internos ainda propostos |
| `flow` | Antes misturava grafos, ocorrências e edição | **RETIRAR INTEGRALMENTE do JSON canônico** **[APROVADO]** |

A ordem da lista não é uma nova exigência técnica de serialização. **Não criar automaticamente `navegacao.participacoes`, `navegacao.entradas` etc. apenas com base neste quadro**: os exemplos das seções seguintes documentam candidatos a contrato.

### 13.1 Regras de propriedade da informação **[DIRETRIZ APROVADA EM PRINCÍPIO]**

- **Estado existe e é identificado em `estados`**, mesmo quando uma ação provoca sua mudança.
- **Gatilho e consequência pertencem a `acoes`**: evento do componente, operação, resultado e, quando houver, destino.
- **Requisitos e contratos de dados pertencem a `dados`**, não ao editor do Flow.
- **Mocks pertencem a `mocks`**, separados dos dados reais.
- **Estrutura e aparência pertencem às seções visuais e aos componentes**, não ao motor Flow.
- **Participação, entradas e composição de jornadas pertencem à navegação compartilhada**, sem regravar destinos de cada ação.
- **O Flow e o Protótipo são leitores da mesma definição operacional**; não existem duas listas de bifurcações independentes.
- **Dados do produto não são configurações da ferramenta**: posições e zoom de um gráfico não são regras do aplicativo.

## 14. Flow Editor — função definida por responsabilidade, não por campo legado

### 14.1 O que o Flow Editor precisa fazer **[PROPOSTA FUNCIONAL DISCUTIDA]**

O assistente enumerou seis funções essenciais do editor. O usuário aprovou explicitamente a organização automática do layout, mas **não homologou ainda cada comando de edição em seus detalhes**:

1. **Visualizar:** desenhar telas e as conexões efetivamente declaradas.
2. **Conectar:** permitir criar, revisar e remover ligações, atualizando a definição canônica correspondente.
3. **Bifurcar:** representar decisões por evento, condição e resultados possíveis, sem escolher rotas arbitrárias.
4. **Organizar:** agrupar e destacar jornadas, subjornadas e trechos reutilizáveis.
5. **Inspecionar:** abrir os dados de origem de uma aresta: evento, ação, condição, operação, estado e destino.
6. **Validar:** detectar IDs/destinos ausentes, eventos sem contrato, ramificações incompletas, condições ambíguas e outros problemas de consistência.

O motor do Flow **não precisa construir HTML nem executar serviços de login/API**. A sua finalidade é uma representação editável do percurso e dos pontos que a constituem.

### 14.2 Regra formal de layout **[APROVADO]**

> **O Flow Editor organiza os nós automaticamente pelas conexões e não grava posições gráficas nos JSONs das telas.**

- O desenho é **calculado** a partir do grafo produzido pelo resolvedor.
- A ordem gráfica em tela não pode alterar silenciosamente uma regra de navegação.
- Coordenadas `x/y`, zoom, arraste ou preferências de apresentação **não** pertencem ao contrato da tela.
- **Não foi aprovado** um arquivo persistente separado de posições manuais como necessidade atual.
- Se no futuro o editor permitir reordenar elementos de interface, deverá distinguir **reordenar visualmente** de **editar navegação real**.

### 14.3 Edições do Flow e onde gravariam **[PROPOSTA DE COMPORTAMENTO]**

| Edição na interface do Flow | Propriedade canônica afetada | Nota |
|---|---|---|
| Criar ou modificar conexão de saída de uma tela | `acoes` da tela **de origem** | Entradas recebidas pela tela de destino são calculadas; não duplicá-las |
| Criar condição para uma transição | Regra tipada associada à ação | Exigir critérios explícitos e tratamento seguro conforme o tipo |
| Criar ponto de entrada de jornada ou subjornada | `navegacao` da tela inicial | Sem criar `flow.publicacao` |
| Revisar estados referenciados | Ler `estados`; editar nele somente se intenção for alterar a definição do estado | Não escrever uma cópia do estado dentro do Flow |
| Adicionar nova tela | Criar JSON canônico no Catálogo | Aparecer no grafo é consequência de uma definição real |
| Apagar uma linha/ligação | Revisar e atualizar a ação correspondente | Exige confirmação e análise de impactos pertinentes |
| Remover nó apenas da visualização | Ocultar/filtrar visualmente, quando suportado | **Não** excluir automaticamente seu JSON |
| Mover um cartão pelo desenho | Nenhum JSON canônico | Layout automático mantém a representação |

Os nomes exatos de comandos e validações serão detalhados quando o editor for implementado.

### 14.4 Relação entre ordem de sequência e navegação efetiva **[DIRETRIZ ARQUITETURAL]**

- A colocação de telas na mesma jornada/subjornada **não** cria uma transição implícita.
- Uma ordem `1.1`, `1.2` ou uma ordem editorial **não significa “próxima tela”**.
- Uma conexão efetiva depende do evento/resultado e da transição declarada em `acoes`.
- Um grafo pode ter bifurcações, retornos, telas compartilhadas, laços e caminhos não lineares.
- O compilador deve diferenciar **pertence ao conjunto** de **pode navegar para**.

## 15. Exemplo das cinco telas e o papel de cada informação

**[EXEMPLO]** A apresentação discutida foi:

```text
Splash --(inicialização)--> Boas-vindas --(continuar)--> Entrar
                                                    |
                                              (login + perfil)
                                             /               \
                                      cliente              advogado
                                        |                    |
                                    Home Cliente        Home Advogado
```

**Importante:** esse desenho é **ilustrativo**. Não homologamos se a Splash sempre leva a Boas-vindas, nem se Entrar consulta perfil antes/depois, nem a totalidade das condições reais de autenticação/onboarding.

| Informação no exemplo | Onde pertence | O que o motor faz |
|---|---|---|
| “Esta é a tela Entrar” | `identidade` | Encontra a tela pelo ID |
| “Entrar participa do percurso de Cliente e Advogado” | `navegacao` (formato a definir) | Reconhece participações múltiplas |
| “Usuário clicou em Enviar” | Evento tratado por `acoes` | Seleciona a ação pertinente |
| “Iniciar autenticação” | `acoes` referencia operação; `dados` descreve contrato | Mapa identifica chamada; runtime executa quando autorizado |
| “Enquanto espera, estado autenticando” | `estados` define; `acoes` referencia ativação | Protótipo simula, Flow pode exibir efeito |
| “Falha no login” | Estado definido em `estados`; resposta definida na ação | Protótipo apresenta o estado de erro |
| “Perfil Cliente leva à Home Cliente” | Destino condicionado em `acoes` | Resolvedor avalia a transição |
| “Entrar tem caminho também para Advogado” | Outra condição/resultado em `acoes` | Flow desenha bifurcação; Protótipo simula opção |
| “Home tem menu reutilizável” | `componentes` referencia ID único | Motor Montagem resolve o mesmo componente canônico |

### 15.1 Esboço de ação para Entrar **[EXEMPLO, NÃO SCHEMA APROVADO]**

```json
{
  "id": "realizar_login",
  "evento": "formulario.enviar",
  "operacao": "auth.login",
  "aoIniciar": { "estado": "autenticando" },
  "aoErro": { "estado": "erro" },
  "aoSucesso": {
    "rotas": [
      {
        "quando": { "campo": "sessao.perfil", "operador": "igual", "valor": "cliente" },
        "destino": { "tipo": "tela", "ref": "cliente.home" }
      },
      {
        "quando": { "campo": "sessao.perfil", "operador": "igual", "valor": "advogado" },
        "destino": { "tipo": "tela", "ref": "advogado.home" }
      }
    ],
    "semCorrespondencia": { "estado": "erro" }
  }
}
```

O exemplo separa **declaração de estado** de **transição para estado**; e **contrato de operação** de **efeitos da operação**. Os rótulos `aoIniciar`, `aoErro`, `aoSucesso`, `rotas`, `semCorrespondencia` e os IDs são ilustrativos, não nomes homologados.

**Regra anterior mantida:** em bifurcação por ação de usuário, o protótipo aguarda a escolha/ação explícita; não toma a primeira rota automaticamente. Em decisões automáticas, condições declaradas e resolução segura são exigidas.

## 16. Resolvedor compartilhado de navegação — desenho discutido

### 16.1 Por que precisa existir **[PROPOSTO, EM DETALHAMENTO]**

Em vez de cada motor implementar sua própria interpretação de `navegacao` e `acoes`, foi proposto um **resolvedor de relações compartilhado**. Seu objetivo é conferir comportamento consistente entre Flow, Jornadas e Protótipo, com possibilidade de consulta pelo Mapa de Interações.

O usuário aprovou avançar para sua definição após confirmar o layout automático do Flow. **Essa continuidade não é, por si, homologação de todas as funções ou da API do resolvedor.**

**Não é sua responsabilidade:** renderizar HTML/CSS, executar autenticação, fazer consultas Google Maps ou persistir outra fonte mestre.

### 16.2 Divisão sugerida em duas capacidades **[PROPOSTO]**

| Capacidade | Entrada | Processamento | Saída derivada | Consumidores |
|---|---|---|---|---|
| **Compilar relações** | IDs de telas, indicadores de navegação, ações, destinos | Indexar registros, resolver entradas, verificar referências, construir nós e arestas, reconhecer participação por jornada | Índice/grafo **temporário** e diagnósticos | Flow, Jornadas, exportação/importação |
| **Resolver transições** | Tela atual, evento acionado, resultado de operação, contexto, regras em `acoes` | Selecionar regras aplicáveis, avaliar condições tipadas e indicar estado/destino ou ausência de correspondência | Resultado de transição **temporário** | Protótipo; futuro runtime do app |

As duas capacidades precisam consultar a **mesma estrutura canônica**. Não devem manter coleções independentes e divergentes de ações/conexões.

### 16.3 Leitura mínima conceitual **[PROPOSTO]**

- `identidade`: localizar telas de origem/destino pelo ID.
- `navegacao`: localizar pontos de entrada e identificar os conjuntos de jornada/subjornada a que telas pertencem.
- `acoes`: extrair eventos, operações, resultados condicionais e destinos.
- `estados`: validar que estados mencionados nas ações existem, quando necessários.
- `dados`: validar contratos de operações/dados referenciados, quando definidos.
- `mocks`: **não** usar como fonte canônica das relações; o Protótipo pode fornecer resultados simulados ao resolvedor.

**Objetivo da inspeção “Motor / JSON de uso”:** mostrar precisamente as entradas consultadas, a transformação feita, os IDs resolvidos, a saída derivada e os avisos. A definição de rastreamento de execução ainda está pendente.

## 17. Identificadores explícitos de jornada/subjornada em cada tela — proposta nova

### 17.1 Necessidade expressa pelo usuário **[REQUISITO EXPRESSO]**

O usuário sugeriu que **cada tela traga um indicador simples** da jornada e da(s) subjornada(s) em que participa, podendo haver mais de uma participação. A motivação é facilitar uma organização clara/linear e encontrar de maneira determinística as telas que pertencem a um recorte, sem depender exclusivamente de percorrer as ações.

Exemplo de apresentação levantado pelo usuário: **Jornada 1 → Subjornada 1.1, 1.2**. Esses números foram apresentados como **exemplo**, não como proposta fechada de chave técnica.

Foi sugerida a seguinte distinção:

- **ID técnico estável** de jornada/subjornada para ligações e composição; não derivado de ordem variável.
- **Número ou ordem visual** (`1`, `1.1`, `1.2` etc.) apenas para apresentar hierarquia de forma humana.
- **Nome legível** da jornada/subjornada para o Catálogo/Flow/Jornadas.
- **Indicador por tela** de participação em uma ou várias delas.

O usuário ainda não escolheu o formato definitivo nem a fonte exclusiva dos nomes.

### 17.2 Proposta mínima de organização **[PROPOSTO, AINDA NÃO APROVADO]**

O último desenho apresentado foi reservar em `navegacao` dois conceitos:

| Candidato | Função | Por que facilita | Decisão faltante |
|---|---|---|---|
| `participaEm` | Lista de IDs estáveis de jornadas/subjornadas em que a tela participa | Encontrar todas as telas de um recorte, inclusive telas compartilhadas | Se deve trazer somente a subjornada específica ou jornada + subjornada explicitamente |
| `entradas` | Define no ponto inicial um percurso reutilizável, com ID, nome, tipo e ordem editorial, se necessário | Localizar ponto inicial e metadados da jornada sem repeti-los em toda tela | Campos exatos, se nome fica na entrada e como organizar múltiplos contextos |

**Não confundir:** `participaEm` é uma declaração de **pertencimento**, não de transição. `entradas` é uma declaração de **ponto inicial**, não uma lista das conexões internas. Destinos e condições das ações permanecem em `acoes`.

### 17.3 Exemplos simplificados **[EXEMPLOS, NÃO DEFINIÇÃO OFICIAL]**

**Tela Home Cliente associada à sua área funcional:**

```json
{
  "identidade": { "id": "cliente.home" },
  "navegacao": {
    "participaEm": ["cliente.pos_home"],
    "entradas": [
      {
        "id": "cliente.pos_home",
        "nome": "Operação Cliente",
        "tipo": "subjornada",
        "jornada": "cliente",
        "ordemVisual": 2
      }
    ]
  }
}
```

**Tela compartilhada Entrar em mais de uma jornada:**

```json
{
  "identidade": { "id": "auth.entrar" },
  "navegacao": {
    "participaEm": ["cliente.autenticacao", "advogado.autenticacao"]
  }
}
```

**Uso de numeradores de exibição (exemplo):**

```text
1 · Cliente
   1.1 · Entrada / Autenticação
   1.2 · Operação Cliente
   1.3 · Área de Estudos incorporada por referência
2 · Advogado
   2.1 · Entrada / Autenticação
   2.2 · Operação Advogado
```

Números e nomes acima são ilustrativos. **Não foi decidido embutir o número de ordem no ID**; a recomendação foi explicitamente não amarrar a identidade técnica à ordem de exibição.

### 17.4 Como a reutilização de subjornada se beneficiaria disso

Se uma tela Cliente apontar, em uma ação, para a entrada da subjornada `estudante.pos_home`, o resolvedor poderá:

1. Identificar a entrada declarada dessa subjornada.
2. Reunir as telas que declaram participação nela.
3. Consultar as **ações reais** para construir conexões internas e bifurcações.
4. Identificar problemas de escopo, referências, permissão ou saída/retorno antes de navegar/exportar.
5. Montar a experiência com **menu, cabeçalho, tema e navegação global da jornada Cliente** — regra já aprovada.
6. Preservar IDs das telas e definições únicas dos componentes, mesmo que a subjornada seja incorporada em outros lugares.

Isso **não** significa que todas as telas de um mesmo grupo sejam percorridas linearmente em qualquer ordem; a navegação efetiva continua definida pelas ações.

### 17.5 Uma distinção ainda aberta: indicar apenas subjornada ou os dois níveis

A pergunta objetiva que ficou sem resposta é:

- **Alternativa A:** cada tela informa apenas a(s) **subjornada(s) mais específica(s)**; o resolvedor deriva a jornada principal pela hierarquia dessas subjornadas.
- **Alternativa B:** cada tela informa **explicitamente** a jornada e a subjornada, por exemplo `jornada: cliente` e `subjornada: cliente.pos_home` (considerando telas compartilhadas e múltiplas participações).

**Status: PENDENTE.** A última mensagem do usuário solicitou atualização deste documento **antes** de responder a essa pergunta. Portanto **não registrar nenhuma alternativa como aprovada**.

### 17.6 Outras questões ainda não resolvidas

- Onde é declarada e validada a hierarquia de jornadas/subjornadas sem criar um segundo cadastro concorrente.
- Como distinguir **pertencimento original** de **incorporação contextual**: a Área de Estudos não deve exigir alterar todas as telas de Estudante para adicionar `cliente`.
- Como definir limites de alcance, saídas, retorno ao chamador e prevenção de ciclos.
- Se uma tela puder iniciar mais de uma sequência reutilizável, como declarar entradas distintas sem conflito.
- Se o número editorial deve ser calculado por ordem ou configurável explicitamente.
- Se `classificacao.jornadas` deve ser retirado/simplificado ao homologar `navegacao`, evitando duas fontes de verdade.
- Como impor permissões e pré-requisitos de dados num contexto incorporado, independentemente da herança visual.

## 18. Arquitetura consolidada dos consumidores — sem `flow` no JSON canônico

| Responsável | Quais seções lê (conceitualmente) | O que produz/faz | Restrição importante |
|---|---|---|---|
| **Catálogo** | `schema`, `identidade`, `classificacao`, `componentes`, `estrutura`, `estilos`, `estados` | Inspeção/edição de registros, prévia e composição visual | Não duplica componente por uso |
| **Montagem** | `componentes`, `estrutura`, `estilos`, `estados`, dados fornecidos à tela | Resolve instâncias por ID e monta HTML/CSS/estado **temporários** | Se subjornada incorporada, usa invólucro visual da principal |
| **Resolvedor compartilhado** | `identidade`, `navegacao`, `acoes`; referências a `estados`/`dados` para validação | Índices de relações, transições e diagnósticos | Não é outra fonte mestre |
| **Jornadas** | `navegacao`, `acoes`, telas/componentes do escopo | Visão de etapas, composição, exportação completa e importação em lote | Comparação/reconciliação por ID com escolha individual/múltipla |
| **Flow** | Projeção do resolvedor baseada em `navegacao` + `acoes` | Grafo auto-organizado, edição e validação | **Não** consulta `flow.editor`; **não** grava coordenadas na tela |
| **Protótipo** | Resolvedor + montagem + `estados` + `mocks` | Percurso navegável com estados simulados | Sem execução real de serviços pelo protótipo |
| **Banco** | `dados`, operações/relações declaradas | Projeção de entidades, tabelas e vínculos | Mock não define esquema |
| **Mapa de Interações** | `acoes`, `estados`, `dados` e operações/serviços declarados | Onde, quando, por que e com que resultado ocorrem interações | Não substitui visualização do Flow |

**Subabas previamente aprovadas (reafirmadas sem alteração):**

- **Catálogo:** Árvore e JSON; Montagem visual; Motor / JSON de uso.
- **Protótipo:** Experiência; Estados e Cenários; Motor / JSON.
- **Mapa:** convertido em Mapa de Interações.
- **Banco:** consolidação de declarações feitas pelas telas, não uma fonte separada.
- **Jornadas:** permanece requisito central a exportação/importação completa e editável. As três subabas sugeridas no item 3.4 do documento original continuam **propostas**, sem aprovação literal.

## 19. Itens que NÃO devem ser confundidos com aprovação

1. **Não** foi aprovado um schema JSON final para `navegacao`, `acoes`, `dados` ou um contrato formal do resolvedor.
2. **Não** foi escolhida a alternativa “participar apenas da subjornada” versus “declarar jornada e subjornada”.
3. **Não** foram aprovados IDs como `auth.entrar`, `cliente.home`, `advogado.home` ou `estudante.pos_home` como nomes finais de registros; são exemplos de estrutura.
4. **Não** foi aprovada a numeração `1`, `1.1`, `1.2` como parte técnica de identificadores.
5. **Não** foi aprovada uma ordem de transição implícita entre telas da mesma subjornada.
6. **Não** foi homologado o percurso completo Splash → Boas-vindas → Entrar → Home; é exemplo para testar bifurcação e login.
7. **Não** foi aprovado persistir coordenadas de nós ou manter campo `flow` para preferências editoriais.
8. **Não** foi autorizado apagar registros de outras jornadas só porque o laboratório inicial usará cinco telas.
9. **Não** foi aprovado aplicar importações por ID sem revisão dos impactos, inclusive componentes compartilhados.
10. **Não** foram implementados os motores ou JSONs novos apenas por esta discussão.

## 20. Próximas decisões recomendadas, na ordem

1. **Escolher o indicador de participação:** apenas subjornada específica ou jornada + subjornada explícitas, contemplando telas compartilhadas.
2. **Homologar os campos mínimos de `navegacao`:** ID(s) de participação, entrada(s), metadados de hierarquia/nome/ordem, sem repetir ações.
3. **Definir `acoes` como contrato tipado:** eventos, transições, operações, condições, estados de início/sucesso/erro, destino `tela` ou `subjornada`, retorno e fechamento de percurso.
4. **Definir os limites de subjornadas:** entrada, pertinência, saídas, retorno, ciclos e visual herdado da principal, com autorização separada.
5. **Detalhar o Resolvedor Compartilhado:** entrada/saída de compilação, transição e diagnósticos, com rastreamento legível no “Motor / JSON de uso”.
6. **Padronizar as cinco telas do laboratório diretamente no contrato novo**, sem converter os JSONs despadronizados antigos.
7. **Definir e auditar o Motor Flow** sobre as cinco telas: grafo automático, bifurcações, edição do campo proprietário, sem cópias e sem `flow`.
8. **Testar o Protótipo e Jornadas sobre o mesmo resolvedor**, preservando navegação simulada e exportação/importação de pacotes completos.
9. **Retomar campos de dados/Banco e eventos/Mapa de Interações**, observando contratos e decisões mantidos no documento original.
10. **Depois** ampliar o padrão ao restante das telas e componentes, sem criar estrutura paralela compatível com o legado.

### Critérios de aceitação sugeridos para o primeiro laboratório (a homologar)

- Todas as cinco telas são reconhecidas por IDs estáveis sem campo `flow`.
- Flow e Protótipo veem exatamente as mesmas ligações declaradas em `acoes`.
- Entrar pode ser compartilhada por Cliente e Advogado sem duplicar a tela.
- Os estados de autenticação existem em `estados`, e as ações apenas os referenciam.
- As bifurcações são mostradas com suas condições explícitas; resultados indefinidos não selecionam automaticamente um destino.
- O Flow desenha automaticamente os nós, sem armazenar posições na definição da tela.
- Uma alteração de ligação pelo editor atualiza **somente a seção canônica competente** e reaparece nos outros leitores.
- Os indicadores de participação permitem inventariar uma subjornada sem tomar as conexões como única forma de descoberta.
- O mesmo componente global permanece único e pode ser reutilizado em Home Cliente e Home Advogado quando pertinente.
- Nenhum exemplo de serviço, estado ou tela é tomado automaticamente como regra final de produto.

## 21. Ponto exato para retomar a discussão após este adendo

**Última proposta substantiva:** atribuir a cada tela indicadores simples de jornada/subjornada, com nomes e ordem de apresentação disponíveis em um ponto canônico, preservando o ID técnico estável da tela e a flexibilidade de reutilização.

**Pergunta ainda não respondida pelo usuário:**

> A tela declara apenas a(s) subjornada(s) específica(s), e o motor deriva a(s) jornada(s) principal(is) pela hierarquia? Ou declara explicitamente a jornada e a subjornada?

**Duas decisões já consolidadas que não devem ser reabertas por padrão:**

- `flow` **não existe** no novo JSON canônico das telas; Flow lê `navegacao` + `acoes` e se organiza automaticamente.
- A subjornada incorporada **sempre herda o visual global da jornada principal**, sem herdar permissões automaticamente.

**Controle de mudança V2:** preservado integralmente o texto da consolidação inicial; acrescentado este adendo com decisões, requisitos, propostas e exemplos posteriores. **Nenhum motor, JSON real, HTML ou repositório GitHub foi modificado.**

---

# ADENDO V3 — Identificadores de participação, três ordens, variação contextual e modelo visual híbrido

**Data da atualização:** 27/10/2026.  
**Marco:** conversas posteriores à consolidação V2, incluindo a aprovação expressa do modelo híbrido de estrutura e estilos.  
**Natureza:** adendo cumulativo; os capítulos 1–21 do documento V2 permanecem integralmente preservados acima.  
**Execução:** documento de definição, sem afirmar que JSONs de tela, componentes, motores, HTMLs ou GitHub tenham sido atualizados.

> **Regra de precedência:** as decisões novas prevalecem sobre perguntas históricas nos capítulos anteriores, **sem apagar seu registro**. O que está marcado `[PROPOSTO]` ou `[PENDENTE]` não pode ser tratado como contrato homologado pelo motor. Especificamente, a pergunta sobre declarar apenas a subjornada foi superada: o usuário passou a exigir explicitamente jornada e subjornada em cada participação.

## 22. Quadro de atualização: o que foi definido desde a V2

| Tema | Situação na V2 | Situação após a conversa seguinte | Status |
|---|---|---|---|
| Indicadores por tela | Jornada e subjornada explícitas ainda eram alternativa | **Ambos os identificadores, jornada e subjornada, devem aparecer diretamente em cada participação da tela** | **APROVADO** |
| Nomes dos agrupamentos | Dúvida se ficarão apenas na entrada | **Repetir ID e nome** da jornada e da subjornada em seus registros de participação para leitura, pesquisa e comparação | **APROVADO** |
| Formato da participação | Lista de IDs simples era um exemplo | **Coleção de participações, cada item com identificador próprio e estável** | **APROVADO** |
| Ordenação | Campo ou hierarquia ainda em discussão | **Três ordens explícitas:** da jornada, da subjornada e da tela naquele contexto | **APROVADO** |
| Fluxo x ordenação | Ordem não deve criar navegação | **Mantido:** ordem serve à organização/inventário; somente ações declaram transições | **MANTIDO** |
| Participação contextual | Existência de usos múltiplos proposta | Tela reutilizada em onboarding, configurações etc. pode apresentar textos, componentes e ações diferentes por contexto, estados e dados | **REQUISITO EXPRESSO** |
| Estrutura, estilos e componentes | Separados no contrato geral | Estrutura HTML e estilos CSS **base separados**, variantes parciais e substituição de blocos inteiros quando necessário | **APROVADO** |
| Condições das variantes | Eram explicações e exemplos | Seleção por **participação, contexto, estado e dados** | **APROVADO — capacidade; PENDENTE — sintaxe e precedência** |
| Seleção e prioridades | Ainda não havia contrato | Discutir avaliação central das regras, ordem de aplicação e solução explícita de conflitos | **EM DISCUSSÃO** |

As decisões dos capítulos 2–18 sobre Banco, Mapa de Interações, Catálogo, Protótipo, pacote integral editável de Jornadas, reconciliação caso a caso, herança do layout principal, remoção de `flow` e organização automática do Flow **continuam integralmente válidas**. Este adendo não as resume, substitui nem desprioriza.

## 23. Participações explícitas por tela — IDs, nomes e ordenação

### 23.1 Cada participação é um registro próprio **[APROVADO]**

O JSON de cada tela deve conter **uma coleção de participações**: cada item tem sua própria identidade, mesmo que a tela seja reutilizada em contextos semelhantes. O usuário explicitou que isso facilita comparação, relações entre registros, inclusão de novas participações e manipulação individual na importação/exportação.

Para cada participação, os conceitos necessários são:

1. **ID da participação** — identifica unicamente aquele uso específico da tela, não a tela em si;
2. **ID da jornada** — chave técnica estável da jornada;
3. **Nome da jornada** — rótulo legível, repetido de modo consistente nas participações;
4. **Ordem da jornada** — valor editorial explícito para listagem;
5. **ID da subjornada** — chave técnica estável da subjornada;
6. **Nome da subjornada** — rótulo legível, repetido de modo consistente;
7. **Ordem da subjornada** — valor editorial explícito dentro da jornada;
8. **Ordem da tela** — valor editorial explícito para aquele uso dentro da subjornada.

Os **nomes concretos dos atributos** (`participacoes`, `ordemTela`, etc.) seguem como proposta de sintaxe até homologação do schema. O princípio da presença de cada informação acima está aprovado.

#### Exemplo conceitual da Home Cliente — ainda não é o schema oficial

```json
{
  "identidade": {"id": "cliente.home", "nome": "Home Cliente"},
  "navegacao": {
    "participacoes": [
      {
        "id": "participacao.cliente.home.operacao",
        "jornada": {"id": "cliente", "nome": "Cliente", "ordem": 1},
        "subjornada": {"id": "cliente.operacao", "nome": "Operação Cliente", "ordem": 2},
        "ordemTela": 1
      }
    ]
  }
}
```

**Nota:** IDs e números são apenas exemplos; a escolha definitiva dos códigos das cinco telas do laboratório e o formato de validação ainda estão pendentes.

### 23.2 Os IDs se repetem quando representam a mesma entidade **[APROVADO — princípio]**

- O **mesmo ID de jornada** se repete em todas as participações que apontam para aquela jornada;
- o **mesmo ID de subjornada** se repete nas participações que apontam para a mesma subjornada;
- os nomes correspondentes também podem se repetir para leitura humana, pesquisa offline e comparação;
- **cada participação recebe ID próprio**, para permitir diferenciar usos específicos;
- **o ID da tela não muda** ao reaproveitá-la em outra jornada ou contexto.

**Salvaguarda recomendada [PROPOSTO]:** ao alterar o nome/ordem de uma jornada ou subjornada, a ferramenta deve localizar, apresentar impacto e atualizar de maneira consistente as participações associadas pelo mesmo ID. O validador deve apontar divergência quando o mesmo ID trouxer nomes ou ordens incompatíveis no mesmo escopo. Não criar uma coleção mestre concorrente de nomes por causa disso.

### 23.3 Três ordens explícitas **[APROVADO]**

1. `jornada.ordem`: ordenação da jornada na apresentação/árvore;
2. `subjornada.ordem`: ordenação da subjornada dentro da respectiva jornada;
3. `ordemTela`: ordenação da participação da tela dentro da subjornada.

**Não derivar apresentação por ordenação alfabética** de nome de tela/pasta (ex.: Administração com letra A aparecendo sem contextualização). A organização editorial de arquivos no Catálogo e a ordenação operacional por jornada são conceitos relacionados, mas diferentes.

**Regra mantida:** essas ordens **não geram conexões nem substituem `acoes`**. Uma tela ordenada como terceira não necessariamente recebe uma transição da segunda: o Flow pode conter decisões, voltas, loops e entradas compartilhadas.

**Telas comuns e globais:** Splash, Boas-vindas e Entrar podem aparecer em percursos compartilhados; Notificações pode ser uma tela global acessível por diversas ações, sem ser forçada artificialmente a uma etapa consecutiva. O modo exato de representar uma tela global sem participação linear obrigatória ainda está pendente.

### 23.4 Reutilização e mesmo registro de tela **[REQUISITO EXPRESSO]**

O usuário explicou que a tela pode ser aberta, retornar, ser novamente aberta, ou aparecer em outra jornada com comportamento diferente. A existência de um ID individual por participação permite resolver o **uso específico** sem clonar a definição da tela. Também é compatível com participação repetida na mesma jornada/subjornada, embora a regra operacional final para múltiplas instâncias no mesmo ponto de percurso ainda precise ser formalizada.

**Exemplo de tela única com participações distintas:**

- Perfil durante onboarding — título "Complete seus dados"; operação de continuidade de cadastro;
- Perfil aberto em Configurações — título "Meu perfil"; operação de salvar edição;
- Termos de uso durante consentimento inicial — foco no aceite;
- Termos de uso consultados por Configurações — apresentação informativa, sem repetir a etapa de onboarding;
- Home Advogado — mesma estrutura visual geral, podendo ter itens do menu e conteúdos diferentes conforme dados e estados.

São **exemplos de comportamento**, não homologação das telas, textos, operações ou regras reais de acesso.

## 24. Participação, contexto, estado e dados são dimensões distintas

**[REQUISITO EXPRESSO — princípio de variação contextual]**

A tela canônica tem identidade única. A participação identifica onde a tela é usada. O contexto identifica o propósito/forma de abertura. O estado identifica sua situação transitória. Os dados indicam fatos disponíveis sobre sessão, perfil, consentimento, cadastros e operações. Essas dimensões podem agir simultaneamente.

| Dimensão | Exemplo | Onde é proprietária a informação |
|---|---|---|
| Identidade da tela | `perfil.tela` | `identidade` |
| Participação | `participacao.perfil.onboarding` | `navegacao.participacoes` |
| Jornada e subjornada | Cliente / Cadastro | `navegacao.participacoes`, sem registro duplicado em `classificacao` |
| Contexto | `modo: cadastro` ou `modo: edicao` | Contexto de entrada da participação/transição; formato definitivo pendente |
| Estado | `carregando`, `erro`, `pronto` | Definições em `estados`; ações referenciam mudanças |
| Dados | `cadastroConcluido: false` | Contratos em `dados`; valores vindos de runtime/mock conforme ambiente |
| Ação | `salvar`, `continuar`, `voltar` | `acoes` |
| Estrutura | Blocos e slots do HTML | `estrutura` da tela / componente |
| Estilos | CSS, padding, margem, responsividade | `estilos` da tela / componente |
| Propriedades de componentes | Itens de menu, título, visibilidade, rótulos | `componentes` + interface do componente referenciado |

**Regra transversal:** a condição de entrada na jornada, a composição visual e os dados não são concessões automáticas de autorização. Controle de acesso permanece uma obrigação separada, mesmo se um item estiver oculto por variante.

**Pendência relevante:** qual campo transporta o contexto de entrada até a tela e como uma ação aponta a uma **participação específica** quando o mesmo `identidade.id` aparece em vários usos. A recomendação é um resolvedor que receba `{telaId, participacaoId, contexto, estado, dados}` e preserve o contexto necessário à volta, mas essa assinatura é exemplo e não API aprovada.

## 25. Modelo visual híbrido de estrutura e estilos **[APROVADO]**

### 25.1 Regra principal

O usuário aprovou expressamente:

> **Estrutura HTML e estilos CSS base separados; variantes parciais selecionadas por contexto, participação, estado e dados; possibilidade de substituição integral de blocos quando realmente necessário.**

Essa regra vale para o desenho do contrato de telas e deve ser considerada também nos componentes reutilizáveis, em especial menus.

A tela/componente deve preservar sua **base reutilizável**. Não exigir um HTML completo e um CSS completo para cada estado, contexto ou jornada. Mudanças localizadas devem ser expressas como alterações pontuais; uma variante pode substituir um bloco estrutural inteiro quando houver alteração estrutural real.

### 25.2 Fronteiras de responsabilidade **[APROVADO — princípio]**

- **`estrutura`**: árvore/HTML estrutural, regiões, slots, hierarquia, encaixes e ordem dos elementos. Não colocar a lógica de navegação aqui.
- **`estilos`**: CSS base e regras de variantes para cores, tipografia, espaçamento (margem/padding), dimensões, responsividade e demais propriedades visuais.
- **`componentes`**: instâncias referenciadas por ID, propriedades e itens fornecidos a cada instância, com possibilidade de variar rótulos, itens, visibilidade e propriedades;
- **`estados`**: declara estados existentes, não armazena cópias integrais de HTML/CSS para cada um;
- **`navegacao`**: IDs das participações, jornada/subjornada, nomes, ordens e contexto associado;
- **`acoes`**: eventos, condições, operações, consequências e destinos. O destino de clique não deve ser copiado dentro do HTML/CSS;
- **`dados`**: contratos de dados usados na seleção e no funcionamento real; os mocks continuam separados para simulação.

### 25.3 Exemplo: menu compartilhado em Home Advogado

- O componente canônico do menu fornece a estrutura e o estilo visual base;
- a instância, segundo participação/estado/dados, fornece os itens correspondentes, textos e IDs de ação;
- o clique em um item emite um evento e é resolvido em `acoes`, em vez de registrar uma segunda lista divergente de destinos dentro do HTML;
- o menu pode ter a mesma aparência estrutural com itens diferentes para um profissional com pendências ou com situação regular;
- quando uma subjornada é incorporada, aplica-se o menu/cabeçalho/tema da **jornada principal**, como já aprovado; não empilhar dois menus globais.

**Não foram homologadas** regras concretas de permissão, as condições reais do cadastro de advogado, ou uma lista definitiva de itens do menu.

### 25.4 Tipos de alterações admitidos **[APROVADO — capacidade; PENDENTE — sintaxe]**

1. **Propriedade de componente:** alterar texto, item, ícone, visibilidade ou outra propriedade declarada na interface do componente;
2. **Estilo parcial:** alterar apenas seletores/regras pontuais, preservando a base CSS;
3. **Estrutura parcial:** adicionar, ocultar, reorganizar ou trocar um bloco endereçável da estrutura base, desde que haja operação formalizada;
4. **Substituição de bloco completo:** quando a organização de determinada região for realmente outra; manter intacto o restante da tela/componente.

A substituição completa do **bloco** não deve ser interpretada automaticamente como obrigação de duplicar **toda a tela**.

## 26. Como selecionar variantes — discussão iniciada, ainda sem homologação das prioridades

### 26.1 Algoritmo conceitual proposto **[PROPOSTO]**

1. Resolver a identidade da tela e a participação específica utilizada na abertura;
2. determinar a jornada/subjornada corrente e, se houver incorporação, o contexto visual principal herdado;
3. receber o contexto funcional, o estado atual e os valores de dados pertinentes (reais ou simulados, conforme ambiente);
4. avaliar as condições de ativação das variantes definidas para aquela tela/componente;
5. selecionar **todas** as variantes cujas condições sejam satisfeitas — não assumir que existe somente uma;
6. ordenar as variantes selecionadas por regra de precedência determinística, **a ser aprovada**;
7. aplicar diferenças parciais sobre a estrutura base, estilos base e propriedades dos componentes;
8. verificar alterações incompatíveis para o mesmo alvo/propriedade;
9. entregar ao motor de Montagem uma projeção temporária, rastreável, sem modificar a fonte canônica;
10. expor no inspetor “Motor / JSON” os dados lidos, as regras avaliadas, variantes selecionadas, ordem, efeitos aplicados e diagnósticos.

**Não confundir:** selecionar visualmente a variante não realiza operações externas ou concede acesso; o runtime de ações/dados e a autorização são funções separadas.

### 26.2 Evitar condições duplicadas **[PROPOSTO — recomendação técnica]**

Em vez de declarar a mesma condição "cadastro incompleto e estado pronto" três vezes, uma em `estrutura`, outra em `estilos` e outra em `componentes`, pode haver **uma identificação central da variante e da regra de ativação**. As seções visuais referenciam a variante por ID e descrevem somente os efeitos que lhes pertencem.

A localização desse registro é **pendente**. Uma seção canônica `variantes` ou `apresentacao.variantes`, independente de `estados` e de `flow`, é candidata — **não foi aprovada** como nova seção obrigatória.

**Exemplo de sintaxe, NÃO schema homologado:**

```json
{
  "variantes": [
    {
      "id": "cadastro_pendente",
      "quando": [
        {"origem": "dados", "campo": "perfil.cadastroCompleto", "operador": "igual", "valor": false}
      ],
      "prioridade": 40
    },
    {
      "id": "carregando",
      "quando": [
        {"origem": "estado", "campo": "id", "operador": "igual", "valor": "carregando"}
      ],
      "prioridade": 90
    }
  ],
  "estrutura": {
    "base": {"slots": ["menu", "conteudo", "rodape"]},
    "variantes": [
      {
        "ref": "cadastro_pendente",
        "alteracoes": [{"alvo": "conteudo", "tipo": "substituir_bloco", "blocoRef": "pendencias"}]
      }
    ]
  },
  "estilos": {
    "base": {"ref": "home.padrao"},
    "variantes": [
      {"ref": "cadastro_pendente", "regras": {"pendencias": {"padding": "16px"}}}
    ]
  },
  "componentes": {
    "variantes": [
      {"ref": "cadastro_pendente", "propriedades": {"titulo": "Complete seu cadastro"}}
    ]
  }
}
```

O exemplo ilustra a **referência cruzada por ID**; nem `variantes` na raiz, nem `prioridade`, nem as operações `substituir_bloco`, nem os números, nem os nomes dos campos foram homologados.

### 26.3 Questão de prioridade — três alternativas **[PENDENTE]**

**A — Precedência fixa por dimensão:** o motor conhece a ordem predefinida (por exemplo base → jornada/subjornada → participação → contexto → dados → estado). Dispensa atribuir prioridade manual, mas exige regra de enquadramento e composição para seletores mistos.

**B — Prioridade numérica explícita por variante:** cada variante tem um campo numérico de prioridade; o editor auxilia a preencher, e o motor apenas filtra/ordena. Facilita inspeção e alteração pontual, mas aumenta o número de campos editados pelo autor.

**C — Híbrido:** o editor atribui prioridades-padrão pelas dimensões e permite substituir a prioridade por valor explícito; o motor resolve pela prioridade final. Conveniente para edição, porém traz regra adicional de cálculo/normalização.

**Recomendação para discutir:** a **alternativa B** é fácil de ler e executar no motor: condição satisfeita → ordenação numérica → aplicação das diferenças. Uma interface de edição pode sugerir números sem criar uma regra escondida dentro do runtime. **Ainda não é uma decisão aprovada.**

### 26.4 Colisões e múltiplas variantes **[PROPOSTO]**

- Duas variantes ativas que modificam **alvos diferentes** podem coexistir;
- se modificarem a **mesma propriedade**, a prioridade escolhida deve determinar qual prevalece, **se isso for parte do contrato aprovado**;
- se tiverem prioridade igual e valores incompatíveis para o mesmo alvo, **não escolher arbitrariamente**: apresentar erro/pendência de validação;
- a simples existência de `estado: carregando` não deve apagar uma participação da jornada: é um aspecto transitório sobre a mesma identidade;
- se uma regra tenta alterar estrutura e outra tenta sobrescrever seu bloco pai, o inspetor deve sinalizar potencial incompatibilidade;
- a composição deve respeitar a hierarquia de **menu/cabeçalho/tema global da jornada principal**; uma variante de subjornada não pode violar silenciosamente essa regra;
- esconder um componente com CSS ou propriedade visual não equivale a autorização de acesso.

### 26.5 Diferença entre **estado** e **variante visual**

- `estados` declara a possibilidade e a situação atual (`carregando`, `erro` etc.);
- uma variante visual é uma **regra de apresentação** que pode ser ativada por um estado, uma participação, um contexto, um dado ou combinação;
- `acoes` pode mudar o estado atual ou o contexto por operação/evento, mas não é o depósito do CSS/HTML de cada estado;
- `estrutura` e `estilos` continuam proprietários dos efeitos visuais;
- as mesmas regras de variação devem poder ser inspecionadas por Catálogo e Protótipo, sem copiarem dados de uma para outra.

## 27. Impacto sobre o Resolvedor, a Montagem e as demais ferramentas

| Serviço/ferramenta | Responsabilidade após esta discussão | Não deve fazer |
|---|---|---|
| **Resolvedor compartilhado** | Resolver participação, contexto de navegação e destinos das ações; fornecer dados estruturados aos consumidores | Executar HTML/CSS, inventar estados ou manter grafo mestre paralelo |
| **Seletor de variantes / Montagem** | Avaliar regras de apresentação, ordenar/aplicar alterações sobre base e devolver projeção montada | Interpretar destinos de navegação por posição de botão ou copiar ações para CSS |
| **Flow Editor** | Mostrar onde a tela participa e quais transições existem; grafo auto-organizado e editável nas seções canônicas competentes | Guardar `flow.editor` ou coordenadas `x/y` no JSON da tela |
| **Protótipo** | Oferecer participação, contexto, estado e dados simulados, navegar e renderizar as variantes selecionadas | Criar versão exclusiva dos HTMLs, CSSs e regras |
| **Jornadas** | Encontrar participações por IDs e três ordens; preparar pacotes completos sem perder variantes, componentes e ações | Tratar a ordem editorial como transição automática |
| **Banco** | Projetar relações e necessidades do contrato em `dados` | Deduzir esquema a partir dos mocks ou CSS |
| **Mapa de Interações** | Localizar operações e seus efeitos em `acoes`/`dados`/`estados` | Apenas reproduzir Flow ou inferir chamadas do desenho visual |

**Sugestão de otimização:** compilar/índexar IDs dos registros canônicos uma vez em memória, com invalidação quando registros forem alterados. Isso evita buscas repetitivas sem exigir um cadastro mestre persistente. Uma implementação específica ainda não foi homologada.

## 28. Decisões ainda abertas para o próximo diálogo e para o HTML autocontido

**Já aprovadas, não voltar a perguntar por padrão:** seção `flow` eliminada; leitura compartilhada de `navegacao`+`acoes`; Flow auto-organizado; cinco telas do novo laboratório; indicadores explícitos de jornada/subjornada; IDs individuais de participação; nomes legíveis repetidos; três ordens explícitas; herança visual global da principal; estrutura/estilos base separados; variantes parciais com substituição de blocos quando necessário; importação comparada por ID com escolhas caso a caso.

**Ainda pendentes:**

1. **Política de prioridades:** fixa por dimensão, numérica explícita ou híbrida com valores sugeridos;
2. **Local do seletor de variantes:** seção canônica de variantes, referência a seletor compartilhado, ou outra forma que evite repetir a mesma condição;
3. **Sintaxe do seletor:** condições simples/compostas, tipos de dados, operadores, AND/OR, ausência de campo, igualdade entre referências, requisitos de autorização;
4. **Critério de colisão:** duas variantes da mesma prioridade para o mesmo alvo, precedência para substituição de blocos pais/filhos;
5. **Referência de alvo visual:** IDs de blocos, slots e instâncias, sem seletores frágeis e sem misturar estilo com navegação;
6. **Modelo de contexto:** como entra, permanece e retorna ao chamador; destino por tela vs participação;
7. **Globais e compartilhadas:** como inventariar Notificações e outras telas transversais sem fabricar uma ordem de percurso;
8. **Exemplos reais das cinco telas:** regras de Splash, Boas-vindas, Entrar e duas Homes precisam ser homologadas, não copiadas do catálogo antigo;
9. **Comandos de edição e rastreamento:** diffs, confirmação e inspeção das regras efetivamente avaliadas;
10. **Schema final:** nomes e formatos definitivos de campos e arrays, versionamento e validador.

**Próxima pergunta objetiva para continuidade:**

> Na seleção de variantes, você prefere que o motor siga **prioridades numéricas explícitas** declaradas em cada variante, uma **ordem fixa por dimensão**, ou um **modelo híbrido** com sugestões automáticas e ajustes manuais?

**Controle de mudança V3:** o documento V2 foi integralmente preservado e este adendo foi acrescentado. **Não houve modificação de catálogo operacional, telas, componentes, motores, HTML autocontido ou repositório GitHub.**

---

# ADENDO V4 — Transferência definitiva, origem de navegação e Workspace de laboratório

**Marco:** definições posteriores ao documento V3 e entrega do Workspace autocontido experimental. O conteúdo histórico acima permanece íntegro e não deve ser reescrito retroativamente.

## 29. Questão 4 — mesma tela, participações e origem de cada acesso

**[DIRETRIZ EXPRESSA, FORMATO INTERNO AINDA EM REVISÃO]** O usuário exemplificou a mesma tela **Entrar** acessada inicialmente por **Boas-vindas** e posteriormente pelo término do **Cadastro**. A tela permanece uma definição canônica única. O contrato deve ser capaz de identificar tanto seu contexto de participação quanto a **origem da transição efetiva**.

Distinguir, sem fundir:

- `identidade.id`: identifica a tela canônica (exemplo `auth.entrar`);
- `navegacao.participacoes[].id`: identifica uma utilização funcional, com jornada/subjornada e as três ordens explícitas;
- referência de ação de origem em `acoes`: determina de qual tela/participação partiu a transição;
- contexto transitório do resolvedor: acompanha origem, ação, destino, dados relevantes e histórico para retorno, quando aplicável.

A origem não precisa ser repetida como lista permanente de entradas no JSON da tela receptora; o Flow pode calcular a lista a partir de todas as ações de origem. **Não gerar uma nova participação por visita** automaticamente. Uma participação distinta pode ser útil quando o comportamento e a apresentação mudam de forma identificável, como **Entrar após Cadastro**, mas os critérios exatos ainda serão homologados.

**[EXEMPLO, NÃO SCHEMA HOMOLOGADO]** Uma ação pode enviar destino com `telaId: "auth.entrar"` e `participacaoId: "part.entrar.pos_cadastro"`, sem alterar o ID da tela.

## 30. Questão 5 — transferência DEFINITIVA de jornada, sem duas modalidades concorrentes

**[REQUISITO EXPRESSO]** O usuário rejeitou manter **duas operações distintas** (incorporar por referência *ou* mover). A intenção é **transferir definitivamente** o conjunto Estudante para Cliente, **atualizando referências em locais delimitados**, sem reconstruir suas telas e relações internas.

Exemplo: Estudante deixa de iniciar sua área operacional pela jornada própria de origem; a antiga Home Estudante passa a ser o ponto de entrada da **subjornada Estudos** acessada por item do **menu Cliente**. O shell global passa a ser o da jornada Cliente.

**Mudanças típicas necessárias:**

1. Alterar em lote a jornada/subjornada e os nomes/ordens explícitos das participações transferidas, preservando os IDs de tela e participação sempre que mantêm sua identidade funcional.
2. Ajustar ou retirar somente as entradas e ligações externas anteriormente usadas para iniciar a jornada Estudante.
3. Declarar nova origem de entrada nas ações da Home ou menu Cliente, com referência à participação inicial pertinente.
4. Preservar ações, destinos, componentes e relações **internas** do trecho transferido quando já são válidos; não fazer renomeação em cascata desnecessária.
5. Aplicar a estrutura global (menu, cabeçalho, tema) da Cliente, com variantes de conteúdo/texto/contexto quando necessário, mas não conceder permissões automaticamente.
6. Verificar dependências, referências de entrada/saída, condições, retornos e eventuais componentes compartilhados antes da aplicação.
7. Apresentar **comparação caso a caso, por registro e campo quando necessário**, com seleção do usuário, antes de confirmar alterações em lote.

**Importante:** renomear o título exibido de uma Home para “Estudos” não implica renomear `identidade.id` ou o arquivo canônico. Renomear tecnicamente IDs só será feito com operação explícita e verificação de referências.

**Não aprovado:** manter uma cópia operacional independente da jornada Estudante como segunda versão em paralelo; produzir duplicatas por padrão; alterar todas as ações internas por mera mudança de hierarquia.

## 31. Documento de trabalho e recomendações provisórias

**[REQUISITO EXPRESSO]** O usuário autorizou construir imediatamente um HTML autocontido para **visualizar o Workspace com o contrato novo**, mesmo havendo perguntas não respondidas. Para essas lacunas, usar a **alternativa recomendada** como base de funcionamento, mas **assinalá-la como provisória, não homologada**, em uma aba de questionário, para revisão posterior.

O Laboratório de Contratos JSON V2 é a referência de cinco telas e três componentes usada para o novo Workspace experimental; o Workspace V3 auditado é referência de organização visual/funcional e **não é migrado** para esse contrato.

No laboratório experimental, a lista 1–19 do questionário mantém a situação de cada resposta, distinguindo **aprovada**, **requisito do usuário** e **recomendação provisória**. Os campos `variantes.regras`, `prioridade` e certos nomes/IDs são de implementação demonstrativa e ainda não definem o schema final.

## 32. Critérios de demonstração do Workspace autocontido

O Workspace experimental deve permitir pelo menos: inspecionar e editar JSONs de tela/componente, montar prévias, ler projeções dos motores, navegar nas cinco telas com mocks, gerar Flow automático por `navegacao` + `acoes`, selecionar jornadas pelos IDs explícitos, exportar pacotes editáveis e revisar diferenças na reimportação, consultar Banco e Mapa de Interações com dados realmente declarados, e manter todas as questões provisórias revisáveis.

**Limitações deliberadas:** as antigas telas Estudante não estão padronizadas no recorte de cinco telas, logo a transferência Estudante → Cliente **não foi aplicada de verdade**. O HTML demonstra o antes/depois da operação em conceitos e referências. O serviço de login é simulado; não há execução real de autenticação, escrita em banco ou chamada de APIs externas. A revisão de importação no laboratório pode ter granularidade inicial por **seções de JSON**, a ser ampliada para campos internos, variantes e referências com análise detalhada de impacto.

**Controle de mudança V4:** o histórico V1–V3 permanece inalterado. O Workspace experimental é um novo artefato de trabalho, não uma substituição automaticamente homologada do catálogo ou do código de produção.
