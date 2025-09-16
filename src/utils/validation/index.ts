/**
 * Utilitários de Validação
 * 
 * Esta pasta contém todos os utilitários relacionados à validação
 * de dados, CPF, CNPJ, email, telefone, etc.
 */

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  // Regex mais rigorosa para validar email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  if (!cpf || typeof cpf !== 'string') return false;
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCPF.charAt(9)) !== digit1) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleanCPF.charAt(10)) === digit2;
}

/**
 * Valida CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj || typeof cnpj !== 'string') return false;
  
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCNPJ.charAt(12)) !== digit1) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleanCNPJ.charAt(13)) === digit2;
}

/**
 * Valida CEP
 */
export function isValidCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
}

/**
 * Valida URL
 */
export function isValidURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida se uma string não está vazia
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valida se um número está dentro de um range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Valida se uma string tem o tamanho mínimo
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Valida se uma string tem o tamanho máximo
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Valida se uma string contém apenas números
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Valida se uma string contém apenas letras
 */
export function isAlpha(value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value);
}

/**
 * Valida se uma string contém apenas letras e números
 */
export function isAlphaNumeric(value: string): boolean {
  return /^[a-zA-Z0-9\s]+$/.test(value);
}

/**
 * Valida se uma data é válida
 */
export function isValidDate(date: string | Date): boolean {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return false;
  
  // Verifica se a data é válida (não é inválida como 2023-02-29 em ano não bissexto)
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    const testDate = new Date(year, month - 1, day);
    return testDate.getFullYear() === year && 
           testDate.getMonth() === month - 1 && 
           testDate.getDate() === day;
  }
  
  return true;
}

/**
 * Valida se uma data é futura
 */
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Valida se uma data é passada
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Valida se um valor está em uma lista de valores permitidos
 */
export function isInList(value: any, allowedValues: any[]): boolean {
  return allowedValues.includes(value);
}

/**
 * Valida se um objeto tem todas as propriedades obrigatórias
 */
export function hasRequiredProperties(obj: any, requiredProps: string[]): boolean {
  return requiredProps.every(prop => obj.hasOwnProperty(prop) && obj[prop] != null);
}

/**
 * Valida se um array não está vazio
 */
export function isNotEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Valida se um valor é um número positivo
 */
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0;
}

/**
 * Valida se um valor é um número inteiro
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/**
 * Valida se um valor é um número decimal
 */
export function isDecimal(value: number): boolean {
  return typeof value === 'number' && !Number.isInteger(value);
}


















