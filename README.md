# Cypress avançado com Intercept e App Actions

Neste exercício, usei o Hub de Leitura para praticar o controle das respostas da API e a preparação da sessão antes dos testes de interface. Com Intercept, simulei respostas do catálogo; com App Actions, fiz o login pela API antes de validar a cesta.

**Tecnologias:** Cypress, JavaScript e Node.js.

## O que foi implementado

| Arquivo | Cenário |
| --- | --- |
| [catalogo.cy.js](cypress/e2e/catalogo.cy.js) | Busca com resposta simulada, conferindo título e autor |
| [catalogo.cy.js](cypress/e2e/catalogo.cy.js) | Resposta 500 e mensagem de erro na interface |
| [cesta.cy.js](cypress/e2e/cesta.cy.js) | Login por API e inclusão de um livro na cesta pela interface |

Os exemplos do professor continuam em `login.cy.js` e `admin-reservas.cy.js`. A App Action de login está em [commands.js](cypress/support/commands.js).

## Como executar

Tenha Node.js e npm instalados e o [Hub de Leitura integrado](https://github.com/EBAC-QE/hub-de-leitura-integrado) em `http://localhost:3000`, com interface e API disponíveis.

```powershell
npm ci
Copy-Item cypress.env.example.json cypress.env.json
```

Preencha as contas de teste no arquivo local e garanta que o catálogo tenha o livro **1984**, disponível para o cenário da cesta. Em seguida:

```powershell
npx cypress run --spec "cypress/e2e/catalogo.cy.js,cypress/e2e/cesta.cy.js"
```

Para abrir a interface, use `npx cypress open`. Para executar também os exemplos, use `npm test`. Caso a aplicação esteja em outro endereço, use `--config baseUrl=http://localhost:3001`.

## Organização

Os cenários ficam em `cypress/e2e`, as respostas simuladas em `cypress/fixtures` e as ações reutilizadas em `cypress/support/commands.js`. O arquivo `cypress.env.json` é local e não é versionado.

## Pipeline Jenkins

Este projeto também atende ao exercício de integração contínua com Jenkins, usando o repositório existente: https://github.com/allesoares/exercicio-cy-avancado.

As alterações deste exercício ficam na branch `exercicio-jenkins`, preservando a entrega anterior na `main`.

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

## Contexto

Exercício desenvolvido por Alexandre Soares durante o curso da EBAC, com a aplicação e os exemplos fornecidos nas aulas.

[Voltar ao portfólio](https://github.com/allesoares/qa-portfolio)
