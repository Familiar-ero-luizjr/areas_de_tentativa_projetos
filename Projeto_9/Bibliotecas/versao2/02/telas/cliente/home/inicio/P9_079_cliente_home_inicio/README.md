# Início do cliente

- **Tela:** `cliente.home.inicio`
- **Biblioteca:** `02`
- **Etapa de execução:** `03_cliente`
- **Caminho preservado:** `02/telas/cliente/home/inicio/P9_079_cliente_home_inicio`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **8 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **30**; dimensões de estado: **4**; rotas candidatas: **0**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): cliente.
- Subjornada(s): cliente.operacao.inicio.
- **Possíveis predecessoras:** auth.sessao.entrar.
- **Possíveis sucessoras:** não identificadas.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
