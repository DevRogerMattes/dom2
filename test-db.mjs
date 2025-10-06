// Teste das tabelas de assinatura
async function testTables() {
  try {
    console.log('Testando conexão com o banco...');
    
    const response = await fetch('http://localhost:3001/api/test-db');
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Resultado:', data);
    } else {
      const errorText = await response.text();
      console.log('Erro:', errorText);
    }
    
  } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

testTables();