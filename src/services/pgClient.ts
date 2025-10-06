// Serviço de conexão PostgreSQL puro
import { Pool } from 'pg';

const pool = new Pool({
  user: 'domius', // ajuste para seu ambiente
  host: 'localhost',
  database: 'domius',
  password: 'aA@2291755',
  port: 5432,
});

export default pool;
