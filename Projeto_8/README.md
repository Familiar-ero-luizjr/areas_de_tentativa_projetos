# Projeto 8 — Laboratórios AdvogadoJá

Áreas independentes para inspeção e evolução controlada de modelos e interfaces.

- [Contratos](./CONTRATO/) — modelo JSON, glossário, exemplo da Home e documentação.
- [Jornadas](./JORNADAS/) — apresentação de telas por jornada e subjornada.
- [Protótipo](./PROTOTIPO/) — laboratórios demonstrativos, cliente e modular.
- [Banco](./BANCO/) — visualizador/estrutura de modelagem.
- [Referências autocontidas](./htmls_autocontidos/) — HTMLs de referência, incluindo Fluxo V2.

Cada módulo usa seu próprio `README.md`. Consulte [AGENTS.md](./AGENTS.md) antes de alterar arquivos. Execute o site por HTTP local quando houver carregamento de JSON via `fetch`.

**Atenção:** materiais de laboratório não homologam automaticamente contratos, rotas ou decisões de produção.

## Workspace único de navegação

O `index.html` é a entrada padrão do Projeto 8. Sua aparência e navegação seguem o menu de referência fornecido para esta integração:

- `workspace/menu.json` define **somente os módulos e as opções conhecidas** de Banco, Contrato e Protótipos. Não fixa perfis de Jornadas;
- `workspace/style.css` define o cabeçalho e menu lateral responsivos;
- `workspace/app.js` carrega cada módulo sob demanda em um iframe de mesma origem, preserva a sessão quando alterna e permite navegar por suas opções reais;
- `workspace/embedded.css` oculta apenas a navegação redundante quando o módulo está integrado ao Workspace. Aberturas diretas dos módulos continuam com seus menus próprios e não sofrem alteração.

### Jornadas dinâmicas

O menu **Jornadas** é construído após o carregamento do visualizador real, lendo os itens de `#journeyTabs`, que por sua vez são montados a partir dos registros do `JORNADAS/dados/manifest.json` e dos JSONs das telas, ou das jornadas importadas em sessão. As **subjornadas permanecem nas abas internas do visualizador**, também derivadas dos dados. Um observador atualiza o menu externo após uma importação de JSON ou mudança de jornada, sem códigos fixos para Advogado, Cliente/Estudante ou Administrador.

Importações do navegador seguem a persistência já existente de Jornadas no `localStorage`; **não** escrevem automaticamente no repositório nem tornam os dados públicos. Para publicar uma nova jornada, inclua os arquivos e suas referências no manifesto versionado.

### Rotas e compatibilidade

Abra `Projeto_8/index.html` para navegar entre os quatro módulos sem sair da página. A URL com fragmento permite apontar para opções específicas, por exemplo `#banco%3Adiagram`, `#contrato%3Adoc`, `#prototipos%3Amodular_v2` e `#jornadas%3A<id-codificado>`.

Os endereços `BANCO/index.html`, `CONTRATO/index.html`, `JORNADAS/index.html` e `PROTOTIPO/index.html` continuam válidos para testes independentes. A integração não migra dados, não reescreve os motores e não converte modelos incompatíveis.
