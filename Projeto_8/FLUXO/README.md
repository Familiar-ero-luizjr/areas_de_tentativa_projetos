# FLUXO — 6 telas — organização independente

## Abrir

Na pasta onde o ZIP foi extraído, execute `python -m http.server 5500` e abra `http://127.0.0.1:5500/FLUXO/`.
O projeto usa apenas os arquivos nas respectivas pastas. Abrir via `file://` pode bloquear a leitura de `documento.json`.

## Estrutura
- `FLUXO/index.html`: menu externo, HTML/CSS original do shell.
- `campos_utilizados/{index.html,motor.js,documento.json}`: frontend/JS/JSON isolados.
- `visualizacao_fluxo/{index.html,motor.js,documento.json}`: frontend React preservado, VFS da biblioteca embutida no JSON e 6 telas ativas.

## Escopo
Splash, Boas-vindas, Entrar, Home Cliente, Home Advogado, Home Estudante (provisória, conforme Plano V2).
As telas Cliente/Advogado usam aliases técnicos do visualizador V2, mapeados explicitamente para as identidades canônicas no documento local.

## Observações de preservação
O design do shell e o CSS de ambos os submódulos foram mantidos. A seleção de seis telas altera intencionalmente a árvore do Fluxo. A Home do Estudante foi incluída a partir do JSON da biblioteca (não havia no visualizador original), e o agrupamento de Homes é apenas editorial, não declara uma autenticação implementada. Os vínculos de outras telas não foram trazidos.

O modelo de *Campos utilizados* foi conservado, inclusive as ações de edição, persistência e importação/exportação. O motor visual React original não foi reescrito.
