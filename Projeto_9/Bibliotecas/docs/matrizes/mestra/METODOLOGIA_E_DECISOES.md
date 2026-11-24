# Matriz Mestra de Percursos — auditoria cruzada

## Escopo e limites

Cruzamento das matrizes existentes em `Bibliotecas/docs/matrizes/versao1`, `versao2`, `versao2_1` e `versao3`. **Não altera contratos ou HTMLs.** Nenhuma ligação foi homologada automaticamente.

- 124 identificadores consolidados por identidade exata ou por correspondência explícita de nomes conhecidos (aliases de acesso/home).
- 144 pares origem→destino declarados em V2/V2.1/V3, com 982 registros brutos.
- 0 pares possuem destino ausente do catálogo consolidado.
- 4 pares possuem representações distintas de condição entre fontes.
- 48 telas sem entrada declarada; isso não prova que sejam inacessíveis.
- V1: 191 registros de tela e **nenhuma aresta formal extraída**. A sequência proposta para V1 se baseia em função e nomenclatura e permanece inferida.

## Divergência funcional explícita

O login direciona advogado com onboarding pendente para `advogado.onboarding.dados_profissionais` em V2/V2.1 e para `advogado.onboarding.revisao_profissional` em V3. Essas alternativas devem ser interpretadas conforme **etapa efetiva do onboarding** (inicial vs. retomada), a confirmar; não unir nem escolher sem uma regra de estado verificada.

## Metodologia

1. Preservar cada evidência original (versão, biblioteca 01/02, ID de rota, evento, condição, destino).
2. Vincular IDs entre versões só com equivalências conhecidas e explícitas (ver tabela abaixo); os demais IDs permanecem distintos.
3. Agrupar arestas por origem e destino somente para comparação, mantendo todas as ocorrências e condições para auditoria.
4. Mostrar divergências de condições e destinos fora do catálogo, sem declarar erro de navegação apenas por diferença.
5. Criar **sequência candidata**, separada do grafo declarado e marcada como inferência quando não existe ligação documental.
6. Homologar por inspeção da tela real, eventos, estados, anteriores/posteriores e regras do produto, antes de converter.

## Correspondências de IDs empregadas (somente para cruzamento)

- `auth.inicializacao.splash` → `global.splash`
- `auth.inicializacao.boas_vindas` → `auth.global.boas_vindas`
- `auth.sessao.entrar` → `auth.global.sessao.entrar`
- `auth.sessao.esqueceu_senha` → `auth.global.sessao.esqueceusenha`
- `auth.sessao.resetar_senha` → `auth.global.sessao.resetarsenha`
- `cliente.home_cliente` → `cliente.home.inicio`
- `admin.dashboard.dashboard` → `admin.home.dashboard`

## Arquivos

- `MATRIZ_MESTRA_INTERATIVA.html`: consulta offline dos dados.
- `matriz_mestra_percursos.json/csv`: arestas agrupadas com evidência rastreável.
- `inventario_consolidado.json/csv`: tela, versão e conectividade.
- `sequencia_acesso_onboarding_proposta.json/csv`: percurso candidato **não homologado**.
- `divergencias_e_multiplas_saidas.json`: pontos de decisão e saídas alternativas.
- `auditoria_grafo.json`: totais e lacunas.

## Decisões ainda necessárias

- Separar login inicial, login com onboarding completo e retomada por etapa.
- Verificar passos reais do cadastro comum, cliente e advogado a partir das ações renderizadas (a ordem sugerida não é fato).
- Determinar retorno de cadastro concluído ao login ou início do onboarding por perfil.
- Distinguir botões de editar/voltar de botões de continuar, evitando interpretar múltiplas saídas como conflito.
- Verificar se destinos ausentes no catálogo pertencem a telas externas, nomes divergentes ou telas a criar.

**Regra:** não converter uma proposta em rota canônica sem indicação de fonte, condição e estado de aprovação.
