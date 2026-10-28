# Mapa de Interações — Workspace V6

## Finalidade
Relacionar gatilhos, serviços, estados e efeitos das ações, sem duplicar o Flow.

## O que existe hoje
projetar() mostra tela, ação, evento, operação referenciada, estados e possíveis destinos.

**Entradas canônicas:** acoes.itens, rotas, estados e dados. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/projecao/mapa-interacoes/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Conferir que cada interação visível existe em acoes e que faltas são sinalizadas.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Referência de operação não comprova chamada real de API ou backend.

**Regra especial:** Não inventar chamadas ao Maps/autenticação; distinguir evento de transição e serviço de projeção.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
