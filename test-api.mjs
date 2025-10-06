// Teste da API de planos
async function testAPI() {
  try {
    console.log('Testando API de planos...');
    
    const response = await fetch('http://localhost:3001/api/subscription-plans');
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Planos:', data);
    } else {
      const errorText = await response.text();
      console.log('Erro na resposta:', errorText);
    }
    
    // Testar também a assinatura do usuário
    console.log('\nTestando assinatura do usuário...');
    const userResponse = await fetch('http://localhost:3001/api/user-subscription/test-user-id');
    console.log('Status da assinatura:', userResponse.status);
    
    if (userResponse.status === 404) {
      console.log('Usuário não tem assinatura ativa (esperado)');
    } else if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('Dados do usuário:', userData);
    } else {
      const userErrorText = await userResponse.text();
      console.log('Erro na assinatura:', userErrorText);
    }
    
  } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

testAPI();