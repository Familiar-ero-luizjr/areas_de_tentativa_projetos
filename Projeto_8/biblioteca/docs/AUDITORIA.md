# Auditoria da biblioteca unificada — AdvogadoJá V2

## Resultado

- Fontes analisadas: **112 arquivos JSON**, em três jornadas.
- Contratos unificados: **98 telas por identidade única**.
- Telas exclusivas: **88**.
- Telas compartilhadas: **10**, reunindo **24 contratos originais**.
- Relações preservadas: **200** (contadas por jornada, sem colapsar transições com mesmo destino).
- Entradas geradas por correspondência objetiva: **141**.
- Bifurcações preservadas: **41**.
- Participações preservadas: **119**.
- HTML das telas compartilhadas: **8 idênticos** / **2 diferentes** entre jornadas.
- CSS das telas compartilhadas: **0 idênticos** / **10 diferentes** entre jornadas.
- Referências estruturadas quebradas: **0**.
- Relações sem gatilho visual executável: **200**.
- Bifurcações sem critério executável: **41**.
- Referências de nós lógicos: **49 tipos/IDs distintos** (não transformados em telas).

## Princípio da composição

Cada ID técnico existe fisicamente uma única vez. Para as telas compartilhadas, `classificacao.jornadas`, `navegacao.relacoes`, `navegacao.bifurcacoes`, `acoes.itens` e `variantes.regras` reúnem as declarações de todas as jornadas. Relações e bifurcações têm **IDs únicos** e `jornadaRef`; entradas são projeções dessas relações, não segunda fonte de verdade.

Cada visual original permanece em `componentes`, com `tela.componentes.instanciasPorJornada`, `tela.estrutura.html.composicaoPorJornada` e `tela.variantes.visuaisPorJornada`. Nas telas compartilhadas, `requerJornada=true` impede a escolha arbitrária de um layout.

As descrições que diferiam foram preservadas como `identidade.descricoesPorJornada` e não substituídas por texto inventado. Não há mapa de migração nem alias legado.

## Distribuição das telas compartilhadas

- `auth.cadastro.concluido` — cliente, advogado
- `auth.cadastro.contato` — cliente, advogado
- `auth.cadastro.endereco` — cliente, advogado
- `auth.cadastro.identificacao` — cliente, advogado
- `auth.cadastro.revisao` — cliente, advogado
- `auth.cadastro.seguranca` — cliente, advogado
- `auth.inicializacao.boas_vindas` — cliente, advogado, admin
- `auth.inicializacao.splash` — cliente, advogado, admin
- `auth.sessao.entrar` — cliente, advogado, admin
- `notificacoes.lista.notificacoes` — cliente, advogado, admin

## Pendências não resolvidas por inferência

Os 200 gatilhos e 41 critérios ausentes na fonte continuam ausentes. Os nós lógicos não são telas. Diferenças de UI/CSS foram preservadas, **não homologadas automaticamente como comportamento de produção**.

A biblioteca não fornece um motor de renderização; o consumidor deve respeitar `jornadaRef`, `requerJornada`, referências das ocorrências e variantes visuais.
