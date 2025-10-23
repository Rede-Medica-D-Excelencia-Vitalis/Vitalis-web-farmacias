/// <reference types="cypress" />

describe('Testes de Segurança - Conformidade LGPD', () => {
  describe('Proteção de Dados Pessoais', () => {
    it('deve ter política de privacidade acessível', () => {
      cy.visit('/')
      
      // Verificar se link para política de privacidade existe
      cy.get('[data-testid="privacy-policy-link"]').should('exist')
      
      // Clicar no link
      cy.get('[data-testid="privacy-policy-link"]').click()
      
      // Verificar se página carrega
      cy.url().should('include', '/privacy-policy')
      cy.get('[data-testid="privacy-policy-content"]').should('be.visible')
    })

    it('deve ter termos de uso acessíveis', () => {
      cy.visit('/')
      
      // Verificar se link para termos de uso existe
      cy.get('[data-testid="terms-of-use-link"]').should('exist')
      
      // Clicar no link
      cy.get('[data-testid="terms-of-use-link"]').click()
      
      // Verificar se página carrega
      cy.url().should('include', '/terms-of-use')
      cy.get('[data-testid="terms-of-use-content"]').should('be.visible')
    })

    it('deve ter aviso de cookies', () => {
      cy.visit('/')
      
      // Verificar se aviso de cookies existe
      cy.get('[data-testid="cookie-consent"]').should('be.visible')
      
      // Verificar se há opções de consentimento
      cy.get('[data-testid="accept-cookies-button"]').should('exist')
      cy.get('[data-testid="reject-cookies-button"]').should('exist')
    })

    it('deve permitir configuração de cookies', () => {
      cy.visit('/')
      
      // Clicar em configurar cookies
      cy.get('[data-testid="configure-cookies-button"]').click()
      
      // Verificar se modal de configuração abre
      cy.get('[data-testid="cookie-settings-modal"]').should('be.visible')
      
      // Verificar se há opções para diferentes tipos de cookies
      cy.get('[data-testid="essential-cookies-toggle"]').should('exist')
      cy.get('[data-testid="analytics-cookies-toggle"]').should('exist')
      cy.get('[data-testid="marketing-cookies-toggle"]').should('exist')
    })
  })

  describe('Consentimento e Autorização', () => {
    it('deve solicitar consentimento para coleta de dados', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Verificar se há solicitação de consentimento
      cy.get('[data-testid="data-consent-checkbox"]').should('exist')
      cy.get('[data-testid="data-consent-text"]').should('contain', 'LGPD')
      
      // Tentar salvar sem consentimento
      cy.get('[data-testid="patient-name"]').type('João Silva')
      cy.get('[data-testid="patient-cpf"]').type('12345678901')
      cy.get('[data-testid="save-patient-button"]').click()
      
      // Verificar se erro é exibido
      cy.get('[data-testid="consent-error"]').should('contain', 'Consentimento obrigatório')
    })

    it('deve permitir exclusão de dados pessoais', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se opção de exclusão existe
      cy.get('[data-testid="delete-account-button"]').should('exist')
      
      // Clicar em excluir conta
      cy.get('[data-testid="delete-account-button"]').click()
      
      // Verificar confirmação
      cy.get('[data-testid="delete-confirmation"]').should('be.visible')
      cy.get('[data-testid="delete-confirmation-text"]').should('contain', 'LGPD')
    })

    it('deve permitir portabilidade de dados', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se opção de exportação existe
      cy.get('[data-testid="export-data-button"]').should('exist')
      
      // Clicar em exportar dados
      cy.get('[data-testid="export-data-button"]').click()
      
      // Verificar se download é iniciado
      cy.get('[data-testid="export-success"]').should('be.visible')
    })

    it('deve permitir retificação de dados', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se dados podem ser editados
      cy.get('[data-testid="edit-profile-button"]').should('exist')
      
      // Clicar em editar
      cy.get('[data-testid="edit-profile-button"]').click()
      
      // Verificar se formulário de edição abre
      cy.get('[data-testid="profile-edit-form"]').should('be.visible')
    })
  })

  describe('Transparência e Informação', () => {
    it('deve informar sobre coleta de dados', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Verificar se há informações sobre coleta de dados
      cy.get('[data-testid="data-collection-info"]').should('be.visible')
      cy.get('[data-testid="data-collection-info"]').should('contain', 'coletamos')
      cy.get('[data-testid="data-collection-info"]').should('contain', 'finalidade')
    })

    it('deve informar sobre compartilhamento de dados', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Verificar se há informações sobre compartilhamento
      cy.get('[data-testid="data-sharing-info"]').should('be.visible')
      cy.get('[data-testid="data-sharing-info"]').should('contain', 'compartilhamento')
    })

    it('deve informar sobre retenção de dados', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Verificar se há informações sobre retenção
      cy.get('[data-testid="data-retention-info"]').should('be.visible')
      cy.get('[data-testid="data-retention-info"]').should('contain', 'retenção')
      cy.get('[data-testid="data-retention-info"]').should('contain', 'tempo')
    })

    it('deve informar sobre direitos do titular', () => {
      cy.visit('/privacy-policy')
      
      // Verificar se há informações sobre direitos
      cy.get('[data-testid="data-subject-rights"]').should('be.visible')
      cy.get('[data-testid="data-subject-rights"]').should('contain', 'direitos')
      cy.get('[data-testid="data-subject-rights"]').should('contain', 'acesso')
      cy.get('[data-testid="data-subject-rights"]').should('contain', 'exclusão')
    })
  })

  describe('Segurança e Proteção', () => {
    it('deve implementar medidas de segurança', () => {
      cy.visit('/privacy-policy')
      
      // Verificar se há informações sobre medidas de segurança
      cy.get('[data-testid="security-measures"]').should('be.visible')
      cy.get('[data-testid="security-measures"]').should('contain', 'segurança')
      cy.get('[data-testid="security-measures"]').should('contain', 'criptografia')
    })

    it('deve ter política de retenção de dados', () => {
      cy.visit('/privacy-policy')
      
      // Verificar se há política de retenção
      cy.get('[data-testid="retention-policy"]').should('be.visible')
      cy.get('[data-testid="retention-policy"]').should('contain', 'retenção')
      cy.get('[data-testid="retention-policy"]').should('contain', 'período')
    })

    it('deve ter procedimentos para violação de dados', () => {
      cy.visit('/privacy-policy')
      
      // Verificar se há procedimentos para violação
      cy.get('[data-testid="data-breach-procedures"]').should('be.visible')
      cy.get('[data-testid="data-breach-procedures"]').should('contain', 'violação')
      cy.get('[data-testid="data-breach-procedures"]').should('contain', 'notificação')
    })
  })

  describe('Exercício de Direitos', () => {
    it('deve permitir acesso aos dados pessoais', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se dados pessoais são exibidos
      cy.get('[data-testid="personal-data"]').should('be.visible')
      cy.get('[data-testid="personal-data"]').should('contain', 'nome')
      cy.get('[data-testid="personal-data"]').should('contain', 'email')
    })

    it('deve permitir correção de dados incorretos', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Clicar em editar dados
      cy.get('[data-testid="edit-profile-button"]').click()
      
      // Verificar se dados podem ser editados
      cy.get('[data-testid="profile-edit-form"]').should('be.visible')
      cy.get('[data-testid="name-input"]').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
    })

    it('deve permitir anonimização de dados', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se opção de anonimização existe
      cy.get('[data-testid="anonymize-data-button"]').should('exist')
      
      // Clicar em anonimizar
      cy.get('[data-testid="anonymize-data-button"]').click()
      
      // Verificar confirmação
      cy.get('[data-testid="anonymize-confirmation"]').should('be.visible')
    })

    it('deve permitir portabilidade de dados', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se opção de portabilidade existe
      cy.get('[data-testid="data-portability-button"]').should('exist')
      
      // Clicar em portabilidade
      cy.get('[data-testid="data-portability-button"]').click()
      
      // Verificar se download é iniciado
      cy.get('[data-testid="portability-success"]').should('be.visible')
    })
  })

  describe('Conformidade e Auditoria', () => {
    it('deve ter registro de consentimentos', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Marcar consentimento
      cy.get('[data-testid="data-consent-checkbox"]').check()
      cy.get('[data-testid="patient-name"]').type('João Silva')
      cy.get('[data-testid="patient-cpf"]').type('12345678901')
      cy.get('[data-testid="save-patient-button"]').click()
      
      // Verificar se consentimento foi registrado
      cy.get('[data-testid="consent-registered"]').should('be.visible')
    })

    it('deve ter log de acessos aos dados', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/patients')
      
      // Verificar se há log de acessos
      cy.get('[data-testid="access-log"]').should('exist')
      cy.get('[data-testid="access-log"]').should('contain', 'acesso')
      cy.get('[data-testid="access-log"]').should('contain', 'data')
    })

    it('deve ter procedimentos para exercício de direitos', () => {
      cy.visit('/privacy-policy')
      
      // Verificar se há procedimentos
      cy.get('[data-testid="rights-procedures"]').should('be.visible')
      cy.get('[data-testid="rights-procedures"]').should('contain', 'procedimento')
      cy.get('[data-testid="rights-procedures"]').should('contain', 'exercício')
    })

    it('deve ter contato para questões de privacidade', () => {
      cy.visit('/privacy-policy')
      
      // Verificar se há contato
      cy.get('[data-testid="privacy-contact"]').should('be.visible')
      cy.get('[data-testid="privacy-contact"]').should('contain', 'contato')
      cy.get('[data-testid="privacy-contact"]').should('contain', 'privacidade')
    })
  })

  describe('Validação de Conformidade', () => {
    it('deve validar conformidade com LGPD', () => {
      cy.visit('/')
      
      // Verificar elementos de conformidade
      cy.get('[data-testid="privacy-policy"]').should('exist')
      cy.get('[data-testid="cookie-consent"]').should('exist')
      cy.get('[data-testid="data-protection"]').should('exist')
    })

    it('deve ter avisos de LGPD em formulários', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Verificar se há avisos de LGPD
      cy.get('[data-testid="lgpd-warning"]').should('be.visible')
      cy.get('[data-testid="lgpd-warning"]').should('contain', 'LGPD')
    })

    it('deve ter consentimento específico para cada finalidade', () => {
      cy.visit('/patients')
      cy.get('[data-testid="add-patient-button"]').click()
      
      // Verificar se há consentimentos específicos
      cy.get('[data-testid="consent-treatment"]').should('exist')
      cy.get('[data-testid="consent-marketing"]').should('exist')
      cy.get('[data-testid="consent-analytics"]').should('exist')
    })

    it('deve permitir retirada de consentimento', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('farmacia@test.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="login-button"]').click()
      cy.visit('/profile')
      
      // Verificar se opção de retirada existe
      cy.get('[data-testid="withdraw-consent-button"]').should('exist')
      
      // Clicar em retirar consentimento
      cy.get('[data-testid="withdraw-consent-button"]').click()
      
      // Verificar confirmação
      cy.get('[data-testid="withdraw-confirmation"]').should('be.visible')
    })
  })
})
