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

## Pipeline Jenkins

Este projeto também atende ao exercício de integração contínua com Jenkins, usando o repositório existente: https://github.com/allesoares/exercicio-cy-avancado.

O `Jenkinsfile` executa em um agente Windows com Node.js, npm e Git no PATH:

1. **Preparação do ambiente:** obtém o código do GitHub, limpa os resultados anteriores e verifica se a interface do Hub está acessível.
2. **Instalação das dependências:** executa `npm ci` e verifica a instalação do Cypress.
3. **Execução dos testes automatizados:** executa todos os testes com `npm run test:ci` e publica resultados JUnit e screenshots de falhas no Jenkins.

### Jenkins local

É necessário Java 21 ou superior. Para instalar manualmente, baixe o pacote WAR LTS em https://www.jenkins.io/download/ e salve-o como `.jenkins-local/jenkins.war`. Essa pasta é ignorada pelo Git.

Inicie o Jenkins na raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-jenkins.ps1
```

Acesse http://localhost:8080. Em uma instalação nova, siga o assistente e instale os plugins **Pipeline**, **Git**, **Credentials Binding** e **JUnit**.

### Configuração do job

1. No Jenkins, cadastre duas credenciais do tipo **Username with password**, com as contas de teste do Hub:
   - ID `hub-leitura-usuario`: email e senha do usuário comum.
   - ID `hub-leitura-admin`: email e senha do administrador.
2. Configure o label `windows` no agente que executará os testes. Para o exercício local, pode ser o nó integrado do Jenkins.
3. Crie um item do tipo **Pipeline**, com o nome `exercicio-cy-avancado`.
4. Em **Definition**, selecione **Pipeline script from SCM**, SCM **Git**, URL `https://github.com/allesoares/exercicio-cy-avancado.git`, branch `*/exercicio-jenkins` e Script Path `Jenkinsfile`.
5. Salve e use **Build Now** para a primeira execução. Nas seguintes, use **Build with Parameters** para informar `BASE_URL`, se necessário.

Mantenha o Hub de Leitura em execução e acessível pelo agente. `localhost` representa o computador do agente Jenkins. O usuário comum e o administrador devem existir, e o livro **1984** deve estar disponível. As credenciais são fornecidas pelo Jenkins; o arquivo local `cypress.env.json` não é necessário no checkout do pipeline.

Depois da primeira execução, o gatilho `pollSCM` consulta o GitHub a cada dois minutos e inicia um build quando encontra um novo commit na branch `exercicio-jenkins`. O Jenkins precisa permanecer ligado e com acesso à rede. Alterações locais passam a ser detectadas depois de commit e push. A execução manual também continua disponível.

Abra o build para consultar **Console Output**, **Test Result** e os artefatos arquivados. Uma falha do Cypress faz o pipeline falhar.
