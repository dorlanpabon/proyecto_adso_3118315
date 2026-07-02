var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
const pool = require('../db/connection');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sanitizeUser, isValidRole, isValidStatus } = require('../lib/users');

router.use(authenticateToken);
router.use(authorizeRoles('coordinador'));

router.get('/', async function (req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, name, email, role, status FROM users ORDER BY created_at DESC'
    );
    return res.json({ users: rows.map(sanitizeUser) });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, name, email, role, status FROM users WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/', async function (req, res) {
  const { username, name, email, password, role, status = 'activo' } = req.body;

  if (!username || !name || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (!isValidRole(role) || !isValidStatus(status)) {
    return res.status(400).json({ message: 'Rol o estado inválido' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (username, name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [username, name, email, passwordHash, role, status]
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

router.put('/:id', async function (req, res) {
  const { username, name, email, password, role, status } = req.body;

  if (!username || !name || !email || !role || !status) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (!isValidRole(role) || !isValidStatus(status)) {
    return res.status(400).json({ message: 'Rol o estado inválido' });
  }

  try {
    const values = [username, name, email, role, status];
    let sql = 'UPDATE users SET username = ?, name = ?, email = ?, role = ?, status = ?';

    if (password) {
      const passwordHash = await bcrypt.hash(password, 12);
      sql += ', password_hash = ?';
      values.push(passwordHash);
    }

    sql += ' WHERE id = ?';
    values.push(req.params.id);

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const [rows] = await pool.query(
      'SELECT id, username, name, email, role, status FROM users WHERE id = ?',
      [req.params.id]
    );

    return res.json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El usuario o correo ya existe' });
    }

    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
