# AGENTS.md — Flutter

## Escopo

Estas regras valem somente para `aplicacoes/flutter/`.

Esta é uma implementação real do Advogado Já e deve permanecer funcionalmente equivalente à implementação React/Node.

## Antes de editar

Não começar pela escrita.

Para cada lote:

1. auditar `lib/`, rotas, tema, componentes, estado e contratos existentes;
2. comparar com a definição/protótipo aprovado;
3. verificar o estado equivalente no React;
4. planejar arquivos, dependências e reutilização;
5. validar o plano;
6. executar;
7. rodar análise/testes/build pertinentes;
8. validar o comportamento.

## Organização

Preferir arquitetura clara por responsabilidade/feature.

Não criar arquivos avulsos apenas para concluir rapidamente uma tela.

Bibliotecas transversais devem ser reutilizadas para:

- loading;
- erro;
- alerta;
- feedback;
- empty state;
- formulário;
- diálogo/modal;
- tema;
- layout;
- navegação;
- tratamento de estados comuns.

## UI e regra de negócio

Widgets de apresentação não devem conter detalhes de Firebase, HTTP do mock ou persistência.

Regras de negócio não devem ser duplicadas entre telas.

Quando faltar decisão funcional, parar e devolver a pendência ao laboratório.

## Contratos

A UI deve conversar com contratos/interfaces estáveis.

Implementações possíveis:

- adapter para Mock Services durante homologação;
- adapter Firebase/serviço real quando autorizado.

Trocar o provider não deve exigir reescrever telas.

## Equivalência com React

Não copiar código React.

Comparar comportamento.

Se um lote foi implementado nos dois projetos, validar que os mesmos estados e ações produzem os mesmos resultados observáveis.

## Legado

Arquivos remanescentes ou históricos não são automaticamente fonte de verdade.

Não restaurar arquitetura antiga, Functions, Rules ou rotas apenas porque já existiam.

Somente decisões atuais e planos aprovados autorizam implementação.
