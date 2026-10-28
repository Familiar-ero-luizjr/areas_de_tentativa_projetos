# Cliente Interativo V3 — Protótipo do Workspace V6

## Responsabilidade
Preenchimento HTML, dados, estados, eventos e rastreamento. É um laboratório HTML/CSS/JavaScript **independente** de seu irmão: sua pasta contém motor, resolvedor, montagem e leitura próprios.

## Origem dos dados
Lê somente `catalogo/indice.json`, `catalogo/telas/` e `catalogo/componentes/` pelo `catalogo.js` local. Não carrega HTML, dados ou rotas históricas do Projeto 6. Usa `mocks.cenarios` apenas dos contratos ativos para simular estados e resultados; não executa autenticação, banco nem APIs reais.

## Ferramentas disponíveis
- ◉ Experiência
- ✦ Dados e cenários
- ◈ Estados
- ⚡ Eventos
- ▦ Telas
- ⇄ Sequências
- ⌁ Relações
- ⚙ Configuração
- ☷ Rastreio
- { } Motor / JSON

## Limites
Os laboratórios de referência do Projeto 6 contêm muito mais telas; aqui as operações que dependem delas ficam limitadas às **cinco telas canônicas**, sem inventar etapas. As notas de relação e sequências editoriais não alteram rotas reais. Importação/exportação transfere só a sessão local.

## Regras
Leia `AGENTS.md`, teste as ações e a abertura por HTTP. Não importe arquivos JS/CSS de outros módulos. O menu geral permanece no próprio HTML; o submenu apenas alterna entre os dois laboratórios.

## Campos de formulário HTML

Os campos do DOM renderizado mantêm valores digitados ao alternar estados e telas durante **a sessão atual**. O preenchimento utiliza somente dados declarados em `mocks.cenarios` da tela, respeitando o que já foi digitado. O histórico registra a referência do campo sem copiar seu valor; credenciais não são exportadas. O motor recebe dados temporários em `contexto` para avaliar variantes; nada é salvo no Catálogo.
