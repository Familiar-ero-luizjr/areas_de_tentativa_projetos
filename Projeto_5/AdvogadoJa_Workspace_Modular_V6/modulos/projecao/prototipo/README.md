# Protótipo — Workspace V6

## Finalidade
Simular navegação, estados, mocks e variantes sobre as cinco telas.

## O que existe hoje
projetar() e resolverTransicao() usam participação e cenário; montarTela() produz a prévia.

**Entradas canônicas:** componentes, estrutura, estilos, estados, mocks, navegacao, acoes, variantes. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `montagem.js` — auxiliar local; sem import de outro módulo
- `regras.js` — auxiliar local; sem import de outro módulo
- `resolvedor.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/projecao/prototipo/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Testar Splash, Boas-vindas, Entrar e Homes com variações e retorno.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Login e demais serviços são simulados, nunca transações reais.

**Regra especial:** Mocks pertencem às telas; aplicar base e alterações visuais contextuais; herdar invólucro visual sem herdar permissão.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
