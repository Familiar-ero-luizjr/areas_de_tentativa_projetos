# Termos e privacidade

- **Tela:** `advogado.configuracao.termos_privacidade`
- **Biblioteca:** `02`
- **Etapa de execução:** `04_advogado`
- **Caminho preservado:** `02/telas/advogado/configuracao/termos_privacidade/P9_040_advogado_configuracao_termos_privacidade`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **7 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **315**; dimensões de estado: **6**; rotas candidatas: **8**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): advogado.
- Subjornada(s): advogado.operacao.configuracoes.
- **Possíveis predecessoras:** advogado.configuracao.configuracao, advogado.configuracao.consentimentos, advogado.configuracao.politica_privacidade, advogado.configuracao.termos_uso.
- **Possíveis sucessoras:** advogado.configuracao.configuracao, advogado.configuracao.consentimentos, advogado.configuracao.politica_privacidade, advogado.configuracao.termos_uso.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
