/**
 * Serviço de Validação
 * 
 * Contém todas as validações de negócio específicas da farmácia,
 * incluindo validações de dados, regras de negócio e validações customizadas.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationRule<T> {
  field: keyof T;
  validator: (value: any, data: T) => string | null;
  required?: boolean;
}

class ValidationService {
  /**
   * Valida dados de um pedido
   */
  validateOrder(orderData: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!orderData.patientId) {
      errors.push('ID do paciente é obrigatório');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Pedido deve conter pelo menos um item');
    }

    if (!orderData.total || orderData.total <= 0) {
      errors.push('Total do pedido deve ser maior que zero');
    }

    // Validações de itens
    if (orderData.items) {
      orderData.items.forEach((item: any, index: number) => {
        if (!item.productId) {
          errors.push(`Item ${index + 1}: ID do produto é obrigatório`);
        }

        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
        }

        if (!item.price || item.price <= 0) {
          errors.push(`Item ${index + 1}: Preço deve ser maior que zero`);
        }
      });
    }

    // Validações de data
    if (orderData.deliveryDate) {
      const deliveryDate = new Date(orderData.deliveryDate);
      const today = new Date();
      
      if (deliveryDate < today) {
        warnings.push('Data de entrega não pode ser no passado');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Valida dados de um produto
   */
  validateProduct(productData: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Nome do produto é obrigatório');
    }

    if (!productData.price || productData.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      errors.push('Estoque não pode ser negativo');
    }

    if (productData.stock !== undefined && productData.stock < 10) {
      warnings.push('Estoque baixo - considere repor');
    }

    if (!productData.category) {
      errors.push('Categoria é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Valida dados de um paciente
   */
  validatePatient(patientData: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!patientData.name || patientData.name.trim().length === 0) {
      errors.push('Nome do paciente é obrigatório');
    }

    if (!patientData.email || !this.isValidEmail(patientData.email)) {
      errors.push('Email válido é obrigatório');
    }

    if (!patientData.phone || !this.isValidPhone(patientData.phone)) {
      errors.push('Telefone válido é obrigatório');
    }

    if (patientData.cpf && !this.isValidCPF(patientData.cpf)) {
      errors.push('CPF inválido');
    }

    if (patientData.birthDate) {
      const birthDate = new Date(patientData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        warnings.push('Data de nascimento parece inválida');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Valida email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida telefone brasileiro
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Valida CPF
   */
  isValidCPF(cpf: string): boolean {
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
  isValidCNPJ(cnpj: string): boolean {
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
  isValidCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
  }

  /**
   * Valida dados genéricos com regras customizadas
   */
  validateWithRules<T>(data: T, rules: ValidationRule<T>[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    rules.forEach(rule => {
      const value = data[rule.field];
      
      // Verificar se é obrigatório
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${String(rule.field)} é obrigatório`);
        return;
      }

      // Executar validação customizada
      if (value !== undefined && value !== null && value !== '') {
        const error = rule.validator(value, data);
        if (error) {
          errors.push(error);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}

// Instância singleton
export const validationService = new ValidationService();
export default validationService;

