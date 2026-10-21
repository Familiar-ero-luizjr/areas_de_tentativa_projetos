# Advogado Já — laboratório funcional

Laboratório independente para fechar a especificação funcional do Advogado Já antes da implementação final do produto.

## Abrir

O ponto de entrada publicado é `index.html`. A partir da raiz do repositório, execute:

```powershell
py -m http.server 8000
```

Depois, abra `http://localhost:8000/Projeto_1/`. No GitHub Pages, o endereço será:

`https://familiar-ero-luizjr.github.io/areas_de_tentativa_projetos/Projeto_1/`

Antes de alterar este projeto com IA, leia [`AGENTS.md`](./AGENTS.md). As instruções daquele arquivo delimitam o escopo e prevalecem sobre descrições históricas abaixo.

---

# Advogado Já — Aba Planejamento e Memória V1

Este pacote é um **overlay incremental** do `labadv.zip`. Não substitui nem inclui os outros módulos pesados do laboratório.

## Como instalar no laboratório

1. Extraia o ZIP deste pacote.
2. Copie a pasta `planejamento/` para a raiz do laboratório (ao lado de `prototipo/`, `jornadas/` e `referencias/`).
3. Substitua o `index.html` da raiz do laboratório pelo `index.html` deste pacote. É o índice original com **uma única aba Planejamento logo após Mapa integrado**.
4. Recomenda-se atualizar também `AGENTS.md` pelo arquivo deste pacote: corrigimos a antiga referência a quatro jornadas e inserimos as decisões mais recentes.
5. Copie `ABRIR_LOCAL.cmd` para a **raiz do laboratório**, ao lado do `index.html`. Execute-o no Windows ou use `python -m http.server 8000` nessa raiz. Acesse `http://localhost:8000/index.html#planejamento`. GitHub Pages também pode servir esse diretório.

## Fonte dos dados

- `planejamento/planejamento.json`: **roteiro estruturado** (3 jornadas, 5 fases, 30 etapas, estados e regras). Mude-o diretamente no repositório ou importe/exporte pela página.
- `planejamento/registros.csv`: **memória de decisões** (registros, perguntas, riscos e ideias). UTF-8 com BOM, separador `;`, compatible com Excel pt-BR. Mantém IDs, status, origem, jornada e links de etapas.
- `planejamento/index.html`: interface; `estilos.css` e `app.js`: apenas apresentação e lógica da aba.

**Não há duplicação de dados entre JSON e CSV.** O JSON controla a sequência; o CSV controla o que foi descoberto/decidido. A página lê os dois a cada recarregamento. `fetch(...,{cache:'no-store'})` reduz o risco de leitura de versões antigas, dependendo das configurações de cache do servidor/CDN.

## Como atualizar usando o ChatGPT e o GitHub

- Pode pedir ao ChatGPT para atualizar `planejamento.json` ou `registros.csv`, fornecendo a versão atual de ambos (ou acesso ao repositório). O arquivo deve ser validado antes da substituição.
- No GitHub, substitua o arquivo correspondente e faça commit. Ao atualizar a página publicada, verá os novos dados.
- A edição na interface é **em memória**: clique em **Exportar JSON** ao mudar estados das etapas, e em **Exportar CSV** após adicionar/editar registros. Os exports **não gravam nem criam commit automaticamente**.
- **Snapshot completo** exporta um JSON de backup e intercâmbio com ambos os conjuntos. Não é o arquivo `planejamento.json` da aplicação; importe o snapshot e depois exporte separadamente os dois arquivos se quiser restaurá-lo.

## Segurança e consistência

- `Confirmado` exige decisão expressa do usuário. Tudo que foi apenas sugerido fica `Proposto` ou `A analisar`.
- ID de registro `REG-0001` etc. nunca deve ser reutilizado. Não excluir: usar status `Descartado`.
- Não gravar credenciais, tokens, dados pessoais reais nem segredos do Firebase ou Google em JSON/CSV públicos.
- Valida campos obrigatórios, unicidade dos IDs e referências de etapas antes da importação.
- Se abrir com `file://`, a leitura automática pode falhar por política do navegador: use HTTP local ou importe os dois arquivos manualmente.
- Para automação de commits, seria necessária uma integração autenticada ao GitHub em vez de somente uma página HTML estática.

## Arquivos adicionais

- `docs/INTEGRACAO.md`: orientações detalhadas de integração.
- `planejamento/AGENTS.md`: contrato local para mudanças nesta aba.
- `validar_dados.py`: valida JSON, CSV, IDs e referências sem dependências externas.
