/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<Element>
    logout(): Chainable<Element>
  }
}

describe('Testes de Segurança - Vulnerabilidades', () => {
  describe('Proteção Contra XSS', () => {
    it('deve proteger contra XSS em campos de entrada', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar XSS no campo de nome
      const xssPayload = '<script>alert("XSS")</script>'
      cy.get('[data-testid="product-name"]').type(xssPayload)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se XSS foi bloqueado
      cy.get('[data-testid="product-name"]').should('not.contain', '<script>')
    })

    it('deve proteger contra XSS em campos de texto longo', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar XSS no campo de descrição
      const xssPayload = '<img src="x" onerror="alert(\'XSS\')">'
      cy.get('[data-testid="product-description"]').type(xssPayload)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se XSS foi bloqueado
      cy.get('[data-testid="product-description"]').should('not.contain', '<img')
    })

    it('deve proteger contra XSS em comentários', () => {
      cy.visit('/orders')
      cy.get('[data-testid="add-order-button"]').click()
      
      // Tentar XSS no campo de observações
      const xssPayload = '<iframe src="javascript:alert(\'XSS\')"></iframe>'
      cy.get('[data-testid="order-notes"]').type(xssPayload)
      cy.get('[data-testid="save-order-button"]').click()
      
      // Verificar se XSS foi bloqueado
      cy.get('[data-testid="order-notes"]').should('not.contain', '<iframe')
    })

    it('deve proteger contra XSS em URLs', () => {
      // Tentar XSS via URL
      const xssPayload = '<script>alert("XSS")</script>'
      cy.visit(`/products?search=${encodeURIComponent(xssPayload)}`)
      
      // Verificar se XSS foi bloqueado
      cy.get('body').should('not.contain', '<script>')
    })

    it('deve proteger contra XSS em headers', () => {
      // Tentar XSS via header
      cy.request({
        method: 'GET',
        url: '/products',
        headers: {
          'User-Agent': '<script>alert("XSS")</script>'
        }
      }).then((response) => {
        expect(response.body).to.not.contain('<script>')
      })
    })
  })

  describe('Proteção Contra SQL Injection', () => {
    it('deve proteger contra SQL injection em busca', () => {
      cy.visit('/products')
      
      // Tentar SQL injection no campo de busca
      const sqlInjection = "'; DROP TABLE produtos; --"
      cy.get('[data-testid="search-input"]').type(sqlInjection)
      cy.get('[data-testid="search-button"]').click()
      
      // Verificar se busca funciona normalmente
      cy.get('[data-testid="products-list"]').should('be.visible')
    })

    it('deve proteger contra SQL injection em filtros', () => {
      cy.visit('/orders')
      
      // Tentar SQL injection em filtros
      const sqlInjection = "1' OR '1'='1"
      cy.get('[data-testid="status-filter"]').select(sqlInjection)
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Verificar se filtros funcionam normalmente
      cy.get('[data-testid="orders-list"]').should('be.visible')
    })

    it('deve proteger contra SQL injection em parâmetros de URL', () => {
      // Tentar SQL injection via URL
      const sqlInjection = "'; DROP TABLE orders; --"
      cy.visit(`/orders?search=${encodeURIComponent(sqlInjection)}`)
      
      // Verificar se página carrega normalmente
      cy.get('[data-testid="orders-list"]').should('be.visible')
    })

    it('deve proteger contra SQL injection em formulários', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar SQL injection em campos
      const sqlInjection = "'; DROP TABLE produtos; --"
      cy.get('[data-testid="product-name"]').type(sqlInjection)
      cy.get('[data-testid="product-price"]').type(sqlInjection)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se formulário funciona normalmente
      cy.get('[data-testid="product-name"]').should('be.visible')
    })
  })

  describe('Proteção Contra CSRF', () => {
    it('deve proteger contra CSRF em formulários', () => {
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

    it('deve proteger contra CSRF em requisições AJAX', () => {
      cy.visit('/products')
      
      // Interceptar requisição
      cy.intercept('POST', '/api/products').as('createProduct')
      
      cy.get('[data-testid="add-product-button"]').click()
      cy.get('[data-testid="product-name"]').type('Produto Teste')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se token CSRF foi enviado
      cy.wait('@createProduct').then((interception) => {
        expect(interception.request.headers).to.have.property('x-csrf-token')
      })
    })

    it('deve proteger contra CSRF em requisições de API', () => {
      // Tentar requisição sem token CSRF
      cy.request({
        method: 'POST',
        url: '/api/products',
        body: {
          name: 'Produto Teste',
          price: 10.50
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })
  })

  describe('Proteção Contra Injeção de Código', () => {
    it('deve proteger contra injeção de JavaScript', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar injeção de JavaScript
      const jsInjection = 'javascript:alert("Injection")'
      cy.get('[data-testid="product-name"]').type(jsInjection)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se injeção foi bloqueada
      cy.get('[data-testid="product-name"]').should('not.contain', 'javascript:')
    })

    it('deve proteger contra injeção de HTML', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar injeção de HTML
      const htmlInjection = '<div onclick="alert(\'Injection\')">Click me</div>'
      cy.get('[data-testid="product-description"]').type(htmlInjection)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se injeção foi bloqueada
      cy.get('[data-testid="product-description"]').should('not.contain', '<div onclick')
    })

    it('deve proteger contra injeção de CSS', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar injeção de CSS
      const cssInjection = '<style>body{background:red}</style>'
      cy.get('[data-testid="product-description"]').type(cssInjection)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se injeção foi bloqueada
      cy.get('[data-testid="product-description"]').should('not.contain', '<style>')
    })
  })

  describe('Proteção Contra Ataques de Força Bruta', () => {
    it('deve proteger contra ataques de força bruta em login', () => {
      cy.visit('/login')
      
      // Tentar múltiplas tentativas de login
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="email-input"]').clear().type('test@test.com')
        cy.get('[data-testid="password-input"]').clear().type('wrongpassword')
        cy.get('[data-testid="login-button"]').click()
        
        cy.get('[data-testid="error-message"]').should('be.visible')
        cy.wait(1000) // Aguardar entre tentativas
      }
      
      // Verificar se conta foi bloqueada
      cy.get('[data-testid="error-message"]').should('contain', 'Conta bloqueada')
    })

    it('deve implementar rate limiting', () => {
      cy.visit('/login')
      
      // Fazer múltiplas requisições rapidamente
      cy.intercept('POST', '/auth/login').as('login')
      
      for (let i = 0; i < 20; i++) {
        cy.get('[data-testid="email-input"]').clear().type('test@test.com')
        cy.get('[data-testid="password-input"]').clear().type('password123')
        cy.get('[data-testid="login-button"]').click()
      }
      
      // Verificar se rate limiting foi aplicado
      cy.wait('@login').then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([429, 403])
      })
    })

    it('deve implementar delay entre tentativas', () => {
      cy.visit('/login')
      
      const startTime = Date.now()
      
      cy.get('[data-testid="email-input"]').type('test@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="login-button"]').click()
      
      const endTime = Date.now()
      expect(endTime - startTime).to.be.greaterThan(1000) // Pelo menos 1 segundo de delay
    })
  })

  describe('Proteção Contra Ataques de Timing', () => {
    it('deve proteger contra ataques de timing em login', () => {
      cy.visit('/login')
      
      // Medir tempo para credenciais válidas
      const startTime = Date.now()
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
      const validTime = Date.now() - startTime
      
      // Medir tempo para credenciais inválidas
      cy.logout()
      cy.visit('/login')
      
      const startTimeInvalid = Date.now()
      cy.get('[data-testid="email-input"]').type('invalid@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="error-message"]').should('be.visible')
      const invalidTime = Date.now() - startTimeInvalid
      
      // Verificar se tempos são similares
      expect(Math.abs(validTime - invalidTime)).to.be.lessThan(1000)
    })
  })

  describe('Proteção Contra Ataques de Sessão', () => {
    it('deve proteger contra session hijacking', () => {
      cy.login('farmacia@test.com', 'password123')
      
      // Simular token comprometido
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'compromised-token')
      })
      
      // Tentar fazer requisição
      cy.request({
        method: 'GET',
        url: '/api/orders',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('deve proteger contra session fixation', () => {
      // Obter sessão inicial
      cy.visit('/login')
      cy.window().then((win) => {
        const initialSession = win.localStorage.getItem('sessionId')
        
        // Fazer login
        cy.login('farmacia@test.com', 'password123')
        
        // Verificar se sessão foi renovada
        cy.window().then((win) => {
          const newSession = win.localStorage.getItem('sessionId')
          expect(newSession).to.not.eq(initialSession)
        })
      })
    })

    it('deve invalidar sessão após logout', () => {
      cy.login('farmacia@test.com', 'password123')
      
      // Fazer logout
      cy.logout()
      
      // Tentar fazer requisição
      cy.request({
        method: 'GET',
        url: '/api/orders',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  })

  describe('Proteção Contra Ataques de Rede', () => {
    it('deve proteger contra ataques de man-in-the-middle', () => {
      cy.visit('/dashboard')
      
      // Verificar se conexão é segura
      cy.window().then((win) => {
        expect(win.location.protocol).to.eq('https:')
      })
    })

    it('deve proteger contra ataques de replay', () => {
      cy.visit('/login')
      
      // Interceptar requisição
      cy.intercept('POST', '/auth/login').as('login')
      
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se requisição tem timestamp
      cy.wait('@login').then((interception) => {
        expect(interception.request.body).to.have.property('timestamp')
      })
    })

    it('deve proteger contra ataques de DNS', () => {
      cy.visit('/dashboard')
      
      // Verificar se domínio é válido
      cy.url().should('match', /^https:\/\/localhost:3000/)
    })
  })

  describe('Validação de Entrada', () => {
    it('deve validar todos os inputs', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir dados maliciosos
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        "'; DROP TABLE produtos; --",
        'javascript:alert("Injection")',
        '<img src="x" onerror="alert(\'XSS\')">'
      ]
      
      maliciousInputs.forEach(input => {
        cy.get('[data-testid="product-name"]').clear().type(input)
        cy.get('[data-testid="save-product-button"]').click()
        
        // Verificar se input foi sanitizado
        cy.get('[data-testid="product-name"]').should('not.contain', '<script>')
        cy.get('[data-testid="product-name"]').should('not.contain', 'DROP TABLE')
        cy.get('[data-testid="product-name"]').should('not.contain', 'javascript:')
        cy.get('[data-testid="product-name"]').should('not.contain', '<img')
      })
    })

    it('deve validar comprimento dos inputs', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir dados muito longos
      const longInput = 'a'.repeat(10000)
      cy.get('[data-testid="product-name"]').type(longInput)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se input foi truncado
      cy.get('[data-testid="product-name"]').should('have.length.lessThan', 10000)
    })

    it('deve validar tipos de dados', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir dados de tipo incorreto
      cy.get('[data-testid="product-price"]').type('not-a-number')
      cy.get('[data-testid="product-stock"]').type('not-a-number')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se validação foi aplicada
      cy.get('[data-testid="price-error"]').should('contain', 'Preço deve ser um número')
      cy.get('[data-testid="stock-error"]').should('contain', 'Estoque deve ser um número')
    })
  })
})
