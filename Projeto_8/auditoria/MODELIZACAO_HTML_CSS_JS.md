# Modelização HTML, CSS, JavaScript e mocks — ciclo 1

## Resultado verificável

- **98 telas de entrada** mantidas em sua árvore de elementos e CSS originais.
- **12 telas documentais sem HTML nem CSS** incorporadas como **rascunhos identificados**, com estrutura mínima visível, sem alegar homologação.
- **51 telas coincidentes com o Protótipo**: CSS original da biblioteca igual ao CSS carregado pelo Protótipo; a renderização continua pela árvore do contrato, **sem duplicar HTML/CSS bruto**.
- **144 campos de interface** adicionais registrados em `tela.dados.camposDeInterface`, todos marcados como candidatos **sem vínculo persistente**.
- **120 declarações de eventos** registradas em `tela.interacoes.eventosPrototipo`, com atributos HTML explícitos, ainda sem atribuir efeitos não comprovados.
- **5 referências diretas de mock** adicionadas às telas de início dos cinco cenários; os dados completos desses cenários permanecem em `biblioteca/mocks/simulacoes.json` e dentro do snapshot do módulo Protótipo.
- **12 roteiros simulados**, mantidos como estruturas de jornada do Protótipo; não se transformam automaticamente em participações editoriais homologadas.
- **Nenhuma relação de navegação nova foi inventada**: as relações existentes da biblioteca já cobriam os IDs documentais do Protótipo.
- **Nenhuma tabela ou coluna física foi deduzida**: o Banco expõe candidatos visuais para mapeamento manual.

## Modelização técnica realizada

1. **HTML:** preservar IDs por elemento, `paiRef`, `ordem`, atributos e texto em `componentes.*.estrutura.html.elementos`. Composição da tela usa `tela.estrutura.html.composicao` e referências de instância.
2. **CSS:** preservar `componentes.*.estrutura.css.regras` e os tokens/regras de `tela.estrutura.css`. Prévia é isolada em iframe para evitar conflito com a interface do editor. `:host` é adaptado para o documento de prévia dentro do iframe, sem modificar os dados-fonte do contrato.
3. **JavaScript semântico:** o que está comprovado nos atributos `data-action`, `data-goto` e outros eventos é registrado como metadado de interação na tela; ações não declaradas permanecem pendentes. O JS dos módulos controla somente visualização, edição explícita, simulação local e exportação; não faz requisições de negócio.
4. **Mocks:** cenários, estados e dados fictícios são visíveis no Protótipo. O módulo não envia dados simulados a serviços externos.
5. **Banco:** campos visuais não implicam `entidadeRef`, coluna SQL, cardinalidade, Cloud Function nem autorização. O editor permite declarar manualmente um vínculo/uma operação por ID e exportar a revisão.

## Independência de módulos

Cada diretório `BANCO/`, `FLUXO/`, `JORNADAS/`, `PROTOTIPO/` tem **somente uma fonte de dados local**, `modulo.json`, além de `index.html` e `script.js`. Os 110 contratos são materializados neste JSON para que o módulo funcione isolado. Não existem chamadas em runtime para `../biblioteca`, `../outro_modulo`, CDN, API ou serviços externos. A biblioteca é a fonte **editorial de geração**, não um serviço do qual os módulos dependem.

## Pendências que exigem homologação tela por tela

- Validar a aparência e os estados de cada tela, especialmente as 12 adicionadas apenas como rascunho.
- Identificar o resultado preciso de cada evento importado e relacionar `acaoRef`, `estadoRef`, `condicaoRef` e seus efeitos reais/simulados.
- Especificar quais inputs são persistidos, quais dados são consumidos, tabela/entidade e onde ocorre cada leitura/gravação/função.
- Confirmar a relação entre cenários e telas que não são início de cenário, sem associá-las por simples proximidade num roteiro.
- Definir a estratégia de exportação/mesclagem de alterações independentes de cada módulo para a biblioteca editorial (não implementar sincronização implícita).

## Procedimento de revisão

`classificar tela → conferir árvore e CSS → identificar elementos/instâncias → ligar eventos declarados → atribuir mocks pertinentes → validar preview → revisar navegação → definir dados/operações → aprovar diff → regenerar snapshots JSON dos módulos`.

O **motor definitivo** não é declarado homologado neste ciclo; a entrega é uma base funcional de avaliação e edição com dados normalizados e autônomos.
