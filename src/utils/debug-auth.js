// Script para debugar e corrigir autenticação
// Execute no console do navegador

console.log('🔧 Debug de Autenticação - Sistema de Farmácias');

// 1. Limpar dados de autenticação
console.log('🧹 Limpando dados de autenticação...');
localStorage.removeItem('authToken');
localStorage.removeItem('user');

// 2. Fazer login como farmácia
console.log('🔐 Fazendo login como farmácia...');

const loginData = {
  email: 'teste@gmail.com',
  senha: '123456'
};

fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  console.log('📥 Resposta do login:', data);
  
  if (data.sucesso && data.token && data.usuario) {
    // Salvar dados de autenticação
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    
    console.log('✅ Login realizado com sucesso!');
    console.log('👤 Usuário:', data.usuario);
    console.log('🔑 Token salvo no localStorage');
    
    // Recarregar a página para aplicar as mudanças
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    console.error('❌ Erro no login:', data);
  }
})
.catch(error => {
  console.error('❌ Erro na requisição:', error);
});

// 3. Verificar dados atuais
console.log('📊 Dados atuais do localStorage:');
console.log('Token:', localStorage.getItem('authToken') ? 'Presente' : 'Ausente');
console.log('Usuário:', localStorage.getItem('user')); 