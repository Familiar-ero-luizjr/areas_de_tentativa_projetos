# AdvogadoJá Jornadas V4 — estrutura modular

Separação do HTML original `ADVOGADOJA_JORNADAS_V3_AUTOCONTIDO.html` sem reescrever o conteúdo individual das telas.

## Estrutura

- `index.html`: documento HTML e marcação de apresentação.
- `visualizador/style.css`: CSS de apresentação, extraído do HTML original.
- `visualizador/app.js`: comportamento do visualizador original, consumindo o pacote montado.
- `conector/montador.js`: carrega, valida e organiza os dados para o visualizador.
- `dados/manifest.json`: ordem dos arquivos de tela, metadados do pacote e relações de fluxo originais.
- `telas/advogado/*.json`: **50 arquivos**, um por tela, mantendo todos os campos originais.

## Executar

Como o navegador costuma bloquear `fetch` de JSON local sob `file://`, abra um terminal nesta pasta:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000/`.

## Como editar uma tela

Altere apenas o JSON da tela na pasta `telas/advogado/`. Atualize a página para ver o resultado. Se adicionar ou retirar telas, atualize também o índice `dados/manifest.json`. A seção `fluxoFonte` do manifesto é preservada do arquivo de origem; a relação das participações usada na apresentação permanece nos JSONs individuais.

**Nota de compatibilidade:** o código de apresentação foi preservado, inclusive o mecanismo de importação/exportação e o uso opcional de `localStorage`. Se houver uma importação persistida anteriormente no mesmo endereço, ela pode substituir a visualização dos arquivos; remova a chave `advogadoja.jornadas.v3` do armazenamento local para retornar ao manifesto. O conector não modifica os dados individuais e não pressupõe endpoints, banco ou regras não presentes no arquivo original.


## Atualização: contratos modulares das 50 telas

Os arquivos `telas/advogado/*.json` agora usam a estrutura modular `<telaId> → tela + componentes`. A prévia continua sendo apresentada pelo adaptador de `conector/montador.js`; detalhes e exportação mostram a estrutura do contrato quando disponível.

Consulte [o relatório da migração](./documentacao/MIGRACAO_TELAS_CONTRATO_MODULAR_V1.md) para as regras de conversão, preservação, limitações e verificações. **A migração não equivale à homologação visual** e não altera a finalidade de Jornada como visualizador estático.
