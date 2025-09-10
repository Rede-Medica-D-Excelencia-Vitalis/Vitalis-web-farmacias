// Script para decodificar o token JWT atual
// Execute este script no console do navegador

console.log('🔍 Decodificando token JWT atual...');

// Função para decodificar JWT (sem verificar assinatura)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Erro ao decodificar token:', error);
    return null;
  }
}

// Obter token do localStorage
const token = localStorage.getItem('token');
const usuario = localStorage.getItem('usuario');

console.log('📋 Token atual:', token);
console.log('📋 Usuário no localStorage:', usuario ? JSON.parse(usuario) : 'Não encontrado');

if (token) {
  const decoded = decodeJWT(token);
  console.log('🔍 Token decodificado:', decoded);
  
  if (decoded) {
    console.log('📅 Data de expiração:', new Date(decoded.exp * 1000));
    console.log('👤 ID do usuário:', decoded.usuario_id);
    console.log('📧 Email:', decoded.email);
    console.log('🏷️ Tipo de usuário:', decoded.tipo_usuario);
    
    // Verificar se o token expirou
    const agora = Math.floor(Date.now() / 1000);
    if (decoded.exp < agora) {
      console.log('⚠️ Token expirado!');
    } else {
      console.log('✅ Token válido');
    }
  }
} else {
  console.log('❌ Nenhum token encontrado no localStorage');
}

// Verificar se há discrepância entre token e localStorage
if (token && usuario) {
  const userData = JSON.parse(usuario);
  const decoded = decodeJWT(token);
  
  if (decoded && decoded.tipo_usuario !== userData.tipo_usuario) {
    console.log('⚠️ DISCREPÂNCIA ENCONTRADA!');
    console.log('Token diz:', decoded.tipo_usuario);
    console.log('localStorage diz:', userData.tipo_usuario);
  } else {
    console.log('✅ Token e localStorage estão consistentes');
  }
} 