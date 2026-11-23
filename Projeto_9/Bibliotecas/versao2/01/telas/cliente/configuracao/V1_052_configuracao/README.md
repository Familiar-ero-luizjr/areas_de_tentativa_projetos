# Cliente · Configurações

- **Tela:** `cliente.configuracao.configuracao`
- **Biblioteca:** `01`
- **Etapa de execução:** `03_cliente`
- **Caminho preservado:** `01/telas/cliente/configuracao/V1_052_configuracao`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **7 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **1**; dimensões de estado: **1**; rotas candidatas: **6**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): cliente.
- Subjornada(s): cliente.operacao.configuracoes.
- **Possíveis predecessoras:** cliente.configuracao.suporte, cliente.configuracao.termos_privacidade.
- **Possíveis sucessoras:** cliente.configuracao.suporte, cliente.configuracao.termos_privacidade, cliente.onboarding.preferencias_contato.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
