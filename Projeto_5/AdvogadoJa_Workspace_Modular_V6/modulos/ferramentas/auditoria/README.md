# Auditoria — Workspace V6

## Finalidade
Inspecionar consistência, IDs e referências do catálogo ativo.

## O que existe hoje
motor.js expõe auditar() de validador.js privado.

**Entradas canônicas:** identidade, componentes, navegacao, acoes, estados e dados. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

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
2. Abra `modulos/ferramentas/auditoria/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Checar contagens; introduzir referência inválida em rascunho e verificar aviso.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Zero erro no laboratório não significa homologação total ou auditoria do acervo.

**Regra especial:** Não corrigir silenciosamente, não incluir o acervo e apresentar origem de cada problema.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
