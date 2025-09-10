import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, LoginResponse } from '@/lib/api';

interface User {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'farmacia' | 'paciente' | 'medico' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuth = () => {
    console.log('🔍 Verificando autenticação...');
    const token = localStorage.getItem('authToken');
    const currentUser = apiService.auth.getCurrentUser();
    
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('Usuário:', currentUser);
    
    if (token && currentUser) {
      console.log('✅ Usuário autenticado encontrado');
      setUser(currentUser);
    } else {
      console.log('❌ Usuário não autenticado');
      // Limpar dados inválidos
      if (!token) localStorage.removeItem('user');
      if (!currentUser) localStorage.removeItem('authToken');
    }
    setIsLoading(false);
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🔐 Tentando login...', { email });
      
      const response: LoginResponse = await apiService.auth.login(email, senha);
      console.log('📥 Resposta do login:', response);
      
      if (response.sucesso && response.token && response.usuario) {
        console.log('✅ Login bem-sucedido, salvando dados...');
        apiService.auth.setAuthData(response.token, response.usuario);
        setUser(response.usuario);
        console.log('💾 Dados salvos no localStorage');
        return true;
      } else {
        console.log('❌ Login falhou - dados inválidos');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      // Tratar erros específicos do backend
      if (error.response?.data?.erro) {
        throw new Error(error.response.data.erro);
      } else if (error.response?.status === 401) {
        throw new Error('Email ou senha incorretos');
      } else if (error.response?.status === 400) {
        throw new Error('Dados inválidos');
      } else {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.auth.logout();
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 