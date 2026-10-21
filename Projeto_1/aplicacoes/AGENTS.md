# AGENTS.md — Aplicações

## Missão

Esta pasta contém a implementação executável do Advogado Já.

Não usar `aplicacoes/` para inventar jornada, tela ou regra de produto. A implementação começa somente depois de definição e protótipo aprovados.

## Regra de equivalência

`advogadojaplus-v2/` e `flutter/` são duas implementações da **mesma aplicação**.

Não criar divergência funcional entre elas por conveniência técnica.

Devem permanecer equivalentes em:

- telas aprovadas;
- ações;
- destinos;
- estados;
- regras;
- validações observáveis;
- contratos funcionais;
- cenários homologados.

A arquitetura interna pode e deve ser idiomática para cada tecnologia.

## Regra máxima de execução

Antes de modificar código de aplicação:

1. **Auditar** o estado atual.
2. **Planejar** a melhor solução.
3. **Validar** o plano contra requisitos e arquitetura.
4. **Executar** somente o que foi planejado.
5. **Validar** o resultado com build, testes e comportamento.

Não editar primeiro para "arrumar depois".

Não produzir saltos arquiteturais, duplicação de responsabilidades ou arquivos improvisados para concluir mais rápido.

## Trabalho por lotes

A implementação pode ocorrer em lotes de telas.

Antes de iniciar cada lote, registrar no plano:

- quais telas entram;
- qual jornada e decisão as autorizam;
- o que já existe no React;
- o que já existe no Flutter;
- componentes reutilizáveis disponíveis;
- componentes transversais faltantes;
- contratos/API envolvidos;
- estados de loading, erro, vazio e sucesso;
- navegação e destinos;
- dados lidos e gravados;
- impacto no mock;
- testes e critérios de conclusão.

Só depois executar o lote nas duas implementações.

## Fronteira entre definição e implementação

O caminho obrigatório é:

```text
definição funcional
→ jornada fechada
→ protótipo de baixa fidelidade
→ planejamento técnico
→ aplicações
→ mock integrado
→ homologação
→ produção
```

Se uma decisão funcional ainda estiver aberta, voltar ao laboratório. Não resolvê-la dentro do código.

## Arquitetura visual

React e Flutter devem manter bibliotecas transversais equivalentes, respeitando seus próprios padrões.

Responsabilidades que não devem ser reimplementadas tela por tela:

- loading;
- erro;
- alerta;
- feedback;
- empty state;
- modal/dialog;
- formulários;
- tema/tokens;
- layout;
- navegação;
- estados comuns.

Não confundir componente transversal com tela de negócio.

## Contratos e infraestrutura

Telas não devem depender diretamente de detalhes de infraestrutura externa quando houver possibilidade de abstração por contrato/adaptador.

A intenção é permitir:

```text
Aplicação → contrato funcional → implementação selecionada
                              ├─ Mock Services
                              └─ serviço real de produção
```

A troca de infraestrutura não deve obrigar reescrita da tela.

## Mock Services

`advogadoja-mock-services/` é o ambiente externo simulado compartilhado.

Ele não define UI do produto.

Ele deve:

- fornecer API/contratos;
- manter estado compartilhado;
- possuir dados fictícios;
- suportar múltiplas instâncias/navegadores;
- permitir seed e reset;
- oferecer painel visual para inspeção/controle;
- simular cenários de serviços externos;
- registrar eventos/logs úteis à homologação.

Google Maps pode ser integração real, mas dados de negócio de teste permanecem controlados pelo ambiente mock.

A tecnologia definitiva de persistência/hospedagem do mock continua pendente de planejamento. Não escolher silenciosamente.

## Produção

Não conectar Firebase, MongoDB, Stripe, Functions ou outro serviço real apenas porque o código ou configuração já existe.

A migração mock → produção deve ser planejada por integração, preservando contratos e comportamento homologado.

## Autoridade local

Ao trabalhar nesta pasta, obedecer:

1. `/AGENTS.md`;
2. este `/aplicacoes/AGENTS.md`;
3. o `AGENTS.md` da aplicação específica;
4. plano aprovado do lote atual.

Em conflito, a regra de nível superior prevalece, salvo decisão explícita posterior.
