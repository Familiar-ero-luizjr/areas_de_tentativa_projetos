# Flow — complemento ao contrato por tela (Projeto 7)

O motor `index.html` já existe e **continua independente**. O Flow não deve receber HTML/JS/CSS de Fluxo do Projeto 8.

Ler, quando disponível nos JSONs de tela: `navegacao.participacoes`, `entradas`, `saidas`, `bifurcacoes`, `caminhosLineares`, `estados` e `acoes`. Resolver `origemNoRef` e `destinoNoRef` para distinguir ocorrências de uma mesma tela.

Apenas para nó contextual de fluxo que não seja tela nem estado já registrado, admite-se o complemento opcional `navegacao.nosContextuais[]`. Não se deve montar uma segunda árvore de nós como fonte de verdade.

Referência: [estrutura compartilhada](../biblioteca_telas/ESTRUTURA_FLOW_JORNADAS_V1.md).

**Status:** contrato descrito, nenhuma mudança no código do motor.
