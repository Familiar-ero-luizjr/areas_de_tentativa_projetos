# Contrato canônico — AdvogadoJá · V7 (modelo estrutural fechado)

**Objetivo.** Um JSON por tela, capaz de orientar React/Flutter e os motores de Tela/Jornada, Fluxo e Protótipo. Os dados reais podem ser preenchidos posteriormente sem mudar o formato. A Home original permanece anexada para rastreabilidade.

## Fonte única e responsabilidades

| Bloco | Responsabilidade exclusiva |
|---|---|
| `identidade` | ID estável e descrição da tela. |
| `classificacao` | Referências a jornada e subjornadas, nunca a árvore inteira. |
| `estrutura.html` | Instâncias com IDs, composição, propriedades e `visivelQuando`. Reutilizar componente só se tiver valor de reuso; conteúdo específico pode continuar na tela. |
| `estrutura.css` | Tokens e regras preservados; `aplicaQuando` para estilos condicionais explícitos. |
| `estados` | Dimensões e opções com IDs únicos, valor inicial e origem do valor. Sem replicar listas de rotas nem estruturas. |
| `navegacao.rotas` | ID, evento e instância de origem, destino e `quando` (única fonte de regras de navegação). |
| `interacoes` | Apenas alterações locais de estado ou comportamento, sem duplicar as rotas. |
| `dados` | Referências de fontes/ações de dados; sem simular que há API homologada. |
| `mocks.cenarios` | Dados substituíveis de teste, referenciando IDs de estados. Não governam produção. |

## Relação por ID

Uma **condição** tem `estadoRef` e `igual`, ou grupo `todos`/`qualquer`. É lida pelo mesmo avaliador no HTML, CSS e rotas. O nome do estado nunca vira uma segunda definição da regra. O motor avalia os estados atuais, escolhe instâncias ativas, aplica regras condicionais de estilo e habilita rotas. A operação inversa (estado → dependências) é um índice calculado, não um segundo cadastro.

**Exemplo de referência**, sem duplicação: `estado.advogado.home.acessoProfissional=enabled` seleciona `screen.online` e `screen.actions`; as rotas de solicitações possuem a mesma condição. `restricted` habilita a ação de validar OAB. Abrir o menu e mudar seções de escritório são interações locais, não novas rotas.

## Jornadas e subjornadas

A **jornada** cobre o percurso amplo. A **subjornada** é uma ramificação navegável identificável, inclusive ao escolher um item de menu, com hierarquia `paiRef`/`filhosRefs`. Quando a sequência de telas diverge, a ramificação possui ID distinto. O arquivo `jornadas.advogado.json` organiza estes percursos com `rotaRefs`, mas **não replica origem, destino nem condição** de uma rota. Subjornadas-pai abrangem os trechos das filhas. Telas compartilham subjornadas por referência, sem duplicar JSONs.

`advogado.entrada` tem os percursos **com onboarding** e **sem onboarding**. `advogado.operacao` se subdivide por destinos da Home (OAB, assinatura, solicitações, configurações, escritório, notificações, sessão). As transições a partir do Login/Onboarding pertencem aos contratos dessas telas; não são inventadas como rotas de saída da Home.

## Consumo progressivo

**Tela/Jornada:** identidade, classificação, estrutura, estados, interações e dados. **Fluxo:** tudo isso + navegação e interpretação das subjornadas. **Protótipo:** tudo isso + mocks. Todos usam o **mesmo JSON canônico**, não três contratos diferentes.

## Proteção contra regressão

1. Nunca trocar IDs estáveis por rótulos visuais; nunca inventar aliasMap.
2. Nunca criar variantes independentes ou outra Home para OAB/escritório.
3. Não criar `condicoes`, `conexoes` ou `bifurcacoes` paralelos: bifurcações são derivadas de rotas condicionais.
4. Cada origem clicável tem um evento identificável; apenas ações que mudam de tela são rotas.
5. A autorização do backend é separada do controle de visibilidade.
6. Antes de aprovar mudança, verificar unicidade de IDs, integridade de refs, condições avaliáveis e preservação de composição/CSS original.
7. Valor real desconhecido é **proposta** ou **mock**, nunca um fato homologado.

## Limites e decisões ainda funcionais (não estruturais)

- Mapeamento de `acessoProfissional` aos dados reais de OAB; definir no adaptador runtime.
- Destinos e eventos de rotas de menu propostos, especialmente Planos.
- Rotas internas dos cadastros/onboarding e de telas externas à Home aguardam os próprios contratos.
- CSS do módulo Escritório conserva seletores legados originais; a condição das instâncias já é declarativa, mas uma futura migração dos seletores pode ser feita sem mudar o contrato.

**Critério de fechamento estrutural:** IDs e refs consistentes; estado → composição, estilos e rotas resolvidos por um único avaliador; renderização visual preservável. Os valores definitivos de dados não bloqueiam esse fechamento.
