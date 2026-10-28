# Contrato — Workspace V6

## Finalidade
Ler o histórico consolidado de decisões de produto e distinguir aprovação de proposta.

## O que existe hoje
resumoContrato() mostra capítulos, total de linhas e tamanho do catálogo.

**Entradas canônicas:** definicoes.md local e contagens dos JSONs ativos. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `definicoes.md` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/definicao/contrato/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Abrir o documento e verificar títulos, origem e status de decisões.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
A leitura documental não altera nem valida exaustivamente os JSONs.

**Regra especial:** Não resumir/substituir conteúdo histórico sem pedido; separar APROVADO, PENDENTE, PROPOSTO.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
