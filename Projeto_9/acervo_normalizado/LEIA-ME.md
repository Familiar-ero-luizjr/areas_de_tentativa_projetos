# AdvogadoJá — Acervo de telas normalizadas · Lote 1

**Data:** 23/11/2026  
**Origem visual:** `bibliotecas.zip`, com duas coleções: `01/` (V1, 80 referências catalogadas) e `02/` (Projeto 9, 111 referências).  
**Status:** estrutura JSON validada e visualizador offline funcional; **não equivale à homologação visual ou funcional de todas as telas**.

## Decisão arquitetural

A nova pasta é separada da biblioteca do projeto. Os arquivos **não substituem** `biblioteca/ui_library/conteudo` e não fazem commit no GitHub. Há **uma definição JSON por tela** e **uma definição por componente**, sem embutir componentes duplicados nos documentos canônicos das telas. Cada HTML autocontido recebe uma cópia de resolução apenas para conseguir funcionar offline.

A base de identidade e composição das telas vem de `02/telas/...` (coleção Projeto 9). A V1 em `01/telas/` define o padrão visual das Homes: header azul-marinho, logo, tipografia, hamburger, sino e menu lateral. A Home do advogado foi usada para a estrutura V1 do header e o CSS de menu; a Home cliente forneceu os itens do perfil cliente. Para áreas autenticadas, o header segue essa família visual. Para acesso e cadastro, a mesma faixa visual é usada **sem botão de menu e sem sino**. Splash/boas-vindas não recebem menu ou header adicionado.

## Resultado

- **111 telas** estruturadas com `identidade`, `classificacao`, `estrutura.html`, `estrutura.css`, `estados`, `variantes`, `interacoes`, `dados`, `mocks`.
- **389 definições compartilhadas** de componentes; JSONs de tela só contêm `componenteRef`, `paiRef`, `alvoRef`, `ordem`, `props` e estados iniciais.
- **772 relações de botão/destino** distribuídas por telas (inclui reutilização do menu em diferentes telas); 11 inferências de sequência de clique e **quatro vínculos candidatos** dos cartões/OAB da Home documentados no Motor V4 do Projeto 9 V6. Esses vínculos não são regras de produção.
- **514 controles sem destino declarado na fonte** foram mantidos como controles de estudo, sem inventar navegação. A contagem é por ocorrência no processo, não por componente único.
- 31 ocorrências de header e 7 menus foram completados com o padrão V1; outros headers/menus existentes foram substituídos por definições compartilhadas do mesmo padrão.
- A instância do modal artificial de navegação foi retirada quando identificada na composição. Modais próprios de formulários ou do domínio não foram removidos apenas pelo nome.

## Estrutura de pastas

```text
acervo_normalizado/
├── index.html                            # catálogo de telas com pesquisa
├── telas/<area>/<...>/
│   ├── documento.json                    # único contrato canônico da tela
│   └── visualizar.html                   # prévia + estados + relações + JSON offline
├── componentes/<id-subpastas>/
│   └── documento.json                    # definição única do componente
├── dados/
│   ├── indice_telas.json
│   ├── relacoes_extraidas.json
│   ├── relacoes_contexto.json
│   ├── sequencias_para_estudo.json
│   ├── pendencias_normalizacao.json
│   └── teste_navegador.json
├── ferramentas/                          # validador e gerador reprodutível
└── PADRAO_CANONICO_HTML_CSS_JSON_ADVOGADOJA_V1.md
```

## O que um HTML de tela faz

1. Renderiza a composição do JSON via DOM, com componentes resolvidos na construção do arquivo.
2. Permite alternar entre largura **mobile** e ampliada.
3. Mostra as dimensões de estado presentes no JSON (`painel`, `disponibilidade`, `acessoProfissional`, `ambiente`, etc.).
4. Aplica alterações de classes, atributos e texto declaradas nos estados; não executa JS original.
5. Mostra interações com destino identificado e as sequências sugeridas; clique **não troca de tela**.
6. Permite visualizar o JSON integral e exportar o documento de tela.

### Sobre `estados.alvos[].texto`

A norma V1 exige alvos de estados com `classes` e `atributos`. Para reproduzir uma mudança documentada de **texto** (ex.: Online/Offline), o acervo acrescenta a propriedade opcional `texto` no alvo do estado. Ela modifica somente o nó de texto daquele elemento. Deve integrar a próxima revisão normativa do documento canônico; o validador atual já a aceita, mas ainda não a impõe.

## Base de evidência e pendências

**Comprovado na fonte:** elementos, textos, classes, CSS e atributos; opções de estados legados; menus da V1; destinos explicitados por `data-goto`; cinco destinos da Home listados no Motor V4 do pacote V6 (notificações + validação OAB + três cartões).

**Proposto para estudo:** sequências pelo campo `order` dos contratos V1, e outras associações temáticas. Estão sinalizadas como candidatas. A Jornada não permite inventar tratamento de negócio, condições de elegibilidade ou endpoints.

**Falta homologar:** comparação visual tela a tela com a referência original, limpeza final de CSS global escopado, ações sem `data-goto`, condições de negócio, templates/coleções dinâmicas e testes de acessibilidade. A biblioteca V1 contém identidades antigas e algumas telas que não possuem correspondência 1:1 no Projeto 9; foram usadas como **referências**, não reimportadas como duplicatas de tela.

## Testes aplicados

- **Validador estrutural V1** sobre as 111 telas e seus 389 componentes: zero erros.
- **Chromium/Playwright**: abertura de todos os 111 HTMLs, zero erros JavaScript ou falhas de montagem.
- Smoke test de `advogado.home`: abrir/fechar menu, alternar estados, rotas exibidas sem navegação.
- Amostras observadas visualmente: Home advogado, Home cliente e cadastro de tipo de conta. Isso **não** representa fidelidade visual aprovada para todas as 111 telas.

## Procedimento de conversão para novas referências

1. Inventariar a fonte e fixar a identidade canônica da tela. Nunca gerar novo ID para uma identidade já existente.
2. Segregar estrutura da Tela (`composicao`) e conteúdo dos Componentes (`elementos`).
3. Normalizar `paiRef` para **instância-pai** e `alvoRef` para **elemento de destino**; não reutilizar a mesma referência para ambos.
4. Transformar texto bruto em nós `#text` reais, preservar `aria-*`, `data-*` e SVG.
5. Converter CSS para `tokens` e `regras[]` ordenadas por parser CSS, depois conferir escopo e cascata.
6. Descobrir estados no HTML/CSS/script original; declarar dimensões em `estados`, com efeito visual completo por opção.
7. Aplicar o header e menu V1 conforme área e fase da jornada, sem duplicar conteúdo entre telas.
8. Associar eventos dos componentes aos efeitos na tela **somente com evidência**. Marcar hipóteses em relatório.
9. Executar validador estrutural, renderizar em isolamento, testar cliques e comparar captura visual da fonte.
10. Após aprovação, publicar as definições na biblioteca canônica e atualizar os motores de Jornada/Fluxo/Protótipo em conjunto.

**Nota:** a pasta é um laboratório de conversão, não um substituto operacional já implantado no Projeto 9.
