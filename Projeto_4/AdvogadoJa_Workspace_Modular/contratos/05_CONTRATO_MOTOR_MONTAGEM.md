# Motor de montagem — contrato atual, com pendências

O motor recebe uma `tela`, os `componentes` resolvidos por `identidade.id`, `jornada` e `estado` e produz uma montagem temporária:

1. Filtra `estrutura.grupos` e `componentes.instancias` por `aplicaA`.
2. Resolve `instancia.ref` no catálogo canônico de componentes.
3. Resolve `props.*Ref` a partir de `dados` e `mocks` da **própria tela**.
4. Distribui árvores visuais de componentes nos slots (`header`, `main`, `menu` etc.) indicados na tela.
5. Compõe estilos próprios da tela e CSS dos componentes instanciados para gerar prévia isolada.
6. Entrega lista de pendências sem fabricar componentes ausentes.

**Pendente:** validar formalmente `estados`, `aplicaA`, semântica de propriedades repetidas, evento emitido/payload, regras de composição e CSS no Flutter. A prévia atual é HTML isolado e não prova equivalência do app real.
