# AdvogadoJá · Motor declarativo V3

## Objetivo

Montar a visualização das telas exclusivamente a partir dos contratos JSON de **Identidade, Classificação e Estrutura**, incluindo as definições de componentes por **escopo → domínio → família → modelo**. A navegação permanece **declarativa e não executável** na prévia.

## Executar

O pacote contém `index.html`, `estilo.css`, `motor.js` e `documento.json`. Mantenha os quatro arquivos na mesma pasta e abra-a em um servidor HTTP local, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000/`. Para abrir diretamente sem servidor, use a versão `AdvogadoJa_Motor_V3_Autocontido.html` fornecida separadamente.

## Contrato de leitura

```text
advogadoja/
├── telas/
│   └── advogado/home/
│       ├── identidade/identidade.json
│       ├── classificacao/classificacao.json
│       ├── estrutura/estrutura.json     ← composicao[instancia].componenteRef
│       └── navegacao/navegacao.json     ← rotas e destinos, sem execução
└── componentes/
    ├── compartilhados/advogado/header/principal/
    │   ├── identidade/identidade.json
    │   ├── classificacao/classificacao.json
    │   └── estrutura/estrutura.json
    ├── compartilhados/advogado/menu/principal/
    │   ├── identidade/identidade.json
    │   ├── classificacao/classificacao.json
    │   └── estrutura/estrutura.json     ← estadosVisuais
    └── locais/advogado/home/<familia>/principal/
        ├── identidade/identidade.json
        ├── classificacao/classificacao.json
        └── estrutura/estrutura.json
```

A biblioteca central é indexada pelo **ID permanente** em `identidade.id`. O nome da pasta organiza, mas não determina a identidade. Uma tela escolhe o modelo pelo `componenteRef` declarado na sua composição. A instância define a posição (`paiRef`, `slot`, `ordem`) e, opcionalmente, as escolhas de `estadoVisual`. Não há inferência de modelo ou estado a partir do nome de uma pasta.

## Estados visuais

O menu aprovado usa um modelo (`ui.advogado.menu.principal`) com dois eixos independentes, ambos na estrutura do **componente**:

- `painel`: `fechado` / `aberto`;
- `disponibilidade`: `online` / `offline`.

A prévia aplica apenas diferenças de classes, atributos e textos. A troca da disponibilidade é **simulada**, sem escrita no banco ou chamadas de backend. Uma nova aparência estrutural deverá ser registrada como **outro modelo** com outra identidade. Estados **não geram cópias do componente**.

## Migração aplicada ao documento

- Preservadas **110 telas** e 645 instâncias de componentes.
- Convertidas as 645 referências de `componentes/instancias.json` para `estrutura.html.composicao[instancia].componenteRef` e eliminados os arquivos duplicados de instâncias.
- Centralizadas 82 cópias de header/menu das 41 telas do advogado em **duas definições compartilhadas**.
- Organizados os sete componentes locais da Home em `componentes/locais/advogado/home/<familia>/principal/`.
- Os demais componentes locais ainda permanecem em suas pastas de tela, com resolução compatível, para **não confundir IDs repetidos com visuais diferentes**.
- **212 destinos declarados** que existiam como `data-goto` não vazio foram movidos para o bloco `navegacao.destinosDeclarados`, sem considerar automaticamente que sejam rotas operacionais homologadas. Os valores vazios foram descartados como ausência de destino.
- HTML/CSS/SVG de apresentação preservados, salvo a retirada dos atributos de navegação e a inclusão dos estados declarativos do menu.

## Funcionalidades no editor

- Macroabas **Telas**, **Tela-Modelo**, **Componentes** e **Visualizador**;
- Edição de JSONs e arquivos de documentação na árvore;
- Montagem de contratos por tela, exportação de ZIP/JSON e HTML da prévia;
- Seletores interativos de estados visuais válidos no visualizador;
- Abertura/fechamento do menu e alteração simulada de disponibilidade;
- Importação de árvore V3, JSON de contrato individual, contrato V3 agrupado e ZIP modular (sem inventar rotas);
- Compatibilidade de leitura com componentes locais no formato modular ou com `componente.json` antigo.

## Limites importantes

- O visualizador **não** executa navegação real, funções, autenticação, autorização, banco ou chamadas de API.
- Não foram criados modelos alternativos fictícios de header/menu; o pacote contém apenas os modelos atuais homologados.
- O motor interpreta a estrutura HTML/CSS. Não gera automaticamente código React ou Flutter.
- Componentes locais de outras telas permanecem temporariamente nas pastas originais; a padronização de todas as famílias depende da revisão dos IDs divergentes.
- Exportar a árvore/ZIP antes de alterações importantes. A persistência automática por IndexedDB depende das permissões do navegador.

## Validações realizadas

- Parse e verificação de sintaxe do `motor.js`.
- Montagem e exportação de **110 contratos**, com referências resolvidas e JSON válido.
- Prévia no Chromium de Splash, Login, Home Cliente, Home Administrador, Home Advogado e Disponibilidade.
- Estado inicial do menu fechado; abertura pelo botão do header; fechamento pelo backdrop; alternância online/offline; dois seletores de estados independentes.
- Exportação de HTML individual da prévia da Home.
