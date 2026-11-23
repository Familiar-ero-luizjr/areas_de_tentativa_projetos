# Biblioteca AdvogadoJá V2.1.1 — reconstrução no molde V3

## Entrega
192 pastas em `01/telas` e `02/telas`, cada qual com `index.html`, `style.css`, `motor.js` e `documento.json`. O motor é o mesmo em todas. As instâncias referenciam componentes em `componentes/catalogo.json`; os elementos HTML saíram dos JSONs de tela.

## Escopo e limitações
- Cada definição de tela preserva o ID da fonte como identidade lógica. IDs duplicados entre 01/02 são mantidos até reconciliação verificada, não mesclados por similaridade.
- O catálogo usa componentes específicos por instância para garantir que os elementos originais não sejam misturados; deduplicação semântica posterior exige prova de equivalência.
- Rotas de clique genéricas não são executáveis: `eventoRef:null` / `status:pendente_vinculo_evento`. As relações de jornadas são as pistas da V2, não são consideradas caminhos homologados.
- Visuais, textos e CSS são reconstruídos a partir das árvores da V2. Não se declara equivalência pixel a pixel sem testes comparativos individuais.
- `referencia_v3/` é cópia do molde original para inspeção e regressão; não faz parte das 192 telas convertidas.
- O motor não chama backend, não autentica, não publica nem executa os destinos por conta própria; comunica rotas ao hospedeiro.

## Servir
Na pasta `ADVOGADOJA_BIBLIOTECA_V2_1`, execute `python -m http.server 8765`. Abra uma das telas em `01/telas/.../index.html` ou `02/telas/.../index.html`; a pasta `componentes/catalogo.json` é consumida pelo motor. Use `?debug` para selecionar estados visuais.

## Atualização V2.1.1
Coleções de 7 componentes foram reconstruídas com os dados de demonstração dos HTMLs V1. Marcadores Handlebars deixam de aparecer na interface. As rotas pendentes permanecem identificadas; homologação visual e funcional ainda é necessária.
