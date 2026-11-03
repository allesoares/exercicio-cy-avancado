# Exercício Cypress Avançado — Hub de Leitura
(Alexandre Soares)
Testes do Hub de Leitura para praticar Intercept e AppActions, aproveitando os cenários de catálogo e cesta do projeto de testes UI e o contrato do projeto de API usados em aula.

## Cenários do exercício

| Arquivo | Cenário |
| --- | --- |
| `catalogo.cy.js` | Positivo com Intercept: buscar um livro e validar título e autor da resposta simulada. |
| `catalogo.cy.js` | Negativo com Intercept: simular erro 500 na listagem e validar a mensagem na interface. |
| `cesta.cy.js` | AppActions: autenticar por API com `cy.loginApp`, preparar o estado da aplicação e adicionar um livro à cesta pela interface. |

Os exemplos do professor continuam em `login.cy.js` e `admin-reservas.cy.js`.

## Como executar

Pré-requisitos: Node.js, npm e o Hub de Leitura com interface e API disponíveis em `http://localhost:3000`. 

1. Instale as dependências com `npm ci`.
2. Copie `cypress.env.example.json` para `cypress.env.json` e ajuste as credenciais dos usuários de teste. Os valores do exemplo são contas demonstrativas da aula.
3. Garanta que o catálogo tenha o livro **1984**, disponível para adicionar à cesta no cenário com AppActions.
4. Execute os novos cenários:

```bash
npx cypress run --spec "cypress/e2e/catalogo.cy.js,cypress/e2e/cesta.cy.js"
```

Para abrir o Cypress, use `npx cypress open`. Para executar também os exemplos do professor, use `npx cypress run`.

Para outro endereço da aplicação, configure `BASE_URL` no ambiente ou use `npx cypress run --config baseUrl=http://localhost:3001`.

## Estrutura

- `cypress/e2e`: cenários de teste.
- `cypress/support/commands.js`: comandos reutilizados, incluindo a AppAction de login.
- `cypress/fixtures`: massas de dados para respostas simuladas.

Credenciais locais, dependências, screenshots, vídeos e logs ficam fora do Git. O `package-lock.json` permanece versionado para reproduzir a instalação.
