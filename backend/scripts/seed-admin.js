require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('../db/connection');

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || '123';
  const name = process.env.ADMIN_NAME || 'Administrador';
  const email = process.env.ADMIN_EMAIL || 'admin@local.test';
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO users (username, name, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, 'coordinador', 'activo')
     ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), password_hash = VALUES(password_hash), role = 'coordinador', status = 'activo'`,
    [username, name, email, passwordHash]
  );

  await pool.end();
  console.log(`Usuario coordinador listo: ${username}`);
}

seedAdmin().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
