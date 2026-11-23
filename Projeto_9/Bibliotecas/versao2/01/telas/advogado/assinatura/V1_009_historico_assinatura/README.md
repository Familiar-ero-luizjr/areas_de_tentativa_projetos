# Histórico de assinatura

- **Tela:** `advogado.assinatura.historico_assinatura`
- **Biblioteca:** `01`
- **Etapa de execução:** `04_advogado`
- **Caminho preservado:** `01/telas/advogado/assinatura/V1_009_historico_assinatura`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **7 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **1**; dimensões de estado: **1**; rotas candidatas: **2**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): advogado.
- Subjornada(s): advogado.operacao.assinatura.
- **Possíveis predecessoras:** advogado.assinatura.gestao_assinatura.
- **Possíveis sucessoras:** advogado.assinatura.gestao_assinatura.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
