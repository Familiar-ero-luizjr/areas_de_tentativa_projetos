# AGENTS.md — AdvogadoJá · Projeto 11

> **Escopo:** instruções para agentes de IA e desenvolvedores que trabalham na raiz `projeto_11/` e em suas subpastas.  
> **Base examinada:** `projeto-11_28-11-2026_01-27.zip.zip`, estrutura `projeto_11/`, em 28/11/2026.  
> **Objetivo:** integrar, manter e acrescentar módulos ao **Workspace existente**, preservando conteúdo, funcionalidades, menus, documentos e identidade visual. Este arquivo é orientação de trabalho, não substitui os contratos JSON nem é um motor novo.

## 1. Regras inegociáveis

1. **Inspecione antes de alterar.** Leia `modulos.json`, `index.html`, `motor.js`, `estilo.css`, os arquivos do módulo envolvido e as fontes JSON efetivamente usadas. Não presuma que o README descreve a versão atual.
2. **Aproveite a arquitetura existente.** O Workspace já possui navegação global, registro de módulos, ciclo de vida e serviços. Não crie outro shell, outro sistema de cadastro de módulos nem uma segunda navegação principal.
3. **Não altere conteúdo interno sem solicitação.** Em tarefas de separação HTML/CSS/JS/JSON ou de integração, preserve integralmente os dados, IDs, rotas, estruturas de tela, regras, estilos, textos e comportamento pretendido. Modifique apenas o necessário para integrar ou carregar arquivos externos.
4. **Não descarte funcionalidades ao retirar menus duplicados.** Classifique cada item do menu original antes de deslocá-lo: módulo/rota global, subitem do módulo, seletor contextual, comando de edição, filtro ou ação de negócio.
5. **Uma fonte de verdade para cada informação.** Não duplique documentos nem mantenha dados conflitantes em múltiplos JSONs. Não invente vínculo, estado, ação, destino ou correspondência por semelhança de nome.
6. **Respeite o isolamento.** CSS de tela, CSS de módulo e CSS do shell têm responsabilidades diferentes. Dados isolados não devem contaminar o modelo relacional global.
7. **Não toque em `legado/` por padrão.** Material arquivado é referência, não fonte ativa automática nem justificativa para restaurar implementações antigas.
8. **Não declare homologação sem teste.** Diferencie verificação estática, teste de navegador e aceitação funcional/visual. Registre o que efetivamente foi executado e qualquer limitação.
9. **Faça alterações pequenas e rastreáveis.** Conserve nomes e interfaces existentes; explique os arquivos modificados e confirme que o restante foi preservado.
10. **Entregue somente o que foi pedido.** Se o usuário pedir um único arquivo, não empacote o projeto inteiro nem adicione refatorações paralelas.

## 2. Arquitetura real encontrada

```text
projeto_11/
├── index.html                 # Shell global: header, navegação e área principal
├── estilo.css                 # Estilo do Workspace
├── motor.js                   # Registro, carregamento, navegação e serviços
├── modulos.json               # Cadastro explícito e ordem dos módulos
├── iniciar.bat
├── dados/                     # JSONs registrados no Workspace
│   ├── contrato_aplicacao.json
│   ├── documentos_telas.json
│   ├── editor_documentacao.json
│   ├── sql_nosql.json
│   └── telas_e_dados.json
├── modulos/
│   ├── diagrama_uml_er/
│   ├── tabelas/
│   ├── telas_e_dados/
│   ├── sql_nosql/
│   ├── editor_documentacao/
│   ├── contratos_em_desenvolvimento/
│   │   ├── arvore/
│   │   ├── documentos/
│   │   └── catalogo.json
│   └── telas_e_jornadas/
│       ├── telas/
│       └── jornadas/
├── docs/
└── legado/
```

O arquivo `modulos.json` deste pacote registra **7 módulos ativos**, na ordem: `diagrama_uml_er`, `tabelas`, `telas_e_dados`, `sql_nosql`, `editor_documentacao`, `contratos_em_desenvolvimento` e `telas_e_jornadas`. O módulo inicial configurado é `diagrama_uml_er`. O README deste pacote ainda diz “quatro módulos”; **prevalecem os arquivos e registros efetivos**.

A estrutura `modulos/<id>/index.html`, `estilo.css` e `motor.js` existe para todos os módulos ativos. **Não é obrigatório que cada módulo tenha um `documento.json` próprio dentro dessa pasta:** os dados que o Workspace deve carregar por registro vivem em `dados/<fonte>.json`; um módulo também pode possuir catálogos e documentos locais, como os submódulos já existentes.

## 3. Responsabilidades e contrato do motor raiz

- `modulos.json`: declara IDs, rótulos, ordem, ativação, fonte(s) de dados, rota opcional e opções de integração. **Não há descoberta automática de pastas.**
- `motor.js` raiz: carrega os JSONs em `dados/`, lê o HTML/CSS/JS de cada módulo ativo, exige `registrarModulo(id, api)`, cria o menu global, seleciona a área de trabalho e chama os métodos do módulo.
- `index.html` raiz: contém o header, `aside#nav`, `main#main` e o modal global. Não inserir novos headers globais dentro dos módulos.
- `modulos/<id>/motor.js`: implementa a interface do módulo; não assume controle da navegação global.
- `dados/*.json`: fontes declaradas. O carregamento é por HTTP `fetch`; abrir pelo protocolo `file://` não é uma forma suportada de execução.

**Ciclo de vida observado:** o motor chama `iniciar(ctx)` na entrada de um módulo, `atualizar(ctx)` na renderização e `destruir()` ao sair. Evite listeners globais, estilos e tarefas assíncronas que sobrevivam após `destruir()`.

**Contexto disponível (`ctx`) na implementação atual:**

| Propriedade/serviço | Uso correto |
|---|---|
| `ctx.modulo` | Registro correspondente em `modulos.json` |
| `ctx.container` | Área do módulo em `main`, preferindo `[data-conteudo]` quando presente |
| `ctx.css` | Texto de `modulos/<id>/estilo.css`, a aplicar no escopo apropriado |
| `ctx.submenu` | Contêiner `#moduleSubmenu` quando `submenu: true`; caso contrário, não presumir sua existência |
| `ctx.dados.<fonte>` | Cópia dos JSONs declarados em `dados` do registro |
| `ctx.servicos.obterDados(id)` | Ler cópia atual da fonte registrada |
| `ctx.servicos.atualizarDados(id, objeto)` | Atualizar fonte registrada e persistir no armazenamento de sessão/navegador conforme seu tipo |
| `ctx.servicos.exportarJSON(id)` | Exportar a fonte indicada |
| `ctx.servicos.navegar(idOuRota)` | Navegar para **módulo global** registrado |
| `ctx.servicos.abrirModal(titulo, corpo)` | Usar modal global quando apropriado |
| `ctx.servicos.notificar(texto)` | Atualizar mensagem de status do shell |

`ctx.dados` é leitura inicial/cópia, não conexão mutável com arquivo no disco. **Nunca confunda atualização de estado do navegador com gravação física do JSON.** Para efetivar no repositório, exporte e substitua a fonte somente quando essa ação for pedida.

## 4. Procedimento para adicionar um módulo

### 4.1. Identifique os materiais e preserve o original

Antes de editar, descreva: finalidade, nome, ID técnico, menus existentes, itens de navegação, ações de toolbar, eventos, dados consumidos, arquivos, CSS e dependências. Verifique se o módulo precisa de tela principal, subitens dinâmicos, dados compartilhados, dados isolados e execução standalone. Não assuma que seus menus são dispensáveis por já existir o `aside` global.

Se o material chegar como um único HTML, **separe sem reescrever a aplicação** quando solicitado: `index.html` (markup), `estilo.css` (CSS), `motor.js` (lógica) e o JSON de conteúdo apropriado. Confirme a equivalência dos dados extraídos e ajuste apenas os carregamentos necessários; o contrato externo de integração continua sendo o do Projeto 11.

### 4.2. Crie os arquivos do módulo

```text
modulos/meu_modulo/
├── index.html
├── estilo.css
└── motor.js
```

O HTML pode usar `<section data-conteudo></section>` como área de montagem. Um documento JSON de uso do Workspace, quando necessário, é registrado à parte em `dados/meu_modulo.json`; não o replique automaticamente dentro de `modulos/meu_modulo/`.

### 4.3. Declare o registro em `modulos.json`

Exemplo **ilustrativo** de módulo com menu próprio, dados isolados e controles específicos:

```json
{
  "id": "meu_modulo",
  "nome": "Meu módulo",
  "ordem": 8,
  "ativo": true,
  "dados": ["meu_modulo"],
  "submenu": true,
  "dadosIsolados": true,
  "acoesProprias": true,
  "estiloIsolado": true
}
```

- `id`: deve corresponder à pasta e à chamada `registrarModulo`; no motor atual, só letras, números, `_` e `-` são aceitos.
- `nome`, `ordem`, `ativo`: controlam o item de menu global. Novas pastas não aparecem sozinhas.
- `rota` (opcional): pode identificar o módulo via `ctx.servicos.navegar`, como nos quatro módulos de modelagem; não confunda com rota interna de uma tela do produto.
- `dados`: IDs das fontes em `dados/<id>.json`; pode ser `[]` caso os dados não façam parte desse carregamento.
- `submenu: true`: cria `ctx.submenu` na navegação global **somente para o módulo ativo**.
- `acoesProprias: true`: evita a toolbar padrão `#moduleActions`; o módulo deve fornecer seus próprios comandos indispensáveis.
- `estiloIsolado: true`: impede que o CSS do módulo seja injetado globalmente pelo shell. **O módulo precisa aplicar `ctx.css` no escopo correto** (por exemplo, `Shadow DOM`).
- `dadosIsolados: true`: trata **as fontes declaradas** como isoladas no carregador. Não é garantia de isolamento de CSS nem de chamadas de rede.

Use essas opções conforme a necessidade observada, e não obrigatoriamente `true` em todos os novos módulos. Não mude IDs ou rotas de módulos existentes para simplificar a integração.

### 4.4. Registre o motor do módulo

Exemplo mínimo compatível com o carregamento por script do Projeto 11:

```js
registrarModulo('meu_modulo', (() => {
  let root;
  return {
    iniciar(ctx) {
      const markup = ctx.container.innerHTML;
      root = ctx.container.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = ctx.css;
      root.append(style);
      const view = document.createElement('div');
      view.innerHTML = markup;
      root.append(view);
      if (ctx.submenu) {
        // Montar aqui os itens internos; manter ações na área do módulo.
      }
      // Ler ctx.dados.meu_modulo, se registrado.
    },
    atualizar(ctx) {
      // Atualizar a apresentação conforme os dados/estado existentes.
    },
    destruir() {
      // Remover listeners globais, estilos externos e cancelar trabalho pendente.
      root = null;
    }
  };
})());
```

Esse código é apenas uma base de integração, **não substitui a implementação do módulo recebido**. Ao portar um HTML autocontido, mantenha seus controles e suas funcionalidades, transferindo a navegação externa para o local correto sem descartar comportamentos.

### 4.5. Integre menus pré-existentes sem duplicar o shell

Antes de alterar o menu original, classifique cada item:

| Item no módulo recebido | Destino no Projeto 11 |
|---|---|
| Navegação para outro módulo do Workspace | Item já registrado em `modulos.json`, via navegação global |
| Grupos, abas, jornadas, seções ou páginas **do próprio módulo** | `ctx.submenu` quando forem navegação persistente, ou controles internos quando forem apenas modos |
| Importar, exportar, editar, salvar, desfazer, filtros e ações contextuais | Conteúdo/toolbar própria (`acoesProprias: true`) ou toolbar padrão, conforme o caso |
| Header, marca e sidebar que repetem o Workspace | Não duplicar no modo integrado; preservar a informação ou ação que não seja redundante |
| Navegação interna do produto simulado (Fluxo/Protótipo) | Continuar no motor/contrato de produto, sem virar rota global de Workspace |

O submenu é parte do menu principal **apenas visualmente**; seus dados e seu comportamento continuam sendo responsabilidade do módulo. Não mover botões indiscriminadamente para o submenu e não converter seletores de estados ou abas locais em módulos globais.

**Referências concretas:** `editor_documentacao` usa `ctx.submenu` para a estrutura documental e `Shadow DOM` para o editor; `contratos_em_desenvolvimento` popula grupos a partir do seu `catalogo.json` e abre visualizadores no módulo; `telas_e_jornadas` possui navegação por Telas e Jornadas, com submódulos, iframes e troca de mensagens. Esses exemplos não impõem que todos os módulos tenham a mesma UI.

### 4.6. Preserve a separação de estilos e dados

- O CSS global pertence ao shell. Nunca cole CSS completo de um HTML independente em `estilo.css` da raiz.
- Ao usar `estiloIsolado`, aplique `ctx.css` localmente; estilos do submenu, que fica **fora** do Shadow DOM, precisam ser explícitos e restritos ao `#moduleSubmenu`, com limpeza em `destruir()` quando adicionados dinamicamente.
- Respeite o `documento.json` de cada tela ou componente quando existir; não substitua o conteúdo por fixtures ou por JSONs de outra ferramenta.
- Fontes **não isoladas** são agregadas a `P` pelo motor raiz. Suas chaves de primeiro nível não podem colidir. Fontes **isoladas** são carregadas e persistidas separadamente no `localStorage` sob `projeto11-fonte-<id>`.
- O estado relacional global usa a chave `advogadoja-dados-simples-v3`. Editores antigos podem usar outras chaves; não crie sincronização automática nem migração silenciosa entre elas.
- O método `ctx.servicos.atualizarDados` para fonte isolada não aciona `render()` global automaticamente. Se o módulo precisar refletir a edição imediatamente, atualize sua própria visualização.
- A importação global V3 é diferente das fontes isoladas: **não** use a rotina global de importação para sobrescrever documentação ou contratos de tela.
- Ao carregar conteúdo assíncrono, confira se o módulo ainda está ativo antes de aplicar o resultado. Feche/desmonte iframes, observadores e eventos registrados quando sair.

## 5. Procedimento de alteração e verificação

**Antes:**

1. Liste precisamente arquivos de entrada, destinos, IDs, fontes, relações e responsabilidades.
2. Registre invariantes: visual, CSS, documentos, caminhos de telas, ações, menus, exportação, resultados simulados e estado persistido.
3. Anote eventuais conflitos de versão ou dados sem resolvê-los por inferência.

**Durante:**

1. Faça a menor mudança que atende ao pedido; prefira adaptador fino à reescrita do motor original.
2. Preserve arquivos não relacionados e o conteúdo sob `legado/`.
3. Ao acrescentar um módulo, atualize somente o registro, seus arquivos e as fontes realmente necessárias.
4. Não renomeie dados e não mude schemas para atender a uma implementação sem uma decisão explícita.

**Depois:**

1. Verifique `modulos.json` e todos os JSONs editados com parser JSON.
2. Verifique a sintaxe dos JS alterados, por exemplo `node --check motor.js` e `node --check modulos/<id>/motor.js`.
3. Execute a partir de `projeto_11/`: `python -m http.server 8000`, então abra `http://localhost:8000/`. Não use `file://`.
4. Teste entrada inicial, seleção dos módulos, submenu, CSS isolado, ações preservadas e troca entre módulos; confirme também `destruir()`.
5. Teste importação/exportação e recarregamento; verifique que dados isolados e compartilhados não foram sobrescritos indevidamente.
6. Teste estados vazio/erro/carregamento e, quando relevante, mobile/desktop e navegação por teclado.
7. Compare interfaces antes/depois e confira a integridade dos conteúdos que deveriam permanecer idênticos.
8. Relate **quais verificações passaram, quais não foram executadas e quais decisões permanecem pendentes**.

## 6. Convenções para futuras decisões

- **Fluxo:** relações, ações, bifurcações, condições e transições explícitas. Não inferir conexões por ordem de telas ou posição de cartões.
- **Jornadas:** agrupamento e apresentação de telas/ocorrências; não confundir com execução de rotas ou editor de grafo.
- **Protótipo:** simular estados, interações e navegação declarada, distinguindo simulação de chamada de produção.
- **Telas/componentes:** preservar suas identidades, estrutura visual, estilos, estados e variantes; alterações de apresentação condicional não exigem duplicar uma mesma tela.
- **Documentação:** distinguir requisitos decididos, observações, propostas e pendências. Exemplo não equivale a contrato homologado.
- **Contratos e fontes:** o motor lê o que foi declarado; jamais inventar dados, relacionamentos, campos, ações ou destinos faltantes para produzir uma tela aparentemente completa.

## 7. Critério de conclusão

Uma integração está concluída apenas quando o módulo consta no registro, abre na área principal, tem menus/ações no lugar correto, não duplica o shell, preserva seus dados e funcionalidades, funciona na troca de módulos e não produz regressões visuais ou perdas de conteúdo. **Não declarar esses itens concluídos apenas porque os arquivos existem ou passaram na análise sintática.**

Se a tarefa for apenas escrever documentação ou exportar um arquivo, **não modificar os fontes do Projeto 11**: entregar exclusivamente o artefato solicitado.
