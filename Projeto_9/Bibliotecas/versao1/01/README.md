# Advogado Já — Todas as telas da V1 em HTML autocontido

Fonte: `v1.zip`, usando `catalogo/catalogo_master.json` como fonte de identificação, composição e textos.

**Total: 78 telas** (uma por registro de tela no Catálogo Mestre), sem deduplicação ou exclusão.

Distribuição: admin: 6, advogado: 29, assinatura: 4, auth: 11, cliente: 21, escritorio: 6, notificacoes: 1.

## Como abrir

1. Extraia o ZIP em qualquer pasta.
2. Abra `index.html` com o navegador para navegar pelo acervo (sem servidor).
3. Ou abra diretamente qualquer arquivo `telas/**/V1_XXX_*.html` — cada um contém todo o necessário para sua apresentação.

## Garantias e limites

- Um arquivo HTML por tela, conservando dados, composição, CSS, perfil de comportamento e componentes da V1.
- HTMLs podem ser abertos via `file://`, sem `fetch` de arquivos externos ou servidor.
- Fontes visuais e imagens da V1 usadas pela tela estão incorporadas como dados internos.
- Onde a V1 implementa ações apenas simuladas, elas continuam simuladas — não são integrações reais com banco de dados, Firebase, Flutter, mapas ou login.
- A navegação entre telas permanece no modelo de simulação definido pela V1; o índice permite escolher livremente cada página para comparação.
- IDs sequenciais V1_001..V1_078 são exclusivos para triagem; o ID canônico original é preservado em metadados e `inventario_telas.json`.
- Não foi feita seleção ou alteração da lista de telas.

## Inventário

Consulte `inventario_telas.json` para ID original, caminho do HTML, nome, área, seção, Flutter route, perfil e composição.


## Índice reorganizado por jornada

O `index.html` apresenta as telas na ordem: públicas e acesso → cadastro → área do usuário (onboarding, home, funcionalidades, perfil, assinaturas, configurações) → administração → notificações.

Foram incluídas 2 telas complementares **propostas**, não presentes na origem. Elas são demos visuais offline, sem autenticação real. O acervo original de 78 telas foi preservado.
