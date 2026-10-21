# Kit HTML Autocontido Canônico V1

Este kit estabelece um **padrão permanente de trabalho** para qualquer agente que produza HTMLs de árvores, módulos, painéis e aplicações demonstrativas. Prioriza **separação de dados, apresentação e comportamento na fonte**, facilidade de localizar/alterar um trecho e **entrega em arquivo HTML único independente**.

**Regra absoluta:** não existe motor de execução compartilhado entre artefatos. Cada pasta-fonte contém seus próprios arquivos, e cada build produz **um `.html` completamente autocontido**. O diretório `modelos/` é somente um *molde copiado na criação de uma nova pasta*, não uma dependência de runtime.

## Arquivos essenciais

- `AGENTS.md` — instruções obrigatórias para o agente de programação (copie para a raiz do repositório onde quer que o agente siga essas regras).
- `COMANDO_MESTRE_HTML.md` — texto reutilizável para iniciar pedidos ao agente. O exemplo `/html-autocontido` é um **atalho textual**, não um comando instalado automaticamente em todos os editores.
- `NOVO_HTML.cmd` — comando Windows para criar novo projeto isolado (`novo_html.py`).
- `CRIAR_HTML.cmd` — comando Windows para compilar a fonte local em um HTML offline (`gerar_html.py`).
- `CRIAR_HTML.sh` — equivalente para Linux/macOS.
- `modelos/projeto_base/` — arquitetura editável que é copiada para cada novo projeto.
- `exemplos/` — 3 exemplos reais e executáveis do kit: árvore, catálogo de módulos e painel genérico, com **dados ilustrativos**.
- `docs/` — contrato JSON, arquitetura e critérios de validação.

## Usando no Windows (CMD)

É necessário ter **Python 3** instalado. Não há bibliotecas Python de terceiros obrigatórias para compilar.

```bat
NOVO_HTML.cmd meu-catalogo modulos
CRIAR_HTML.cmd projetos\meu-catalogo
CRIAR_HTML.cmd projetos\meu-catalogo --verificar
```

O primeiro comando já gera `projetos\meu-catalogo\saida\meu-catalogo.html`. Edite `dados\conteudo.json`, `estilos\tema.css`, `interface\estrutura.html` e `comportamentos\*.js` **dentro dessa pasta**, depois recompile com o segundo comando. `--verificar` acusa caso a fonte tenha mudado e o HTML não tenha sido recompilado.

Para gerar os exemplos:

```bat
CRIAR_HTML.cmd exemplos\arvore-repositorio
CRIAR_HTML.cmd exemplos\catalogo-modulos
CRIAR_HTML.cmd exemplos\aplicacao-painel
```

No Linux ou macOS:

```sh
python3 ferramentas/novo_html.py meu-catalogo modulos
./CRIAR_HTML.sh projetos/meu-catalogo
./CRIAR_HTML.sh projetos/meu-catalogo --verificar
```

## Onde ficam os arquivos

```text
projetos/meu-catalogo/
├── projeto.json                        configuração e ordem de compilação
├── dados/conteudo.json                 dados verdadeiros ou explicitamente de exemplo
├── estilos/tema.css                    design tokens + regiões visuais
├── interface/estrutura.html            esqueleto com placeholders
├── comportamentos/
│   ├── 01-estado-indices.js            estado e índices por ID/caminho
│   ├── 02-componentes-render.js        estrutura e renderização sob demanda
│   ├── 03-busca.js                     busca progressiva
│   └── 04-acoes.js                     eventos, JSON import/export e inicialização
└── saida/meu-catalogo.html             arquivo final sem dependências externas
```

## O que o modelo executável já oferece

- Árvore aberta por ramo somente quando necessário; expansão e recolhimento.
- Exibição em cards para `modulos` e `aplicacao` (a composição é adaptável; não é um simulador funcional completo por si só).
- Busca por caminho/título/conteúdo, índice em memória, debounce e lotes para não bloquear a UI por varreduras grandes.
- Painel de detalhes baseado no ID, campos estruturados e fonte original do registro.
- Importação JSON **por ID** com validação e preservação de registros que não vieram no arquivo; exportação JSON da sessão.
- Suporte a `file://`: os scripts, estilos e dados estão embutidos, sem `fetch` ou CDN. A importação é temporária e não reescreve automaticamente o HTML; exporte JSON e substitua a fonte para persistir novas alterações.
- CSS responsivo, nomes de regiões e ausência de recursos externos.

## Distinção importante

O script do kit é um **ponto de partida para visualização**. Ele **não cria automaticamente qualquer aplicativo complexo**, regras de negócio, autenticação ou navegação Flutter/React a partir de uma frase. Para interfaces/fluxos específicos, o agente precisa editar as fontes do próprio artefato sob as regras de `AGENTS.md` e entregar o HTML compilado após testes. `NOVO_HTML.cmd` não acessa conversa, ChatGPT ou API de IA; cria o esqueleto técnico local.

## Verificação

- `python ferramentas/gerar_html.py <pasta> --verificar` compara os bytes do HTML atual ao que a fonte produz.
- `python ferramentas/testar_html.py` executa testes de interface com Playwright/Chromium **se instalados**. Esta etapa é opcional; o compilador em si utiliza só bibliotecas padrão.
- Para grandes arquivos, testar com volumes realistas, não apenas com poucos registros, antes de prometer desempenho.
