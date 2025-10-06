// Script para executar a migração via Node.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    user: 'domius',
    host: 'localhost',
    database: 'domius',
    password: 'aA@2291755',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco!');
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '8. subscription_plans.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executando migração de subscription_plans...');
    await client.query(migrationSQL);
    console.log('✅ Migração executada com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
  } finally {
    await client.end();
  }
}

runMigration();