require('dotenv').config();

const mysql = require('mysql2/promise');

const sslEnabled = process.env.DB_SSL === 'true';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proyecto_adso_3118315',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (sslEnabled) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
