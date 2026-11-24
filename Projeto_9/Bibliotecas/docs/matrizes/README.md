# Matrizes por versão — etapa pré-conversão

Esta pasta é uma **documentação de auditoria**, não uma conversão nem homologação de fluxos.

## Critérios

- Cada versão recebe matriz própria de telas e rotas, com arquivos CSV/JSON e visualizador HTML autocontido.
- V1: telas e rotas Flutter indicadas no inventário; não criar arestas navegáveis sem fonte explícita.
- V2/V2.1/V3: copiar como evidência as rotas declaradas, origem/evento, destino, condição por estado e classificação existente; **não assumir que estão corretas**.
- Os IDs são comparados estritamente; semelhança de nome e posição em pasta não equivale à mesma tela.
- `destino_no_escopo=false` exige inspeção funcional posterior. `destino_no_escopo=true` só confirma existência do ID, não ordem correta de navegação.
- `equivalencias_por_id` é um índice de coincidência textual, não um aliasMap nem prova de equivalência semântica.

## Ordem de trabalho após as matrizes

1. Revisão semântica de Splash, Boas-vindas, login, cadastro e onboarding por perfis.
2. Revisão de entradas/saídas de cada tela com confiança e alternativas.
3. Aprovação das hierarquias de jornadas/subjornadas e rotas candidatas.
4. **Só então** conversão física da V2 para o contrato da V3, sem manter duplicações antigas.

As bibliotecas originais permanecem intactas neste pacote.
