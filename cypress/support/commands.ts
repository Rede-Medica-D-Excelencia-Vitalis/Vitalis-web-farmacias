/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
      checkSecurityHeaders(): Chainable<void>
      checkHTTPS(): Chainable<void>
      checkXSSProtection(): Chainable<void>
      checkSQLInjectionProtection(): Chainable<void>
    }
  }
}

// Comando personalizado para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    // Interceptar TODAS as requisições da API
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        sucesso: true,
        token: 'mock-jwt-token-' + Date.now(),
        usuario: {
          id: 1,
          nome: 'Farmácia Teste',
          email: email,
          tipo_usuario: 'farmacia'
        }
      }
    }).as('loginRequest')

    // Interceptar requisições do dashboard
    cy.intercept('GET', '**/farmacias/estatisticas', {
      statusCode: 200,
      body: { sucesso: true, dados: [] }
    }).as('dashboardStats')
    
    cy.intercept('GET', '**/farmacias/atividades-recentes', {
      statusCode: 200,
      body: { sucesso: true, dados: [] }
    }).as('dashboardActivities')

    // Interceptar requisições de produtos
    cy.intercept('GET', '**/produtos**', {
      statusCode: 200,
      body: { sucesso: true, dados: [] }
    }).as('productsRequest')

    // Interceptar requisições de pedidos
    cy.intercept('GET', '**/pedidos**', {
      statusCode: 200,
      body: { sucesso: true, dados: [] }
    }).as('ordersRequest')

    // Interceptar requisições de usuário atual
    cy.intercept('GET', '**/auth/me', {
      statusCode: 200,
      body: {
        sucesso: true,
        usuario: {
          id: 1,
          nome: 'Farmácia Teste',
          email: email,
          tipo_usuario: 'farmacia'
        }
      }
    }).as('currentUserRequest')

    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type(email)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    
    // Aguardar a requisição de login
    cy.wait('@loginRequest')
    
    // Aguardar redirecionamento e verificar se está no dashboard
    cy.url({ timeout: 10000 }).should('include', '/dashboard')
  })
})

// Comando personalizado para logout
Cypress.Commands.add('logout', () => {
  // Interceptar possíveis requisições de logout
  cy.intercept('POST', '**/auth/logout', {
    statusCode: 200,
    body: { sucesso: true }
  }).as('logoutRequest')

  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
  cy.visit('/login')
  cy.url().should('include', '/login')
})

// Comando para verificar headers de segurança
Cypress.Commands.add('checkSecurityHeaders', () => {
  cy.request({
    method: 'GET',
    url: '/',
    failOnStatusCode: false
  }).then((response) => {
    expect(response.headers).to.have.property('x-content-type-options', 'nosniff')
    expect(response.headers).to.have.property('x-frame-options')
    expect(response.headers).to.have.property('x-xss-protection', '1; mode=block')
  })
})

// Comando para verificar HTTPS
Cypress.Commands.add('checkHTTPS', () => {
  cy.url().should('match', /^https:/)
})

// Comando para verificar proteção XSS
Cypress.Commands.add('checkXSSProtection', () => {
  const xssPayload = '<script>alert("XSS")</script>'
  cy.get('body').should('not.contain', xssPayload)
})

// Comando para verificar proteção SQL Injection
Cypress.Commands.add('checkSQLInjectionProtection', () => {
  const sqlPayload = "'; DROP TABLE users; --"
  cy.get('body').should('not.contain', sqlPayload)
})
