// scripts/status.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrateStatus() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('🔍 Verificando status das migrações...\n');

    // 1. Verifica se a tabela de controle existe
    const tableCheck = await client.query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = '_migrations'
        );
    `);

    let appliedMigrations = [];
    if (tableCheck.rows[0].exists) {
        const { rows } = await client.query('SELECT name, applied_at FROM _migrations ORDER BY id ASC');
        appliedMigrations = rows;
    } else {
        console.log('⚠️ Tabela "_migrations" não existe no banco (Nenhuma migração rodou ainda).');
    }

    // Cria um mapa para busca rápida: { "nome_arquivo": "data_aplicacao" }
    const appliedMap = new Map(appliedMigrations.map(m => [m.name, m.applied_at]));

    // 2. Lê os arquivos da pasta
    const migrationsDir = path.join(__dirname, '../migrations');
    
    // Se a pasta não existir, avisa
    if (!fs.existsSync(migrationsDir)) {
        console.error('❌ Pasta "migrations" não encontrada na raiz do projeto.');
        return;
    }

    const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.up.sql'))
        .sort();

    // 3. Monta o relatório
    console.log('STATUS | ARQUIVO                      | DATA APLICAÇÃO');
    console.log('-------|------------------------------|----------------------');

    let pendingCount = 0;

    for (const file of files) {
        const isApplied = appliedMap.has(file);
        const statusIcon = isApplied ? '✅' : '⬜'; // Check ou quadrado vazio
        const date = isApplied 
            ? appliedMap.get(file).toLocaleString('pt-BR') 
            : 'Pendente';
        
        // Formatação simples de espaço para alinhar (padEnd)
        console.log(`${statusIcon}     | ${file.padEnd(28)} | ${date}`);

        if (!isApplied) pendingCount++;
    }

    // Verifica se tem migração no banco que não tem arquivo (Arquivo deletado?)
    const filesSet = new Set(files);
    const orphans = appliedMigrations.filter(m => !filesSet.has(m.name));
    
    if (orphans.length > 0) {
        console.log('\n⚠️  AVISO: Migrações registradas no banco mas sem arquivo local:');
        orphans.forEach(m => console.log(`   ❌ ${m.name} (Aplicado em: ${m.applied_at.toLocaleString()})`));
    }

    console.log('\n-------------------------------------------------------------');
    if (pendingCount > 0) {
        console.log(`🟡 Você tem ${pendingCount} migração(ões) pendente(s). Rode 'npm run db:up' para aplicar.`);
    } else {
        console.log('🟢 Tudo atualizado! Nenhuma migração pendente.');
    }

  } catch (err) {
    console.error('❌ Erro ao verificar status:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateStatus();