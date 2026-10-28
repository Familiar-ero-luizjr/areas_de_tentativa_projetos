# Módulo importacao-exportacao — Advogado Já V6

**Isolamento:** HTML, CSS, JavaScript, motor e auxiliares estão todos nesta pasta. Nenhum import de código externo é permitido.
A única fonte compartilhada de dados é `../../../catalogo/indice.json` e os JSONs de tela e componente referenciados por ele.
O acervo pendente não participa da execução. O índice geral é só navegação e pode ser alterado sem afetar este módulo.

## Arquivos

- `index.html`: interface do módulo; links para outros módulos são navegação opcional, não dependências.
- `style.css`: CSS completo deste módulo, incluindo seu tema base; personalize livremente.
- `app.js`: eventos e interações da interface.
- `motor.js`: processamento e projeção do módulo; os JSONs canônicos são imutáveis até o usuário confirmar uma edição.
- `catalogo.js`: código auxiliar privado deste módulo.
- `ui.js`: código auxiliar privado deste módulo.
- `zip.js`: código auxiliar privado deste módulo.

## Interação com o catálogo

O carregador local `catalogo.js` lê `../../../catalogo/indice.json` e os registros nele listados. A API HTTP `/api/catalogo/` (opcional, no `iniciar.py`) apenas grava alterações depois de validar; não é um motor compartilhado.
Com Live Server, alterações podem permanecer como rascunhos locais deste módulo: outros módulos só enxergam mudanças quando os arquivos JSON físicos são alterados.

## Evolução de contratos

Cada motor interpreta as mesmas convenções dos JSONs, mas sua implementação é **privada**. Alterar uma regra do contrato requer teste de conformidade dos consumidores, não edição de um arquivo JS compartilhado.
A seção `flow` é proibida nos JSONs canônicos das cinco telas. O Flow projeta `navegacao` e `acoes`.

## Responsabilidade exclusiva — Importação e Exportação

- **Objetivo:** Trocar pacotes completos de telas/componentes e comparar alterações por ID.
- **Fonte lida:** catálogo ativo inteiro, índice e pacotes JSON/ZIP no Catálogo ativo.
- **Processamento implementado:** exportacao() monta pacote; comparar() distingue novos, iguais e alterados e calcula impacto de componentes.
- **Limite conhecido:** Reconciliar campos complexos e mover jornada ainda exigem contratos adicionais.
- **Regra adicional:** Nunca apagar ausentes, não sobrescrever compartilhados sem revisão, impedir alterações não autorizadas.

## Verificação específica

- Exportar/importar pacote sem mudanças; examinar diferenças e confirmar gravação validada.
- Conferir referências internas de JS/CSS; não depender de arquivos de código de outros módulos.
- Diferenciar dados do catálogo ativo de acervo pendente e decisões aprovadas de recomendações provisórias.
- Antes de editar, ler o README.md desta pasta. A alteração em um contrato JSON requer revalidar os consumidores, sem sincronizar motores automaticamente.
