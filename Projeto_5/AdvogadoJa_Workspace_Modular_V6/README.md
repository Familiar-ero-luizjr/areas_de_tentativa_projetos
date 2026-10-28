# Advogado Já — Workspace V6 (módulos autossuficientes)

Esta versão parte da V5, mas **não possui `nucleo/` de código compartilhado**.
Cada módulo é uma aplicação web isolada: sua pasta contém `index.html`, `style.css`, `app.js`, `motor.js` e todos os auxiliares JS necessários (incluindo seu próprio resolvedor e leitor quando aplicáveis).
**Somente o Catálogo ativo é compartilhado como fonte de dados**: 5 telas, 3 componentes e `catalogo/indice.json`. O índice geral não executa motores dos módulos.

## Para usar

1. Extraia o ZIP inteiro.
2. Na raiz execute `python iniciar.py` (Python 3.10+, sem bibliotecas adicionais).
3. Abra `http://localhost:8765` e selecione um módulo.
4. Também é possível servir a raiz usando Live Server, mas para gravar JSONs físicos é necessário o servidor Python ou exportação/manual.
5. `file://` não permite `fetch` dos JSONs externos.

## Onde editar

- `modulos/<area>/<modulo>/index.html`: elementos próprios do módulo.
- `.../style.css`: CSS completo do módulo, **sem importar CSS externo**.
- `.../app.js`: comportamento da interface.
- `.../motor.js`: seu motor próprio.
- `.../catalogo.js`, `.../resolvedor.js`, `.../montagem.js`, `.../regras.js`, `.../validador.js`, `.../ui.js`, `.../zip.js`: auxiliares **locais e privados**, presentes somente quando utilizados.
- `catalogo/indice.json`, `catalogo/telas/*.json`, `catalogo/componentes/*.json`: fonte compartilhada de dados entre módulos.
- `acervo_pendente/`: 106 telas e 142 componentes antigos preservados; não são carregados pelos motores.

Cada pasta de módulo pode ser modificada e substituída isoladamente. Para executá-la fora desta árvore é preciso manter acesso ao catálogo e ajustar a constante `ROOT` no `catalogo.js` local conforme a nova localização. Links de navegação para outros módulos são opcionais e não importam lógica desses módulos.

## Dependências e independência

- Nenhum JS ou CSS dos módulos importa código de outra pasta de módulo ou de uma pasta `nucleo`.
- Há **cópias intencionais** do carregador e de pequenos auxiliares dentro dos módulos. Não sincronize essas cópias automaticamente ao alterar um único motor.
- Ao mudar o **contrato JSON compartilhado**, todos os motores consumidores precisam passar por testes de conformidade: autonomia de código não torna semânticas diferentes compatíveis automaticamente.
- `iniciar.py` é apenas servidor estático + gravação validada e transacional dos JSONs do catálogo ativo, **não um resolvedor compartilhado**. Nenhum motor consome uma projeção vinda dele.
- No Live Server, rascunhos ficam no armazenamento local do módulo/navegador. Só salvar no arquivo físico torna a mudança visível aos demais módulos.
- Documento de contrato e questionário do respectivo módulo são cópias locais. O acervo pendente e `documentacao/` não entram no motor.

## Limitações de laboratório

As cinco telas são exemplos de contrato ainda provisório; ações, variantes e dados não equivalem a serviços de produção. O gráfico Flow é auto-organizado, sem x/y persistidos, e os módulos não são o aplicativo mobile real. Banco só projeta dados declarados. A transferência Estudante → Cliente é ilustrativa e não mexe no acervo.
As recomendações pendentes do questionário não são fixadas automaticamente.

## Documentação de cada módulo

Os 12 módulos agora mantêm **README.md** e **AGENTS.md** específicos em suas pastas. Leia-os antes de alterar o motor ou o design. Consulte também o [portal do Projeto 5](../index.html) e o [README do projeto](../README.md). GitHub Pages é somente leitura; alterações persistidas requerem o servidor Python local.
