# Enriquecimento dos mocks pelo ambiente

Este pacote parte integralmente do `Mocks_AdvogadoJa.zip` anterior e aplica somente mudanças aditivas observadas ou inferidas com segurança a partir do `ambiente.zip`. Nenhum campo existente foi removido ou renomeado. Campos com significado equivalente aos já existentes não foram duplicados.

## Campos adicionados

- `clients`: `cpf`, `profilePhotoFileName`, `profilePhotoUploadState`, `complement`, `country`, `preferredContactChannels`, `bestContactTime`, `locationSource`, `locationCapturedAt`.
- `lawyer_private`: `complement`, `country`.
- `lawyers`: `languages`, para suportar o filtro de idioma mostrado no ambiente.
- `office_invites`: `invitedOab`, pois o formulário de convite solicita e-mail e OAB.
- `contact_requests`: `attachmentUrls`; em `location`, `source` e `capturedAt`, para diferenciar localização atual de cidade informada manualmente.

## Catálogo enriquecido

Foram preservadas todas as especialidades anteriores e adicionadas as opções presentes no ambiente que não existiam no mock: `Direito Intelectual`, `Trânsito`, `Bancário` e `Não sei informar`.

## O que propositalmente não foi duplicado

- `accountType` não foi adicionado a `users`, porque `profiles` já representa o perfil da conta.
- `legalAccepted` não foi adicionado como booleano separado, porque `legalConsent` e `consent_history` já representam o aceite.
- `password` e `passwordConfirmation` não foram persistidos nos mocks de banco; são credenciais/estado transitório de autenticação.
- `phone` do formulário de escritório não foi duplicado, pois o mock já usa `phoneE164`.
- `Online/Offline` não virou novo campo, pois `available` já representa esse estado.
- `Híbrido` não criou uma segunda modalidade equivalente a `ambos`; a nomenclatura já existente foi preservada.
- Nome, e-mail e status exibidos no perfil do Cliente continuam derivados de `users` quando já existem lá, sem duplicação em `clients`.
