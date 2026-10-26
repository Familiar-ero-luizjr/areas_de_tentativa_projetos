# Advogado Já — Plano único de evolução do Workspace

**Versão:** 1.0 — documento explicativo para discussão, não implementação  
**Situação:** proposta; nenhuma mudança automática no catálogo ou nos motores  
**Base consultada:** Workspace Modular V5 (README, AGENTS e contratos existentes), catálogo V6 discutido na conversa e objetivos expressos durante o planejamento.

## 1. O que queremos construir

O Workspace não deve ser um segundo aplicativo nem um conjunto de ferramentas que precisem de configuração manual toda vez que uma tela mudar. Ele é o **ambiente de definição do Advogado Já**.

O trabalho principal acontece nos **dados estruturados**: descrevemos uma tela, seu comportamento, seus componentes, suas jornadas e suas relações; o Workspace interpreta os registros e monta automaticamente as visões correspondentes.

A intenção é permitir este processo simples:

1. Discutimos uma jornada do produto.
2. Incluímos, removemos ou alteramos suas telas por JSON, sem reescrever motores.
3. O catálogo valida os documentos e registra cada tela e componente em seu arquivo canônico.
4. As abas Jornadas, Flow, Relações, Montagem, Protótipo, Mapa e Banco passam a mostrar projeções consistentes dessa mesma base.
5. Registramos decisões e pendências no módulo Contrato; itens não homologados continuam identificados.

**Regra mais importante:** colocar a inteligência descritiva no contrato de dados; deixar os motores pequenos, genéricos e previsíveis. Isso não significa colocar programação arbitrária no JSON. O JSON descreve fatos e regras em formatos aprovados; o motor só reconhece esses formatos, valida e os interpreta.

## 2. Diferença entre catálogo, tela, componente, jornada e contrato

Esses termos representam responsabilidades diferentes, não cinco cópias da aplicação:

| Conceito | O que representa | Onde fica a fonte persistente |
|---|---|---|
| **Catálogo** | Conjunto organizado das definições disponíveis | Pastas `catalogo/telas` e `catalogo/componentes` |
| **Tela** | Uma unidade funcional, com identidade, variantes, componentes, dados e ações | Um JSON por tela |
| **Componente** | Uma peça visual ou reutilizável, com interface e estilos próprios | Um JSON por componente |
| **Jornada** | Um recorte das telas e de suas ligações, conforme perfil/contexto e sequência | **Projeção** dos atributos e relações das telas; arquivo importado é pacote de intercâmbio, não banco paralelo |
| **Contrato** | O significado aprovado de cada campo, formato e comportamento dos motores | Planejamento no `modulo_contrato/data/contrato_workspace.json`, com documentos explicativos/schemas versionados |

Exemplo simples: a tela “Entrar” pode participar das jornadas Cliente, Advogado, Estudante e Administrador sem que sejam gerados quatro JSONs de tela iguais. O conjunto de componentes referenciados também é reutilizado, respeitando as variantes declaradas.

## 3. Fonte única de verdade — e o que atualizará automaticamente

```text
                          CONTRATO (definição de regras)
                  documento exclusivo, sem escrita automática
                                  |
                                  v
                      validação / homologação
                                  |
                                  v
              CATALOGO CANÔNICO DE TELAS E COMPONENTES
                 tela A.json    tela B.json   menu.json
                           |           |
                           +-----------+
                                  |
                        leitura por ID / referências
                                  |
           +----------------------+------------------------+
           |                      |                        |
       JORNADAS / FLOW        MONTAGEM / PROTÓTIPO       MAPA / BANCO
           |                      |                        |
           +----------------------+------------------------+
                           visões derivadas
```

Ao alterar um JSON de tela válido, **os motores podem refletir as mudanças quando a Store em memória for atualizada ou recarregada**. Não devemos afirmar que qualquer edição feita diretamente no disco já aparece instantaneamente: o Workspace atual requer atualização/recarregamento quando os arquivos são editados fora da interface. A atualização automática contínua de arquivos externos é uma melhoria futura, caso desejada.

Não devem existir `flow_master`, `screens_master`, listas persistentes de entradas calculadas, coleções duplicadas de telas por jornada, nem cópias de componentes nas pastas dos motores.

## 4. A nova área “Modelos”: uma tela que ensina o sistema

A proposta é uma **aba Modelos**, diferente da aba Catálogo. Enquanto o Catálogo mostra os arquivos reais, a aba Modelos explica **como deve ser qualquer arquivo** e oferece modelos vazios, válidos e prontos para adaptação.

### Como essa tela será organizada

**À esquerda:** uma navegação com os tipos de documento: **Catálogo/Pacote**, **Tela**, **Componente**, **Jornada (pacote de intercâmbio)** e **Relações/Regras**, este último apenas quando houver contrato específico aprovado. Os três primeiros serão os fundamentos. Jornada será apresentada como um pacote que referencia telas, não como nova Store.

**No centro:** uma representação em árvore do modelo selecionado. Cada grupo mostra o nome do campo, o significado, o tipo esperado, se é obrigatório/condicional/opcional, o valor padrão, exemplos e dependências. Um campo pode ser expandido sem precisar ler milhares de linhas JSON.

**À direita:** uma explicação simples do que esse campo produz nas outras abas: “ao preencher `classificacao.jornadas`, a tela passa a aparecer nessas jornadas”; “ao indicar `componentes.instancias[].ref`, a Montagem resolve o componente”; “ao declarar `acoes...destino`, Relações conhece a saída”; “ao informar `flow.editor`, a Árvore do Flow posiciona a ocorrência”.

**Na parte superior:** ações **Ver modelo vazio**, **Ver exemplo**, **Validar meu JSON**, **Exportar modelo** e **Importar para validar**. Importar para validar **não altera imediatamente o catálogo**. Depois de validar, uma ação separada confirma a incorporação.

### O que a aba Modelos não deve fazer

Ela não inventa identificadores, não duplica telas, não modifica decisões homologadas, não se torna uma segunda biblioteca editável de registros e não depende de copiar um JSON real como “padrão”. Os exemplos são didáticos; os schemas/contratos aprovados definem a validação de verdade.

## 5. Modelo de tela — o que o JSON precisa responder

Cada tela deve responder, de forma explícita e auditável:

| Grupo | Pergunta respondida | Campos já usados como base |
|---|---|---|
| Identidade | Qual tela é esta? | `identidade.id`, `nome`, `tipo`, `versao`, `rota`, `status` |
| Classificação | Onde aparece e de quais jornadas participa? | `classificacao.jornadas`, `subjornadas`, `compartilhada`, `localizacaoArvore` |
| Estados | Como se comporta em situações diferentes? | `estados.fonte`, `fallbackSeguro`, `grupos` |
| Composição | Quais peças visuais usa? | `componentes.instancias[].ref`, `slot`, `props`, `aplicaA` |
| Estrutura/estilos | Como o motor monta a tela? | `estrutura.base`, `estrutura.grupos`, `estilos` |
| Ações e destinos | O que acontece quando o usuário age? | `acoes.grupos[].acoes`, `destino`, rotas/condições declaradas |
| Dados | Que entidades e informações a tela exige? | `dados.grupos`, `fontes`, `persistencia` |
| Prévia | Com que dados e estados o Protótipo pode exibi-la? | `mocks`, estados declarados |
| Edição do Flow | Em quais pontos a tela aparece na árvore? | `flow.editor.occurrences`, `branches`, `paths` |

**Importante:** o identificador da tela permanece estável mesmo quando ela muda de ordem, muda de jornada ou aparece várias vezes no Flow. IDs do tipo `J1`, `J2` podem ser usados como rótulos de leitura, se aprovados, mas nunca devem substituir a identidade única da tela nem sua referência nas conexões.

## 6. Modelo de componente — o que o JSON precisa responder

Um componente deve declarar sua identidade, classificação, árvore visual, estilos e interface: propriedades aceitas, eventos que emite e dados que precisa. A tela usa o componente **por referência**, passando propriedades/estado. Se dez telas usam o mesmo componente, sua implementação canônica não deve ser copiada dez vezes.

O modelo deve separar cuidadosamente **componente visual** de **regra de navegação**: um botão pode emitir uma intenção/evento, mas o destino funcional deve ser resolvido por uma declaração validada e pelo contexto da tela.

## 7. Importação e exportação de jornadas — experiência proposta

A aba **Jornadas** deve ter ações **Importar jornada (JSON)**, **Exportar jornada (JSON)** e **Ver estrutura da jornada**.

Fluxo desejado ao importar:

1. Usuário seleciona um JSON de jornada ou pacote de telas de uma jornada.
2. O sistema valida a versão, o formato, as telas referenciadas e os componentes necessários.
3. Mostra uma prévia do impacto: telas novas, telas reutilizadas, campos alterados, jornadas adicionadas, relações novas e conflitos de IDs.
4. Em caso de registros divergentes, pede uma decisão explícita; nunca sobrescreve silenciosamente.
5. Após confirmação, distribui cada definição nos **arquivos individuais da Store**, preservando os IDs estáveis.
6. Recalcula as projeções de Jornada, Flow, Mapa, Protótipo e outras abas interessadas.

Ao exportar, o Workspace pode montar um documento de intercâmbio contendo `schema`, versão, ID da jornada, lista de referências às telas, um manifesto de dependências e, se solicitado, as definições necessárias para importar em outro ambiente. **Esse pacote não fica salvo como cadastro paralelo de jornada.**

**Questão que precisa ser decidida antes da implementação:** o pacote será apenas um manifesto referencial (mais leve) ou também poderá carregar as definições das telas/componentes (mais portátil)? Minha proposta é oferecer os dois modos, identificados no arquivo e validados pelo mesmo importador.

## 8. Função de cada módulo do Workspace

| Módulo / aba | Responsabilidade principal | O que não deve fazer |
|---|---|---|
| **Árvore do Catálogo** | Exibir, localizar, inspecionar, criar e editar os JSONs reais de telas/componentes | Guardar uma Store paralela |
| **Modelos (proposta)** | Ensinar os modelos oficiais, explicar campos, validar e fornecer exemplos vazios | Alterar registros sem confirmação |
| **Contrato** | Registrar objetivos, campos, regras, pendências e decisões para homologação | Executar automaticamente mudanças no catálogo |
| **Jornadas** | Mostrar dinamicamente as telas por jornada e permitir trabalhar com seus percursos; futuramente importar/exportar jornada | Duplicar telas por persona |
| **Árvore do Flow** | Montar visualmente sequências, ocorrências e bifurcações de `flow.editor` | Ser a fonte operacional de todas as ações |
| **Flow & referências** | Apresentar saídas declaradas e entradas calculadas; editar vínculos seguros na tela de origem | Salvar um `inbound` ou grafo duplicado |
| **Motor de Montagem** | Resolver instâncias, slots, estilos, estados e propriedades para montar uma tela | Decidir regras de negócio que não constam no contrato |
| **Protótipo** | Exibir a experiência navegável das jornadas e prévias visuais | Executar autenticação, pagamento ou backend real |
| **Mapa integrado** | Mostrar visão geral derivada das classificações e relações | Manter seu próprio cadastro de telas e ligações |
| **Banco** | Projetar entidades e relações declaradas em `dados.persistencia` | Inventar modelagem independente da Store |
| **Gestão & exportação** | Gerar pacotes, manifestos e índices transitórios para intercâmbio | Transformar exportações em fontes mestras |
| **Infraestrutura `app/` + servidor** | Carregar, validar, atualizar em memória, persistir com proteção contra conflitos e comunicar alterações | Inserir regras específicas de cada jornada no código |

## 9. Contrato mínimo de todos os motores: simples, específicos e sem redundância

Um motor deve funcionar como uma **função genérica de interpretação**:

**Entrada:** seleção do usuário (jornada, tela, estado etc.) + registros canônicos necessários.  
**Processamento:** procurar IDs, validar referências, filtrar regras declaradas, organizar dados e gerar a projeção correspondente.  
**Saída:** visualização, montagem, índice transitório ou diagnóstico de inconsistência.  
**Escrita:** somente se for um editor autorizado, no JSON proprietário daquela informação.

Exemplos práticos:

- **Jornadas:** procura em `classificacao.jornadas` e agrupa; se surgir uma nova jornada, cria a aba visual sem mudança no motor.
- **Montagem:** recebe `telaId`, `jornada`, `estado`; busca tela, resolve `componentes.instancias[].ref`, aplica `aplicaA` e monta HTML/CSS.
- **Relações:** lê `acoes...destino` e destinos dos itens declarados; descobre todas as saídas e calcula entradas por inversão. Não grava entradas.
- **Flow:** busca `flow.editor` em cada tela e reconstrói sequências, bifurcações e ocorrências. Não mantém JSON mestre.
- **Protótipo:** combina jornada + Flow + montagem; navega de forma demonstrativa sem executar efeitos reais.
- **Banco:** agrega definições de persistência das telas e evidencia colisões/inconsistências, em vez de manter outra modelagem.

### Regras de implementação para preservar a simplicidade

1. **Um dado, um proprietário.** Destino de ação pertence à tela que a declara; componente pertence ao catálogo de componentes; contrato de planejamento pertence ao módulo Contrato.
2. **Consulta por ID, não por endereço físico.** Pastas e ordem visual são detalhes de organização; os relacionamentos usam IDs.
3. **Sem exceções por tela no motor.** Uma tela nova deve funcionar somente pela descrição aceita pelo contrato.
4. **Sem adivinhação de regras.** Se uma condição é texto legado ou ainda não foi homologada, o motor sinaliza a limitação. Não transforma texto em lógica executável por interpretação livre.
5. **Campos obrigatórios claros.** A nova aba Modelos mostra o mínimo necessário para uma tela válida; os campos opcionais aparecem quando usados.
6. **Sem reprocessamento total desnecessário.** O motor atualiza apenas projeções afetadas pelos arquivos alterados e renderiza a aba sob demanda.
7. **Diagnósticos em vez de correções invisíveis.** Destino ausente, branch incompleta, componente não encontrado ou campo incompatível são relatados.
8. **Teste por contrato.** Cada módulo deve provar que interpreta um registro novo válido sem receber alterações de código específicas.

## 10. Fluxo de trabalho ilustrado — adicionar uma nova tela numa jornada

**Exemplo hipotético:** durante a revisão da jornada Cliente, decidimos introduzir “Confirmar atendimento”.

- Consultamos **Modelos → Tela** e criamos um JSON a partir do modelo vazio.
- A tela recebe identidade estável, participação em `cliente`, componentes necessários, estados e ações com destinos.
- Importamos esse JSON pelo **Catálogo** ou pelo futuro importador da aba **Jornadas**.
- O Catálogo valida e registra o arquivo individual. Componentes já existentes são referenciados, sem cópias.
- O Flow recebe a nova ocorrência na sequência adequada (automaticamente apenas quando a posição estiver declarada; caso contrário, usuário escolhe o ponto de inserção).
- Relações e Mapa passam a mostrar os vínculos declarados; Protótipo exibe a nova tela quando existir posição válida no percurso; Banco mostra as necessidades de dados existentes.
- Quando algo estiver faltando, a interface informa: “falta destino”, “falta ocorrência no Flow”, “prévia sem componente”, em vez de inventar.

**Resultado:** não precisamos adicionar um caso específico a cada motor para fazer a tela aparecer.

## 11. O que já existe e o que ainda é proposta

### Já implementado ou previsto nos contratos atuais da V5

- JSON canônico por tela e componente.
- Jornadas descobertas dinamicamente a partir das telas.
- Árvore editorial em `flow.editor`, com telas reutilizáveis.
- Montagem visual por componentes referenciados.
- Relações operacionais calculadas dos JSONs.
- Protótipo navegável com avanço, retorno e reinício; ainda lineariza caminhos de bifurcação.
- Módulo Contrato com JSON exclusivo de planejamento e exportação/importação própria.

### Propostas descritas aqui, ainda não implementadas

- Nova aba **Modelos** com árvore didática de campos, schemas, exemplos e validação.
- Importação/exportação de **jornada completa** com prévia de diferenças, conflitos e confirmação.
- Atualizações incrementais dos módulos sem recriar todas as prévias ao carregar.
- Escolha interativa de bifurcações no Protótipo a partir de condições homologadas.
- Recarregamento automático quando arquivos externos forem modificados, caso aprovado.

### Pendências da base que não devemos esconder

A auditoria anterior identificou destinos de ação ainda ausentes, caminhos vazios e ao menos uma tela fora da árvore editorial. Esses pontos precisam aparecer no diagnóstico e ser resolvidos no processo de revisão de jornadas; não são motivo para o motor fabricar registros ou corrigir o Flow sem decisão.

## 12. Plano de execução em etapas curtas

**Etapa A — Especificar e homologar Modelos:** definir os modelos oficiais (catálogo/pacote, tela, componente e jornada de intercâmbio), obrigatoriedade e validação, sem tocar nos JSONs existentes.

**Etapa B — Implementar a aba Modelos:** criar a interface explicativa, exemplos, árvore de campos e validação de JSON. Confirmar que os modelos refletem os contratos aprovados, não telas específicas.

**Etapa C — Introduzir importação/exportação de jornadas:** validar referências, comparar diferenças, apresentar conflitos, confirmar e gravar exclusivamente nos registros canônicos.

**Etapa D — Simplificar e otimizar motores:** abstrair busca e resolução comuns, reduzir recálculos, renderizar por demanda e evitar materializar imagens/iframes antes da hora; não mudar regras de negócio durante a otimização.

**Etapa E — Usar o Workspace para o objetivo principal:** revisar jornadas reais, localizar telas ausentes ou duplicadas, complementar onboarding e administração, homologar relações e estados e finalizar os fluxos do produto.

## 13. Critérios de aceite da arquitetura

O plano só estará bem aplicado quando for possível demonstrar estes cenários:

- Uma nova tela válida, importada por JSON, entra no catálogo **sem mudança no código dos motores**.
- Uma jornada nova declarada por telas ganha sua visão correspondente sem cadastro manual de abas.
- Um componente alterado é refletido nas telas que o referenciam após sincronização/recarregamento, sem JSONs duplicados.
- Uma saída adicionada na tela de origem aparece nas relações, sem gravar entrada na tela de destino.
- Uma ocorrência adicionada ao Flow passa a aparecer na sequência correta, preservando ocorrências já existentes.
- O Protótipo monta a prévia usando o catálogo e deixa claro quando a navegação condicional não está homologada.
- Um JSON de jornada pode ser **validado e comparado antes da importação**, e conflitos não sobrescrevem silenciosamente a base.
- A aba Modelos responde “qual é a estrutura esperada?” sem obrigar o usuário a abrir uma tela real.
- Nenhuma atualização no módulo Contrato aplica mudanças ao catálogo sem implementação/homologação específica.
- O carregamento inicial não precisa reconstruir todas as abas, todos os caminhos e todas as prévias do Flow.

## 14. Decisão orientadora final

> **O catálogo descreve o produto. Os modelos explicam como descrevê-lo. O módulo Contrato define e homologa as regras. Os motores interpretam essas descrições. As demais abas mostram diferentes leituras da mesma verdade.**

Esse é o fundamento que permite voltar ao objetivo principal: **construir e revisar as jornadas e telas do Advogado Já**, em vez de gastar mais tempo recriando ferramentas.
