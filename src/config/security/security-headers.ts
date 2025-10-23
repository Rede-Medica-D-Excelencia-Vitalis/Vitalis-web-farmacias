/**
 * Configurações de headers de segurança
 * Implementa as melhores práticas de segurança para headers HTTP
 */

export const securityHeaders = {
  // Previne MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Previne clickjacking
  'X-Frame-Options': 'DENY',
  
  // Proteção XSS
  'X-XSS-Protection': '1; mode=block',
  
  // Força uso de HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', '),
  
  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
}

/**
 * Headers específicos para APIs
 */
export const apiSecurityHeaders = {
  ...securityHeaders,
  
  // Previne cache de dados sensíveis
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  
  // CORS
  'Access-Control-Allow-Origin': 'https://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
}

/**
 * Headers para páginas estáticas
 */
export const staticSecurityHeaders = {
  ...securityHeaders,
  
  // Cache seguro para recursos estáticos
  'Cache-Control': 'public, max-age=31536000, immutable'
}

/**
 * Configurações de CORS
 */
export const corsConfig = {
  origin: [
    'https://localhost:3000',
    'https://vitalis-farmacias.com',
    'https://www.vitalis-farmacias.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With'
  ]
}

/**
 * Configurações de rate limiting
 */
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP por janela
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos',
  standardHeaders: true,
  legacyHeaders: false
}

/**
 * Configurações de rate limiting para login
 */
export const loginRateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP por janela
  message: 'Muitas tentativas de login, tente novamente em 15 minutos',
  skipSuccessfulRequests: true
}

/**
 * Configurações de sessão
 */
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'vitalis-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS apenas
    httpOnly: true, // Não acessível via JavaScript
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'strict' // Proteção CSRF
  }
}

/**
 * Configurações de JWT
 */
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'vitalis-jwt-secret',
  expiresIn: '24h',
  issuer: 'vitalis-farmacias',
  audience: 'vitalis-users',
  algorithm: 'HS256'
}

/**
 * Configurações de criptografia
 */
export const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16
}

/**
 * Configurações de validação
 */
export const validationConfig = {
  maxStringLength: 1000,
  maxArrayLength: 100,
  maxObjectDepth: 10,
  allowedHtmlTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
  allowedHtmlAttributes: ['class', 'id']
}

/**
 * Configurações de sanitização
 */
export const sanitizationConfig = {
  stripHtml: true,
  escapeHtml: true,
  removeScripts: true,
  removeStyles: true,
  removeComments: true,
  normalizeWhitespace: true
}

/**
 * Configurações de logging de segurança
 */
export const securityLogConfig = {
  logLevel: 'info',
  logFile: 'security.log',
  maxLogSize: '10MB',
  maxLogFiles: 5,
  logEvents: [
    'login_attempt',
    'login_success',
    'login_failure',
    'logout',
    'password_change',
    'data_access',
    'data_modification',
    'security_violation',
    'rate_limit_exceeded'
  ]
}

/**
 * Configurações de monitoramento
 */
export const monitoringConfig = {
  enableSecurityMonitoring: true,
  alertThresholds: {
    failedLogins: 5,
    suspiciousActivity: 10,
    dataAccess: 100
  },
  notificationChannels: ['email', 'slack'],
  retentionDays: 90
}
