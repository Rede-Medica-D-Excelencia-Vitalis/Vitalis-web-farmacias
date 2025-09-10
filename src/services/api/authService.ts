/**
 * Serviço de Autenticação
 * 
 * Gerencia todas as operações relacionadas à autenticação de usuários,
 * incluindo login, logout, refresh de tokens e gerenciamento de sessão.
 */

import { api } from '@/lib/api/api';
import type { LoginRequest, LoginResponse, User, RefreshTokenRequest } from '@/types';

export interface AuthServiceConfig {
  tokenKey: string;
  refreshTokenKey: string;
  userKey: string;
}

class AuthService {
  private config: AuthServiceConfig = {
    tokenKey: 'vitalis_auth_token',
    refreshTokenKey: 'vitalis_refresh_token',
    userKey: 'vitalis_user_data'
  };

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, refreshToken, user } = response.data;

      // Salvar tokens e dados do usuário
      this.setToken(token);
      this.setRefreshToken(refreshToken);
      this.setUser(user);

      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais independentemente do resultado da API
      this.clearAuthData();
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      const { token } = response.data;

      this.setToken(token);
      return token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Obtém o perfil do usuário atual
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data;
      
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    
    return !!(token && user);
  }

  /**
   * Obtém o token de acesso
   */
  getToken(): string | null {
    return localStorage.getItem(this.config.tokenKey);
  }

  /**
   * Define o token de acesso
   */
  private setToken(token: string): void {
    localStorage.setItem(this.config.tokenKey, token);
  }

  /**
   * Obtém o refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.config.refreshTokenKey);
  }

  /**
   * Define o refresh token
   */
  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.config.refreshTokenKey, refreshToken);
  }

  /**
   * Obtém os dados do usuário
   */
  getUser(): User | null {
    const userData = localStorage.getItem(this.config.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Define os dados do usuário
   */
  private setUser(user: User): void {
    localStorage.setItem(this.config.userKey, JSON.stringify(user));
  }

  /**
   * Limpa todos os dados de autenticação
   */
  clearAuthData(): void {
    localStorage.removeItem(this.config.tokenKey);
    localStorage.removeItem(this.config.refreshTokenKey);
    localStorage.removeItem(this.config.userKey);
  }

  /**
   * Verifica se o token está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true;
    }
  }

  /**
   * Obtém informações do token
   */
  getTokenInfo(): { exp: number; iat: number; sub: string } | null {
    const token = this.getToken();
    
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Erro ao obter informações do token:', error);
      return null;
    }
  }
}

// Instância singleton
export const authService = new AuthService();
export default authService;

