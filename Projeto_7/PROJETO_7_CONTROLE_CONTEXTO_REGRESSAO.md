# Projeto 7 — Controle de contexto, decisões e prevenção de regressões

**Versão:** 1.0 · **Data-base:** 2026-11-05  
**Função:** documento de continuidade para retomar o projeto sem perder decisões, confundir proposta com implementação ou regredir funções já existentes.  
**Documento parceiro:** `PROJETO_7_CHECKLIST_EXECUCAO.md`.

> **Instrução de retomada:** antes de qualquer intervenção, leia este documento, o checklist, o `README.md` do ZIP original e os `AGENTS.md` pertinentes. Verifique o conteúdo atual dos arquivos. Não assuma que decisões descritas aqui já foram implementadas.

## 1. Objetivo e destino

Organizar **sem recomeçar do zero** o ambiente `Projeto_7`, mantendo oito módulos independentes, capazes de consumir JSONs canônicos do catálogo. Cada JSON de tela precisa reunir as informações necessárias para que o módulo do catálogo e os motores de fluxo, mapa, protótipo, banco, geração e auditoria leiam campos definidos e realizem sua função sem reconstrução complexa da estrutura da tela.

A intenção é **colocar o processo em funcionamento rapidamente**, aproveitando o que já foi construído. O aperfeiçoamento progressivo dos 17 campos acontecerá após o alinhamento e a organização inicial.

## 2. Decisões aprovadas — autoridade alta

| ID | Decisão | Implicação prática |
|---|---|---|
| D001 | Manter `audit`, `catalog`, `database`, `flow`, `generator`, `map`, `master`, `prototype` | Não excluir nem fundir essas pastas durante a organização inicial. |
| D002 | Independência dos módulos com contratos compartilhados | Cada motor tem código e responsabilidade próprios; contrato é interface comum. |
| D003 | JSON da tela no catálogo é a fonte canônica | Evitar dados divergentes mantidos manualmente em motores. |
| D004 | Preservar e ampliar os 17 campos já presentes nos contratos de tela | Não propor novo schema radical neste ciclo. |
| D005 | `identidade.id` é a autoridade canônica | Não sobrescrever ID para fazê-lo coincidir com nome físico incorreto. |
| D006 | Tela autocontida inclui as próprias definições dos componentes | Motor não deve necessitar de definição externa de componente para montar uma tela. |
| D007 | Componente possui ID estável e identidade textual, reutilizável entre telas | A mesma identidade lógica pode aparecer integralmente embutida em telas distintas. |
| D008 | Componentes podem ter múltiplos estados; instâncias possuem IDs próprios | Mesmo componente pode ser usado em estados distintos e várias vezes numa tela. |
| D009 | Repetição controlada de componentes entre telas é aceitável | Auditoria deve detectar divergências sem sobrescrever intencionalidades locais. |
| D010 | Organizar primeiro, melhorar depois, etapa a etapa | Evitar discussões excessivas e refatoração geral antes de resultados funcionais. |
| D011 | Não alterar o ZIP original sem lote e homologação | Trabalhar sobre cópia com rollback e relatórios. |

**Importante:** a conversa **não aprovou ainda** a localização física final de contratos de componentes isolados, o nome/estrutura do índice gerado, a árvore interna final de `master/` nem o tratamento das oito propostas de componente. Esses pontos são **abertos**; não tratá-los como decisão existente.

## 3. Estado factual do material de entrada (verificado no ZIP original)

**Artefato:** `Projeto_7.zip`  
**SHA-256:** `6a9df96edf4d9197d72ca6007e2e087fbbad3878d3291cba5cd0135223d2a329`  
**Tamanho:** 6.699.719 bytes  
**Data da inspeção:** 2026-11-05.

### Estrutura

```text
Projeto_7.zip
├── README.md
├── index.html
├── audit/index.html
├── catalog/index.html
│   └── catalogo/       # 125 arquivos .json
├── database/
│   ├── index.html
│   └── ADVOGADOJA_BANCO_V6_AUTOCONTIDO.html
├── flow/index.html
├── generator/index.html
├── map/
│   ├── index.html
│   └── ADVOGADOJA_MAPA_V2_AUTOCONTIDO.html
├── master/index.html
└── prototype/
    ├── index.html
    ├── AdvogadoJa_Prototipo_Laboratorio_Modular_V2.html
    ├── AdvogadoJa_Laboratorio_Cliente_Interativo_V3.html
    ├── AGENTS.md
    └── README.md
```

Há **125 JSONs válidos na leitura sintática**, classificados como **98 telas** e **27 componentes** (19 com `schemaVersion` de primeiro nível `0.3.0`; oito sem esse campo de primeiro nível). As 98 telas usam os 17 campos:

`schema`, `schemaVersion`, `identidade`, `classificacao`, `navegacao`, `estados`, `acoes`, `dados`, `componentes`, `estrutura`, `estilos`, `variantes`, `interacoes`, `mocks`, `localizacao`, `proveniencia`, `politicas`.

### Problema crítico P001 — desalinhamento físico

- **125/125 arquivos** têm nome diferente de `identidade.id + '.json'`.
- Existem **125 IDs internos únicos** (sem duplicidade exata).
- IDs sem nome físico correspondente: `admin.administradores`, `admin.administrador_detalhe`, `cabecalho.app.resumido`.
- Nomes físicos sem ID interno correspondente: `catalogo`, `catalogo_modular_completo_v03`, `popup.status-toast.v01`.
- Exemplos: `admin.assinaturas.json` contém `admin.administradores`; `app.splash.json` contém `advogado.validacao_profissional`; `auth.cadastro.consentimentos.json` contém `app.splash`.

**Leitura:** o deslocamento sugere erro de associação nome/conteúdo na exportação ou montagem, mas **a causa não está comprovada**. Não corrigir IDs por nome de arquivo; primeiro construir correspondência e verificar referências.

### Observações estruturais

- `README.md` da raiz declara que o projeto modular conservou a lógica integrada dos HTMLs autocontidos; trata-se de separação de distribuição, ainda não refatoração modular do código.
- O armazenamento mencionado no README usa `localStorage` com chave `advogadoja.contrato-vivo.v1`; compartilhamento entre arquivos `file://` não é garantido.
- `prototype/README.md` e `prototype/AGENTS.md` referem-se ao **Projeto 6**. Preservar os protótipos e corrigir o contexto documental apenas durante a migração específica.
- **Ainda não foi realizado teste de interface/regressão funcional de ponta a ponta.** Inspeção estrutural não equivale a homologação de funcionamento.

## 4. Papel de cada módulo — orientação de escopo, sujeita à validação da implementação

| Módulo | Papel esperado | Deve evitar |
|---|---|---|
| `catalog` | Guardar contratos e permitir consulta/montagem das telas | Tornar componentes externos pré-requisito para renderizar tela |
| `master` | Inspecionar, editar e validar estrutura canônica | Manter segunda cópia autoritativa das telas |
| `flow` | Interpretar transições, estados, ações e condições | Inventar destinos ou regras ausentes |
| `map` | Projetar visualização de mapa a partir dos contratos | Reconstruir catálogo paralelo |
| `prototype` | Montar e simular telas com componentes embutidos e estados | Redefinir componentes manualmente fora dos JSONs |
| `database` | Interpretar campos, fontes, operações e persistência declarados | Inventar esquemas de dados |
| `generator` | Gerar saídas a partir de contratos tipados | Alterar fonte canônica sem autorização |
| `audit` | Encontrar incompatibilidades e regressões | Corrigir silenciosamente dados intencionais |

## 5. Contratos de identidade e componentes — regras a implementar

**Tela:** `identidade.id` é único; `nome` e `nomeExibicao` são rótulos humanos.  
**Componente embutido:** identidade equivalente à da tela, com ID lógico persistente entre telas.  
**Instância:** ID único no escopo da tela (ou escopo declarado), com referência ao ID do componente.  
**Estado:** identificado separadamente, selecionado por configuração ou condições declaradas; não redefinir o ID lógico do componente em cada estado.

**Forma atual a preservar como ponto de partida:** `componentes.definicoesEmbutidas` e `componentes.instancias`, além de `estados` e `variantes`. Um possível detalhamento futuro é uma decisão de schema, **não uma implementação autorizada aqui**.

**Princípio de funcionamento:** todos os dados necessários à montagem de uma tela estão no seu contrato JSON. O motor lê campos conhecidos e resolve apenas relações explicitamente declaradas; validações e processamento inerente ao motor continuam permitidos.

## 6. O que já foi feito vs. o que falta

### Feito

- Decisões D001–D011 registradas em conversa.
- Inventário inicial do ZIP e contagem/classificação dos JSONs.
- Identificados o desalinhamento físico P001 e os documentos legados de `prototype/`.
- Criados este controle de contexto e checklist de execução.

### Ainda não feito

- **Não** houve renomeação, cópia reestruturada, correção de IDs, alteração de schema ou publicação em GitHub.
- **Não** há mapeamento completo de referências cruzadas homologado.
- **Não** há `master/` refatorado nem módulos convertidos para consumir apenas o catálogo.
- **Não** houve certificação de equivalência visual ou funcional.
- **Não** foram completados os dados de banco, estados ou fluxos faltantes.

## 7. Backlog priorizado — caminho mais curto para avançar

| Ordem | Lote | Resultado observável | Bloqueios |
|---|---|---|---|
| 1 | L001 | Mapa completo `arquivo atual -> identidade.id -> destino` e referências | Nenhum para leitura; exceções exigem análise |
| 2 | L002 | Catálogo alinhado em cópia, sem perda de conteúdo | L001 + homologação do plano |
| 3 | L003 | Contratos de tela autocontidos auditados | Catálogo alinhado e regras de instância |
| 4 | L004 | `master/` organizado, preservando funções | Contratos estáveis |
| 5 | L005–L010 | Motores organizados um por vez | Integração específica |
| 6 | Pós-organização | Completar 17 campos por prioridade real de telas | Evidência de necessidade |

## 8. Protocolo antirregressão

**Antes de cada lote**
1. Ler este documento e checklist; conferir se há decisões posteriores aprovadas.
2. Confirmar o SHA-256 e guardar snapshot de entrada.
3. Inventariar arquivos, referências e funções afetadas.
4. Definir explicitamente o que **não** será modificado.

**Durante**
1. Modificar apenas o escopo do lote, em cópia.
2. Preservar IDs e conteúdos; qualquer mudança semântica requer justificativa e aprovação.
3. Produzir diff/mapeamento; não depender apenas de testes visuais.
4. Não misturar limpeza estética, mudança de comportamento e migração de dados em um único lote.

**Depois**
1. Recontar contratos, verificar IDs únicos, JSON válido e referências resolvíveis.
2. Testar funções preexistentes e o caminho de execução modificado, com resultados explícitos.
3. Registrar falhas, limitações e itens não testados.
4. Guardar saída versionada + relatório + procedimento de rollback.
5. Atualizar o checklist e o resumo abaixo **no mesmo lote**.

## 9. Registro de continuidade (atualizar sempre)

**Último marco:** M000 — definições arquiteturais + inspeção do ZIP + documentação de controle.  
**Última alteração em código/dados:** nenhuma.  
**Próxima ação:** L001 — inventário completo e tabela de correspondência/impacto dos 125 JSONs, sem alterar conteúdos.  
**Risco principal:** nome físico de arquivo apontando para contrato lógico diferente.  
**Questões abertas imediatas:** tratamento físico dos 27 componentes independentes; exceções dos três IDs e três nomes; índice derivado e localização final.

### Modelo de atualização após cada sessão

```text
SESSÃO/LOTE: [ID / data]
BASE: [arquivo/commit + SHA-256]
OBJETIVO: [...]
DECISÕES NOVAS: [D012, D013... ou nenhuma]
ALTERAÇÕES REALIZADAS: [arquivos e motivos]
EVIDÊNCIAS: [testes, hashes, relatórios, comparação]
REGRESSÕES: [nenhuma verificada / descrever / não testado]
PENDÊNCIAS: [...]
PRÓXIMO PASSO ÚNICO: [...]
SAÍDA E ROLLBACK: [caminho de artefato e recuperação]
```

## 10. Regra de continuidade para o próximo agente/sessão

Não retornar à discussão abstrata da arquitetura já aprovada. Começar pelo **L001**, apresentar fatos e exceções com evidências, e só então propor o menor lote implementável. Se encontrar divergência entre um documento e o código/ZIP, registrar a divergência, não sobrescrever silenciosamente. Decisão nova recebe ID e deve ser adicionada a ambos os documentos quando afetar o plano.

**Estado de aprovação destes documentos:** versões iniciais para uso e revisão; a elaboração dos arquivos não autoriza automaticamente a migração do ZIP.
