/**
 * Utilitários de validação
 * 
 * Este arquivo contém funções de validação reutilizáveis
 * para formulários e dados da aplicação.
 */

/**
 * Valida se um email é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se um CPF é válido
 */
export function isValidCPF(cpf: string): boolean {
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
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

/**
 * Valida se um CNPJ é válido
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validação do primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  // Validação do segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
}

/**
 * Valida se um telefone é válido
 */
export function isValidPhone(phone: string): boolean {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se tem entre 10 e 11 dígitos (com DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

/**
 * Valida se um CEP é válido
 */
export function isValidCEP(cep: string): boolean {
  // Remove caracteres não numéricos
  const cleanCEP = cep.replace(/\D/g, '');
  
  // Verifica se tem 8 dígitos
  return cleanCEP.length === 8;
}

/**
 * Valida se uma senha é forte
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida se um valor é um número válido
 */
export function isValidNumber(value: any): boolean {
  return !isNaN(value) && isFinite(value);
}

/**
 * Valida se um valor está dentro de um intervalo
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Valida se uma string não está vazia
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valida se uma data é válida
 */
export function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * Valida se uma data é futura
 */
export function isFutureDate(date: string): boolean {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj > now;
}

/**
 * Valida se uma data é passada
 */
export function isPastDate(date: string): boolean {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj < now;
}

/**
 * Valida se um valor é uma URL válida
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida se um valor é um número de cartão de crédito válido (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // Remove espaços e hífens
  const cleanNumber = cardNumber.replace(/\s|-/g, '');
  
  // Verifica se contém apenas números
  if (!/^\d+$/.test(cleanNumber)) return false;
  
  // Verifica se tem pelo menos 13 dígitos
  if (cleanNumber.length < 13) return false;
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Valida se um valor é um PIX válido
 */
export function isValidPIX(pix: string): boolean {
  // Remove espaços
  const cleanPIX = pix.replace(/\s/g, '');
  
  // Verifica se tem pelo menos 10 caracteres
  if (cleanPIX.length < 10) return false;
  
  // Verifica se contém apenas caracteres válidos
  return /^[a-zA-Z0-9@.-]+$/.test(cleanPIX);
}

/**
 * Valida se um valor é um preço válido
 */
export function isValidPrice(price: number): boolean {
  return isValidNumber(price) && price >= 0;
}

/**
 * Valida se um valor é uma quantidade válida
 */
export function isValidQuantity(quantity: number): boolean {
  return isValidNumber(quantity) && quantity > 0 && Number.isInteger(quantity);
}

/**
 * Valida se um valor é um percentual válido
 */
export function isValidPercentage(percentage: number): boolean {
  return isValidNumber(percentage) && percentage >= 0 && percentage <= 100;
}

/**
 * Valida se um valor é um código de barras válido
 */
export function isValidBarcode(barcode: string): boolean {
  // Remove espaços
  const cleanBarcode = barcode.replace(/\s/g, '');
  
  // Verifica se contém apenas números
  if (!/^\d+$/.test(cleanBarcode)) return false;
  
  // Verifica se tem entre 8 e 13 dígitos
  return cleanBarcode.length >= 8 && cleanBarcode.length <= 13;
}

/**
 * Valida se um valor é um nome válido
 */
export function isValidName(name: string): boolean {
  // Remove espaços extras
  const cleanName = name.trim();
  
  // Verifica se não está vazio
  if (cleanName.length === 0) return false;
  
  // Verifica se tem pelo menos 2 caracteres
  if (cleanName.length < 2) return false;
  
  // Verifica se contém apenas letras, espaços e acentos
  return /^[a-zA-ZÀ-ÿ\s]+$/.test(cleanName);
}

/**
 * Valida se um valor é um endereço válido
 */
export function isValidAddress(address: string): boolean {
  // Remove espaços extras
  const cleanAddress = address.trim();
  
  // Verifica se não está vazio
  if (cleanAddress.length === 0) return false;
  
  // Verifica se tem pelo menos 10 caracteres
  return cleanAddress.length >= 10;
}
