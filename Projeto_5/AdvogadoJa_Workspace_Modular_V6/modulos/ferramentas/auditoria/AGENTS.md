# Módulo auditoria — Advogado Já V6

**Isolamento:** HTML, CSS, JavaScript, motor e auxiliares estão todos nesta pasta. Nenhum import de código externo é permitido.
A única fonte compartilhada de dados é `../../../catalogo/indice.json` e os JSONs de tela e componente referenciados por ele.
O acervo pendente não participa da execução. O índice geral é só navegação e pode ser alterado sem afetar este módulo.

## Arquivos

- `index.html`: interface do módulo; links para outros módulos são navegação opcional, não dependências.
- `style.css`: CSS completo deste módulo, incluindo seu tema base; personalize livremente.
- `app.js`: eventos e interações da interface.
- `motor.js`: processamento e projeção do módulo; os JSONs canônicos são imutáveis até o usuário confirmar uma edição.
- `catalogo.js`: código auxiliar privado deste módulo.
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

## Responsabilidade exclusiva — Auditoria

- **Objetivo:** Inspecionar consistência, IDs e referências do catálogo ativo.
- **Fonte lida:** identidade, componentes, navegacao, acoes, estados e dados no Catálogo ativo.
- **Processamento implementado:** motor.js expõe auditar() de validador.js privado.
- **Limite conhecido:** Zero erro no laboratório não significa homologação total ou auditoria do acervo.
- **Regra adicional:** Não corrigir silenciosamente, não incluir o acervo e apresentar origem de cada problema.

## Verificação específica

- Checar contagens; introduzir referência inválida em rascunho e verificar aviso.
- Conferir referências internas de JS/CSS; não depender de arquivos de código de outros módulos.
- Diferenciar dados do catálogo ativo de acervo pendente e decisões aprovadas de recomendações provisórias.
- Antes de editar, ler o README.md desta pasta. A alteração em um contrato JSON requer revalidar os consumidores, sem sincronizar motores automaticamente.
