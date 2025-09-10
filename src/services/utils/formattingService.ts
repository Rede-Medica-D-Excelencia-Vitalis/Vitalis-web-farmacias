/**
 * Serviço de Formatação
 * 
 * Contém todas as funções de formatação de dados utilizadas
 * em toda a aplicação, incluindo formatação de moeda, data, telefone, etc.
 */

export interface FormattingOptions {
  locale?: string;
  currency?: string;
  timeZone?: string;
}

class FormattingService {
  private defaultOptions: FormattingOptions = {
    locale: 'pt-BR',
    currency: 'BRL',
    timeZone: 'America/Sao_Paulo'
  };

  /**
   * Formata valor monetário
   */
  formatCurrency(value: number, options?: Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    
    return new Intl.NumberFormat(opts.locale, {
      style: 'currency',
      currency: opts.currency
    }).format(value);
  }

  /**
   * Formata número com separadores de milhares
   */
  formatNumber(value: number, options?: Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    
    return new Intl.NumberFormat(opts.locale).format(value);
  }

  /**
   * Formata porcentagem
   */
  formatPercentage(value: number, decimals = 2, options?: Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    
    return new Intl.NumberFormat(opts.locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  }

  /**
   * Formata data
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions & Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    return new Intl.DateTimeFormat(opts.locale, {
      ...defaultFormat,
      ...options,
      timeZone: opts.timeZone
    }).format(dateObj);
  }

  /**
   * Formata data e hora
   */
  formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions & Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat(opts.locale, {
      ...defaultFormat,
      ...options,
      timeZone: opts.timeZone
    }).format(dateObj);
  }

  /**
   * Formata apenas a hora
   */
  formatTime(date: Date | string, options?: Intl.DateTimeFormatOptions & Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultFormat: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat(opts.locale, {
      ...defaultFormat,
      ...options,
      timeZone: opts.timeZone
    }).format(dateObj);
  }

  /**
   * Formata data relativa (ex: "há 2 dias")
   */
  formatRelativeDate(date: Date | string, options?: Partial<FormattingOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    const rtf = new Intl.RelativeTimeFormat(opts.locale, { numeric: 'auto' });
    const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000;
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
      if (count >= 1) {
        return rtf.format(diffInSeconds < 0 ? -count : count, interval.label as Intl.RelativeTimeFormatUnit);
      }
    }

    return rtf.format(0, 'second');
  }

  /**
   * Formata CPF
   */
  formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata CNPJ
   */
  formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formata telefone
   */
  formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }

  /**
   * Formata CEP
   */
  formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Formata tamanho de arquivo
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Formata duração em segundos para formato legível
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  /**
   * Formata texto com capitalização
   */
  formatTextCase(text: string, caseType: 'upper' | 'lower' | 'title' | 'sentence'): string {
    switch (caseType) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'sentence':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default:
        return text;
    }
  }

  /**
   * Trunca texto com reticências
   */
  truncateText(text: string, maxLength: number, suffix = '...'): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Formata status de pedido para exibição
   */
  formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'processing': 'Processando',
      'ready': 'Pronto',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado',
      'returned': 'Devolvido'
    };

    return statusMap[status] || status;
  }

  /**
   * Formata status de pagamento
   */
  formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'paid': 'Pago',
      'failed': 'Falhou',
      'refunded': 'Reembolsado',
      'cancelled': 'Cancelado'
    };

    return statusMap[status] || status;
  }
}

// Instância singleton
export const formattingService = new FormattingService();
export default formattingService;
