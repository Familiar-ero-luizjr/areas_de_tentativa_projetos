# Flow — Projeto 7: visualizador do Projeto 8 com contratos canônicos do Projeto 7

**Estado:** visualizador atualizado; integração por projeção em memória, sem migrar telas e sem substituir a estrutura dos JSONs canônicos.

- `index.html`: interface e motor do Fluxo declarativo originário de `Projeto_8/FLUXO/index.html`, com os dados embutidos do Projeto 8 **retirados**.
- `adaptador_p7.js`: lê os JSONs existentes do catálogo por `identidade.id` e projeta os campos `navegacao.participacoes`, `saidas`, `entradas`, `bifurcacoes` e `nosContextuais` para a API de apresentação do Fluxo 8.
- `catalogo_caminhos.json`: índice **apenas de nomes físicos dos arquivos** de `../catalog/catalogo/`. Não guarda cópia de telas, participantes, relações ou estados.
- `legado_contrato_vivo.html`: cópia intacta do antigo `flow/index.html`, para teste de regressão e reversão.

## Regras de compatibilidade
1. **Fonte canônica** continua exclusivamente em `catalog/catalogo/*.json` (17 campos originais de primeiro nível).
2. O adaptador não escreve no catálogo e não tenta corrigir nomes físicos que divergem de `identidade.id`.
3. Onde não há `ocorrenciaNoRef`, a visualização gera uma chave local derivada do ID da participação, sem inventar tela, destino ou regra de negócio.
4. Saídas sem nó de origem/destino explicitamente identificado permanecem incompletas e podem aparecer como alertas de auditoria; não são conectadas por palpite.
5. **Importar/Exportar rascunho** e o armazenamento local continuam no formato interno do Fluxo 8. **Não são um patch canônico do Projeto 7**; a aplicação de alterações no catálogo exige conversor e validação próprios.
6. Para atualizar o motor, preservar a versão de origem e manter o adaptador segregado. O motor do Projeto 8 foi reutilizado como visualizador; não houve junção com o JavaScript legado do Projeto 7.
7. A listagem de caminhos deve ser atualizada quando novos JSONs forem adicionados/retirados do catálogo; não representa outra autoridade sobre telas.

A pasta deve ser servida por HTTP/HTTPS. No GitHub Pages, abra `Projeto_7/flow/`; em `file://` a leitura por `fetch` será bloqueada em muitos navegadores.
