# Arquitetura

A separação é proposital:

- `pages/`: painel React, somente interface de controle;
- `modules/`: comportamento dos serviços simulados;
- `data/`: estado e seed das coleções;
- `contracts/`: portas que o app consome;
- `adapters/`: implementações substituíveis;
- `scenarios/`: estados completos reproduzíveis;
- `chaos/`: falhas controladas;
- `api/`: superfície HTTP simulada;
- `logs/`: rastreabilidade.

O painel não é o mock. O painel controla o mock.
