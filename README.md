# Áreas de tentativa — catálogo de projetos

Este repositório reúne projetos independentes. Cada diretório `Projeto_*` possui sua própria página inicial, documentação e instruções para agentes de IA.

## Publicação no GitHub Pages

Após habilitar o GitHub Pages para a branch `main` e a pasta raiz (`/`), o catálogo estará disponível em:

`https://familiar-ero-luizjr.github.io/areas_de_tentativa_projetos/`

Cada projeto pode ser aberto sem depender dos demais:

- [Projeto 1 — Advogado Já](./Projeto_1/)
- [Projeto 2 — Organizador de Vida](./Projeto_2/)
- [Projeto 3 — Arquitetura HTML Autocontido](./Projeto_3/)

## Organização e trabalho com IA

Antes de iniciar uma alteração, escolha somente um projeto e leia o respectivo `AGENTS.md`. Mudanças devem permanecer dentro desse diretório, salvo autorização explícita para alterar o catálogo da raiz.

O `README.md` de cada projeto descreve seu propósito e como abri-lo. O `AGENTS.md` fixa o escopo, as regras e o modo de validação para agentes.

## Execução local

Os projetos são páginas estáticas. Para evitar restrições de `file://`, sirva a raiz por HTTP, por exemplo:

```powershell
py -m http.server 8000
```

Depois, abra `http://localhost:8000/`.
