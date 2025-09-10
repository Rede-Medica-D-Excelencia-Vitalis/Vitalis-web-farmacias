// Script para forçar login como farmácia
// Execute este script no console do navegador

console.log('🔄 Forçando login como farmácia...');

// 1. Limpar localStorage
localStorage.clear();
console.log('✅ localStorage limpo');

// 2. Fazer login como farmácia
async function fazerLoginFarmacia() {
  try {
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
      console.log('🔑 Token:', data.token);
      
      // Salvar no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      console.log('💾 Dados salvos no localStorage');
      console.log('🔄 Recarregando página...');
      
      // Recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } else {
      console.error('❌ Erro no login:', data);
    }
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
  }
}

// Executar login
fazerLoginFarmacia(); 