# AdvogadoJá — Campos do Flow | revisão de referências V1

Atualização do `campos_fluxo.zip` feita em 19/11/2026 a partir do contrato canônico V1 e da projeção JSON da Home enviada no mesmo contexto.

## Como abrir

A pasta mantém `index.html`, `motor.js` e `documento.json` na raiz. Como `motor.js` lê `documento.json` através de uma requisição relativa, inicie um servidor local **na pasta extraída**:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/index.html`. Não é necessário instalar dependências externas. Abrir `index.html` diretamente via `file://` pode bloquear a leitura do JSON pelas políticas do navegador.

## Atualizações implementadas

- Preservação das 15 seções anteriores do `modelo`, do editor em árvore, dos dados de navegação legado e da exportação de JSON.
- Quatro seções adicionais no `modelo`: `conexoes`, `condicoes`, `segmentos`, `referencias` (19 seções no total).
- Oito conexões **candidatas** normalizadas de `navegacao.saidas` e duas condições extraídas de `estados.itens` (OAB); os campos e seus IDs legados continuam preservados.
- Referências da biblioteca observadas no `advogadoja-fluxo-projecao.json`: 9 slots de composição da Home, 12 atributos de evento/identificação nos componentes. Não foi criado um componente novo.
- Aba **Conexões** com grafo por origem/saída, indicação de destino fora do recorte, edição/criação/exclusão de conexões e condições, visualização de componentes observados e botões de acesso aos campos do modelo mestre.
- Inferência visual da bifurcação condicional quando o mesmo evento tem duas condições complementares. Eventos distintos são mostrados como opções, não como bifurcações booleanas.
- Exemplo hipotético pós-login isolado de `modelo`, para demonstrar bifurcação sem introduzir regras de negócio.
- Barra local para alternar Flow ↔ Modelo mestre, exportar e desfazer; permanece o estilo do laboratório.
- Migração aditiva de rascunhos antigos do `localStorage` para o template V0.3, sem sobrescrever valores locais existentes. A redefinição do exemplo continua disponível.

## Premissas e limitações

A fonte `advogadoja-fluxo-projecao.json` enviada nesta etapa contém **uma tela** (`advogado.home`) e nove componentes. Portanto, os destinos das oito conexões não foram validados contra um catálogo completo. "Fora do recorte" significa **não disponível nesta amostra**, não "tela inexistente".

Os IDs `advogado.home` e `advogado.home_advogado` estão registrados como candidato de alias, mas a equivalência oficial não foi homologada. As rotas `/advogado/home` e `/professional/home` também não foram silenciosamente unificadas.

As variáveis reais de banco para onboarding, estado de OAB, os segmentos compartilhados e as políticas de navegação Flutter/React continuam pendentes de confirmação. Nenhum `data-action` observado no HTML foi transformado automaticamente numa ação backend ou rota.

A visualização e a edição afetam o **contrato JSON local**; não alteram o `Fluxo_V1_Autocontido.html` nem executam navegação do app ou consulta de banco. O grafo visual é uma projeção do recorte, não a migração integral de 197 ocorrências do fluxo anterior.

## Testes de integridade executados

- `documento.json` convertido e lido como JSON válido;
- JavaScript validado sintaticamente;
- renderização da aba Conexões em Chromium com oito grupos originais;
- alternância do exemplo `onboardingConcluido` true/false;
- edição e inclusão de conexão, com atualização do modelo e inferência de bifurcação;
- ausência de erro JavaScript nas operações validadas.

Detalhamento de campo → front em `docs/MAPEAMENTO_CAMPOS_FRONT.md` e documento base em `docs/CONTRATO_CANONICO_V1.md`.
