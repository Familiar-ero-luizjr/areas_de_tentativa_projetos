# AdvogadoJá — Fluxo progressivo (Jornadas → Fluxo)

## Decisão canônica implementada

O **Fluxo possui seu próprio `data/documento.json`**, com a mesma estrutura física usada no módulo Jornadas:

```text
documento.json
├── tipo
├── versao
├── telas
│   └── <id-da-tela>
│       ├── identidade
│       ├── classificacao
│       ├── estrutura
│       │   ├── html
│       │   └── css
│       └── navegacao       ← conteúdo acrescentado pelo Fluxo
└── componentes
```

**O Fluxo não carrega, importa em tempo de execução nem consulta a pasta Jornadas.** Usa somente o seu `data/documento.json`. O mesmo motor de montagem visual foi incorporado ao `js/motor.js`, não duplicado nos dados de cada tela. O arquivo HTML único carrega a mesma coleção diretamente de um bloco JSON incorporado.

## Procedência e preservação

- **110 telas** e **388 componentes**, copiados do `jornadas.zip` sem alterar suas definições originais.
- Acrescentou-se `telas[id].navegacao`, aproveitando as relações declaradas no Flow V3 disponível. As 103 identidades da fonte V3 foram resolvidas para 99 IDs distintos de Jornadas. As outras 11 telas de Jornadas também permanecem no catálogo.
- São preservadas **163 saídas declaradas**: **106 conexões visuais** identificadas após agrupamento de 13 referências redundantes, além de **44 saídas internas** para estado/processo (que não viram telas artificiais). As entradas, bifurcações, participações e demais metadados da fonte V3 permanecem na navegação da tela quando existentes.
- Não existe uma chave raiz `fluxo`, nem um catálogo `catalogo.telas` adicional no documento persistido. A estrutura de edição interna pode gerar índices em memória, mas a exportação mantém **apenas** `tipo`, `versao`, `telas` e `componentes`.
- IDs visuais preservados conforme Jornadas; referências V3 convertidas para os IDs correspondentes, mantendo `origensV3` para rastreabilidade.

## Arquivos

- `index.html`: editor, com estrutura visual V1, seleção de telas, abas de bifurcação, inspeção e prévia.
- `css/style.css`: estilos do editor.
- `js/motor.js`: ligações, importação/exportação, validação, simulação e **composição visual do JSON**.
- `data/documento.json`: documento completo **da própria etapa Fluxo**.
- `Fluxo_V4_Progressivo_Autocontido.html`: versão de arquivo único no ZIP, que não depende dos outros arquivos.

## Como abrir

**HTML único:** abra `Fluxo_V4_Progressivo_Autocontido.html` no navegador. Catálogo, motor e estilos já estão incorporados. Pode abrir sem servidor.

**Módulo em pastas:** rode um servidor estático na pasta que contém `modulos`, por exemplo `python -m http.server 8000`, e acesse `http://localhost:8000/modulos/fluxo/index.html`. A única leitura de dados é `./data/documento.json`.

## Uso

- **Importar**: lê um documento de quatro campos; aceita também algumas projeções antigas e conserva o conteúdo visual nativo que já existe no módulo.
- **Exportar**: produz `documento_fluxo.json`, no contrato progressivo de quatro campos.
- **Recriar do catálogo**: interpreta o `documento.json` original do módulo e monta as conexões. Não fixa manualmente a Splash: a tela inicial é inferida dos metadados.
- **Visual**: renderiza HTML/CSS/componentes com o mesmo mecanismo de Jornadas; suporta estados e ações demonstrativas (menu do advogado testado).
- **Conectar / Editar / Remover**: atuam sobre os IDs; bifurcações são inferidas automaticamente das saídas.
- **Ferramentas** (ícone F): validação, configuração de variáveis e simulação de navegação.
- **Novo vazio** remove as conexões da edição; **Restaurar base** recupera o documento original do próprio módulo.

> Prévia offline não faz autenticação real, escrita em banco ou chamadas a APIs. Se uma ação não estiver vinculada a uma saída única, o motor informa a pendência; não inventa o destino.

## Testes feitos

- Auditoria de preservação por igualdade: as **110 telas**, retirando somente `navegacao`, permanecem idênticas às telas de Jornadas; os **388 componentes são idênticos**.
- Cada tela contém composição visual, e todos os seus `componenteRef` existentes resolvem no mesmo documento.
- Renderização de Splash, Entrar e Home do advogado no Chromium sem erros JavaScript.
- Ação visual de abrir o menu do advogado funcionou na prévia.
- Criação de saída condicional gerou bifurcação; a condição foi persistida, reimportada e removida em um ciclo de teste.
- Exportação sem alterações reproduziu o documento original do módulo sem perdas e sem chave raiz `fluxo`.
