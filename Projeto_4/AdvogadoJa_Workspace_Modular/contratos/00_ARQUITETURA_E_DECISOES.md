# Arquitetura e decisões de contrato — PROPOSTA

- **Escopo:** definição de dados e interfaces dos motores, separada de backend de produção.
- **Canônico:** documento individual `{identidade,classificacao,estados,componentes,estrutura,estilos,acoes,dados,mocks,flow}` para tela; definição `{identidade,classificacao,estrutura,estilos,interface}` para componente.
- **Físico:** pasta hierárquica `catalogo/telas` e `catalogo/componentes` é somente uma organização de trabalho; os IDs vinculam os registros e a localização da árvore vem dos metadados.
- **Montagem visual:** slots, instâncias e props apontam para o catálogo de componentes, nunca copiam HTML/CSS dos componentes para o documento da tela.
- **Flow:** colocações em sequências e caminhos em `flow.editor`; navegação real em `acoes.grupos`/itens; entradas derivadas.
- **Protótipo:** lê `classificacao.jornadas` e `flow.editor` das telas, usa a montagem visual para apresentar pontos navegáveis; não executa comandos e ainda não escolhe caminhos condicionais interativamente.
- **Segurança:** os JSONs são dados não confiáveis. Servidor só lê/escreve a pasta permitida; a montagem faz whitelist parcial de tags/atributos. CSS importado ainda exige revisão antes de executar fora de ambiente de desenvolvimento.
- **Evolução:** todas as alterações de contrato são discutidas e versionadas, não exigidas retroativamente antes de migrar a Store inteira.

## Pendências para aprovação

1. `flow.editor.branches`: manter a responsabilidade editorial vinculada à tela imediatamente anterior, como V3, ou criar âncora explícita? **Manter como V3 por enquanto.**
2. Consolidar `acoes.grupos` e itens de componentes em um modelo formal de `eventoId`, `regra`, `destino` e `efeito` sem replicação. **Ainda não finalizado.**
3. Completar vínculos de estados autoritativos e mocks por tela, especialmente cadastro e administrativo. **Ainda não finalizado.**
4. Decidir quais componentes locais serão promovidos a reutilizáveis. **Ainda não finalizado.**
5. Auditar e homologar as prévias importadas das jornadas e completar componentes faltantes por tela; a existência de JSONs visuais não garante fidelidade. **Ainda não concluído.**
