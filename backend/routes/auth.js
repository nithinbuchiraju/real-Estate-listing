const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const db = require('../utils/db');
const { sign, auth } = require('../middleware/auth');

const clean = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone });

router.post('/register', (req, res) => {
  const { name, email, password, phone = '' } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const d = db.read();
  const mail = email.toLowerCase().trim();
  if (d.users.some((u) => u.email === mail)) return res.status(409).json({ message: 'Email already registered' });

  const user = {
    id: randomUUID(), name: name.trim(), email: mail, phone: phone.trim(),
    passwordHash: bcrypt.hashSync(password, 10), favorites: [], createdAt: new Date().toISOString(),
  };
  d.users.push(user);
  db.write(d);
  res.status(201).json({ token: sign(user), user: clean(user) });
});

router.post('/login', (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const user = db.read().users.find((u) => u.email === email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: clean(user) });
});

router.get('/me', auth, (req, res) => {
  const user = db.read().users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(clean(user));
});

module.exports = router;
