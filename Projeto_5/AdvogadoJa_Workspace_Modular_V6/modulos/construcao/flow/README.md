# Flow Editor — Workspace V6

## Finalidade
Desenhar e editar ligações de navegação sem persistir grafo separado.

## O que existe hoje
compilarRelacoes() e ordenarParticipacoes() desenham nós/arestas; o app permite alterar ação de origem.

**Entradas canônicas:** identidade, navegacao.participacoes, navegacao.entradas, acoes.itens e rotas. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `regras.js` — auxiliar local; sem import de outro módulo
- `resolvedor.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/construcao/flow/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Comparar arestas com ações e alterar uma ligação de rascunho com confirmação.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Layout é derivado e depende das conexões realmente declaradas.

**Regra especial:** Não recriar flow.editor, não salvar posições x/y, não deduzir destino pela ordem editorial.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
