# Plano de validação — conversão V1 → contrato V10

## O que já foi feito
- Blocos 01 e 02 da versão 1 mantidos separados, respeitando os subcaminhos de origem.
- Cada HTML convertido para pasta própria com `index.html`, `style.css`, `motor.js`, `documento.json`, `README.md` e original como referência.
- 192 contratos no schema V10, componentes no catálogo único, mesmo arquivo de motor V3 em todas as telas.
- Rotas extraídas apenas de controles com destino explícito `data-goto`/`data-route`, não importadas automaticamente da Matriz Mestra.

## Limitações — não homologadas
- **Não há garantia de pixel-perfect:** templates e CSS do bloco 01 e definições DOM/CSS do bloco 02 migrados estruturalmente; Shadow DOM, estilo `:host` e scripts específicos podem se comportar de outra maneira.
- As condições e interações específicas que dependiam de JS privado da V1 não foram todas migradas para estados/interações declarativos. Campos ausentes permanecem vazios, e não inventados.
- Nem todos os estados, valores dinâmicos, rotas e subjornadas foram reconstruídos. `jornadas.json` é propositalmente vazio até validação semântica.
- O HTML original foi preservado apenas para comparação e não é consumido pelo motor novo.
- A execução automatizada em Chromium foi bloqueada por política de acesso localhost do ambiente. Portanto, **não há homologação visual**.

## Próximos passos de homologação
1. Validar no navegador HTTP cada par original/convertido, por bloco, por estado.
2. Catalogar diferenças de HTML/CSS e corrigir sem adicionar lógica de tela ao motor.
3. Mapear eventos e ações da V1 para interações e estados canônicos, sem alterar visual.
4. Confrontar rotas com `docs/matrizes/mestra`, resolver divergências e então preencher `jornadas.json`.
5. Registrar por tela aprovação funcional e visual no README e auditoria.

**Esta entrega é a base estrutural de migração, não a versão final certificada.**
