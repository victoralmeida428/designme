// scripts/migrate.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrateUp() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('🔵 Iniciando migração (UP)...');
    
    // 1. Cria a tabela de controle se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Busca migrations já executadas
    const { rows: appliedMigrations } = await client.query('SELECT name FROM _migrations');
    const appliedNames = new Set(appliedMigrations.map(m => m.name));

    // 3. Lê arquivos da pasta
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.up.sql')) // Pega apenas os .up
        .sort(); // Garante ordem (ex: 001, 002)

    // 4. Filtra apenas os que NÃO foram rodados
    const pendingFiles = files.filter(file => !appliedNames.has(file));

    if (pendingFiles.length === 0) {
      console.log('✅ Nenhuma nova migração pendente.');
      return;
    }

    // 5. Executa as novas migrations em transação
    await client.query('BEGIN');
    
    for (const file of pendingFiles) {
        console.log(`📄 Executando: ${file}`);
        const sqlPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        // Executa o SQL do arquivo
        await client.query(sql);
        
        // Salva no histórico
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
    }
    
    await client.query('COMMIT');
    console.log(`✅ Sucesso! ${pendingFiles.length} migrações aplicadas.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro na migração (ROLLBACK executado):', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateUp();