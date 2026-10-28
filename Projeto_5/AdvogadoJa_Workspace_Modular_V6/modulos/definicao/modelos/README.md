# Modelos JSON — Workspace V6

## Finalidade
Inspecionar JSONs atuais de tela e componente, suas seções e exemplos, sem homologar automaticamente o schema.

## O que existe hoje
campos() e modelo() em motor.js calculam campos observados e detalham o registro selecionado.

**Entradas canônicas:** schema, identidade e todas as seções dos registros ativos. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

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
2. Abra `modulos/definicao/modelos/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Verificar que a árvore corresponde ao JSON real e não apresenta flow como campo novo.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
A inspeção não substitui validação de schema aprovado.

**Regra especial:** Não transformar ocorrência de campo em obrigatoriedade; respeitar exemplos e versão de contrato.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
