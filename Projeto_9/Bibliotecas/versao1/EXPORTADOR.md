# Exportador de telas V1/V2

Abra `index.html#exportar` pelo GitHub Pages ou por um servidor HTTP iniciado em `Projeto_9/Bibliotecas`. A aba carrega os dois inventários V1 e a auditoria V2; origens V1 adicionais registradas na V2 são incluídas sem mesclar IDs. A seleção é por versão, biblioteca e caminho, e continua ao trocar filtros.

- V1: o conteúdo HTML original é copiado como texto UTF-8.
- V2: os quatro arquivos existentes são lidos; CSS, JSON e motor são incorporados no HTML. Somente a leitura de documento.json é substituída por leitura do JSON interno. Não modifica o motor da biblioteca, telas ou contratos. Links/ações originais continuam como na fonte; não monta uma aplicação navegável nem faz homologação visual.
- ZIP sem CDN, usando STORE e CRC-32, contém apenas HTMLs, segregados por versão e caminhos 01/02. Qualquer falha bloqueia a exportação integral e identifica as telas afetadas.

## Verificação manual
1. Abrir a aba, verificar 192 itens V1 e 192 V2 no snapshot atual.
2. Selecionar telas de V1 e V2, inclusive o mesmo ID em versões/bibliotecas diferentes; trocar filtros e conferir contagem.
3. Gerar ZIP, extrair e abrir dois HTMLs diretamente com file://, sem servidor; verificar tela, estados e ações simuladas.
4. Desconectar a rede após extrair e repetir; eventuais recursos externos da fonte devem ser registrados como pendência, não substituídos por novos conteúdos.
5. Simular falha de um arquivo e conferir que não é baixado ZIP incompleto.
