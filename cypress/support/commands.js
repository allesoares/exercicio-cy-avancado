// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, senha, sucesso = true) => {
    cy.visit('login.html')
    cy.get('#email').type(email)
    cy.get('#password').type(senha)
    cy.get('#login-btn').click()

    if (sucesso) {
        cy.url().should('include', 'dashboard')
    }


})

Cypress.Commands.add('loginErro', (email, senha) => {
    cy.visit('login.html')
    cy.get('#email').type(email)
    cy.get('#password').type(senha)
    cy.get('#login-btn').click()
})

Cypress.Commands.add('loginApp', (email, senha) => {
    cy.request({
        log: false,
        method: 'POST',
        url: 'api/login',
        body: {
            "email": email,
            "password": senha
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.token).to.be.a('string').and.not.be.empty
        // Preparar o estado antes de carregar a página, sem passar pelo formulário.
        cy.visit('dashboard.html', {
            onBeforeLoad(win) {
                win.localStorage.setItem('authToken', response.body.token)
                win.localStorage.setItem('userId', response.body.id)
                win.localStorage.setItem('userName', response.body.name)
                win.localStorage.setItem('isAdmin', response.body.isAdmin)
                win.localStorage.removeItem('bookCart')
            }
        })
        cy.get('h4').should('contain', 'Olá')
    })
})

Cypress.Commands.add('loginToken', (token) => {
    cy.visit('login.html')
    window.localStorage.setItem('authToken', token)
    cy.visit('dashboard.html')
    cy.get('h4').should('contain', 'Olá')
})
