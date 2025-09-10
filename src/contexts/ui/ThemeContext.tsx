/**
 * Contexto de Tema
 * 
 * Este arquivo contém:
 * 1. Contexto para gerenciar o tema da aplicação
 * 2. Hook personalizado para acessar o tema
 * 3. Provider para envolver a aplicação
 */

import { createContext, useContext } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook personalizado para acessar o tema
 * 
 * @returns Contexto do tema
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Provider do tema que envolve a aplicação
 * 
 * @param children - Componentes filhos
 * @returns JSX.Element - Provider do tema
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
} 