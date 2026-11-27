# AdvogadoJá — Projeto 11

Refatoração do HTML original em quatro módulos.

## Executar
Extraia o ZIP, abra o terminal na pasta projeto_11 e execute `python -m http.server 8000` (ou `py -m http.server 8000` no Windows). Abra http://localhost:8000. Também funciona com Live Server. Não abra por file://, pois o navegador bloqueia fetch de JSON e HTML.

## Adicionar módulo
1. Crie `modulos/meu_modulo/index.html`, `estilo.css`, `motor.js`. O HTML pode conter `<section data-conteudo></section>`.
2. Crie `dados/meu_modulo.json` (objeto com chaves de primeiro nível exclusivas, sem repetir chaves de outras fontes).
3. Acrescente a `modulos.json`, dentro de `modulos`, o registro:

```json
{"id":"meu_modulo","nome":"Meu módulo","ordem":5,"ativo":true,"dados":["meu_modulo","sql_nosql"]}
```

4. No motor individual registre:

```js
registrarModulo('meu_modulo', {
  iniciar(ctx) {},
  atualizar(ctx) {
    ctx.container.textContent = JSON.stringify(ctx.dados.meu_modulo, null, 2);
  },
  destruir() {}
});
```

O menu é montado pelo registro. Os motores são carregados na inicialização para compatibilidade com as funções legadas. HTML e CSS são aplicados ao selecionar o módulo. Use `ctx.servicos.atualizarDados(id, objeto)` para alterar dados e `ctx.servicos.exportarJSON(id)` para exportar. O contexto retorna cópias dos dados; os quatro módulos legados ainda usam o estado compartilhado P e handlers inline para preservar comportamento. Não há descoberta automática de pastas.

## Dados
`sql_nosql.json`: versão, projeto, tipo, domínios, tabelas e relações. `telas_e_dados.json`: telas e mapeamentos. Importação global mantém o formato V3 original. Alterações ficam no localStorage; exporte para salvar no disco. O botão Exportar fontes baixa os JSONs separadamente.

## Verificação
Sintaxe JavaScript conferida com Node. O teste visual no navegador foi bloqueado pela política do ambiente; não há garantia de equivalência visual integral ou de todos os fluxos de edição.

## Documentação integrada
O módulo editor_documentacao usa a fonte dados/editor_documentacao.json (84 seções, versão mais completa do ZIP recebido). O menu de seções é um submenu do menu principal. A fonte documental é isolada do modelo relacional e salva localmente pelo motor geral. Exportar fontes inclui ambos os modelos e a documentação; exportar JSON global mantém o formato V3 do banco.

Importação parcial aceita um objeto {id,title,content,children}, uma lista de objetos, ou um envelope sections/section. Escolha raiz, acima, abaixo, subseção ou atualização por ID. IDs duplicados são recusados; atualização preserva filhos não enviados. Importação completa é uma ação separada com confirmação. Para persistir no arquivo físico, exporte e substitua manualmente a fonte em dados/.
