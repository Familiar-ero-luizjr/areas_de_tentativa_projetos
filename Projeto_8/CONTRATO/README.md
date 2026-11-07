# AdvogadoJá · Contrato modular V5

Conversão estrutural do HTML `ADVOGADOJA_CONTRATO_COMPLETO_ARVORE_TRES_ABAS_V4.html`.

## Estrutura

- `index.html`: a interface das três abas.
- `visualizador/style.css`: CSS original da interface, sem mudança no design.
- `visualizador/app.js`: árvore, documentação, modais, importação e exportação da interface original.
- `conector/montador.js`: lê o manifesto e os arquivos JSON, valida o pacote e inicializa o visualizador.
- `dados/manifest.json`: referências dos arquivos que serão carregados.
- `dados/contrato/modelo.json`: modelo explicado da aba 01, com tipos de campos.
- `dados/contrato/glossario.json`: explicações de campo e suas situações.
- `telas/advogado/advogado.home.json`: exemplo integral da Home do Advogado da aba 02, incluindo todas as definições de componentes e navegação contidas no original.
- `dados/documentacao/decisoes_consolidadas.json`: documentação estruturada da aba 03.

## Executar

Extraia o ZIP, abra um terminal na pasta e execute:

```sh
python -m http.server 8000
```

Abra `http://localhost:8000/` no navegador. Acesso direto via `file://` pode bloquear `fetch()` dos arquivos locais.

## Alterar dados

Altere o JSON desejado. Atualize `dados/manifest.json` caso adicione outra tela. O montador coleta o pacote antes do visualizador inicializar. Preserve a chave de ID na raiz do JSON da tela. Ao alterar o modelo e o glossário, mantenha suas estruturas originais. Importações na interface são transitórias: para persistir mudanças, atualize os JSONs do projeto.

**Observação:** a Home e suas relações são exemplos documentais, não definições homologadas. A separação dos arquivos não altera esse status. A interface original foi mantida, incluindo sua lógica de importação/exportação.

## Auditoria do contrato de navegação (não homologada)

- [`dados/documentacao/AUDITORIA_EQUIVALENCIAS_NAVEGACAO_V1.md`](dados/documentacao/AUDITORIA_EQUIVALENCIAS_NAVEGACAO_V1.md): equivalências semânticas, limites de leitura dos motores, campos candidatos e validações.
- `dados/contrato/modelo.json` e `dados/contrato/glossario.json` descrevem os campos candidatos; `telas/advogado/advogado.home.json` é apenas o exemplo documental.
- `dados/documentacao/decisoes_consolidadas.json` permanece inalterado até novas aprovações.
