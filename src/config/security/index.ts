/**
 * Configurações de Segurança
 * Exporta todas as configurações de segurança do sistema
 */

export { securityHeaders, apiSecurityHeaders, staticSecurityHeaders, corsConfig, rateLimitConfig, loginRateLimitConfig, sessionConfig, jwtConfig, encryptionConfig, validationConfig, sanitizationConfig, securityLogConfig, monitoringConfig } from './security-headers'
export { SecurityMonitor, SecurityEvent, SecurityAlert, checkSecurity, useSecurityMonitor } from './security-monitor'

// Configurações de ambiente de segurança
export const securityEnv = {
  enabled: process.env.SECURITY_ENABLED === 'true',
  httpsRequired: process.env.HTTPS_REQUIRED === 'true',
  csrfProtection: process.env.CSRF_PROTECTION === 'true',
  xssProtection: process.env.XSS_PROTECTION === 'true',
  sqlInjectionProtection: process.env.SQL_INJECTION_PROTECTION === 'true',
  lgpdCompliance: process.env.LGPD_COMPLIANCE === 'true',
  dataEncryption: process.env.DATA_ENCRYPTION === 'true',
  consentRequired: process.env.CONSENT_REQUIRED === 'true'
}

// Configurações de validação de segurança
export const securityValidation = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
  passwordMinLength: 8,
  passwordRequireSpecialChars: true,
  passwordRequireNumbers: true,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true
}

// Configurações de monitoramento de segurança
export const securityMonitoring = {
  enableRealTimeMonitoring: true,
  enableLogging: true,
  enableAlerts: true,
  alertThresholds: {
    failedLogins: 5,
    suspiciousActivity: 10,
    dataAccess: 100,
    securityViolations: 1
  },
  retentionDays: 90,
  notificationChannels: ['email', 'slack', 'webhook']
}
