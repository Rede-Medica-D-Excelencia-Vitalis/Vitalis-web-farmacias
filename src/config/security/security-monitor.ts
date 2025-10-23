/**
 * Monitor de Segurança
 * Implementa monitoramento contínuo de segurança da aplicação
 */

import { securityLogConfig, monitoringConfig } from './security-headers'

export interface SecurityEvent {
  id: string
  timestamp: Date
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export interface SecurityAlert {
  id: string
  timestamp: Date
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

export class SecurityMonitor {
  private static instance: SecurityMonitor
  private events: SecurityEvent[] = []
  private alerts: SecurityAlert[] = []
  private thresholds = monitoringConfig.alertThresholds

  private constructor() {
    this.startMonitoring()
  }

  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }

  /**
   * Registra um evento de segurança
   */
  public logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    }

    this.events.push(securityEvent)
    this.checkThresholds(securityEvent)
    this.writeToLog(securityEvent)
  }

  /**
   * Registra tentativa de login
   */
  public logLoginAttempt(email: string, success: boolean, ipAddress?: string): void {
    this.logEvent({
      type: success ? 'login_success' : 'login_failure',
      severity: success ? 'low' : 'medium',
      message: `Login ${success ? 'bem-sucedido' : 'falhado'} para ${email}`,
      ipAddress,
      metadata: { email, success }
    })
  }

  /**
   * Registra acesso a dados sensíveis
   */
  public logDataAccess(userId: string, resource: string, action: string): void {
    this.logEvent({
      type: 'data_access',
      severity: 'low',
      message: `Acesso a dados: ${action} em ${resource}`,
      userId,
      metadata: { resource, action }
    })
  }

  /**
   * Registra modificação de dados
   */
  public logDataModification(userId: string, resource: string, action: string): void {
    this.logEvent({
      type: 'data_modification',
      severity: 'medium',
      message: `Modificação de dados: ${action} em ${resource}`,
      userId,
      metadata: { resource, action }
    })
  }

  /**
   * Registra violação de segurança
   */
  public logSecurityViolation(type: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'high'): void {
    this.logEvent({
      type: 'security_violation',
      severity,
      message: `Violação de segurança: ${message}`,
      metadata: { violationType: type }
    })
  }

  /**
   * Registra excedência de rate limit
   */
  public logRateLimitExceeded(ipAddress: string, endpoint: string): void {
    this.logEvent({
      type: 'rate_limit_exceeded',
      severity: 'medium',
      message: `Rate limit excedido para ${endpoint}`,
      ipAddress,
      metadata: { endpoint }
    })
  }

  /**
   * Verifica se há atividade suspeita
   */
  public checkSuspiciousActivity(): SecurityAlert[] {
    const recentEvents = this.getRecentEvents(15 * 60 * 1000) // Últimos 15 minutos
    const suspiciousActivities: SecurityAlert[] = []

    // Verificar múltiplas tentativas de login falhadas
    const failedLogins = recentEvents.filter(e => e.type === 'login_failure')
    if (failedLogins.length >= this.thresholds.failedLogins) {
      suspiciousActivities.push(this.createAlert(
        'multiple_failed_logins',
        'high',
        `Múltiplas tentativas de login falhadas: ${failedLogins.length}`
      ))
    }

    // Verificar acesso excessivo a dados
    const dataAccess = recentEvents.filter(e => e.type === 'data_access')
    if (dataAccess.length >= this.thresholds.dataAccess) {
      suspiciousActivities.push(this.createAlert(
        'excessive_data_access',
        'medium',
        `Acesso excessivo a dados: ${dataAccess.length}`
      ))
    }

    // Verificar violações de segurança
    const violations = recentEvents.filter(e => e.type === 'security_violation')
    if (violations.length > 0) {
      suspiciousActivities.push(this.createAlert(
        'security_violations',
        'critical',
        `Violações de segurança detectadas: ${violations.length}`
      ))
    }

    return suspiciousActivities
  }

  /**
   * Obtém estatísticas de segurança
   */
  public getSecurityStats(): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    recentAlerts: SecurityAlert[]
    suspiciousActivity: SecurityAlert[]
  } {
    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const recentAlerts = this.alerts.filter(alert => 
      !alert.resolved && 
      (Date.now() - alert.timestamp.getTime()) < 24 * 60 * 60 * 1000
    )

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      recentAlerts,
      suspiciousActivity: this.checkSuspiciousActivity()
    }
  }

  /**
   * Resolve um alerta de segurança
   */
  public resolveAlert(alertId: string, resolvedBy: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      alert.resolvedAt = new Date()
      alert.resolvedBy = resolvedBy
    }
  }

  /**
   * Limpa eventos antigos
   */
  public cleanupOldEvents(): void {
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 dias
    this.events = this.events.filter(event => event.timestamp > cutoffDate)
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffDate)
  }

  /**
   * Inicia monitoramento contínuo
   */
  private startMonitoring(): void {
    if (!monitoringConfig.enableSecurityMonitoring) return

    // Verificar atividade suspeita a cada 5 minutos
    setInterval(() => {
      const suspiciousActivities = this.checkSuspiciousActivity()
      if (suspiciousActivities.length > 0) {
        this.sendAlerts(suspiciousActivities)
      }
    }, 5 * 60 * 1000)

    // Limpar eventos antigos diariamente
    setInterval(() => {
      this.cleanupOldEvents()
    }, 24 * 60 * 60 * 1000)
  }

  /**
   * Verifica thresholds e cria alertas
   */
  private checkThresholds(event: SecurityEvent): void {
    const recentEvents = this.getRecentEvents(15 * 60 * 1000)
    
    // Verificar rate limit
    if (event.type === 'rate_limit_exceeded') {
      this.alerts.push(this.createAlert(
        'rate_limit_exceeded',
        'medium',
        `Rate limit excedido para ${event.ipAddress}`
      ))
    }

    // Verificar múltiplas falhas de login
    const failedLogins = recentEvents.filter(e => e.type === 'login_failure')
    if (failedLogins.length >= this.thresholds.failedLogins) {
      this.alerts.push(this.createAlert(
        'multiple_failed_logins',
        'high',
        `Múltiplas tentativas de login falhadas: ${failedLogins.length}`
      ))
    }
  }

  /**
   * Cria um alerta de segurança
   */
  private createAlert(type: string, severity: 'low' | 'medium' | 'high' | 'critical', message: string): SecurityAlert {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      severity,
      message,
      resolved: false
    }
  }

  /**
   * Obtém eventos recentes
   */
  private getRecentEvents(timeWindow: number): SecurityEvent[] {
    const cutoffTime = Date.now() - timeWindow
    return this.events.filter(event => event.timestamp.getTime() > cutoffTime)
  }

  /**
   * Envia alertas
   */
  private sendAlerts(alerts: SecurityAlert[]): void {
    // Implementar envio de alertas via email, Slack, etc.
    console.log('Alertas de segurança:', alerts)
  }

  /**
   * Escreve evento no log
   */
  private writeToLog(event: SecurityEvent): void {
    if (securityLogConfig.logEvents.includes(event.type)) {
      console.log(`[SECURITY] ${event.timestamp.toISOString()} - ${event.type}: ${event.message}`)
    }
  }

  /**
   * Gera ID único
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

/**
 * Função utilitária para verificar segurança
 */
export function checkSecurity(): void {
  const monitor = SecurityMonitor.getInstance()
  
  // Verificar se HTTPS está sendo usado
  if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
    monitor.logSecurityViolation('insecure_protocol', 'HTTPS não está sendo usado')
  }
  
  // Verificar se dados sensíveis estão expostos
  if (typeof window !== 'undefined') {
    const sensitiveData = document.querySelectorAll('[data-sensitive]')
    if (sensitiveData.length > 0) {
      monitor.logSecurityViolation('sensitive_data_exposure', 'Dados sensíveis expostos no DOM')
    }
  }
}

/**
 * Hook para monitoramento de segurança
 */
export function useSecurityMonitor() {
  const monitor = SecurityMonitor.getInstance()
  
  return {
    logEvent: monitor.logEvent.bind(monitor),
    logLoginAttempt: monitor.logLoginAttempt.bind(monitor),
    logDataAccess: monitor.logDataAccess.bind(monitor),
    logDataModification: monitor.logDataModification.bind(monitor),
    logSecurityViolation: monitor.logSecurityViolation.bind(monitor),
    logRateLimitExceeded: monitor.logRateLimitExceeded.bind(monitor),
    getSecurityStats: monitor.getSecurityStats.bind(monitor),
    resolveAlert: monitor.resolveAlert.bind(monitor)
  }
}
