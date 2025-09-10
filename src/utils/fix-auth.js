// Script para corrigir problemas de autenticação
// Execute este script no console do navegador

console.log('🔧 Corrigindo problemas de autenticação...');

// Função para decodificar JWT
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

// Verificar token atual
const token = localStorage.getItem('authToken') || localStorage.getItem('token');
const user = localStorage.getItem('user') || localStorage.getItem('usuario');

console.log('🔍 Token atual:', token ? 'Presente' : 'Ausente');
console.log('🔍 Usuário atual:', user ? JSON.parse(user) : 'Não encontrado');

if (token) {
  const decoded = decodeJWT(token);
  console.log('🔍 Token decodificado:', decoded);
  
  if (decoded) {
    console.log('📅 Data de expiração:', new Date(decoded.exp * 1000));
    console.log('👤 ID do usuário:', decoded.usuario_id);
    console.log('📧 Email:', decoded.email);
    console.log('🏷️ Tipo de usuário:', decoded.tipo_usuario);
    
    if (decoded.tipo_usuario !== 'farmacia') {
      console.log('⚠️ Usuário não é farmácia. Fazendo login como farmácia...');
      forceFarmaciaLogin();
    } else {
      console.log('✅ Usuário já é farmácia. Verificando permissões...');
      checkPermissions();
    }
  }
} else {
  console.log('❌ Nenhum token encontrado. Fazendo login como farmácia...');
  forceFarmaciaLogin();
}

// Função para forçar login como farmácia
async function forceFarmaciaLogin() {
  try {
    console.log('🔄 Fazendo login como farmácia...');
    
    // Limpar localStorage
    localStorage.clear();
    console.log('✅ localStorage limpo');
    
    // Fazer login como farmácia
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teste@gmail.com',
        senha: '123456'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login realizado com sucesso!');
      console.log('📋 Dados do usuário:', data.usuario);
      
      // Salvar no localStorage com as chaves corretas
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      console.log('💾 Dados salvos no localStorage');
      console.log('🔄 Recarregando página...');
      
      // Recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } else {
      console.error('❌ Erro no login:', data);
      console.log('🔍 Tentando outras credenciais...');
      
      // Tentar outras credenciais comuns
      const credentials = [
        { email: 'farmacia@teste.com', senha: '123456' },
        { email: 'admin@vitalis.com', senha: 'admin123' },
        { email: 'farmacia@vitalis.com', senha: 'farmacia123' }
      ];
      
      for (const cred of credentials) {
        try {
          const retryResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cred)
          });
          
          const retryData = await retryResponse.json();
          
          if (retryResponse.ok && retryData.usuario.tipo_usuario === 'farmacia') {
            console.log('✅ Login com credenciais alternativas:', cred.email);
            localStorage.setItem('authToken', retryData.token);
            localStorage.setItem('user', JSON.stringify(retryData.usuario));
            setTimeout(() => window.location.reload(), 1000);
            return;
          }
        } catch (error) {
          console.log('❌ Falha com credenciais:', cred.email);
        }
      }
      
      console.error('❌ Todas as tentativas de login falharam');
    }
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
  }
}

// Função para verificar permissões
async function checkPermissions() {
  try {
    console.log('🔍 Verificando permissões...');
    
    const response = await fetch('http://localhost:3001/api/farmacias/minha', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Permissões verificadas:', data);
    } else {
      console.log('❌ Erro ao verificar permissões:', response.status);
      if (response.status === 403) {
        console.log('🔄 Token pode estar inválido. Fazendo novo login...');
        forceFarmaciaLogin();
      }
    }
  } catch (error) {
    console.error('❌ Erro ao verificar permissões:', error);
  }
}

console.log('🔧 Script de correção carregado. Execute as funções manualmente se necessário.');
console.log('🔧 Funções disponíveis: forceFarmaciaLogin(), checkPermissions()'); 