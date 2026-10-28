# Catálogo — Workspace V6

## Finalidade
Editar e inspecionar os JSONs de tela e componente com montagem visual.

## O que existe hoje
projetar() apresenta referências, participações e auditoria; a interface tem Árvore e JSON, Montagem visual e Motor/JSON.

**Entradas canônicas:** identidade, componentes, estrutura, estilos, estados, variantes, mocks e navegação. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `montagem.js` — auxiliar local; sem import de outro módulo
- `regras.js` — auxiliar local; sem import de outro módulo
- `resolvedor.js` — auxiliar local; sem import de outro módulo
- `validador.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/construcao/catalogo/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Abrir tela e componente, conferir ref, editar em rascunho, validar e só então salvar.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
A prévia é laboratório; não equivale a app Flutter ou produto homologado.

**Regra especial:** Não copiar definições de componentes; revisar impactos de componentes compartilhados; não incluir acervo no índice.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
