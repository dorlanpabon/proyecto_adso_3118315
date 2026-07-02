require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../db/connection');

async function migrate() {
  const migrationPath = path.join(__dirname, '..', 'migrations', '001_create_users.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }

  await pool.end();
  console.log('Migraciones aplicadas');
}

migrate().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
