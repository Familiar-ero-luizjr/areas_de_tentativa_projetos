# Configuração do perfil profissional

- **Tela:** `advogado.onboarding.perfil_profissional`
- **Biblioteca:** `02`
- **Etapa de execução:** `02_cadastro_onboarding`
- **Caminho preservado:** `02/telas/advogado/onboarding/perfil_profissional/P9_052_advogado_onboarding_perfil_profissional`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **5 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **315**; dimensões de estado: **0**; rotas candidatas: **2**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): advogado.
- Subjornada(s): advogado.onboarding.
- **Possíveis predecessoras:** advogado.onboarding.disponibilidade.
- **Possíveis sucessoras:** advogado.onboarding.areas_atuacao.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
