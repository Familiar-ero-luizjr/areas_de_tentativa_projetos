# Boas-vindas

- **Tela:** `auth.inicializacao.boas_vindas`
- **Biblioteca:** `02`
- **Etapa de execução:** `01_acesso`
- **Caminho preservado:** `02/telas/auth/inicializacao/boas_vindas/P9_065_auth_inicializacao_boas_vindas`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **4 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **314**; dimensões de estado: **0**; rotas candidatas: **3**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): global.
- Subjornada(s): global.acesso.inicializacao.
- **Possíveis predecessoras:** auth.inicializacao.splash.
- **Possíveis sucessoras:** auth.sessao.entrar.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
