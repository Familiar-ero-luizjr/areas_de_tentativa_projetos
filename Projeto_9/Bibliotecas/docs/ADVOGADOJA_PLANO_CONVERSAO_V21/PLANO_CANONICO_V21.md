# Plano de reconstrução da biblioteca V2.1 a partir da V3

## Hierarquia de autoridade
- **V3** é a fonte do contrato JSON, motor de renderização, componentes compartilhados e regras de validação.
- **V2** é apenas fonte documental para captura de conteúdo, elementos, estilos, estados e caminhos candidatos. O JSON V2 não é compatível por decreto.
- **V1** é a fonte visual de comparação quando disponível.
- **V2.1** é construída em pasta nova `versao2.1/01/...` e `versao2.1/02/...`, preservando os caminhos relativos das telas da V2 e substituindo suas implementações por contratos canônicos.

## Procedimento obrigatório tela a tela
1. Identificar HTML visual de origem, finalidade, perfil, localização e eventual tela V3 equivalente. Não equiparar IDs diferentes por semelhança textual sem validação.
2. Reconstruir a árvore visual e seus componentes: extrair `estrutura.html.composicao[*].elementos` da V2 para `componentes` canônicos; instância da tela conterá `componenteRef` e `props`, não árvore local duplicada.
3. Comparar CSS original, tokens, regras e mudanças de estado em todos os cenários observados. Estado = dimensões com IDs e opções; efeitos visuais devem ser declarativos.
4. Reconstituir os eventos reais de clique, formulário, fechamento, seleção etc., com `elementoRef` de componentes. Eventos genéricos `button` não são rotas executáveis homologadas.
5. Construir `navegacao.rotas[]` com `id`, `origem.instanciaRef`, `origem.eventoRef`, `destinoRef`, `quando`. Validar exclusividade e totalidade das condições. Destinos desconhecidos permanecem pendentes; não inventar resolução.
6. Construir jornadas/subjornadas a partir de caminhos reais. `classificacao.*Refs` referencia o catálogo; não duplica o grafo.
7. Criar mocks e dados separadamente; não supor autorização, APIs ou ações de backend.
8. Testar com o motor V3: renderização inicial, todas as opções de estado, botões/links, rotas, viewport móvel, referências e diferenças visuais. Registrar aprovação por tela antes de integrar a nova versão.

## Estrutura esperada
```
versao2.1/
  01/telas/<mesmas pastas da V2>/<nome da tela>/
    index.html
    style.css
    motor.js
    documento.json
  02/telas/<mesmas pastas da V2>/<nome da tela>/
    index.html
    style.css
    motor.js
    documento.json
  componentes/catalogo.json
  jornadas.json
  auditoria.json
```
`motor.js` é idêntico em todas as telas (cópia verificável por hash), sem desvios por perfil. Os arquivos de componente ficam num catálogo comum, não numa segunda fonte lógica por tela.

## Aceitação antes de construção em lote
Testar amostras de 01 e 02, especialmente tela com vários componentes, estados, formulário, navegação condicional e elementos SVG. Validação de schema e teste em navegador são critérios distintos. Não remover o acervo V2 da entrega nem migrar todas as telas automaticamente antes de fechar os vínculos e o padrão em um piloto.

## Riscos observados
- A V2 emprega elementos embutidos em instâncias, enquanto a V3 usa componentes referenciados.
- Há rotas da V2 cuja origem é genérica e não está suficientemente ligada ao elemento de origem.
- As classificações de jornada da V2 exigem reconciliação pelo grafo e não podem ser tomadas como autoridade.
- A V3 contém oito contratos de referência e não substitui automaticamente os 192 registros existentes.

## Entregáveis desta etapa
`inventario_plano_por_tela.json` descreve, por cada uma das 192 telas, indicadores, caminhos, alertas e roteiro de reconstrução. `matriz_192_telas.csv` facilita filtrar prioridades. `resumo_auditoria.json` consolida contagens estáticas. **Nenhuma tela foi convertida nesta etapa.**
