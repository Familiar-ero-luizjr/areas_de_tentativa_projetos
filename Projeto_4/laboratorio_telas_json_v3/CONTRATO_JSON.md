# CONTRATO CANÔNICO — Laboratório de telas JSON V2

## Regra central

O motor JavaScript **não contém nenhum template HTML de telas**. Ele monta as telas por criação de nós DOM a partir de `telas[id].estrutura.fragmentos[].arvore`, lendo seu estilo, dados e ações de outros blocos JSON. O único HTML fixo é o **shell do laboratório** (editor, navegador de telas e iframe), que não é a aplicação projetada.

As telas iniciais `auth.sessao.entrar` e `advogado.home_advogado` são ativas. A tela `cliente.home_cliente` existe como terceira tela opcional. São simulações sem autenticação real.

## Modelo do projeto

```json
{
  "schema": "advogadoja-laboratorio-telas-v2",
  "versao": "2.0.0",
  "inicial": "auth.sessao.entrar",
  "telas": {
    "auth.sessao.entrar": {
      "estrutura": {"raiz": "login", "layout": {}, "fragmentos": []},
      "estilos": {"tema": {}, "baseCss": "", "componentes": {}, "elementos": {}, "cssAdicional": ""},
      "acoes": {},
      "interacoes": {},
      "dados": {"componentes": {}, "fixtures": {}, "campos": {}},
      "estados": {}
    }
  },
  "mocks": {},
  "assets": {},
  "configuracoes": {}
}
```

## 1. Estrutura

Fragmentos conservam o `id`, `slot`, `ordem`, `origem`, `habilitado` e **`arvore`**. Cada nó DOM é definido pelo JSON:

```json
{
  "id": "content::botao_personalizado",
  "tag": "button",
  "atributos": {"class": "secondary", "type": "button"},
  "filhos": ["Abrir pop-up"]
}
```

- `id`: identificador estável, único dentro da tela; referenciado por ações e estilos.
- `tag`: tag DOM permitida (`div`, `button`, `img`, `svg`, `path`, `input`, etc.); não permite script, iframe, style, object, embed ou link.
- `atributos`: atributos DOM, inclusive SVG, classes, ARIA e `data-*`.
- `filhos`: outros nós ou conteúdo textual, em ordem.
- `vinculos` (opcional): associação declarativa de valor de input, texto ou classe a dados/estado.
- Texto também pode vir de `{ "ref": "dados.componentes.content.entrar" }`, inserido em `filhos`, ou de `{ "partes": ["Olá, ", {"ref":"dados.fixtures.hero.name"}] }`.
- Não existe `template` HTML em nenhum fragmento. Alterar `arvore` reconstrói o DOM. Cada elemento é criado por `document.createElement` ou `document.createElementNS` para SVG.

**Observação sobre listas:** as listas de demonstração da V1 foram convertidas em nós explícitos, cujos textos e atributos mantêm referências indexadas aos dados. Atualizar os valores dos itens existentes em `dados.fixtures` atualiza a renderização; **adicionar ou remover itens exige adicionar ou remover os nós correspondentes em `estrutura.arvore`**. A V2 não implementa ainda uma instrução declarativa de repetição automática.

## 2. Estilos

- `estilos.tema`: variáveis CSS `--*`.
- `estilos.baseCss`: CSS de referência da biblioteca V2, armazenado no próprio JSON.
- `estilos.componentes[fragmentoId]`: CSS do componente/fragmento.
- `estilos.elementos[elementId]`: alterações pontuais criadas pelo editor (`x`, `y`, `css`).
- `estilos.cssAdicional`: alterações avançadas da tela.

Os estilos da biblioteca original não são reconstruídos a partir de heurísticas. São incorporados no JSON de cada tela para reproduzir a aparência original.

## 3. Ações e interações

`acoes` é o catálogo de comandos da tela. `interacoes` associa o evento de um elemento a uma referência de ação:

```json
{
  "acoes": {
    "abrir_customizado": {
      "tipo": "popup", "titulo": "Meu pop-up", "mensagem": "Simulação"
    }
  },
  "interacoes": {
    "content::botao_personalizado": {
      "evento": "click", "acaoRef": "abrir_customizado"
    }
  }
}
```

Tipos suportados: `navegar`, `popup`, `mock`, `alternarEstado`, `menu`, `selecionarFiltro`, `fecharPopup`, `vincular`, `nenhuma`. Eventos aceitos: `click`, `submit`, `input`, `change`. Todas as ações devem ser configuradas por JSON; o motor não contém `if` por ID de tela ou handler específico de Login.

Destino de navegação desconhecido abre um aviso, não cria uma tela falsa. `mock` só preenche campos locais; não acessa serviços reais.

## 4. Dados e estados

Os campos `dados.componentes`, `dados.fixtures` e `dados.campos` são lidos pelo motor por referências `ref`. `estados` representa as flags de cada tela. Mudanças na flag `online`, por exemplo, ativam os vínculos `vinculos.textoPorEstado` e `vinculos.classePorEstado`. O JS só conhece o **tipo de vínculo**, não onde esse vínculo aparece na tela.

## 5. Editor e persistência

- Ao selecionar um elemento, seu `id` é usado para atualizar `estilos.elementos`.
- Edição de texto atualiza a folha de `estrutura.arvore` **ou** o campo apontado por sua referência em `dados`.
- Edição de uma ação cria/atualiza uma entrada em `acoes` e altera `interacoes[elementId].acaoRef`.
- A guia JSON permite modificar `estrutura`, `estilos`, `acoes`, `interacoes`, `dados`, `estados`, a tela completa ou o projeto inteiro.
- Ações de importação passam por validação de IDs, referências, estrutura e tags permitidas.
- Alterações feitas no navegador não persistem na fonte: exporte/import JSON, ou modifique `dados/conteudo.json` e recompilhe.

## 6. Limites

- Sem autenticação real, backend, pagamentos ou banco de dados.
- Sem repetição automática de arrays e sem construção de telas remotas por nome; todas as telas devem estar presentes no projeto JSON.
- Controles do editor visual abrangem texto de folha, aparência, posição e ação. Para adicionar, remover ou reorganizar nós e alterar atributos complexos use o bloco `estrutura` da guia JSON.
- CSS no JSON é texto CSS declarativo. O motor organiza os estilos e cria o DOM; isso não é uma linguagem de programação executada pelo usuário.
- Preserva o visual de referência (fonte V2) e alguns dados de demonstração necessários às telas que originalmente dependiam de dados em runtime.


## 7. Extensão da V3: árvore de inspeção, exportação e importação

A V3 **não modifica o schema das telas V2**. Ela adiciona uma página de exploração e um envelope portável de intercâmbio de telas.

- `schema`: constante `advogadoja-laboratorio-telas-v2-export`.
- `versao`: `3.0.0` (versão do envelope, não do schema visual).
- `tipo`: `tela` (um objeto em `tela`) ou `colecao` (array em `telas`).
- `origem`: metadados do projeto e do contrato de origem.
- `dependencias.mocks`, `dependencias.assets`: recursos globais existentes no projeto, para evitar exportação que dependa de arquivos remotos.
- A exportação não reescreve IDs nem converte ações para código: usa as definições declarativas correntes.

Importação: valida formato, IDs únicos, estrutura, referências de interação, tags permitidas e limites do contrato antes de oferecer confirmação. A opção padrão preserva a tela existente quando há conflito. A opção atualizar substitui **somente IDs do arquivo**. Dependências globais são mescladas por chave; entradas existentes permanecem, exceto na opção explícita de atualização. Telas não mencionadas são preservadas. O exportador legado de projeto completo permanece disponível no topo.

Exploração: o painel Árvore JSON renderiza nós recursivos de maneira preguiçosa, diretamente de `projeto.telas`. Não gera templates HTML próprios para telas. O nó selecionado mostra o valor JSON completo (somente leitura) e um atalho para o editor de bloco original.
