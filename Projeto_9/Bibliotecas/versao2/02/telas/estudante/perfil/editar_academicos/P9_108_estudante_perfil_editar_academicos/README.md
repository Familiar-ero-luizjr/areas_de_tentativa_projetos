# Dados acadêmicos

- **Tela:** `estudante.perfil.editar_academicos`
- **Biblioteca:** `02`
- **Etapa de execução:** `06_outros`
- **Caminho preservado:** `02/telas/estudante/perfil/editar_academicos/P9_108_estudante_perfil_editar_academicos`
- **Arquivos:** `index.html`, `style.css`, `motor.js`, `documento.json` (motor idêntico em todas as telas).

## Como foi montada
- Composição compilada em **5 instâncias**, a partir do conteúdo e dos elementos visuais da tela; componentes e estilos foram incorporados às definições estruturais em `documento.json`, sem dependência de arquivos da biblioteca antiga.
- Regras de CSS: **1**; dimensões de estado: **4**; rotas candidatas: **0**.
- Os valores reais ainda não conhecidos permanecem ausentes; não são substituídos por dados de produção inventados.
- Motor universal: lê `documento.json`, monta instâncias e elementos, aplica estados e condições e apresenta navegações simuladas.

## Classificação e percursos
- Jornada(s): estudante.
- Subjornada(s): estudante.operacao.estudante.
- **Possíveis predecessoras:** não identificadas.
- **Possíveis sucessoras:** não identificadas.

## Decisões e verificação
- Percursos extraídos dos elementos e da auditoria são **candidatos**, não homologação funcional.
- Estados globais não representados explicitamente no material original não foram inventados.
- Referências externas são mantidas como destinos sem criar telas fictícias.
- Os arquivos foram gerados; **não há confirmação pixel-perfect nem homologação de todas as interações específicas**.
- Abrir por servidor HTTP local; `file://` pode bloquear `fetch` do JSON.
