var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var router = express.Router();
const pool = require('../db/connection');
const { getJwtSecret } = require('../middleware/auth');
const { sanitizeUser } = require('../lib/users');

router.post('/', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, username, name, email, password_hash, role, status FROM users WHERE username = ? AND status = ? LIMIT 1',
      [username, 'activo']
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }

    const safeUser = sanitizeUser(user);
    const token = jwt.sign(safeUser, getJwtSecret(), {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    return res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login failed', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      message: error.message
    });
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
