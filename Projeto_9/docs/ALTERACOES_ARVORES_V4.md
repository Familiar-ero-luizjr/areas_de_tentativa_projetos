# Árvore progressiva V4 — remoção do modal de navegação simulada

A partir do arquivo HTML V3 fornecido, foi removido o componente artificial de navegação simulada que o documento canônico V2 marca como obsoleto. A fonte original permanece inalterada; este pacote é derivado.

Em **Jornada, Fluxo e Protótipo**:
- Removida a definição `componentes["modal.route-modal.v02"]` (inclui todos os seus elementos HTML e CSS exclusivo).
- Removida a instância `telas["advogado.home"].estrutura.html.composicao["screen.modal"]`.

Em **Fluxo e Protótipo**, adicionalmente:
- Removida `advogado.home.interacao.route_close` de `interacoes.eventos`.
- Removida `advogado.home.acao.route_close` de `acoes.itens`.

Os outros oito componentes são preservados com os seus HTML, CSS e estados, sem criação de aliases ou rotas. `popup.status-toast.v01` foi mantido porque não representa um modal de navegação simulada. As regras legadas `.device-frame` continuam no CSS do contrato original e não fazem parte desta exclusão específica.

**Critérios verificados:** três abas, identidade `advogado.home` consistente, oito componentes e oito instâncias por etapa; nenhuma referência residual para `modal.route-modal.v02`, `screen.modal`, `route_modal.*`, `route.close` ou `route_close` no JSON exportado.

**Situação:** as projeções de Fluxo e Protótipo permanecem não homologadas e não executam navegação.
