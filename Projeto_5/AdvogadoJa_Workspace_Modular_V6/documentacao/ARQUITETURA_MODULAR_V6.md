# Contrato de isolamento dos módulos V6

1. Cada pasta de módulo contém HTML, CSS integral, controlador de interface, motor e todas as suas dependências JavaScript privadas.
2. Nenhum módulo importa JS/CSS dos demais nem de um núcleo comum.
3. Somente os JSONs do `catalogo/` são a fonte de dados compartilhada. O acervo pendente está fora dos índices de execução.
4. O `index.html` geral apenas apresenta links e lê contagens do índice de catálogo.
5. O servidor Python opcional oferece somente HTTP e gravação física controlada; não roda motores, não fornece resoluções comuns.
6. O resolvedor do Flow e o do Protótipo são cópias independentes do mesmo contrato, não serviços compartilhados.
7. Mudanças de HTML/CSS/motor de um módulo não alteram outros. Mudanças no contrato de JSON são compartilhadas e exigem teste de conformidade entre consumidores.
8. A personalização do CSS está exclusivamente na pasta do módulo; é aceitável que regras iniciais iguais estejam copiadas em módulos diferentes.
9. A pasta de cada módulo pode ser entregue isoladamente para manutenção. Para executar precisa alcançar o catálogo HTTP e ter o caminho de ROOT correto no carregador local.
10. Questões provisórias permanecem recomendações, sem fixação automática.
