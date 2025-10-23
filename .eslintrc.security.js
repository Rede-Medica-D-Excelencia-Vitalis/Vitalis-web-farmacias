module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended'
  ],
  plugins: [
    'security',
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Regras de segurança
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-object-injection': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-unsafe-regex': 'error',
    
    // Regras específicas para React
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-unsafe': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': 'error',
    
    // Regras de validação de entrada
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Regras de sanitização
    'no-html-entities': 'error',
    'no-unescaped-entities': 'error',
    
    // Regras de validação
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    
    // Regras de segurança de dados
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // Regras de validação de tipos
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    
    // Regras de validação de formulários
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Regras de validação de props
    'react/prop-types': 'off', // Usando TypeScript
    'react/react-in-jsx-scope': 'off' // React 17+
  }
}
