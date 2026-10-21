# Contrato de dados HTML autocontido V1

## Fonte editável

`projeto.json`:

```json
{
  "schema": "html.autocontido.projeto.v1",
  "id": "meu-projeto",
  "titulo": "Meu projeto",
  "modo": "arvore",
  "dados": "dados/conteudo.json",
  "interface": "interface/estrutura.html",
  "estilos": ["estilos/tema.css"],
  "comportamentos": ["comportamentos/01-estado-indices.js", "comportamentos/02-componentes-render.js", "comportamentos/03-busca.js", "comportamentos/04-acoes.js"]
}
```

`dados/conteudo.json`:

```json
{
  "schema": "html.autocontido.dados.v1",
  "versao": 1,
  "itens": [
    {
      "id": "tela.login",
      "parentId": null,
      "titulo": "Login",
      "tipo": "tela",
      "descricao": "Tela de autenticação",
      "campos": {"codigo": "S010", "responsavel": "Autenticação"},
      "palavrasChave": ["entrada", "conta"]
    }
  ]
}
```

## Regras

- `id` é **identidade canônica**. Não reutilizar um ID para entidades distintas.
- `parentId` deve ser um ID existente ou `null` na raiz. São proibidos ciclos e IDs duplicados.
- `titulo` é obrigatório. `tipo`, `descricao`, `campos` e `palavrasChave` são opcionais. `campos` é objeto, `palavrasChave` é lista de strings.
- Na exportação a partir do navegador, o payload segue o mesmo schema de dados. Importação mescla por `id` e valida antes de aplicar. Não apaga silenciosamente itens ausentes.
- `modo` suporta `arvore`, `modulos`, `aplicacao` no gerador genérico. Para `fluxo` ou layouts específicos, construir template/componentes locais à aplicação, sem alterar os dados canônicos além do necessário.
- Caso um HTML represente arquivos de código e conteúdos volumosos, guardar conteúdo apenas na fonte JSON ou payload comprimido; a interface deve abrir/descompactar somente o que for solicitado.
- Não inserir credenciais, tokens, dados reais sensíveis ou texto HTML sem sanitização.
