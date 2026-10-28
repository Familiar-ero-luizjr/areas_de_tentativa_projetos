# Banco — Workspace V6

## Finalidade
Projetar necessidades de dados sem executar banco de dados.

## O que existe hoje
projetar() agrega declarações de operações, entidades e fontes por tela.

**Entradas canônicas:** dados.operacoes, dados.persistencia, dados.fontes. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

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
2. Abra `modulos/projecao/banco/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Checar rastreabilidade de cada entidade à tela e avisos para ausência de requisitos.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Se os campos não descrevem schema suficiente, exibir aviso; não inventar tabelas.

**Regra especial:** Não criar esquema a partir de mocks; não executar migrações nem gravações em serviço real.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
