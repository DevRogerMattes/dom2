const { Pool } = require('pg');

const pool = new Pool({
  user: 'domius',
  host: 'localhost',
  database: 'domius',
  password: 'aA@2291755',
  port: 5432,
});

async function runMigration() {
  try {
    // Primeiro vamos verificar se a coluna já existe
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name = 'user_id'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('Column user_id already exists in products table.');
      return;
    }

    // Adicionar a coluna user_id
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN user_id TEXT NOT NULL DEFAULT 'system'
    `);
    
    console.log('Successfully added user_id column to products table');

    // Criar índice para melhor performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id)
    `);
    
    console.log('Successfully created index on user_id column');

  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();