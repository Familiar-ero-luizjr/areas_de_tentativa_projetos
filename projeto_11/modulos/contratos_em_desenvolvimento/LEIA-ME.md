# Atualização incremental — Contratos em desenvolvimento

Copie modulos.json e modulos/contratos_em_desenvolvimento/ sobre a raiz do Projeto 11. Abra via servidor HTTP (iniciar.bat). O index, estilo e motor principais não foram alterados.

O catálogo controla os dois grupos e seus itens. Os 14 laboratórios compartilham documentos/index.html, estilo.css e motor.js. Cada tela tem seu documento.json individual. A árvore lê o MESMO JSON da Home, sem cópia. Importação na árvore altera a sessão; exporte e substitua o arquivo correspondente para persistir.

Migração estrutural experimental V0.4 → V0.5: rotas dentro da navegação, classificação aninhada, IDs, condições e elementos preservados. Rotas incluem nome para leitura. Só os componentes utilizados foram incluídos. As 20 telas demonstrativas não foram duplicadas; referências e caminhos permanecem. A Home inclui oito entradas de autenticação adicionais já existentes no laboratório. O motor do laboratório continua simulando navegação por modal, conforme o ZIP de origem.

Sobreposição não apaga arquivos antigos. Após conferir, remova apenas os antigos documentos/telas/*.html e arvore/Home_Cliente_Arvore_JSON_V05.html; não remova as subpastas com JSON. O antigo documentos/LEIA-ME.md também fica obsoleto. O catálogo novo não usa esses arquivos. Para adicionar telas, crie uma pasta com documento.json e registre no catálogo.
