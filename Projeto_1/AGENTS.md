# AGENTS.md — Advogado Já · Laboratório Funcional

## Atualização de decisões — 16/10/2026 (prevalece sobre orientações antigas)

O usuário definiu três jornadas principais e sua ordem de trabalho: **Cliente → Advogado → Administrador**.
**Estudante não é conta nem jornada principal separada**: o Cliente pode contratar um plano de acesso à Área Estudante, mantendo a mesma identidade.
A proposta de Home própria da Área Estudante dentro da mesma conta está **em avaliação** e deve passar pela entrevista antes de ser marcada como aprovada.

**Planejamento vivo:** `planejamento/planejamento.json` contém o roteiro de execução; `planejamento/registros.csv` contém decisões, perguntas, propostas, riscos e ideias com IDs estáveis. Os dois são carregados automaticamente pelo `planejamento/index.html` e não podem ser substituídos por memória conversacional imprecisa.
**Precedência:** decisão explícita do usuário > registro confirmado com origem > proposta/legado. Se uma regra abaixo contradiz esta atualização, tratá-la como legado a revisar, não como regra vigente.

Para atualizar o conteúdo da aba: editar ou substituir o JSON/CSV e efetuar commit. Edições feitas no navegador ficam somente em memória até exportação e substituição no repositório. Não marcar registros como confirmados sem aprovação expressa.

## Missão

Este repositório existe para **fechar a especificação funcional do Advogado Já antes da construção final das telas e do aplicativo**.

Qualquer agente que editar este repositório deve atuar como mantenedor de especificação, não como inventor de produto.

## Regra principal: não alucinar

Nunca criar uma tela, fluxo, regra, tabela, campo, permissão, estado ou integração apenas porque parece uma boa prática.

Quando uma definição necessária não estiver fechada:

- manter o ponto como **PENDENTE**;
- criar ou ajustar uma pergunta objetiva na entrevista;
- não transformar a hipótese em regra canônica.

## Distinções obrigatórias

Nunca confundir:

- **Tela**: superfície navegável/routeável ou visualmente própria.
- **Componente**: parte reutilizável de uma tela, como menu, header, drawer ou bottom nav.
- **Ação**: comando do usuário/sistema, como enviar, aceitar, recusar, sair ou alterar status.
- **Estado**: condição que muda conteúdo, disponibilidade ou permissões sem criar uma nova tela.

Não criar uma nova tela apenas para representar um estado.

## Hierarquia funcional

Usar a estrutura:

**JORNADA → SUBJORNADA → FLUXO → TELA**

A mesma tela pode participar de múltiplos fluxos ou jornadas.

## Personas/perfis atuais

O laboratório trabalha com quatro experiências:

1. Cliente
2. Advogado
3. Estudante de Direito
4. Administrador

Regras já fechadas:

- uma pessoa = uma identidade;
- a identidade pode acumular perfis;
- Cliente e Advogado são experiências principais; Estudante é acesso adicional por assinatura do Cliente;
- Administrador é papel interno, concedido a conta existente;
- o primeiro Administrador nasce por root/bootstrap;
- com 2+ perfis utilizáveis, o seletor de perfil é exibido;
- Escritório é subfluxo do Advogado;
- OAB não pertence ao cadastro nem ao onboarding profissional;
- após onboarding, o Advogado entra na mesma Home Profissional;
- OAB muda capabilities, menu, main e ações, mas não cria outra Home;
- falha técnica de OAB é estado desconhecido e deve ser fail-closed para operações protegidas;
- dados acadêmicos do plano Estudante devem ser reavaliados durante a entrevista; não presumir exigência nem obrigação de comprovação;
- planos profissionais e o plano Estudante pertencente ao Cliente precisam de regras de assinatura documentadas;
- assinatura é contratada/gerida no Advogado Já;
- DMembers não deve ser fonte de verdade do plano; acesso deve ser derivado de estado de assinatura/entitlements do backend.

## Relação entre os artefatos

Os artefatos principais são:

- `jornadas/*.html`
- `definicao/entrevista_funcional_4_jornadas.html`
- `modelos/modelagem_banco_todas_telas.html`

Uma alteração funcional deve ser rastreada entre eles.

### Quando uma pergunta é respondida

Verificar obrigatoriamente:

1. muda alguma tela?
2. muda algum caminho de fluxo?
3. muda ação ou estado?
4. muda dados necessários?
5. exige nova tabela/campo/relação ou elimina algum?
6. afeta outra persona?
7. afeta Map/Flow/Prototype futuramente?

Atualizar somente os artefatos realmente impactados.

### Quando uma tela é proposta

Antes de criá-la:

- confirmar que não é apenas estado;
- confirmar que não é apenas ação;
- confirmar que não é componente;
- procurar tela existente que possa ser reutilizada;
- identificar a pergunta/decisão que justifica sua existência;
- identificar os dados que a tela lê/grava.

### Quando o banco é alterado

Toda tabela/campo/relação precisa ter uma necessidade funcional rastreável.

Não modelar banco apenas pela aparência das telas. Considerar:

- fonte de verdade;
- histórico necessário;
- estados persistentes;
- auditoria;
- relações entre perfis;
- integrações externas.

## Tratamento de conflitos

Se dois artefatos discordarem:

1. não escolher silenciosamente;
2. verificar a decisão explícita mais recente;
3. se a decisão não estiver clara, marcar conflito como pendente;
4. criar pergunta objetiva;
5. só depois sincronizar os artefatos.

**HTML existente não vira canônico por existir.**

## Entrevista funcional

A entrevista é um instrumento de decisão, não um formulário descartável.

Regras:

- preservar IDs existentes;
- não reutilizar ID para outra pergunta;
- acrescentar novas perguntas com novos IDs;
- respostas consolidadas podem ser atualizadas quando uma decisão explícita posterior as substitui;
- permitir desmarcar/alterar respostas;
- não fazer a pergunta desaparecer durante a edição;
- exportação JSON deve preservar perguntas, alternativas e respostas.

## Método operacional para terminar a definição

O **Inventário Mestre de Telas** é o eixo de trabalho da fase atual.

A entrevista funcional e o modelo de banco **não dirigem isoladamente o produto**. Eles existem para validar e fechar o que as jornadas exigem.

### Ordem de trabalho

1. consolidar o inventário único das quatro jornadas;
2. fechar primeiro o fluxo comum: cadastro, login, conta, perfis e seletor;
3. auditar Cliente;
4. auditar Advogado;
5. auditar Estudante de Direito;
6. auditar Administrador;
7. revisar os impactos cruzados no banco e nas perguntas funcionais;
8. congelar a especificação funcional antes da construção final das telas.

### Para cada tela do inventário

Responder objetivamente:

1. **Esta tela precisa existir?**
2. **Quais ações podem acontecer nela?**
3. **Para onde cada ação leva?**
4. **Quais dados e estados ela precisa?**

Se alguma dessas respostas não estiver fechada, criar/usar uma pergunta objetiva na entrevista. Não preencher a lacuna por suposição.

### Status do inventário

Usar os seguintes estados:

- **A AUDITAR** — existe na jornada, mas ainda não foi validada;
- **CONFIRMADA** — a tela realmente deve existir como está conceitualmente;
- **ALTERAR** — existe, mas precisa mudar;
- **CRIAR** — tela necessária ainda não consolidada no produto;
- **EXCLUIR** — item atualmente tratado como tela, mas não deve permanecer;
- **POSSÍVEL DUPLICATA** — precisa ser comparada com outra tela;
- **PENDENTE** — depende de decisão funcional ainda não fechada.

Marcar uma tela como CRIAR não autoriza inventar seu conteúdo. Primeiro deve existir uma necessidade funcional rastreável.

### Regra de atualização cruzada

Toda decisão relevante deve disparar esta verificação:

**Jornada → Tela → Pergunta/decisão → Dados/persistência → outras jornadas afetadas**

Se a decisão alterar comportamento, atualizar a jornada.
Se alterar persistência, estado, histórico ou vínculo entre entidades, revisar o banco.
Se eliminar uma dúvida, atualizar/consolidar a entrevista.
Se afetar outro perfil, revisar a jornada correspondente.

### O que significa "terminar"

Não é necessário "responder todas as perguntas" por si só.

A fase termina quando:

- as três jornadas principais podem ser percorridas ponta a ponta, incluindo acesso opcional à Área Estudante pelo Cliente;
- o inventário não possui buracos funcionais críticos;
- cada ação relevante tem destino conhecido;
- telas, componentes, ações e estados estão corretamente separados;
- dados persistentes necessários têm suporte no modelo de banco;
- guards, capabilities e integrações necessárias estão definidos;
- perguntas restantes não bloqueiam a construção das telas.

A partir desse ponto, o laboratório deixa de descobrir arquitetura básica e passa a alimentar a construção das telas.

### Navegação do laboratório

O `index.html` é somente o **hub de acesso por abas**. Os HTMLs continuam separados e independentes no repositório.

Não fundir jornadas, entrevista, banco e inventário em um único arquivo de conteúdo apenas para facilitar navegação. A barra de abas deve carregar cada artefato mantendo sua fonte própria.


## GitHub Pages

O laboratório pode ser publicado como site estático.

Não incluir:

- secrets;
- tokens;
- chaves privadas;
- credenciais;
- dados pessoais reais;
- endpoints privados com credenciais embutidas.

Links internos devem ser relativos para funcionar no GitHub Pages.

## Critério de conclusão desta fase

A fase termina quando for possível percorrer as quatro jornadas ponta a ponta e, para cada etapa:

- saber se é tela, componente, ação ou estado;
- saber o screenKey da tela, quando aplicável;
- saber entrada e saída do fluxo;
- saber regras/guards/capabilities;
- saber os dados mínimos;
- saber persistência necessária;
- saber loading, erro e empty state relevantes;
- saber integrações externas;
- não existir decisão funcional crítica escondida.

Só então a construção final das telas deve ser tratada como próxima etapa.
