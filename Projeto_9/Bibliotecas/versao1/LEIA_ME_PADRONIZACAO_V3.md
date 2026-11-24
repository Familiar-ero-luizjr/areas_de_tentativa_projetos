# Bibliotecas 01 e 02 — headers e menus canônicos V3

As telas originais continuam com seus IDs, pastas e conteúdo de negócio. Headers, barras de título e menus anteriores foram removidos das composições/definições embutidas e substituídos pelos componentes `layout.header.app`, `layout.header.title` e `layout.menu.drawer`.

**Regra de apresentação:** splash/boas-vindas sem header; acesso e onboarding com header público sem menu/notificações; áreas autenticadas com header V1, titlebar branca e menu por perfil. Cliente pode exibir área Estudante; Advogado pode exibir Escritório; Admin dispõe de estados de permissões, todos em simulação.

Cada HTML mantém JSON embutido `aj-layout-canonical-data`, usado para inspecionar os estados e suas variações. Há o botão discreto “Estados do layout” para testes nas páginas autenticadas. Nenhum link do menu abre outra tela no modo biblioteca.

**Limites:** situações de assinatura, escritório e permissão que não possuam regra oficial são estudos. Não constituem autorização de produção. As bibliotecas usam dois renderizadores independentes; a V1 recebe componentes no registro compartilhado do bundle, e o Projeto 9 recebe definições no `view-data`.

Telas propostas complementares de recuperação de senha usam o mesmo cabeçalho público. `header-padrao.js` legado foi retirado porque não é mais necessário.
