# AGENTS — Workspace Advogado Já V6

- **Arquitetura obrigatória:** nenhuma dependência de código/CSS entre módulos. Cada módulo é autossuficiente e lê exclusivamente o catálogo ativo como fonte externa dos dados de tela e componente.
- Não recrie uma pasta `nucleo/` ou um servidor de motores centralizados. `iniciar.py` limita-se a servir arquivos e validar/gravar JSONs físicos.
- Mantenha `index.html`, `style.css`, `app.js`, `motor.js` e auxiliares necessários na pasta do módulo. Leia o AGENTS.md local.
- A fonte canônica é `catalogo/indice.json`, `catalogo/telas/` e `catalogo/componentes/`. Acervo antigo em `acervo_pendente/` não é consumido.
- Os dados das telas têm seções `navegacao`, `acoes`, `estados`, `estrutura`, `estilos`, `componentes`, `dados`, `mocks`, com responsabilidade própria; **não usar seção `flow`**.
- Posições de nós no Flow são derivadas, sem gravação em telas. Três ordens (jornada, subjornada, tela) são editoriais, não criam conexões automáticas.
- Cada participação possui ID, jornada/subjornada com IDs e nomes explícitos. Não duplicar telas por contexto.
- Componentes são referenciados por ID. O mock está em `mocks` das telas; cada módulo implementa localmente como interpretá-lo se precisar.
- Importações são revisadas por ID, especialmente alterações de componentes compartilhados. Ausência no pacote não causa exclusão.
- O código dos motores pode divergir internamente, mas a semântica dos dados canônicos precisa ser coerente. Testar conformidade entre motores ao alterar contratos.
- Não chamar o legado de migrado nem atribuir homologação de produção ao laboratório.

## Guia local obrigatório

Leia também o README.md da pasta do módulo antes de alterar código. Ele documenta o que seu motor efetivamente implementa, seus campos de entrada, limitações e testes. Mudanças em contratos JSON compartilhados exigem verificar todos os consumidores sem criar motor compartilhado.


## Regra de acesso único e menu privado por módulo

- A entrada pública `../index.html` e o alias `index.html` encaminham para `modulos/construcao/catalogo/index.html`.
- Não recriar páginas intermediárias de índice no Projeto 5 nem no Workspace.
- O menu ☰ de navegação é implementado **localmente no index.html e style.css de cada módulo**; sem CSS/JS compartilhado e sem impacto nos motores.
- Manter os links relativos entre módulos e a indicação visual do módulo atual; testar responsividade e acessibilidade do menu.
