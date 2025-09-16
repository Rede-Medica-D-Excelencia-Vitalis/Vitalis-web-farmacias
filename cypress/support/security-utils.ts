/**
 * Utilitários de Segurança para Cypress
 * Funções auxiliares para testes de segurança
 */

import { securityHeaders, lgpdElements } from '../fixtures/security-test-data.json'

/**
 * Verifica se headers de segurança estão presentes
 */
export function checkSecurityHeaders(response: any): void {
  const requiredHeaders = securityHeaders.required
  
  requiredHeaders.forEach(header => {
    expect(response.headers).to.have.property(header)
  })
}

/**
 * Verifica se elementos de LGPD estão presentes
 */
export function checkLGPDElements(): void {
  const requiredElements = lgpdElements.required
  
  requiredElements.forEach(element => {
    cy.get(`[data-testid="${element}"]`).should('exist')
  })
}

/**
 * Testa proteção contra XSS
 */
export function testXSSProtection(selector: string, payload: string): void {
  cy.get(selector).type(payload)
  cy.get(selector).should('not.contain', '<script>')
  cy.get(selector).should('not.contain', '<img')
  cy.get(selector).should('not.contain', '<iframe')
  cy.get(selector).should('not.contain', '<svg')
  cy.get(selector).should('not.contain', '<body')
}

/**
 * Testa proteção contra SQL Injection
 */
export function testSQLInjectionProtection(selector: string, payload: string): void {
  cy.get(selector).type(payload)
  cy.get(selector).should('not.contain', 'DROP TABLE')
  cy.get(selector).should('not.contain', 'INSERT INTO')
  cy.get(selector).should('not.contain', 'UPDATE')
  cy.get(selector).should('not.contain', 'DELETE')
  cy.get(selector).should('not.contain', 'UNION')
}

/**
 * Testa proteção contra CSRF
 */
export function testCSRFProtection(): void {
  cy.get('[data-testid="csrf-token"]').should('exist')
  
  // Tentar submeter sem token
  cy.get('[data-testid="csrf-token"]').invoke('remove')
  cy.get('[data-testid="save-button"]').click()
  
  // Verificar se requisição é rejeitada
  cy.get('[data-testid="error-message"]').should('contain', 'Token CSRF inválido')
}

/**
 * Testa validação de entrada
 */
export function testInputValidation(selector: string, invalidValue: string, expectedError: string): void {
  cy.get(selector).type(invalidValue)
  cy.get('[data-testid="save-button"]').click()
  cy.get(`[data-testid="${selector}-error"]`).should('contain', expectedError)
}

/**
 * Testa força da senha
 */
export function testPasswordStrength(password: string, expectedError: string): void {
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="confirm-password-input"]').type(password)
  cy.get('[data-testid="register-button"]').click()
  cy.get('[data-testid="password-error"]').should('contain', expectedError)
}

/**
 * Testa rate limiting
 */
export function testRateLimiting(requests: number, expectedStatus: number): void {
  for (let i = 0; i < requests; i++) {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: 'test@test.com',
        password: 'password123'
      },
      failOnStatusCode: false
    }).then((response) => {
      if (i === requests - 1) {
        expect(response.status).to.eq(expectedStatus)
      }
    })
  }
}

/**
 * Testa expiração de sessão
 */
export function testSessionExpiration(): void {
  // Simular expiração de sessão
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', 'expired-token')
    win.localStorage.setItem('tokenExpiry', '0')
  })
  
  // Tentar fazer requisição
  cy.visit('/dashboard')
  
  // Verificar redirecionamento para login
  cy.url().should('include', '/login')
}

/**
 * Testa criptografia de dados
 */
export function testDataEncryption(): void {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken')
    expect(token).to.not.contain('password')
    expect(token).to.match(/^[A-Za-z0-9+/=]+$/) // Base64 format
  })
}

/**
 * Testa conformidade com LGPD
 */
export function testLGPDCompliance(): void {
  // Verificar política de privacidade
  cy.get('[data-testid="privacy-policy-link"]').should('exist')
  
  // Verificar aviso de cookies
  cy.get('[data-testid="cookie-consent"]').should('be.visible')
  
  // Verificar consentimento para dados pessoais
  cy.get('[data-testid="data-consent-checkbox"]').should('exist')
}

/**
 * Testa proteção contra ataques de timing
 */
export function testTimingAttackProtection(): void {
  const startTime = Date.now()
  
  cy.get('[data-testid="email-input"]').type('test@test.com')
  cy.get('[data-testid="password-input"]').type('password123')
  cy.get('[data-testid="login-button"]').click()
  
  cy.get('[data-testid="login-button"]').click()
  
  const endTime = Date.now()
  expect(endTime - startTime).to.be.greaterThan(1000) // Pelo menos 1 segundo de delay
}

/**
 * Testa validação de origem das requisições
 */
export function testOriginValidation(): void {
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
}

/**
 * Testa sanitização de inputs
 */
export function testInputSanitization(selector: string, maliciousInput: string): void {
  cy.get(selector).type(maliciousInput)
  cy.get('[data-testid="save-button"]').click()
  
  // Verificar se input foi sanitizado
  cy.get(selector).should('not.contain', '<script>')
  cy.get(selector).should('not.contain', '<img')
  cy.get(selector).should('not.contain', '<iframe')
  cy.get(selector).should('not.contain', '<svg')
  cy.get(selector).should('not.contain', '<body')
}

/**
 * Testa validação de comprimento máximo
 */
export function testMaxLengthValidation(selector: string, maxLength: number): void {
  const longInput = 'a'.repeat(maxLength + 1)
  cy.get(selector).type(longInput)
  cy.get('[data-testid="save-button"]').click()
  
  // Verificar se input foi truncado
  cy.get(selector).should('have.length.lessThan', maxLength + 1)
}

/**
 * Testa validação de tipos de dados
 */
export function testDataTypeValidation(selector: string, invalidValue: string, expectedError: string): void {
  cy.get(selector).type(invalidValue)
  cy.get('[data-testid="save-button"]').click()
  
  // Verificar se erro é exibido
  cy.get(`[data-testid="${selector}-error"]`).should('contain', expectedError)
}

/**
 * Testa validação de formatos específicos
 */
export function testFormatValidation(selector: string, invalidValue: string, expectedError: string): void {
  cy.get(selector).type(invalidValue)
  cy.get('[data-testid="save-button"]').click()
  
  // Verificar se erro é exibido
  cy.get(`[data-testid="${selector}-error"]`).should('contain', expectedError)
}

/**
 * Testa validação de limites de valores
 */
export function testValueLimitsValidation(selector: string, invalidValue: string, expectedError: string): void {
  cy.get(selector).type(invalidValue)
  cy.get('[data-testid="save-button"]').click()
  
  // Verificar se erro é exibido
  cy.get(`[data-testid="${selector}-error"]`).should('contain', expectedError)
}

/**
 * Testa proteção contra ataques de força bruta
 */
export function testBruteForceProtection(maxAttempts: number): void {
  for (let i = 0; i < maxAttempts; i++) {
    cy.get('[data-testid="email-input"]').clear().type('test@test.com')
    cy.get('[data-testid="password-input"]').clear().type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    
    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.wait(1000) // Aguardar entre tentativas
  }
  
  // Verificar se conta foi bloqueada
  cy.get('[data-testid="error-message"]').should('contain', 'Conta bloqueada')
}

/**
 * Testa proteção contra ataques de sessão
 */
export function testSessionProtection(): void {
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
}

/**
 * Testa proteção contra ataques de rede
 */
export function testNetworkProtection(): void {
  // Verificar se HTTPS está sendo usado
  cy.url().should('match', /^https:/)
  
  // Verificar se não há avisos de certificado
  cy.get('body').should('not.contain', 'certificate')
  cy.get('body').should('not.contain', 'SSL')
  cy.get('body').should('not.contain', 'TLS')
}

/**
 * Testa monitoramento de segurança
 */
export function testSecurityMonitoring(): void {
  // Verificar se não há avisos de segurança no console
  cy.window().then((win) => {
    const consoleLogs = win.console.log
    expect(consoleLogs).to.not.contain('Security warning')
  })
  
  // Verificar se dados sensíveis não estão expostos
  cy.get('body').should('not.contain', 'password')
  cy.get('body').should('not.contain', 'token')
  cy.get('body').should('not.contain', 'secret')
}

/**
 * Testa conformidade com padrões de segurança
 */
export function testSecurityCompliance(): void {
  // Verificar se HTTPS está sendo usado
  cy.url().should('match', /^https:/)
  
  // Verificar se headers de segurança estão presentes
  cy.checkSecurityHeaders()
  
  // Verificar se elementos de LGPD estão presentes
  cy.checkLGPDElements()
}
