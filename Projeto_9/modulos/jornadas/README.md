# AdvogadoJá · Galeria modular (V1)

## Arquivos

- `index.html`: interface da galeria.
- `css/style.css`: estilos da galeria (não substitui o CSS das telas).
- `js/motor.js`: carrega a coleção, renderiza componentes e realiza importação/exportação.
- `data/documento.json`: documento canônico, copiado **sem nenhuma alteração** de `AdvogadoJa_colecao_completa.json`.

## Abrir com carregamento automático

Inicie um servidor estático na pasta `AdvogadoJa_Galeria_Modular_V1`:

```bash
python -m http.server 8000
```

Abra http://localhost:8000 no navegador. A galeria carrega `data/documento.json` automaticamente e renderiza a Home e seus nove componentes.

## Abrir sem servidor (file://)

Abra `index.html` diretamente no navegador e clique em **Importar JSON**. Selecione o arquivo `data/documento.json` da pasta. A seleção é necessária porque os navegadores restringem o carregamento automático de JSON local via `fetch`.

## Alterar a coleção

Importe documentos de telas ou coleções usando **Importar JSON**. Os dados e componentes são mantidos em memória e, quando disponível, no armazenamento local do navegador (IndexedDB). **Exportar JSON**, na galeria, gera um arquivo chamado `documento.json`, no mesmo formato de quatro campos (`tipo`, `versao`, `telas`, `componentes`). Substitua manualmente `data/documento.json` pelo exportado para tornar as alterações a nova base permanente.

**Reiniciar** restaura a coleção base originalmente carregada; o arquivo JSON no disco não é alterado automaticamente.

Não depende de bibliotecas externas. A prévia usa o CSS e os elementos declarados no JSON de cada tela e componente. Navegação é simulada, sem redirecionamento.
