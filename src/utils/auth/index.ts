/**
 * Utilitários de Autenticação
 * 
 * Esta pasta contém todos os utilitários relacionados à autenticação,
 * autorização e gerenciamento de tokens.
 */

/**
 * Decodifica um token JWT sem verificar a assinatura
 */
export function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Verifica se um token JWT está expirado
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error);
    return true;
  }
}

/**
 * Obtém informações do usuário a partir do token
 */
export function getUserFromToken(token: string): any | null {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return null;
    
    return {
      id: decoded.usuario_id || decoded.sub,
      email: decoded.email,
      tipo: decoded.tipo_usuario || decoded.type,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error('Erro ao obter usuário do token:', error);
    return null;
  }
}

/**
 * Limpa todos os dados de autenticação do localStorage
 */
export function clearAuthData(): void {
  const authKeys = ['authToken', 'token', 'user', 'usuario', 'refreshToken'];
  authKeys.forEach(key => localStorage.removeItem(key));
}

/**
 * Salva dados de autenticação no localStorage
 */
export function saveAuthData(token: string, user: any, refreshToken?: string): void {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

/**
 * Obtém dados de autenticação do localStorage
 */
export function getAuthData(): { token: string | null; user: any | null; refreshToken: string | null } {
  return {
    token: localStorage.getItem('authToken') || localStorage.getItem('token'),
    user: (() => {
      const userStr = localStorage.getItem('user') || localStorage.getItem('usuario');
      return userStr ? JSON.parse(userStr) : null;
    })(),
    refreshToken: localStorage.getItem('refreshToken')
  };
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  const { token, user } = getAuthData();
  return !!(token && user && !isTokenExpired(token));
}

/**
 * Verifica se o usuário é do tipo farmácia
 */
export function isPharmacyUser(): boolean {
  const { user, token } = getAuthData();
  
  if (user && user.tipo_usuario) {
    return user.tipo_usuario === 'farmacia';
  }
  
  if (token) {
    const decoded = decodeJWT(token);
    return decoded?.tipo_usuario === 'farmacia';
  }
  
  return false;
}

/**
 * Força login como farmácia (para desenvolvimento)
 */
export async function forcePharmacyLogin(): Promise<boolean> {
  try {
    console.log('🔄 Forçando login como farmácia...');
    
    // Limpar dados existentes
    clearAuthData();
    
    // Credenciais de teste
    const credentials = [
      { email: 'teste@gmail.com', senha: '123456' },
      { email: 'farmacia@teste.com', senha: '123456' },
      { email: 'admin@vitalis.com', senha: 'admin123' },
      { email: 'farmacia@vitalis.com', senha: 'farmacia123' }
    ];
    
    for (const cred of credentials) {
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cred)
        });
        
        const data = await response.json();
        
        if (response.ok && data.usuario?.tipo_usuario === 'farmacia') {
          saveAuthData(data.token, data.usuario);
          console.log('✅ Login realizado com sucesso:', cred.email);
          return true;
        }
      } catch (error) {
        console.log('❌ Falha com credenciais:', cred.email);
      }
    }
    
    console.error('❌ Todas as tentativas de login falharam');
    return false;
  } catch (error) {
    console.error('❌ Erro ao forçar login:', error);
    return false;
  }
}

/**
 * Verifica permissões do usuário
 */
export async function checkUserPermissions(): Promise<boolean> {
  try {
    const { token } = getAuthData();
    if (!token) return false;
    
    const response = await fetch('http://localhost:3001/api/farmacias/minha', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Erro ao verificar permissões:', error);
    return false;
  }
}

/**
 * Debug de autenticação
 */
export function debugAuth(): void {
  console.log('🔧 Debug de Autenticação - Sistema de Farmácias');
  
  const { token, user, refreshToken } = getAuthData();
  
  console.log('📊 Dados atuais:');
  console.log('Token:', token ? 'Presente' : 'Ausente');
  console.log('Usuário:', user);
  console.log('Refresh Token:', refreshToken ? 'Presente' : 'Ausente');
  
  if (token) {
    const decoded = decodeJWT(token);
    console.log('🔍 Token decodificado:', decoded);
    
    if (decoded) {
      console.log('📅 Data de expiração:', new Date(decoded.exp * 1000));
      console.log('👤 ID do usuário:', decoded.usuario_id);
      console.log('📧 Email:', decoded.email);
      console.log('🏷️ Tipo de usuário:', decoded.tipo_usuario);
      console.log('⏰ Token expirado:', isTokenExpired(token));
    }
  }
  
  console.log('✅ Usuário autenticado:', isAuthenticated());
  console.log('🏥 É farmácia:', isPharmacyUser());
}














