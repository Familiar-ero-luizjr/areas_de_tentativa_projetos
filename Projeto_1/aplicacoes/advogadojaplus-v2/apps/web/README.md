# Frontend AdvogadoJá Plus

As rotas vivem em `src/app`, com suas implementações em `src/views/pages` (não usar `src/pages`, reservado pelo Next.js). Cada página possui `Page.tsx` e `Page.styles.ts`; somente telas com estado/comportamento próprios possuem `.hooks.ts`.

O frontend **sempre acessa a API HTTP** em `NEXT_PUBLIC_API_URL`. Não importa seeds, IndexedDB nem banco fake. A API é quem decide entre mock e MongoDB Atlas.

Contextos: Session, Journey, Feedback e Modal. Tokens visuais compartilhados em `src/themes/tokens.css` e referenciados por `tokens.ts` via CSS custom properties.

Os caminhos de advogado, login social e ações fora do escopo até Home continuam Em construção.
