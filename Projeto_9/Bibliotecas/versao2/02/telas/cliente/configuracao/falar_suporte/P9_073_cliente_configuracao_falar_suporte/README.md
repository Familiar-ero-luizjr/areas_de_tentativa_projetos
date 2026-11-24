# Falar com o suporte

- **Tela:** `cliente.configuracao.falar_suporte`
- **Biblioteca:** `02`
- **Etapa de execução:** `03_cliente`
- **Caminho preservado:** `02/telas/cliente/configuracao/falar_suporte/P9_073_cliente_configuracao_falar_suporte`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **7 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **315**; dimensões de estado: **4**; rotas candidatas: **3**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): cliente.
- Subjornada(s): cliente.operacao.configuracoes.
- **Possíveis predecessoras:** cliente.configuracao.meus_chamados, cliente.configuracao.suporte.
- **Possíveis sucessoras:** cliente.configuracao.suporte.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
