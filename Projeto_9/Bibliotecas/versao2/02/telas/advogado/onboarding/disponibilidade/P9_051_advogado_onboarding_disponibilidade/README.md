# Disponibilidade inicial

- **Tela:** `advogado.onboarding.disponibilidade`
- **Biblioteca:** `02`
- **Etapa de execução:** `02_cadastro_onboarding`
- **Caminho preservado:** `02/telas/advogado/onboarding/disponibilidade/P9_051_advogado_onboarding_disponibilidade`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **5 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **315**; dimensões de estado: **0**; rotas candidatas: **2**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): advogado.
- Subjornada(s): advogado.onboarding.
- **Possíveis predecessoras:** advogado.onboarding.revisao_profissional, escritorio.onboarding.vinculo_escritorio.
- **Possíveis sucessoras:** advogado.onboarding.perfil_profissional.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
