import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  isValidCEP,
  isValidURL,
  isNotEmpty,
  isInRange,
  hasMinLength,
  hasMaxLength,
  isNumeric,
  isAlpha,
  isAlphaNumeric,
  isValidDate,
  isFutureDate,
  isPastDate,
  isInList,
  hasRequiredProperties,
  isNotEmptyArray,
  isPositiveNumber,
  isInteger,
  isDecimal
} from '@/utils/validation'

describe('isValidEmail', () => {
  it('deve validar emails válidos', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    expect(isValidEmail('test+tag@example.org')).toBe(true)
    expect(isValidEmail('user123@domain123.com')).toBe(true)
    expect(isValidEmail('a@b.co')).toBe(true)
  })

  it('deve rejeitar emails inválidos', () => {
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('test.example.com')).toBe(false)
    expect(isValidEmail('test@.com')).toBe(false)
    expect(isValidEmail('test@domain.')).toBe(false)
    expect(isValidEmail('test@domain..com')).toBe(false)
  })

  it('deve rejeitar emails vazios ou nulos', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail(null as any)).toBe(false)
    expect(isValidEmail(undefined as any)).toBe(false)
  })
})

describe('isValidCPF', () => {
  it('deve validar CPFs válidos', () => {
    expect(isValidCPF('11144477735')).toBe(true)
    expect(isValidCPF('111.444.777-35')).toBe(true)
    expect(isValidCPF('12345678909')).toBe(true)
  })

  it('deve rejeitar CPFs inválidos', () => {
    expect(isValidCPF('11111111111')).toBe(false)
    expect(isValidCPF('12345678901')).toBe(false)
    expect(isValidCPF('123')).toBe(false)
    expect(isValidCPF('123456789012')).toBe(false)
    expect(isValidCPF('00000000000')).toBe(false)
    expect(isValidCPF('99999999999')).toBe(false)
  })

  it('deve rejeitar CPFs com dígitos iguais', () => {
    expect(isValidCPF('00000000000')).toBe(false)
    expect(isValidCPF('11111111111')).toBe(false)
    expect(isValidCPF('99999999999')).toBe(false)
  })

  it('deve rejeitar CPFs vazios ou nulos', () => {
    expect(isValidCPF('')).toBe(false)
    expect(isValidCPF(null as any)).toBe(false)
    expect(isValidCPF(undefined as any)).toBe(false)
  })
})

describe('isValidCNPJ', () => {
  it('deve validar CNPJs válidos', () => {
    expect(isValidCNPJ('11222333000181')).toBe(true)
    expect(isValidCNPJ('11.222.333/0001-81')).toBe(true)
    expect(isValidCNPJ('12345678000195')).toBe(true)
  })

  it('deve rejeitar CNPJs inválidos', () => {
    expect(isValidCNPJ('11111111111111')).toBe(false)
    expect(isValidCNPJ('12345678901234')).toBe(false)
    expect(isValidCNPJ('123')).toBe(false)
    expect(isValidCNPJ('123456789012345')).toBe(false)
    expect(isValidCNPJ('00000000000000')).toBe(false)
    expect(isValidCNPJ('99999999999999')).toBe(false)
  })

  it('deve rejeitar CNPJs com dígitos iguais', () => {
    expect(isValidCNPJ('00000000000000')).toBe(false)
    expect(isValidCNPJ('11111111111111')).toBe(false)
    expect(isValidCNPJ('99999999999999')).toBe(false)
  })

  it('deve rejeitar CNPJs vazios ou nulos', () => {
    expect(isValidCNPJ('')).toBe(false)
    expect(isValidCNPJ(null as any)).toBe(false)
    expect(isValidCNPJ(undefined as any)).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('deve validar telefones válidos', () => {
    expect(isValidPhone('(11) 99999-9999')).toBe(true)
    expect(isValidPhone('(11) 9999-9999')).toBe(true)
    expect(isValidPhone('(21) 1234-5678')).toBe(true)
  })

  it('deve rejeitar telefones inválidos', () => {
    expect(isValidPhone('11999999999')).toBe(false)
    expect(isValidPhone('(11) 999999999')).toBe(false)
    expect(isValidPhone('(11) 999-9999')).toBe(false)
    expect(isValidPhone('11 99999-9999')).toBe(false)
    expect(isValidPhone('(1) 99999-9999')).toBe(false)
  })
})

describe('isValidCEP', () => {
  it('deve validar CEPs válidos', () => {
    expect(isValidCEP('12345678')).toBe(true)
    expect(isValidCEP('12345-678')).toBe(true)
    expect(isValidCEP('00000000')).toBe(true)
  })

  it('deve rejeitar CEPs inválidos', () => {
    expect(isValidCEP('1234567')).toBe(false)
    expect(isValidCEP('123456789')).toBe(false)
    expect(isValidCEP('12345-67')).toBe(false)
    expect(isValidCEP('abc12345')).toBe(false)
  })
})

describe('isValidURL', () => {
  it('deve validar URLs válidas', () => {
    expect(isValidURL('https://example.com')).toBe(true)
    expect(isValidURL('http://example.com')).toBe(true)
    expect(isValidURL('https://www.example.com/path')).toBe(true)
    expect(isValidURL('https://subdomain.example.com')).toBe(true)
  })

  it('deve rejeitar URLs inválidas', () => {
    expect(isValidURL('not-a-url')).toBe(false)
    expect(isValidURL('example.com')).toBe(false)
    expect(isValidURL('ftp://example.com')).toBe(false)
    expect(isValidURL('')).toBe(false)
  })
})

describe('isNotEmpty', () => {
  it('deve validar strings não vazias', () => {
    expect(isNotEmpty('hello')).toBe(true)
    expect(isNotEmpty('  hello  ')).toBe(true)
    expect(isNotEmpty('a')).toBe(true)
  })

  it('deve rejeitar strings vazias', () => {
    expect(isNotEmpty('')).toBe(false)
    expect(isNotEmpty('   ')).toBe(false)
    expect(isNotEmpty('\t\n')).toBe(false)
  })
})

describe('isInRange', () => {
  it('deve validar números dentro do range', () => {
    expect(isInRange(5, 1, 10)).toBe(true)
    expect(isInRange(1, 1, 10)).toBe(true)
    expect(isInRange(10, 1, 10)).toBe(true)
    expect(isInRange(0, -5, 5)).toBe(true)
  })

  it('deve rejeitar números fora do range', () => {
    expect(isInRange(0, 1, 10)).toBe(false)
    expect(isInRange(11, 1, 10)).toBe(false)
    expect(isInRange(-1, 0, 10)).toBe(false)
  })
})

describe('hasMinLength', () => {
  it('deve validar strings com tamanho mínimo', () => {
    expect(hasMinLength('hello', 3)).toBe(true)
    expect(hasMinLength('hello', 5)).toBe(true)
    expect(hasMinLength('a', 1)).toBe(true)
  })

  it('deve rejeitar strings com tamanho menor que o mínimo', () => {
    expect(hasMinLength('hi', 3)).toBe(false)
    expect(hasMinLength('', 1)).toBe(false)
  })
})

describe('hasMaxLength', () => {
  it('deve validar strings com tamanho máximo', () => {
    expect(hasMaxLength('hello', 10)).toBe(true)
    expect(hasMaxLength('hello', 5)).toBe(true)
    expect(hasMaxLength('', 5)).toBe(true)
  })

  it('deve rejeitar strings com tamanho maior que o máximo', () => {
    expect(hasMaxLength('hello', 3)).toBe(false)
    expect(hasMaxLength('very long string', 10)).toBe(false)
  })
})

describe('isNumeric', () => {
  it('deve validar strings numéricas', () => {
    expect(isNumeric('123')).toBe(true)
    expect(isNumeric('0')).toBe(true)
    expect(isNumeric('999999')).toBe(true)
  })

  it('deve rejeitar strings não numéricas', () => {
    expect(isNumeric('123a')).toBe(false)
    expect(isNumeric('abc')).toBe(false)
    expect(isNumeric('12.34')).toBe(false)
    expect(isNumeric('12-34')).toBe(false)
  })
})

describe('isAlpha', () => {
  it('deve validar strings alfabéticas', () => {
    expect(isAlpha('hello')).toBe(true)
    expect(isAlpha('Hello World')).toBe(true)
    expect(isAlpha('a')).toBe(true)
  })

  it('deve rejeitar strings não alfabéticas', () => {
    expect(isAlpha('hello123')).toBe(false)
    expect(isAlpha('123')).toBe(false)
    expect(isAlpha('hello!')).toBe(false)
  })
})

describe('isAlphaNumeric', () => {
  it('deve validar strings alfanuméricas', () => {
    expect(isAlphaNumeric('hello123')).toBe(true)
    expect(isAlphaNumeric('Hello World 123')).toBe(true)
    expect(isAlphaNumeric('abc')).toBe(true)
    expect(isAlphaNumeric('123')).toBe(true)
  })

  it('deve rejeitar strings não alfanuméricas', () => {
    expect(isAlphaNumeric('hello!')).toBe(false)
    expect(isAlphaNumeric('hello@123')).toBe(false)
    expect(isAlphaNumeric('hello-123')).toBe(false)
  })
})

describe('isValidDate', () => {
  it('deve validar datas válidas', () => {
    expect(isValidDate('2023-01-01')).toBe(true)
    expect(isValidDate('2023-12-31')).toBe(true)
    expect(isValidDate(new Date())).toBe(true)
    expect(isValidDate('2023-02-29')).toBe(false) // Ano não bissexto
  })

  it('deve rejeitar datas inválidas', () => {
    expect(isValidDate('invalid-date')).toBe(false)
    expect(isValidDate('2023-13-01')).toBe(false)
    expect(isValidDate('2023-01-32')).toBe(false)
    expect(isValidDate('')).toBe(false)
  })
})

describe('isFutureDate', () => {
  it('deve validar datas futuras', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    expect(isFutureDate(futureDate)).toBe(true)
    expect(isFutureDate('2030-01-01')).toBe(true)
  })

  it('deve rejeitar datas passadas', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)
    expect(isFutureDate(pastDate)).toBe(false)
    expect(isFutureDate('2020-01-01')).toBe(false)
  })
})

describe('isPastDate', () => {
  it('deve validar datas passadas', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)
    expect(isPastDate(pastDate)).toBe(true)
    expect(isPastDate('2020-01-01')).toBe(true)
  })

  it('deve rejeitar datas futuras', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    expect(isPastDate(futureDate)).toBe(false)
    expect(isPastDate('2030-01-01')).toBe(false)
  })
})

describe('isInList', () => {
  it('deve validar valores na lista', () => {
    expect(isInList('a', ['a', 'b', 'c'])).toBe(true)
    expect(isInList(1, [1, 2, 3])).toBe(true)
    expect(isInList(true, [true, false])).toBe(true)
  })

  it('deve rejeitar valores fora da lista', () => {
    expect(isInList('d', ['a', 'b', 'c'])).toBe(false)
    expect(isInList(4, [1, 2, 3])).toBe(false)
    expect(isInList(null, [1, 2, 3])).toBe(false)
  })
})

describe('hasRequiredProperties', () => {
  it('deve validar objetos com propriedades obrigatórias', () => {
    const obj = { name: 'John', age: 30, email: 'john@example.com' }
    expect(hasRequiredProperties(obj, ['name', 'age'])).toBe(true)
    expect(hasRequiredProperties(obj, ['name'])).toBe(true)
  })

  it('deve rejeitar objetos sem propriedades obrigatórias', () => {
    const obj = { name: 'John', age: 30 }
    expect(hasRequiredProperties(obj, ['name', 'email'])).toBe(false)
    expect(hasRequiredProperties(obj, ['id'])).toBe(false)
  })

  it('deve rejeitar propriedades com valores null/undefined', () => {
    const obj = { name: 'John', age: null, email: undefined }
    expect(hasRequiredProperties(obj, ['name', 'age'])).toBe(false)
    expect(hasRequiredProperties(obj, ['name', 'email'])).toBe(false)
  })
})

describe('isNotEmptyArray', () => {
  it('deve validar arrays não vazios', () => {
    expect(isNotEmptyArray([1, 2, 3])).toBe(true)
    expect(isNotEmptyArray(['a'])).toBe(true)
    expect(isNotEmptyArray([{}])).toBe(true)
  })

  it('deve rejeitar arrays vazios ou não arrays', () => {
    expect(isNotEmptyArray([])).toBe(false)
    expect(isNotEmptyArray(null as any)).toBe(false)
    expect(isNotEmptyArray(undefined as any)).toBe(false)
    expect(isNotEmptyArray('not an array' as any)).toBe(false)
  })
})

describe('isPositiveNumber', () => {
  it('deve validar números positivos', () => {
    expect(isPositiveNumber(1)).toBe(true)
    expect(isPositiveNumber(0.5)).toBe(true)
    expect(isPositiveNumber(100)).toBe(true)
  })

  it('deve rejeitar números não positivos', () => {
    expect(isPositiveNumber(0)).toBe(false)
    expect(isPositiveNumber(-1)).toBe(false)
    expect(isPositiveNumber(-0.5)).toBe(false)
  })
})

describe('isInteger', () => {
  it('deve validar números inteiros', () => {
    expect(isInteger(1)).toBe(true)
    expect(isInteger(0)).toBe(true)
    expect(isInteger(-1)).toBe(true)
    expect(isInteger(100)).toBe(true)
  })

  it('deve rejeitar números decimais', () => {
    expect(isInteger(1.5)).toBe(false)
    expect(isInteger(0.1)).toBe(false)
    expect(isInteger(-1.5)).toBe(false)
  })
})

describe('isDecimal', () => {
  it('deve validar números decimais', () => {
    expect(isDecimal(1.5)).toBe(true)
    expect(isDecimal(0.1)).toBe(true)
    expect(isDecimal(-1.5)).toBe(true)
  })

  it('deve rejeitar números inteiros', () => {
    expect(isDecimal(1)).toBe(false)
    expect(isDecimal(0)).toBe(false)
    expect(isDecimal(-1)).toBe(false)
  })
})
