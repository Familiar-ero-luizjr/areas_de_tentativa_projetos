# Jornadas — Workspace V6

## Finalidade
Agrupar participações, ordenar os percursos e exportar conjuntos completos.

## O que existe hoje
projetar() filtra nós por jornada, calcula arestas e dependências para pacote.

**Entradas canônicas:** navegacao.participacoes, navegacao.entradas, acoes e componentes referenciados. Os dados vêm somente de `../../../catalogo/indice.json` e dos JSONs ativos que ele enumera. O motor não consulta o acervo antigo.

## Arquivos locais
- `index.html` — interface HTML deste módulo
- `style.css` — estilos exclusivos
- `app.js` — interação e controles
- `motor.js` — transformação/projeção própria
- `catalogo.js` — auxiliar local; sem import de outro módulo
- `regras.js` — auxiliar local; sem import de outro módulo
- `resolvedor.js` — auxiliar local; sem import de outro módulo
- `ui.js` — auxiliar local; sem import de outro módulo
- `AGENTS.md` — regras de desenvolvimento
- `README.md` — este guia

## Como verificar
1. Execute `python iniciar.py` na raiz `AdvogadoJa_Workspace_Modular_V6`.
2. Abra `modulos/construcao/jornadas/index.html` a partir do Workspace ou pelo servidor HTTP.
3. Verificar três ordens explícitas e exportação com dependências sem criar links implícitos.
4. Modifique HTML/CSS/JS/motor **somente nesta pasta** e confirme os imports internos.

## Limites e próxima evolução
A transferência definitiva Estudante → Cliente foi definida como objetivo, mas não está concluída no motor atual.

**Regra especial:** Não clonar telas nem reescrever relações internas válidas; preservar IDs; não inventar modalidade paralela de incorporação temporária.

Outros módulos podem interpretar os mesmos dados, mas não importam código deste módulo. A mudança no contrato JSON compartilhado requer teste de conformidade dos consumidores. GitHub Pages fornece leitura estática; salvar arquivos físicos exige o servidor local ou exportação controlada.
