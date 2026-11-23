# V7 consolidada com V10

- V10 permanece referência do motor universal e dos componentes visuais.
- A Home V7 preserva seu JSON canônico e hierarquia de OAB pendente/habilitada, além de subseções de Escritório.
- O clique `event.ui_aj_menu_advogado_v1.e0060` possui somente `rota.advogado.home.sair`, com destino existente `auth.global.sessao.entrar`.
- A rota Sair não pertence mais à subjornada de Assinatura.
- A aba Árvore V7 agora usa o documento real da Home corrigida na V10.
- Rotas sem evento concreto continuam propostas, não foram forçadas a funcionar.
- O validador verifica conflitos de rotas por estado e coerência pai/filho.
