# Módulo catalogo — Advogado Já V6

**Isolamento:** HTML, CSS, JavaScript, motor e auxiliares estão todos nesta pasta. Nenhum import de código externo é permitido.
A única fonte compartilhada de dados é `../../../catalogo/indice.json` e os JSONs de tela e componente referenciados por ele.
O acervo pendente não participa da execução. O índice geral é só navegação e pode ser alterado sem afetar este módulo.

## Arquivos

- `index.html`: interface do módulo; links para outros módulos são navegação opcional, não dependências.
- `style.css`: CSS completo deste módulo, incluindo seu tema base; personalize livremente.
- `app.js`: eventos e interações da interface.
- `motor.js`: processamento e projeção do módulo; os JSONs canônicos são imutáveis até o usuário confirmar uma edição.
- `catalogo.js`: código auxiliar privado deste módulo.
- `montagem.js`: código auxiliar privado deste módulo.
- `regras.js`: código auxiliar privado deste módulo.
- `resolvedor.js`: código auxiliar privado deste módulo.
- `ui.js`: código auxiliar privado deste módulo.
- `validador.js`: código auxiliar privado deste módulo.

## Interação com o catálogo

O carregador local `catalogo.js` lê `../../../catalogo/indice.json` e os registros nele listados. A API HTTP `/api/catalogo/` (opcional, no `iniciar.py`) apenas grava alterações depois de validar; não é um motor compartilhado.
Com Live Server, alterações podem permanecer como rascunhos locais deste módulo: outros módulos só enxergam mudanças quando os arquivos JSON físicos são alterados.

## Evolução de contratos

Cada motor interpreta as mesmas convenções dos JSONs, mas sua implementação é **privada**. Alterar uma regra do contrato requer teste de conformidade dos consumidores, não edição de um arquivo JS compartilhado.
A seção `flow` é proibida nos JSONs canônicos das cinco telas. O Flow projeta `navegacao` e `acoes`.

## Responsabilidade exclusiva — Catálogo

- **Objetivo:** Editar e inspecionar os JSONs de tela e componente com montagem visual.
- **Fonte lida:** identidade, componentes, estrutura, estilos, estados, variantes, mocks e navegação no Catálogo ativo.
- **Processamento implementado:** projetar() apresenta referências, participações e auditoria; a interface tem Árvore e JSON, Montagem visual e Motor/JSON.
- **Limite conhecido:** A prévia é laboratório; não equivale a app Flutter ou produto homologado.
- **Regra adicional:** Não copiar definições de componentes; revisar impactos de componentes compartilhados; não incluir acervo no índice.

## Verificação específica

- Abrir tela e componente, conferir ref, editar em rascunho, validar e só então salvar.
- Conferir referências internas de JS/CSS; não depender de arquivos de código de outros módulos.
- Diferenciar dados do catálogo ativo de acervo pendente e decisões aprovadas de recomendações provisórias.
- Antes de editar, ler o README.md desta pasta. A alteração em um contrato JSON requer revalidar os consumidores, sem sincronizar motores automaticamente.
