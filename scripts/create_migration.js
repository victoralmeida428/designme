// scripts/create_migration.js
const fs = require('fs');
const path = require('path');

// 1. Obtém o nome da migração passado via argumento
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('❌ Erro: Você precisa fornecer um nome para a migração.');
    console.error('👉 Exemplo: npm run db:create criar_tabela_usuarios');
    process.exit(1);
}

const migrationName = args.join('_').toLowerCase(); // Garante snake_case simples

// 2. Gera o Timestamp no formato YYYYMMDDHHMMSS
const now = new Date();
const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

// 3. Define o diretório de destino
const migrationsDir = path.resolve(__dirname, '../migrations');

// Cria a pasta migrations se ela não existir
if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
}

// 4. Define os nomes dos arquivos
const fileNameUp = `${timestamp}_${migrationName}.up.sql`;
const fileNameDown = `${timestamp}_${migrationName}.down.sql`;

const filePathUp = path.join(migrationsDir, fileNameUp);
const filePathDown = path.join(migrationsDir, fileNameDown);

// 5. Cria os arquivos vazios (com um comentário padrão)
const templateUp = `-- Migration UP: ${migrationName}\n-- Escreva seu SQL aqui:\n\n`;
const templateDown = `-- Migration DOWN: ${migrationName}\n-- Escreva o rollback aqui:\n\n`;

try {
    fs.writeFileSync(filePathUp, templateUp);
    fs.writeFileSync(filePathDown, templateDown);

    console.log('✅ Arquivos de migração criados com sucesso:');
    console.log(`   📄 ${fileNameUp}`);
    console.log(`   📄 ${fileNameDown}`);
} catch (err) {
    console.error('❌ Erro ao criar arquivos:', err);
}