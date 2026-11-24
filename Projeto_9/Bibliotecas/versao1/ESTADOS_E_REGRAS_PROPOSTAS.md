# Biblioteca de estados interativos — Advogado Já

## Origem e escopo

- Biblioteca 01: 78 telas originais V1 + 2 telas de senha propostas.
- Biblioteca 02: 110 telas originais Projeto 9 + 1 tela de senha proposta.
- Os layouts base, componentes e dados das telas foram preservados. Adicionou-se uma camada de simulação de estado nos HTMLs de profissional e estudante.
- Seletores nos índices 01 e 02, mais um `estados.html` comparativo. Todos funcionam sem internet e sem backend.

## OAB — profissional

Na V1 já existem estados `professionalAccess=restricted|enabled`, derivados da capacidade profissional e da validação da OAB. O modo restrito oculta solicitações e disponibilidade e mantém CTA de validação. No Projeto 9 há classes CSS equivalentes na Home.

| Cenário | Condição | Comportamento
|---|---|---|
| Habilitado | OAB validada | Solicitações, disponibilidade e agenda no menu
| Sem OAB | Não informada | Solicitações restritas; apresentar validação OAB
| OAB em análise | Em análise | Mesmo bloqueio; mensagem de espera (PROPOSTA)
| OAB rejeitada | Rejeitada | Mesmo bloqueio; mensagem de correção (PROPOSTA)
| Offline | OAB validada, disponível = não | Atendimento pausado; menu com acesso à agenda
| Sem plano | OAB validada, plano ausente | Convite a contratar; bloqueios por assinatura não assumidos (PROPOSTA)

**Nota:** sem OAB ≠ estudante. Estudante é uma área complementar do perfil Cliente.

## Cliente com área Estudante

Os contratos do Projeto 9 indicam que o cliente pode entrar na área Estudante e visualizar catálogo sem assinatura. O acesso a aulas exclusivas depende de assinatura ativa.

| Cenário | Home | Catálogo | Meus cursos | Menu
|---|---|---|---|---|
| Sem plano | Convite para contratar | Visível | Bloqueado | Curso com cadeado; Planos disponível
| Pagamento pendente | Aguardando confirmação (PROPOSTA) | Visível | Bloqueado | Contratação e assinatura
| Plano ativo | Conteúdo liberado | Visível | Liberado | Meus cursos e assinatura
| Plano vencido | Convite para renovar (PROPOSTA) | Visível | Bloqueado | Renovação e assinatura

As telas de Estudante vieram com um drawer de Cliente reutilizado. A simulação adiciona um menu contextual Cliente + Estudante, mantendo os HTMLs originais e a sua origem rastreável.

## Como usar

1. Abra `index.html`.
2. Use `estados.html` para comparar a Home Profissional com a Home Estudante lado a lado.
3. Abra a Biblioteca 01 ou 02, selecione Home/funcionalidade de Advogado ou Estudante e mude o cenário no seletor acima da prévia.
4. Clique nos itens do menu de estado para mudar de tela mantendo o cenário.
5. Abra o HTML individual e clique em `⚙ Estados` para testar isoladamente.

**Nenhuma operação de pagamento ou validação OAB real é realizada.** Regras propostas devem ser homologadas durante a especificação definitiva.
