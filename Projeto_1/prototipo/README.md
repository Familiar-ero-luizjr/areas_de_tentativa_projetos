# Protótipo navegável — laboratório Advogado Já Plus

Acesse a aba **Protótipo** no `index.html` raiz ou abra `prototipo/index.html` diretamente pelo servidor.

## Iniciar

No terminal, dentro da raiz do laboratório:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000/index.html#prototipo`.

Não abra diretamente com `file://`, pois o navegador bloqueia a leitura dos JSONs locais por `fetch`.

## Estado desta versão

- Quatro jornadas: Maria (Cliente), João (Advogado), Ana (Estudante) e Administrador.
- Cada JSON mantém nós, decisões, estado e prévias visuais extraídos **sem editar** os HTMLs originais de `jornadas/`.
- A navegação é feita pelos controles do protótipo (Avançar, Voltar, Reiniciar, selecionar decisão, acessar ponto da jornada).
- As telas incorporadas são **prévias estáticas**: nenhuma autenticação, gravação ou integração operacional ocorre nesta interface. Estados sem tela não são fabricados.
- A aplicação Next.js em `advogadojaplus-v2/` foi mantida intacta. Suas telas podem substituir as prévias conforme forem implementadas, mediante mapeamento explícito de rotas.

## Atualização das jornadas

Os arquivos `cliente.json`, `advogado.json`, `estudante.json` e `administrador.json` são snapshots da versão do ZIP recebida. Para atualizá-los após alterar os HTMLs de `jornadas/`, extraia novamente as constantes `GLOBAL_RUNTIME_CSS`, `SCREENS` e `FLOW_NODES` de cada jornada, preservando os demais arquivos. A regeneração **não é automática**, portanto mudanças diretas nos HTMLs originais não aparecem automaticamente no protótipo.

Para apresentar com Vinix ou outro ambiente, sirva toda a pasta do laboratório e use `index.html#prototipo` como entrada, ou incorpore essa página numa aba que aceite `iframe` de mesma origem.
