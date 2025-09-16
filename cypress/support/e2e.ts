// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Interceptar todas as requisições da API para evitar erros de conexão
beforeEach(() => {
  // Interceptar requisições de autenticação
  cy.intercept('POST', '**/auth/login', (req) => {
    const { email, senha } = req.body
    
    // Simular diferentes cenários baseados nas credenciais
    if (email === 'farmacia@test.com' && senha === 'password123') {
      req.reply({
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
      })
    } else {
      req.reply({
        statusCode: 401,
        body: { sucesso: false, erro: 'Email ou senha incorretos' }
      })
    }
  }).as('loginRequest')

  // Interceptar requisições de usuário atual
  cy.intercept('GET', '**/auth/me', {
    statusCode: 200,
    body: {
      sucesso: true,
      usuario: {
        id: 1,
        nome: 'Farmácia Teste',
        email: 'farmacia@test.com',
        tipo_usuario: 'farmacia'
      }
    }
  }).as('currentUserRequest')

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

  // Interceptar requisições de categorias
  cy.intercept('GET', '**/categorias**', {
    statusCode: 200,
    body: { sucesso: true, dados: [] }
  }).as('categoriesRequest')

  // Interceptar requisições de farmácias
  cy.intercept('GET', '**/farmacias**', {
    statusCode: 200,
    body: { sucesso: true, dados: [] }
  }).as('pharmaciesRequest')

  // Interceptar requisições de pacientes
  cy.intercept('GET', '**/pacientes**', {
    statusCode: 200,
    body: { sucesso: true, dados: [] }
  }).as('patientsRequest')

  // Interceptar requisições de médicos
  cy.intercept('GET', '**/medicos**', {
    statusCode: 200,
    body: { sucesso: true, dados: [] }
  }).as('doctorsRequest')

  // Interceptar requisições de relatórios
  cy.intercept('GET', '**/relatorios**', {
    statusCode: 200,
    body: { sucesso: true, dados: [] }
  }).as('reportsRequest')

  // Interceptar requisições de configurações
  cy.intercept('GET', '**/configuracoes**', {
    statusCode: 200,
    body: { sucesso: true, dados: {} }
  }).as('settingsRequest')

  // Interceptar requisições de logout
  cy.intercept('POST', '**/auth/logout', {
    statusCode: 200,
    body: { sucesso: true }
  }).as('logoutRequest')

  // Interceptar requisições de refresh token
  cy.intercept('POST', '**/auth/refresh', {
    statusCode: 200,
    body: { token: 'new-mock-token-' + Date.now() }
  }).as('refreshTokenRequest')
})

// Configurações de segurança
Cypress.on('uncaught:exception', (err, runnable) => {
  // Não falhar o teste em erros de segurança esperados
  if (err.message.includes('SecurityError') || 
      err.message.includes('CSP') ||
      err.message.includes('XSS')) {
    return false
  }
  return true
})

// Configurações de segurança para requisições
Cypress.on('window:before:load', (win) => {
  // Configurar headers de segurança
  win.fetch = new Proxy(win.fetch, {
    apply(target, thisArg, args) {
      const [url, options = {}] = args
      const secureOptions = {
        ...options,
        headers: {
          ...options.headers,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
      return target.apply(thisArg, [url, secureOptions])
    }
  })
})
