# Advogado Já · Laboratório V3 — telas JSON com árvore inspecionável e exportação seletiva

## Entrega

`saida/advogadoja_laboratorio_telas_v3.html`: **arquivo único HTML autocontido** e offline. Não usa CDN, API, biblioteca remota ou recursos externos.

## Arquitetura declarativa herdada da V2

- **Eliminados os templates HTML das telas**. `estrutura.fragmentos[].arvore` agora contém uma árvore de nós JSON puros, com IDs estáveis, tags, atributos, filhos e vínculos.
- O renderizador DOM é **universal**: cria elementos de acordo com a árvore e não possui código HTML/roteamento/markup específico de Entrar, Início Profissional ou Home Cliente.
- Ações são guardadas em `acoes`; `interacoes` contém referências `acaoRef` por ID de elemento, separadas da aparência.
- Textos e atributos que vêm de dados do modelo mantêm referências, de modo que editar `dados` reconstrói a tela com esses valores.
- O editor visual altera `estilos.elementos`, os valores de dados ou a árvore do elemento, e o catálogo de ações com interações. A guia JSON pode inserir qualquer nó novo com seu ID, atributos e filhos.

## Telas do laboratório

- Entrar (`auth.sessao.entrar`) é a abertura.
- Início Profissional (`advogado.home_advogado`) é a navegação padrão do botão Entrar.
- Home Cliente (`cliente.home_cliente`) está pronta no JSON e pode ser ativada pela barra lateral.

Aparência derivada dos arquivos reais da biblioteca da V2 do ZIP `contrucao_fluxo-main.zip`, sem escrever CSS alternativo que imite as telas. A estrutura HTML foi **migrada uma vez para nós JSON**; o runtime usa somente esses nós.

## Estrutura do projeto

```text
laboratorio_telas_json_v2/
├── AGENTS.md
├── CONTRATO_JSON.md
├── README.md
├── projeto.json
├── compilar.py
├── dados/
│   └── conteudo.json
├── estilos/
│   └── tema.css                # apenas aparência da interface do laboratório
├── interface/
│   └── estrutura.html          # apenas shell fixo do laboratório/editor
├── comportamentos/
│   ├── 01-utilitarios.js       # esquema, validação e estado
│   ├── 02-renderizador.js      # árvore JSON -> DOM + executor genérico de ações
│   ├── 03-editor.js            # propriedades, alterações e JSON
│   ├── 04-inicializacao.js     # eventos do laboratório e integração
│   └── 05-arvore-importacao.js # árvore explorável, seleção, exportação e importação com revisão
└── saida/
    └── advogadoja_laboratorio_telas_v3.html
```

## Usando

1. Abra `saida/advogadoja_laboratorio_telas_v3.html` diretamente no navegador.
2. No modo **Simular**, clique em **Entrar** para ver a Home Profissional. O botão **Preencher login com mock** define credenciais fictícias.
3. No modo **Editar**, selecione um elemento (Alt+clique para alcançar um elemento interno) e modifique o texto, deslocamento, cor, tamanho ou ação. Volte a Simular.
4. Na guia **JSON**, selecione `estrutura`, `estilos`, `acoes`, `interacoes`, `dados`, `estados`, `tela` ou `projeto`. Clique **Validar e aplicar**.
5. Na aba **Árvore JSON**, veja as três telas em seções independentes, expanda nós/propriedades e inspecione os valores.
6. Exporte uma tela, as marcadas ou todas. O topo ainda permite **Exportar projeto completo** (contrato V2).
7. Importe por qualquer botão Importar JSON/Telas, revise conflitos e escolha preservar (padrão) ou atualizar IDs existentes.
8. Para recompilar fontes: `python compilar.py` na pasta do projeto.

## Exemplo: novo botão

No bloco `estrutura`, acrescente um nó em `filhos` de qualquer seção:

```json
{"id":"content::meu-botao","tag":"button","atributos":{"type":"button","class":"secondary"},"filhos":["Meu botão"]}
```

Depois, em `acoes`, adicione: `"mostrar_alerta": {"tipo":"popup","titulo":"Teste","mensagem":"Funcionou"}`.
Em `interacoes`, adicione: `"content::meu-botao": {"evento":"click","acaoRef":"mostrar_alerta"}`.
A partir daí o botão é visível e executa o pop-up — **nenhuma mudança no JavaScript do motor**.

## Verificações

- Validação do modelo JSON, ausência de propriedade `template` e IDs de nós sem repetição.
- Testes no Chromium da renderização, preenchimento por mock, Entrar → Home, drawer, estado Online/Offline, alteração de ação para pop-up, edição de posição, edição do bloco `dados`, adição de nó em `estrutura`, ação + interação em JSON e exportação.
- Sem erro JavaScript ou requisição de rede nos testes; comparação visual da tela Entrar praticamente pixel a pixel com a V1, e Home Profissional com diferença média inferior a 0,1 unidade RGB por canal (na viewport testada).

## Limites

O JSON descreve todas as telas, mas o motor ainda implementa **as capacidades universais** de DOM, estilos, eventos e estados. Não pode interpretar qualquer ação inventada no JSON sem registro do tipo no motor. Arrays de dados já migrados geraram nós explícitos: adicionar um item a uma lista exige também adicionar seu nó em `estrutura`; não há ainda sintaxe declarativa de repetição. Os dados de login e das Homes são fictícios; nenhum backend é usado.

## V3 — Árvore JSON e portabilidade de telas

A V3 adiciona a terceira aba principal `Árvore JSON` (além de `Simular` e `Editar`), como uma página separada. Cada definição de tela aparece em sua própria seção, com botão de exportação e checkbox de seleção. As propriedades, objetos e arrays são abertos por demanda, mantendo boa resposta mesmo com CSS longo embutido em JSON.

- **Exportar esta tela:** arquivo `<id_da_tela>.json` com um objeto `tela` completo e suas dependências globais.
- **Exportar selecionadas:** arquivo com lista `telas`, contendo apenas as marcadas, sem alterar as não marcadas.
- **Exportar todas:** lista `telas` de todas as telas, inclusive opcionais/inativas, e dependências.
- **Exportar projeto completo:** compatibilidade com o exportador da V2; salva o objeto `projeto` completo no schema original.
- **Importar telas / Importar JSON:** aceita exportação individual, coleção, JSON direto de uma tela declarativa e projeto V2 completo; primeiro valida, depois mostra a comparação e exige confirmação. ID existente é preservado por padrão e só substituído por escolha explícita; não se removem telas ausentes do importado.
- **Caminho e valor:** ao selecionar um nó, painel lateral mostra caminho JSON e o valor completo, com botões de cópia e atalho para editar seu bloco no Editor.

### Formato portável de exportação individual

```json
{
  "schema": "advogadoja-laboratorio-telas-v2-export",
  "versao": "3.0.0",
  "tipo": "tela",
  "origem": {"projeto": "…", "contrato": "advogadoja-laboratorio-telas-v2"},
  "dependencias": {"mocks": {}, "assets": {}},
  "tela": {"id": "auth.sessao.entrar", "estrutura": {}, "estilos": {}, "acoes": {}, "interacoes": {}, "dados": {}, "estados": {}}
}
```

Quando `tipo` é `colecao`, o campo `tela` é substituído por `telas: [{…}, {…}]`.
O exemplo acima indica a organização, e não contém todos os dados reais. O schema das telas continua `advogadoja-laboratorio-telas-v2` por compatibilidade; a interface evoluiu para a V3.

### Importante sobre persistência

A árvore reflete alterações feitas no Editor assim que você retorna a ela. Alterações importadas são feitas somente em memória do navegador até exportação. A função de importação **não edita arquivos no disco nem sincroniza com o GitHub**. Se quiser incorporar alterações no projeto-fonte, importe o JSON exportado ou modifique `dados/conteudo.json` e recompile.

### Testes

`python testes/auditar_contrato.py` e `python testes/testar_navegador_v3.py` (Playwright e Chromium no ambiente de desenvolvimento). O teste funcional cobre árvore, busca, exportação individual/seletiva/completa, dependências, conflitos com preservar/substituir, importação de tela nova, navegação e bloqueio de JSON inválido.
