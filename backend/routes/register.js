var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
const pool = require('../db/connection');
const { sanitizeUser, isValidRole } = require('../lib/users');

router.post('/', async function (req, res) {
  const { username, name, email, password, role = 'aprendiz' } = req.body;

  if (!username || !name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (!isValidRole(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [username, name, email, passwordHash, role]
    );
    const [rows] = await pool.query(
      'SELECT id, username, name, email, role, status FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El usuario o correo ya existe' });
    }

    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
