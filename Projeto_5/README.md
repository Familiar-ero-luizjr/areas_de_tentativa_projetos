# Projeto 5 — Advogado Já · Workspace Modular V6

O Projeto 5 reúne o Workspace modular do Advogado Já, organizado para que **cada módulo possa evoluir isoladamente**.

- [Portal deste Projeto 5](./index.html)
- [Workspace V6 — índice geral](./AdvogadoJa_Workspace_Modular_V6/index.html)
- [Regras de trabalho (AGENTS.md)](./AGENTS.md)
- [Documentação técnica do Workspace](./AdvogadoJa_Workspace_Modular_V6/README.md)

## Organização

```text
Projeto_5/
├── index.html
├── README.md
├── AGENTS.md
└── AdvogadoJa_Workspace_Modular_V6/
    ├── index.html
    ├── iniciar.py
    ├── catalogo/
    │   ├── indice.json
    │   ├── telas/           # 5 JSONs ativos
    │   └── componentes/     # 3 JSONs ativos
    ├── acervo_pendente/    # 106 telas e 142 componentes preservados
    ├── modulos/
    │   ├── definicao/
    │   ├── construcao/
    │   ├── projecao/
    │   └── ferramentas/
    └── documentacao/
```

## Os 12 módulos
- [Modelos JSON](./AdvogadoJa_Workspace_Modular_V6/modulos/definicao/modelos/README.md): Inspecionar JSONs atuais de tela e componente, suas seções e exemplos, sem homologar automaticamente o schema.
- [Contrato](./AdvogadoJa_Workspace_Modular_V6/modulos/definicao/contrato/README.md): Ler o histórico consolidado de decisões de produto e distinguir aprovação de proposta.
- [Planejamento](./AdvogadoJa_Workspace_Modular_V6/modulos/definicao/planejamento/README.md): Visualizar etapas e pendências da padronização do Workspace.
- [Catálogo](./AdvogadoJa_Workspace_Modular_V6/modulos/construcao/catalogo/README.md): Editar e inspecionar os JSONs de tela e componente com montagem visual.
- [Jornadas](./AdvogadoJa_Workspace_Modular_V6/modulos/construcao/jornadas/README.md): Agrupar participações, ordenar os percursos e exportar conjuntos completos.
- [Flow Editor](./AdvogadoJa_Workspace_Modular_V6/modulos/construcao/flow/README.md): Desenhar e editar ligações de navegação sem persistir grafo separado.
- [Protótipo](./AdvogadoJa_Workspace_Modular_V6/modulos/projecao/prototipo/README.md): Simular navegação, estados, mocks e variantes sobre as cinco telas.
- [Banco](./AdvogadoJa_Workspace_Modular_V6/modulos/projecao/banco/README.md): Projetar necessidades de dados sem executar banco de dados.
- [Mapa de Interações](./AdvogadoJa_Workspace_Modular_V6/modulos/projecao/mapa-interacoes/README.md): Relacionar gatilhos, serviços, estados e efeitos das ações, sem duplicar o Flow.
- [Auditoria](./AdvogadoJa_Workspace_Modular_V6/modulos/ferramentas/auditoria/README.md): Inspecionar consistência, IDs e referências do catálogo ativo.
- [Importação e Exportação](./AdvogadoJa_Workspace_Modular_V6/modulos/ferramentas/importacao-exportacao/README.md): Trocar pacotes completos de telas/componentes e comparar alterações por ID.
- [Questionário](./AdvogadoJa_Workspace_Modular_V6/modulos/ferramentas/questionario/README.md): Apresentar respostas aprovadas e recomendações provisórias separadamente.

Cada pasta de módulo contém sua interface `index.html`, `style.css`, `app.js`, `motor.js`, auxiliares próprios e agora um `README.md` e um `AGENTS.md` específicos. **Nenhum módulo importa código de outro módulo.** A única fonte comum de dados de telas/componentes é `catalogo/`. O índice geral serve para navegação, não é motor central.

## Execução
```bash
cd Projeto_5/AdvogadoJa_Workspace_Modular_V6
python iniciar.py
```
Abra `http://localhost:8765`. O GitHub Pages é estático: permite abrir e consultar os módulos, mas não gravar os JSONs via API Python local.

## Contratos e limites
O novo contrato de tela **não possui seção `flow`**. O Flow usa `navegacao` e `acoes`; o Protótipo utiliza também estrutura, estilos, componentes, estados e mocks. A ordem editorial não cria transições automáticas. O Banco apenas projeta dados declarados.

As cinco telas formam um **laboratório**, sem autenticação real ou migração automática do acervo. A transferência Estudante → Cliente é requisito de reorganização futura, não resultado já aplicado. O questionário distingue recomendações provisórias de aprovações explícitas.

Antes de alterar um módulo, leia `README.md` e `AGENTS.md` na pasta específica. Não misture com `Projeto_1` a `Projeto_4`.
