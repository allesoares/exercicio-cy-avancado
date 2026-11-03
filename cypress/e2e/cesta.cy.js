/// <reference types="cypress" />

describe('Funcionalidade: Cesta de livros com AppActions', () => {
    it('Deve adicionar um livro à cesta com o usuário autenticado por AppAction', () => {
        cy.loginApp(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))

        cy.visit('catalog.html')
        cy.get('#search-input').type('1984')
        cy.contains('#book-list .card', '1984').find('.add-to-cart').click()
        cy.get('#cart-count').should('have.text', '1')

        cy.visit('basket.html')
        cy.get('#cart-list .card-title').should('contain.text', '1984')
        cy.get('#cart-count').should('have.text', '1')
    })
})
