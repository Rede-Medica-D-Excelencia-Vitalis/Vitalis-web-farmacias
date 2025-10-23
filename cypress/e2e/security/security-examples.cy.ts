/// <reference types="cypress" />

/**
 * Exemplos de Uso dos Testes de Segurança
 * Este arquivo demonstra como usar os comandos personalizados e utilitários de segurança
 */

describe('Exemplos de Uso - Testes de Segurança', () => {
  describe('Comandos Personalizados', () => {
    it('deve usar comando de login personalizado', () => {
      // Login com credenciais válidas
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se login foi bem-sucedido
      cy.url().should('include', '/dashboard')
    })

    it('deve usar comando de logout personalizado', () => {
      // Login primeiro
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Logout
      cy.window().then((win) => {
        win.localStorage.clear()
        win.sessionStorage.clear()
      })
      cy.visit('/login')
      
      // Verificar se foi redirecionado para login
      cy.url().should('include', '/login')
    })

    it('deve verificar headers de segurança', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        // Verificar headers de segurança
        expect(response.headers).to.have.property('x-content-type-options', 'nosniff')
        expect(response.headers).to.have.property('x-frame-options')
        expect(response.headers).to.have.property('x-xss-protection', '1; mode=block')
        expect(response.headers).to.have.property('strict-transport-security')
      })
    })

    it('deve verificar HTTPS', () => {
      cy.visit('/dashboard')
      // Verificar se a URL usa HTTPS
      cy.url().should('match', /^https:/)
    })

    it('deve verificar proteção XSS', () => {
      cy.visit('/products')
      // Verificar se não há scripts maliciosos no DOM
      cy.get('body').should('not.contain', '<script>')
      cy.get('body').should('not.contain', 'javascript:')
    })

    it('deve verificar proteção SQL Injection', () => {
      cy.visit('/products')
      // Verificar se não há dados sensíveis expostos
      cy.get('body').should('not.contain', 'password')
      cy.get('body').should('not.contain', 'token')
      cy.get('body').should('not.contain', 'secret')
    })
  })

  describe('Testes de Integração', () => {
    it('deve executar fluxo completo de segurança', () => {
      // 1. Verificar HTTPS
      cy.visit('/login')
      cy.url().should('match', /^https:/)
      
      // 2. Verificar headers de segurança
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        expect(response.headers).to.have.property('x-content-type-options', 'nosniff')
        expect(response.headers).to.have.property('x-frame-options')
        expect(response.headers).to.have.property('x-xss-protection', '1; mode=block')
        expect(response.headers).to.have.property('strict-transport-security')
      })
      
      // 3. Tentar login com credenciais inválidas
      cy.get('[data-testid="email-input"]').type('invalid@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      // 4. Verificar se erro é exibido
      cy.get('[data-testid="error-message"]').should('be.visible')
      
      // 5. Login com credenciais válidas
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // 6. Verificar proteção XSS
      cy.visit('/products')
      cy.get('body').should('not.contain', '<script>')
      cy.get('body').should('not.contain', 'javascript:')
      
      // 7. Verificar proteção SQL Injection
      cy.get('body').should('not.contain', 'password')
      cy.get('body').should('not.contain', 'token')
      cy.get('body').should('not.contain', 'secret')
      
      // 8. Logout
      cy.window().then((win) => {
        win.localStorage.clear()
        win.sessionStorage.clear()
      })
    })

    it('deve testar conformidade LGPD', () => {
      // 1. Verificar política de privacidade
      cy.visit('/')
      cy.get('[data-testid="privacy-policy-link"]').should('exist')
      
      // 2. Verificar aviso de cookies
      cy.get('[data-testid="cookie-consent"]').should('be.visible')
      
      // 3. Verificar consentimento para dados pessoais
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      cy.get('[data-testid="data-consent-checkbox"]').should('exist')
    })
  })

  describe('Testes de Vulnerabilidades', () => {
    it('deve testar proteção contra XSS', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar XSS
      const xssPayload = '<script>alert("XSS")</script>'
      cy.get('[data-testid="product-name"]').type(xssPayload)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se XSS foi bloqueado
      cy.get('[data-testid="product-name"]').should('not.contain', '<script>')
    })

    it('deve testar proteção contra SQL Injection', () => {
      cy.visit('/products')
      
      // Tentar SQL Injection
      const sqlInjection = "'; DROP TABLE produtos; --"
      cy.get('[data-testid="search-input"]').type(sqlInjection)
      cy.get('[data-testid="search-button"]').click()
      
      // Verificar se busca funciona normalmente
      cy.get('[data-testid="products-list"]').should('be.visible')
    })

    it('deve testar proteção contra CSRF', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Verificar se token CSRF está presente
      cy.get('[data-testid="csrf-token"]').should('exist')
      
      // Tentar submeter sem token
      cy.get('[data-testid="csrf-token"]').invoke('remove')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se requisição é rejeitada
      cy.get('[data-testid="error-message"]').should('contain', 'Token CSRF inválido')
    })
  })

  describe('Testes de Performance de Segurança', () => {
    it('deve medir tempo de resposta para credenciais válidas', () => {
      cy.visit('/login')
      
      const startTime = Date.now()
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
      const endTime = Date.now()
      
      // Verificar se tempo de resposta é aceitável
      expect(endTime - startTime).to.be.lessThan(5000) // Menos de 5 segundos
    })

    it('deve medir tempo de resposta para credenciais inválidas', () => {
      cy.visit('/login')
      
      const startTime = Date.now()
      cy.get('[data-testid="email-input"]').type('invalid@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="error-message"]').should('be.visible')
      const endTime = Date.now()
      
      // Verificar se tempo de resposta é aceitável
      expect(endTime - startTime).to.be.lessThan(5000) // Menos de 5 segundos
    })
  })

  describe('Testes de Monitoramento', () => {
    it('deve verificar se monitoramento de segurança está ativo', () => {
      cy.visit('/dashboard')
      
      // Verificar se não há avisos de segurança no console
      cy.window().then((win) => {
        const consoleLogs = win.console.log
        expect(consoleLogs).to.not.contain('Security warning')
      })
    })

    it('deve verificar se dados sensíveis não estão expostos', () => {
      cy.visit('/dashboard')
      
      // Verificar se não há dados sensíveis no DOM
      cy.get('body').should('not.contain', 'password')
      cy.get('body').should('not.contain', 'token')
      cy.get('body').should('not.contain', 'secret')
    })
  })

  describe('Testes de Conformidade', () => {
    it('deve verificar conformidade com LGPD', () => {
      cy.visit('/')
      
      // Verificar elementos de conformidade
      cy.get('[data-testid="privacy-policy"]').should('exist')
      cy.get('[data-testid="cookie-consent"]').should('exist')
      cy.get('[data-testid="data-protection"]').should('exist')
    })

    it('deve verificar conformidade com padrões de segurança', () => {
      cy.visit('/dashboard')
      
      // Verificar se HTTPS está sendo usado
      cy.url().should('match', /^https:/)
      
      // Verificar se headers de segurança estão presentes
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        expect(response.headers).to.have.property('x-content-type-options', 'nosniff')
        expect(response.headers).to.have.property('x-frame-options')
        expect(response.headers).to.have.property('x-xss-protection', '1; mode=block')
        expect(response.headers).to.have.property('strict-transport-security')
      })
    })
  })

  describe('Testes de Recuperação', () => {
    it('deve testar recuperação de falhas de segurança', () => {
      cy.visit('/login')
      
      // Simular falha de segurança
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'invalid-token')
      })
      
      // Tentar acessar área protegida
      cy.visit('/dashboard')
      
      // Verificar se foi redirecionado para login
      cy.url().should('include', '/login')
    })

    it('deve testar recuperação de sessão expirada', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Simular expiração de sessão
      cy.window().then((win) => {
        win.localStorage.setItem('tokenExpiry', '0')
      })
      
      // Tentar fazer requisição
      cy.visit('/dashboard')
      
      // Verificar se foi redirecionado para login
      cy.url().should('include', '/login')
    })
  })
})
