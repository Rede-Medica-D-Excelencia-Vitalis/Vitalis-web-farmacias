/**
 * Utilitários de Formatação
 * 
 * Esta pasta contém todos os utilitários relacionados à formatação
 * de dados, moeda, datas, telefones, etc.
 */

/**
 * Formata valor monetário para o padrão brasileiro
 */
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Formata número com separadores de milhares
 */
export function formatNumber(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Formata data para o padrão brasileiro
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Formata data e hora
 */
export function formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Formata apenas a hora
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Formata data relativa (ex: "há 2 dias")
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
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
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone brasileiro
 */
export function formatPhone(phone: string): string {
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
export function formatCEP(cep: string): string {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata tamanho de arquivo
 */
export function formatFileSize(bytes: number): string {
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
export function formatDuration(seconds: number): string {
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
export function formatTextCase(text: string, caseType: 'upper' | 'lower' | 'title' | 'sentence'): string {
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
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Formata status de pedido para exibição
 */
export function formatOrderStatus(status: string): string {
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
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Pendente',
    'paid': 'Pago',
    'failed': 'Falhou',
    'refunded': 'Reembolsado',
    'cancelled': 'Cancelado'
  };

  return statusMap[status] || status;
}


















