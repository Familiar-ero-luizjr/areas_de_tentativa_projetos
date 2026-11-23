# Regerar as telas normalizadas

O pacote já contém todos os resultados. Para repetir a normalização a partir do seu `bibliotecas.zip`:

```bash
python -m pip install beautifulsoup4 tinycss2
python ferramentas/normalizar.py /caminho/bibliotecas.zip /caminho/saida
python ferramentas/gerar_htmls.py /caminho/saida
```

**Atenção:** os scripts são conversores específicos para os envelopes de referências do ZIP utilizado. Execute em uma pasta nova, não sobre a biblioteca de produção. Para aplicar outras fontes, primeiro adapte o extrator, mantendo a saída igual ao contrato canônico. Os destinos candidatos do V6 são preservados como hipóteses documentadas, não como roteamento de produção.

Validação: o `ferramentas/validar.py` valida um *bundle* contendo `schema`, `schemaVersion`, `telas` e `componentes`. Os documentos de tela e componentes são separados por design; para validar todos em lote, agregue os arquivos em memória, sem gravar uma segunda fonte de verdade.
