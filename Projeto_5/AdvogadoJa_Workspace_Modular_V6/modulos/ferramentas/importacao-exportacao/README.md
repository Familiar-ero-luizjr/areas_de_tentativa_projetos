# Importação e Exportação — Workspace V6

## Finalidade
Trocar pacotes completos de telas/componentes e comparar alterações por ID.

## O que existe hoje
exportacao() monta pacote; comparar() distingue novos, iguais e alterados e calcula impacto de componentes.

**Entradas canônicas:** catálogo ativo inteiro, índice e pacotes JSON/ZIP. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `zip.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/ferramentas/importacao-exportacao/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Exportar/importar pacote sem mudanças; examinar diferenças e confirmar gravação validada.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
Reconciliar campos complexos e mover jornada ainda exigem contratos adicionais.

**Regra especial:** Nunca apagar ausentes, não sobrescrever compartilhados sem revisão, impedir alterações não autorizadas.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
