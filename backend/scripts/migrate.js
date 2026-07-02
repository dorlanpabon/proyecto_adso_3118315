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

  await ensureColumn('name', 'VARCHAR(120) NULL');
  await ensureColumn('password_hash', 'VARCHAR(255) NULL');
  await ensureColumn('status', 'VARCHAR(20) NULL');

  if (await hasColumn('full_name')) {
    await pool.query('UPDATE users SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL');
  }

  if (await hasColumn('password')) {
    await pool.query('UPDATE users SET password_hash = password WHERE password_hash IS NULL AND password IS NOT NULL');
  }

  if (await hasColumn('is_active')) {
    await pool.query("UPDATE users SET status = CASE WHEN is_active = 1 THEN 'activo' ELSE 'inactivo' END WHERE status IS NULL");
  }

  await pool.query("ALTER TABLE users MODIFY COLUMN role VARCHAR(30) NOT NULL DEFAULT 'aprendiz'");
  await pool.query(`UPDATE users
    SET role = CASE role
      WHEN 'admin' THEN 'coordinador'
      WHEN 'coordinator' THEN 'coordinador'
      WHEN 'instructor' THEN 'instructor'
      WHEN 'apprentice' THEN 'aprendiz'
      ELSE role
    END`);
  await pool.query("UPDATE users SET role = 'aprendiz' WHERE role NOT IN ('coordinador', 'instructor', 'aprendiz')");
  await pool.query("UPDATE users SET status = 'activo' WHERE status NOT IN ('activo', 'inactivo') OR status IS NULL");
  await pool.query('ALTER TABLE users MODIFY COLUMN username VARCHAR(80) NOT NULL');
  await pool.query('ALTER TABLE users MODIFY COLUMN name VARCHAR(120) NOT NULL');
  await pool.query('ALTER TABLE users MODIFY COLUMN email VARCHAR(160) NOT NULL');
  await pool.query('ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NOT NULL');
  await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('coordinador', 'instructor', 'aprendiz') NOT NULL DEFAULT 'aprendiz'");
  await pool.query("ALTER TABLE users MODIFY COLUMN status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'");
  await ensureIndex('users_role_index', 'CREATE INDEX users_role_index ON users (role)');
  await ensureIndex('users_status_index', 'CREATE INDEX users_status_index ON users (status)');
  await pool.end();
  console.log('Migraciones aplicadas');
}

async function ensureColumn(name, definition) {
  if (await hasColumn(name)) {
    return;
  }

  await pool.query(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
}

async function hasColumn(name) {
  const [rows] = await pool.query('SHOW COLUMNS FROM users LIKE ?', [name]);

  return rows.length > 0;
}

async function ensureIndex(name, sql) {
  const [rows] = await pool.query('SHOW INDEX FROM users WHERE Key_name = ?', [name]);

  if (rows.length === 0) {
    await pool.query(sql);
  }
}

migrate().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
