# Instruções — Arquitetura de HTML Autocontido

## Missão

Manter a documentação interativa do padrão de arquitetura HTML autocontido, sem alterar outros projetos do repositório.

## Regras

- `index.html` deve continuar sendo uma página estática, independente e compatível com GitHub Pages.
- Preserve o arquivo `PADRAO_ARQUITETURA_HTML_AUTOCONTIDO (1).html` como fonte original, salvo pedido explícito de alteração.
- Mantenha `padrao-html-autocontido-dados.json` válido e sincronizado com qualquer mudança de conteúdo que o utilize.
- Não inclua segredos, credenciais ou dependências remotas obrigatórias.
- Verifique o HTML por HTTP local depois de modificá-lo.

## Delegação

Delegue apenas trabalhos específicos dentro deste diretório. O agente que integra a mudança continua responsável pela coerência arquitetural e por respeitar este escopo.
