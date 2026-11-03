/// <reference types="cypress" />

describe('Funcionalidade: Catálogo de livros com Intercept', () => {
    it('Deve buscar um livro e exibir o resultado simulado', () => {
        cy.fixture('catalogo').then((catalogo) => {
            cy.intercept({
                method: 'GET',
                pathname: '/api/books',
                query: { search: '1984' }
            }, {
                statusCode: 200,
                body: catalogo
            }).as('buscarLivro')

            cy.visit('catalog.html')
            cy.get('#search-input').type('1984')
            cy.wait('@buscarLivro').its('response.statusCode').should('eq', 200)
            cy.get('#book-list .card').should('have.length', 1)
            cy.get('#book-list .card-title').should('contain.text', catalogo.books[0].title)
            cy.get('#book-list .card').should('contain.text', catalogo.books[0].author)
        })
    })

    it('Deve exibir uma mensagem quando o catálogo falhar ao carregar', () => {
        // O parâmetro page identifica a listagem, sem afetar a carga dos filtros.
        cy.intercept({
            method: 'GET',
            pathname: '/api/books',
            query: { page: '1' }
        }, {
            statusCode: 500,
            body: { message: 'Erro ao buscar livros.' }
        }).as('erroCatalogo')

        cy.visit('catalog.html')
        cy.wait('@erroCatalogo').its('response.statusCode').should('eq', 500)
        cy.get('#global-alert-container').should('be.visible')
            .and('contain.text', 'Erro ao carregar livros. Tente novamente.')
        cy.get('#book-list .card').should('not.exist')
    })
})
