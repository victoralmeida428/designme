// scripts/rollback.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrateDown() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('🟠 Iniciando rollback (DOWN)...');

    await client.query('BEGIN');

    // 1. Verifica se a tabela de controle existe
    const tableCheck = await client.query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = '_migrations'
        );
    `);
    
    if (!tableCheck.rows[0].exists) {
        console.log('⚠️ Tabela de migrações não encontrada. Nada para reverter.');
        await client.query('ROLLBACK');
        return;
    }

    // 2. Pega a ÚLTIMA migração aplicada
    const lastMigrationResult = await client.query(
        'SELECT * FROM _migrations ORDER BY id DESC LIMIT 1'
    );

    if (lastMigrationResult.rows.length === 0) {
        console.log('✅ Nenhuma migração para reverter (banco limpo).');
        await client.query('ROLLBACK'); // Rollback técnico apenas para fechar a transação limpa
        return;
    }

    const lastMigration = lastMigrationResult.rows[0];
    const upFileName = lastMigration.name;
    
    // 3. Descobre o nome do arquivo DOWN correspondente
    // Exemplo: muda "init.up.sql" para "init.down.sql"
    const downFileName = upFileName.replace('.up.sql', '.down.sql');
    const migrationsDir = path.join(__dirname, '../migrations');
    const downFilePath = path.join(migrationsDir, downFileName);

    console.log(`REVERTENDO: ${upFileName} ➡️ Usando ${downFileName}`);

    // 4. Verifica se o arquivo .down existe
    if (!fs.existsSync(downFilePath)) {
        throw new Error(`Arquivo de rollback não encontrado: ${downFileName}`);
    }

    // 5. Executa o SQL de Down
    const sql = fs.readFileSync(downFilePath, 'utf8');
    await client.query(sql);

    // 6. Remove o registro da tabela de controle
    await client.query('DELETE FROM _migrations WHERE id = $1', [lastMigration.id]);

    await client.query('COMMIT');
    console.log(`✅ Rollback concluído: ${upFileName} foi revertido.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro no rollback:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateDown();