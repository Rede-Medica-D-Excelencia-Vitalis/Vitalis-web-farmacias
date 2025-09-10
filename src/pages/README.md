# Organização das Páginas

Este diretório contém todas as páginas da aplicação, organizadas de forma profissional por categorias funcionais.

## Estrutura de Pastas

### 📁 `auth/` - Autenticação e Cadastro
Páginas relacionadas ao processo de autenticação e registro de usuários.

- **Login.tsx** - Página de login com carrossel de recursos
- **Cadastro.tsx** - Formulário de cadastro de farmácia
- **CadastroConcluido.tsx** - Confirmação de cadastro bem-sucedido

### 📁 `business/` - Gestão de Negócio
Páginas relacionadas ao gerenciamento operacional da farmácia.

- **Dashboard.tsx** - Painel de controle com métricas e estatísticas
- **Orders.tsx** - Gerenciamento de pedidos e status
- **Products.tsx** - Catálogo e gestão de produtos
- **Pharmacy.tsx** - Configurações da farmácia
- **Reports.tsx** - Relatórios e análises

### 📁 `legal/` - Documentos Legais
Páginas com conteúdo legal e termos de uso.

- **TermosCondicao.tsx** - Termos e condições de uso
- **TermosConduta.tsx** - Código de conduta

### 📁 `system/` - Sistema e Configurações
Páginas de configuração e funcionalidades do sistema.

- **Settings.tsx** - Configurações gerais
- **Profile.tsx** - Perfil do usuário
- **Help.tsx** - Sistema de ajuda e suporte
- **NotFound.tsx** - Página 404

## Convenções de Nomenclatura

- **PascalCase** para nomes de arquivos de componentes
- **camelCase** para variáveis e funções
- **kebab-case** para classes CSS
- **UPPER_SNAKE_CASE** para constantes

## Padrões de Desenvolvimento

### Estrutura de um Componente de Página

```typescript
/**
 * Nome da Página
 * 
 * Descrição breve da funcionalidade
 * 
 * Este arquivo contém:
 * 1. Funcionalidade principal
 * 2. Integração com APIs
 * 3. Gerenciamento de estado
 */

import { useState, useEffect } from 'react';
// ... outros imports

interface ComponentProps {
  // Props do componente
}

/**
 * Componente da página
 * 
 * @param props - Propriedades do componente
 * @returns JSX.Element - Página renderizada
 */
const ComponentName = (props: ComponentProps) => {
  // Estados
  const [state, setState] = useState();

  // Efeitos
  useEffect(() => {
    // Lógica de inicialização
  }, []);

  // Funções auxiliares
  const handleAction = () => {
    // Lógica da ação
  };

  // Renderização
  return (
    <div>
      {/* Conteúdo da página */}
    </div>
  );
};

export default ComponentName;
```

### Organização de Imports

1. **React e Hooks**
2. **Componentes UI**
3. **Serviços e APIs**
4. **Contextos e Hooks customizados**
5. **Utilitários e Helpers**
6. **Tipos e Interfaces**

### Gerenciamento de Estado

- Use `useState` para estado local simples
- Use `useContext` para estado global compartilhado
- Use `useReducer` para estado complexo com múltiplas ações
- Considere bibliotecas como Zustand para estado mais complexo

### Tratamento de Erros

- Implemente try/catch em operações assíncronas
- Use toast notifications para feedback ao usuário
- Implemente fallbacks para estados de erro
- Log de erros para debugging

### Performance

- Use `React.memo` para componentes que renderizam frequentemente
- Implemente lazy loading para páginas grandes
- Otimize re-renderizações desnecessárias
- Use `useMemo` e `useCallback` quando apropriado

## Migração de Arquivos

Para mover arquivos entre pastas:

1. Copie o arquivo para a nova localização
2. Atualize os imports nos arquivos que referenciam o componente
3. Remova o arquivo original
4. Teste a aplicação para garantir que tudo funciona

## Manutenção

- Mantenha a documentação atualizada
- Revise periodicamente a organização
- Considere refatoração quando necessário
- Siga os padrões estabelecidos para novos arquivos
