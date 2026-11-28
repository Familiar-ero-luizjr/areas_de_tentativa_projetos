# Integração das sete telas — Profissionais e solicitações

Fonte: HTML AdvogadoJa_Profissionais_Solicitacoes_Novo_Contrato.html, especificação V2 e os seis JSON enviados.

## Alterações

- contrato_aplicacao.json: 14 → 21 páginas; 3 → 4 componentes. Layout Base e componentes anteriores preservados integralmente. 33 saídas resolvidas (destino definido); 15 entradas recíprocas acrescentadas à Home/Login. Nenhuma página anterior teve estrutura, estados, interações ou dados alterados.
- documentos_telas.json: 7 documentos e notas novos, complementos da Home/Login; nome da subjornada professional_requests.
- editor_documentacao.json: grupo e sete subseções individuais em Design e Conteúdo do Aplicativo; documentação do componente request_detail. Esquema macro preservado.
- analise_requisitos.json: 14 registros novos; histórico correspondente. Apenas decisão arquitetural de reutilização marcada Confirmado. Regras e questões permanecem em análise/em aberto.
- sql_nosql.json: três tabelas candidatas e quatro relações, domínio separado; sem alterar tabelas anteriores. Persistência proposta; reviewed deriva de request_reviews, none não é status persistido. Contato privado candidato a users.phone; canal WhatsApp e autorização pendentes. Nenhum SQL executado.
- telas_e_dados.json: sete mapeamentos de entrada/saída, tabelas e campos candidatos, operação temporária para contexto e filtros.

## Compatibilidade e limites

Prévia experimental incorporada ao contrato, não homologada no motor do projeto. As expressões and, filterBy, merge e upsert e o transporte de data.request, data.requests, data.professional, data.plano e data.returnPage entre páginas precisam de suporte no motor. A seleção de profissional da Home usa data-profissional na prévia; o contrato atual ainda não transporta esse contexto automaticamente. Mocks fictícios; sem chamadas externas. As decisões de negócio em aberto não foram aprovadas por esta integração.

- Conservado o path já registrado para professional_profile (/demo/cliente/profissionais/perfil-publico) em vez de trocar a rota original do contrato. A referência legada continua no documento.
- As decisões em aberto da especificação V2 não foram resolvidas arbitrariamente; dados e requisitos são propostas.
- O status available indica que o destino está presente no catálogo, não que a ação foi homologada.
- Teste estático: JSON parseado, IDs, referências de rota/estado/componente, tabelas e campos, preservação das entidades originais. Não houve teste do projeto em navegador ou implementação de backend. Motor não alterado.

## Aplicação

Substituir os seis arquivos de mesmo nome em projeto_11/dados/ após backup. Este pacote não contém motor. Para o funcionamento integral é necessário adequar o motor de Telas e Jornadas e testar continuidade de seleção, estados, filtros e ações.
