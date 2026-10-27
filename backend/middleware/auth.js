const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const sign = (user) => jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '7d' });

function decode(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  try { return jwt.verify(token, SECRET); } catch { return null; }
}

function auth(req, res, next) {
  const user = decode(req);
  if (!user) return res.status(401).json({ message: 'Please log in' });
  req.user = user;
  next();
}

function optionalAuth(req, res, next) {
  req.user = decode(req);
  next();
}

module.exports = { sign, auth, optionalAuth };
