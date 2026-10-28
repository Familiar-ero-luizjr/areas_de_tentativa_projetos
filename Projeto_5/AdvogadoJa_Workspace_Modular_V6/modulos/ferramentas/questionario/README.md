# Questionário — Workspace V6

## Finalidade
Apresentar respostas aprovadas e recomendações provisórias separadamente.

## O que existe hoje
resumo() distingue aprovações, respostas confirmadas e recomendações usadas apenas como base.

**Entradas canônicas:** questionario.json local, respostas de usuário e catálogo para contexto. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `questionario.json` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/ferramentas/questionario/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Alterar proposta, exportar resposta e confirmar que status permanece provisório.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Opção recomendada não foi homologada; não altera automaticamente JSONs ou regras.

**Regra especial:** Não promover recomendação a aprovação sem consentimento explícito; preservar observações.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
