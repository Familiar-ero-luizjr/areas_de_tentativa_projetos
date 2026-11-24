# Meus chamados

- **Tela:** `advogado.configuracao.meus_chamados`
- **Biblioteca:** `01`
- **Etapa de execução:** `04_advogado`
- **Caminho preservado:** `01/telas/advogado/configuracao/V1_022_meus_chamados`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **7 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **1**; dimensões de estado: **1**; rotas candidatas: **4**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): advogado.
- Subjornada(s): advogado.operacao.configuracoes.
- **Possíveis predecessoras:** advogado.configuracao.suporte.
- **Possíveis sucessoras:** advogado.configuracao.falar_suporte, advogado.configuracao.suporte.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
