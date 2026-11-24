# Testes de renderização executados

Ambiente de teste: Chromium headless + Playwright, `page.set_content` com os mesmos arquivos `index.html`, `style.css`, `motor.js` e objetos JSON carregados por resposta simulada de `fetch` (o ambiente restringe navegação direta localhost/file). Testou-se montagem inicial de todas as oito telas, presença de elementos DOM e erros de JS.

| Tela | Nós DOM montados | Resultado |
|---|---:|---|
| `global.splash` | 5 | Abriu |
| `auth.global.boas_vindas` | 10 | Abriu |
| `auth.global.sessao.entrar` | 38 | Abriu |
| `auth.global.sessao.esqueceusenha` | 34 | Abriu |
| `auth.global.sessao.resetarsenha` | 39 | Abriu |
| `advogado.home` | 166 | Abriu |
| `cliente.home.inicio` | 284 | Abriu |
| `admin.home.dashboard` | 131 | Abriu |

**Erros JavaScript reportados: 0.** Isso não prova equivalência pixel a pixel nem todos os estados/interações. Testes de navegação e comparação visual por estado continuam necessários antes de homologar a conversão de 01/02.

## Interações testadas após a normalização
- `advogado.home`: OAB restrita → habilitada, área Profissional → Escritório, título da seção Equipe e retorno; botão Validar OAB solicita a rota associada.
- `cliente.home.inicio`: abrir área Estudante, mudar plano para ativo, selecionar Catálogo e obter atualização de textos.
- `admin.home.dashboard`: alternar permissão para Gestão e alterar seção para Logs.
- **Exceções observadas nos testes adicionais:** nenhuma exceção JavaScript.

Os testes foram executados com o mesmo `motor.js` e os dados canônicos por tela via Playwright.
