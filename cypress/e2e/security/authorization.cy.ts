/// <reference types="cypress" />

describe('Testes de Segurança - Autorização', () => {
  describe('Controle de Acesso', () => {
    it('deve bloquear acesso não autorizado a rotas protegidas', () => {
      // Tentar acessar rota protegida sem autenticação
      cy.visit('/dashboard')
      
      // Verificar redirecionamento para login
      cy.url().should('include', '/login')
    })

    it('deve validar permissões de usuário', () => {
      // Login como usuário sem permissão
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('user@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Tentar acessar área restrita
      cy.visit('/admin')
      
      // Verificar se acesso é negado
      cy.get('[data-testid="access-denied"]').should('be.visible')
    })

    it('deve permitir acesso apenas para usuários autorizados', () => {
      // Login como farmácia
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Acessar dashboard
      cy.visit('/dashboard')
      
      // Verificar se acesso é permitido
      cy.url().should('include', '/dashboard')
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
    })

    it('deve bloquear acesso a APIs não autorizadas', () => {
      // Tentar acessar API sem token
      cy.request({
        method: 'GET',
        url: '/api/orders',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('deve validar token em requisições', () => {
      // Login válido
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Fazer requisição com token válido
      cy.request({
        method: 'GET',
        url: '/api/orders',
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  describe('Controle de Acesso Baseado em Roles', () => {
    it('deve permitir acesso de farmácia a funcionalidades de farmácia', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Acessar funcionalidades de farmácia
      cy.visit('/products')
      cy.get('[data-testid="products-list"]').should('be.visible')
      
      cy.visit('/orders')
      cy.get('[data-testid="orders-list"]').should('be.visible')
    })

    it('deve bloquear acesso de farmácia a funcionalidades administrativas', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Tentar acessar funcionalidades administrativas
      cy.visit('/admin/users')
      cy.get('[data-testid="access-denied"]').should('be.visible')
      
      cy.visit('/admin/settings')
      cy.get('[data-testid="access-denied"]').should('be.visible')
    })

    it('deve permitir acesso de admin a todas as funcionalidades', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('admin@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Acessar funcionalidades administrativas
      cy.visit('/admin/users')
      cy.get('[data-testid="admin-users"]').should('be.visible')
      
      cy.visit('/admin/settings')
      cy.get('[data-testid="admin-settings"]').should('be.visible')
    })

    it('deve validar permissões em tempo real', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Simular mudança de permissões
      cy.window().then((win) => {
        const userData = JSON.parse(win.localStorage.getItem('user') || '{}')
        userData.role = 'user'
        win.localStorage.setItem('user', JSON.stringify(userData))
      })
      
      // Tentar acessar funcionalidade restrita
      cy.visit('/products')
      cy.get('[data-testid="access-denied"]').should('be.visible')
    })
  })

  describe('Proteção de Recursos', () => {
    it('deve proteger dados de outros usuários', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia1@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Tentar acessar dados de outra farmácia
      cy.request({
        method: 'GET',
        url: '/api/orders?farmaciaId=2',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })

    it('deve validar propriedade de recursos', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia1@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Tentar editar pedido de outra farmácia
      cy.request({
        method: 'PUT',
        url: '/api/orders/999',
        body: { status: 'cancelled' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })

    it('deve proteger endpoints sensíveis', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Tentar acessar endpoints sensíveis
      const sensitiveEndpoints = [
        '/api/admin/users',
        '/api/admin/settings',
        '/api/admin/logs',
        '/api/admin/backup'
      ]
      
      sensitiveEndpoints.forEach(endpoint => {
        cy.request({
          method: 'GET',
          url: endpoint,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(403)
        })
      })
    })
  })

  describe('Validação de Sessão', () => {
    it('deve invalidar sessão após logout', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Fazer logout - limpar localStorage
      cy.window().then((win) => {
        win.localStorage.clear()
        win.sessionStorage.clear()
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

    it('deve invalidar sessão após mudança de senha', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Simular mudança de senha
      cy.window().then((win) => {
        win.localStorage.removeItem('authToken')
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

    it('deve renovar sessão automaticamente', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Simular token próximo do vencimento
      cy.window().then((win) => {
        const tokenData = {
          token: 'valid-token',
          expiry: Date.now() + 300000 // 5 minutos
        }
        win.localStorage.setItem('authToken', JSON.stringify(tokenData))
      })
      
      // Fazer requisição que deve renovar token
      cy.request({
        method: 'GET',
        url: '/api/orders'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  describe('Proteção Contra Ataques', () => {
    it('deve proteger contra token hijacking', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
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

    it('deve validar origem das requisições', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      
      // Tentar fazer requisição de origem diferente
      cy.request({
        method: 'GET',
        url: '/api/orders',
        headers: {
          'Origin': 'https://malicious-site.com',
          'Referer': 'https://malicious-site.com'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })

    it('deve proteger contra session fixation', () => {
      // Obter sessão inicial
      cy.visit('/login')
      cy.window().then((win) => {
        const initialSession = win.localStorage.getItem('sessionId')
        
        // Fazer login
        cy.get('[data-testid="email-input"]').type('farmacia@test.com')
        cy.get('[data-testid="password-input"]').type('password123')
        cy.get('[data-testid="login-button"]').click()
        
        // Verificar se sessão foi renovada
        cy.window().then((win) => {
          const newSession = win.localStorage.getItem('sessionId')
          expect(newSession).to.not.eq(initialSession)
        })
      })
    })
  })
})
