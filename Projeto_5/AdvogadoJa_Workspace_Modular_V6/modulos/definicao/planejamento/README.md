# Planejamento — Workspace V6

## Finalidade
Visualizar etapas e pendências da padronização do Workspace.

## O que existe hoje
plano() reúne etapas e utiliza auditar() para contar os registros.

**Entradas canônicas:** contagens do catálogo e auditoria local. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `regras.js` — auxiliar local; sem import de outro módulo
- `resolvedor.js` — auxiliar local; sem import de outro módulo
- `validador.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/definicao/planejamento/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Conferir as cinco telas ativas, pendências e o acervo separado.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
As tarefas são orientativas, não execução automática nem acompanhamento remoto.

**Regra especial:** Não marcar etapa como concluída por inferência; não contar acervo como padronizado.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
