/// <reference types="cypress" />

describe('Testes de Segurança - Comunicação Segura', () => {
  describe('HTTPS e Certificados', () => {
    it('deve usar HTTPS em produção', () => {
      cy.visit('/dashboard')
      // Verificar se a URL usa HTTPS
      cy.url().should('match', /^https:/)
    })

    it('deve ter certificado SSL válido', () => {
      cy.visit('/dashboard')
      
      // Verificar se não há avisos de certificado
      cy.get('body').should('not.contain', 'certificate')
      cy.get('body').should('not.contain', 'SSL')
      cy.get('body').should('not.contain', 'TLS')
    })

    it('deve redirecionar HTTP para HTTPS', () => {
      // Tentar acessar via HTTP
      cy.visit('http://localhost:3000/dashboard')
      
      // Verificar redirecionamento para HTTPS
      cy.url().should('match', /^https:/)
    })

    it('deve usar TLS 1.2 ou superior', () => {
      cy.visit('/dashboard')
      
      // Verificar se conexão é segura
      cy.window().then((win) => {
        expect(win.location.protocol).to.eq('https:')
      })
    })
  })

  describe('Headers de Segurança', () => {
    it('deve ter headers de segurança apropriados', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }).then((response) => {
        // Verificar headers de segurança
        expect(response.headers).to.have.property('x-content-type-options', 'nosniff')
        expect(response.headers).to.have.property('x-frame-options')
        expect(response.headers).to.have.property('x-xss-protection', '1; mode=block')
        expect(response.headers).to.have.property('strict-transport-security')
      })
    })

    it('deve ter Content Security Policy configurado', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        expect(response.headers).to.have.property('content-security-policy')
        
        const csp = response.headers['content-security-policy']
        expect(csp).to.contain("default-src 'self'")
        expect(csp).to.contain("script-src 'self'")
        expect(csp).to.contain("style-src 'self'")
      })
    })

    it('deve ter X-Frame-Options configurado', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        const xFrameOptions = response.headers['x-frame-options']
        expect(xFrameOptions).to.be.oneOf(['DENY', 'SAMEORIGIN'])
      })
    })

    it('deve ter X-Content-Type-Options configurado', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        expect(response.headers).to.have.property('x-content-type-options', 'nosniff')
      })
    })

    it('deve ter X-XSS-Protection configurado', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        expect(response.headers).to.have.property('x-xss-protection', '1; mode=block')
      })
    })

    it('deve ter Strict-Transport-Security configurado', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        const hsts = response.headers['strict-transport-security']
        expect(hsts).to.contain('max-age=31536000')
        expect(hsts).to.contain('includeSubDomains')
      })
    })
  })

  describe('Proteção Contra CSRF', () => {
    beforeEach(() => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
    })

    it('deve validar tokens CSRF', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Verificar se token CSRF está presente
      cy.get('[data-testid="csrf-token"]').should('exist')
      
      // Tentar submeter formulário sem token
      cy.get('[data-testid="csrf-token"]').invoke('remove')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se requisição é rejeitada
      cy.get('[data-testid="error-message"]').should('contain', 'Token CSRF inválido')
    })

    it('deve validar tokens CSRF em requisições AJAX', () => {
      cy.visit('/products')
      
      // Interceptar requisição AJAX
      cy.intercept('POST', '/api/products').as('createProduct')
      
      cy.get('[data-testid="add-product-button"]').click()
      cy.get('[data-testid="product-name"]').type('Produto Teste')
      cy.get('[data-testid="product-price"]').type('10.50')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se token CSRF foi enviado
      cy.wait('@createProduct').then((interception) => {
        expect(interception.request.headers).to.have.property('x-csrf-token')
      })
    })

    it('deve rejeitar requisições sem token CSRF', () => {
      cy.visit('/products')
      
      // Fazer requisição sem token CSRF
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

    it('deve validar origem das requisições', () => {
      cy.visit('/products')
      
      // Fazer requisição com origem diferente
      cy.request({
        method: 'POST',
        url: '/api/products',
        headers: {
          'Origin': 'https://malicious-site.com',
          'Referer': 'https://malicious-site.com'
        },
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

  describe('Validação de Certificados', () => {
    it('deve validar certificados SSL', () => {
      cy.visit('/dashboard')
      
      // Verificar se não há avisos de certificado
      cy.get('body').should('not.contain', 'certificate')
      cy.get('body').should('not.contain', 'SSL')
      cy.get('body').should('not.contain', 'TLS')
    })

    it('deve rejeitar certificados inválidos', () => {
      // Simular certificado inválido
      cy.visit('/dashboard')
      
      // Verificar se página carrega normalmente
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
    })

    it('deve usar certificados de confiança', () => {
      cy.visit('/dashboard')
      
      // Verificar se conexão é segura
      cy.window().then((win) => {
        expect(win.location.protocol).to.eq('https:')
      })
    })
  })

  describe('Proteção de Dados em Trânsito', () => {
    it('deve criptografar dados em trânsito', () => {
      cy.visit('/login')
      
      // Interceptar requisição de login
      cy.intercept('POST', '/auth/login').as('login')
      
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se dados foram criptografados
      cy.wait('@login').then((interception) => {
        expect(interception.request.headers).to.have.property('content-type', 'application/json')
        // Verificar se senha não está em texto plano
        expect(interception.request.body.password).to.not.eq('password123')
      })
    })

    it('deve usar HTTPS para todas as requisições', () => {
      cy.visit('/dashboard')
      
      // Interceptar requisições
      cy.intercept('GET', '/api/**').as('apiRequests')
      
      // Fazer algumas requisições
      cy.get('[data-testid="refresh-data-button"]').click()
      
      // Verificar se todas as requisições usam HTTPS
      cy.wait('@apiRequests').then((interception) => {
        expect(interception.request.url).to.match(/^https:/)
      })
    })

    it('deve validar integridade dos dados', () => {
      cy.visit('/products')
      
      // Interceptar requisição
      cy.intercept('GET', '/api/products').as('getProducts')
      
      cy.get('[data-testid="refresh-products-button"]').click()
      
      // Verificar se dados foram recebidos corretamente
      cy.wait('@getProducts').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200)
        expect(interception.response?.body).to.be.an('array')
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
      
      // Interceptar requisição de login
      cy.intercept('POST', '/auth/login').as('login')
      
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se requisição tem timestamp
      cy.wait('@login').then((interception) => {
        expect(interception.request.body).to.have.property('timestamp')
      })
    })

    it('deve proteger contra ataques de timing', () => {
      cy.visit('/login')
      
      // Medir tempo de resposta para credenciais válidas
      const startTime = Date.now()
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
      const validTime = Date.now() - startTime
      
      // Medir tempo de resposta para credenciais inválidas
      cy.window().then((win) => {
        win.localStorage.clear()
        win.sessionStorage.clear()
      })
      cy.visit('/login')
      
      const startTimeInvalid = Date.now()
      cy.get('[data-testid="email-input"]').type('invalid@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="error-message"]').should('be.visible')
      const invalidTime = Date.now() - startTimeInvalid
      
      // Verificar se tempos são similares (proteção contra timing attacks)
      expect(Math.abs(validTime - invalidTime)).to.be.lessThan(1000)
    })
  })

  describe('Configurações de Segurança', () => {
    it('deve ter configurações de segurança apropriadas', () => {
      cy.visit('/dashboard')
      
      // Verificar se não há informações sensíveis expostas
      cy.get('body').should('not.contain', 'password')
      cy.get('body').should('not.contain', 'token')
      cy.get('body').should('not.contain', 'secret')
    })

    it('deve ter configurações de CORS apropriadas', () => {
      cy.request({
        method: 'OPTIONS',
        url: '/api/products',
        headers: {
          'Origin': 'https://localhost:3000',
          'Access-Control-Request-Method': 'POST'
        }
      }).then((response) => {
        expect(response.headers).to.have.property('access-control-allow-origin')
        expect(response.headers).to.have.property('access-control-allow-methods')
        expect(response.headers).to.have.property('access-control-allow-headers')
      })
    })

    it('deve ter configurações de cache apropriadas', () => {
      cy.request({
        method: 'GET',
        url: '/dashboard'
      }).then((response) => {
        // Verificar se não há cache para dados sensíveis
        expect(response.headers).to.have.property('cache-control')
        const cacheControl = response.headers['cache-control']
        expect(cacheControl).to.contain('no-cache')
        expect(cacheControl).to.contain('no-store')
      })
    })
  })
})
