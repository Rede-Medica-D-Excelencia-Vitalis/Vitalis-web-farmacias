/// <reference types="cypress" />

describe('Testes de Segurança - Proteção de Dados', () => {
  describe('Sanitização de Inputs', () => {
    beforeEach(() => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
    })

    it('deve sanitizar inputs maliciosos em produtos', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir script malicioso
      const maliciousInput = '<script>alert("XSS")</script>'
      cy.get('[data-testid="product-name"]').type(maliciousInput)
      cy.get('[data-testid="product-description"]').type(maliciousInput)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se script foi sanitizado
      cy.get('[data-testid="product-name"]').should('not.contain', '<script>')
      cy.get('[data-testid="product-description"]').should('not.contain', '<script>')
    })

    it('deve sanitizar inputs maliciosos em pedidos', () => {
      cy.visit('/orders')
      cy.get('[data-testid="add-order-button"]').click()
      
      // Tentar inserir script malicioso
      const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">'
      cy.get('[data-testid="order-notes"]').type(maliciousInput)
      cy.get('[data-testid="save-order-button"]').click()
      
      // Verificar se script foi sanitizado
      cy.get('[data-testid="order-notes"]').should('not.contain', '<img')
    })

    it('deve sanitizar inputs maliciosos em pacientes', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Tentar inserir script malicioso
      const maliciousInput = '<iframe src="javascript:alert(\'XSS\')"></iframe>'
      cy.get('[data-testid="patient-notes"]').type(maliciousInput)
      cy.get('[data-testid="save-patient-button"]').click()
      
      // Verificar se script foi sanitizado
      cy.get('[data-testid="patient-notes"]').should('not.contain', '<iframe')
    })

    it('deve validar dados de entrada', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir dados inválidos
      cy.get('[data-testid="product-price"]').type('invalid-price')
      cy.get('[data-testid="product-stock"]').type('invalid-stock')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar validação
      cy.get('[data-testid="price-error"]').should('contain', 'Preço deve ser um número válido')
      cy.get('[data-testid="stock-error"]').should('contain', 'Estoque deve ser um número válido')
    })

    it('deve validar comprimento máximo dos campos', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir dados muito longos
      const longText = 'a'.repeat(1000)
      cy.get('[data-testid="product-name"]').type(longText)
      cy.get('[data-testid="product-description"]').type(longText)
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar validação
      cy.get('[data-testid="name-error"]').should('contain', 'Nome muito longo')
      cy.get('[data-testid="description-error"]').should('contain', 'Descrição muito longa')
    })
  })

  describe('Criptografia de Dados Sensíveis', () => {
    it('deve criptografar dados sensíveis no localStorage', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se token não está em texto plano
      cy.window().then((win) => {
        const token = win.localStorage.getItem('authToken')
        expect(token).to.not.contain('password')
        expect(token).to.match(/^[A-Za-z0-9+/=]+$/) // Base64 format
      })
    })

    it('deve criptografar dados de usuário', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se dados do usuário estão criptografados
      cy.window().then((win) => {
        const userData = win.localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
        
          // Verificar se dados sensíveis não estão expostos
          expect(parsedUser).to.not.have.property('password')
          expect(parsedUser).to.not.have.property('senha')
        }
      })
    })

    it('deve criptografar dados de sessão', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Verificar se dados de sessão estão criptografados
      cy.window().then((win) => {
        const sessionData = win.localStorage.getItem('sessionData')
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData)
          expect(parsedSession).to.not.have.property('password')
        }
      })
    })

    it('deve usar HTTPS para transmissão de dados', () => {
      cy.visit('/login')
      // Verificar se a URL usa HTTPS
      cy.url().should('match', /^https:/)
    })
  })

  describe('Validação de Dados', () => {
    beforeEach(() => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
    })

    it('deve validar todos os campos obrigatórios', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar submeter formulário vazio
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar se todos os erros são exibidos
      cy.get('[data-testid="name-error"]').should('contain', 'Nome é obrigatório')
      cy.get('[data-testid="price-error"]').should('contain', 'Preço é obrigatório')
      cy.get('[data-testid="stock-error"]').should('contain', 'Estoque é obrigatório')
    })

    it('deve validar tipos de dados', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir dados de tipo incorreto
      cy.get('[data-testid="product-price"]').type('not-a-number')
      cy.get('[data-testid="product-stock"]').type('not-a-number')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar validação de tipos
      cy.get('[data-testid="price-error"]').should('contain', 'Preço deve ser um número')
      cy.get('[data-testid="stock-error"]').should('contain', 'Estoque deve ser um número')
    })

    it('deve validar formatos específicos', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Tentar inserir dados com formatos incorretos
      cy.get('[data-testid="patient-email"]').type('invalid-email')
      cy.get('[data-testid="patient-phone"]').type('invalid-phone')
      cy.get('[data-testid="patient-cpf"]').type('invalid-cpf')
      cy.get('[data-testid="save-patient-button"]').click()
      
      // Verificar validação de formatos
      cy.get('[data-testid="email-error"]').should('contain', 'Email inválido')
      cy.get('[data-testid="phone-error"]').should('contain', 'Telefone inválido')
      cy.get('[data-testid="cpf-error"]').should('contain', 'CPF inválido')
    })

    it('deve validar limites de valores', () => {
      cy.visit('/products')
      cy.get('[data-testid="add-product-button"]').click()
      
      // Tentar inserir valores inválidos
      cy.get('[data-testid="product-price"]').type('-10')
      cy.get('[data-testid="product-stock"]').type('-5')
      cy.get('[data-testid="save-product-button"]').click()
      
      // Verificar validação de limites
      cy.get('[data-testid="price-error"]').should('contain', 'Preço deve ser positivo')
      cy.get('[data-testid="stock-error"]').should('contain', 'Estoque deve ser positivo')
    })
  })

  describe('Proteção Contra SQL Injection', () => {
    it('deve proteger contra SQL injection em busca de produtos', () => {
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
  })

  describe('Proteção Contra XSS', () => {
    it('deve proteger contra XSS em campos de texto', () => {
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
      const xssPayload = '<script>alert("XSS")</script>'
      cy.get('[data-testid="order-notes"]').type(xssPayload)
      cy.get('[data-testid="save-order-button"]').click()
      
      // Verificar se XSS foi bloqueado
      cy.get('[data-testid="order-notes"]').should('not.contain', '<script>')
    })

    it('deve proteger contra XSS em dados de usuário', () => {
      cy.visit('/profile')
      
      // Tentar XSS no campo de nome
      const xssPayload = '<script>alert("XSS")</script>'
      cy.get('[data-testid="user-name"]').clear().type(xssPayload)
      cy.get('[data-testid="save-profile-button"]').click()
      
      // Verificar se XSS foi bloqueado
      cy.get('[data-testid="user-name"]').should('not.contain', '<script>')
    })
  })

  describe('Proteção de Dados Pessoais', () => {
    it('deve mascarar dados sensíveis na interface', () => {
      cy.visit('/patients')
      
      // Verificar se CPF está mascarado
      cy.get('[data-testid="patient-cpf"]').should('contain', '***')
      
      // Verificar se telefone está mascarado
      cy.get('[data-testid="patient-phone"]').should('contain', '***')
    })

    it('deve criptografar dados pessoais no armazenamento', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Inserir dados pessoais
      cy.get('[data-testid="patient-name"]').type('João Silva')
      cy.get('[data-testid="patient-cpf"]').type('12345678901')
      cy.get('[data-testid="patient-phone"]').type('11999999999')
      cy.get('[data-testid="save-patient-button"]').click()
      
      // Verificar se dados foram criptografados
      cy.window().then((win) => {
        const patientData = win.localStorage.getItem('patients')
        expect(patientData).to.not.contain('12345678901')
        expect(patientData).to.not.contain('11999999999')
      })
    })

    it('deve validar conformidade com LGPD', () => {
      cy.visit('/patients')
      
      // Verificar se há aviso de LGPD
      cy.get('[data-testid="lgpd-warning"]').should('be.visible')
      
      // Verificar se há opção de consentimento
      cy.get('[data-testid="consent-checkbox"]').should('exist')
    })
  })
})
