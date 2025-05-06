const db = require('./db');
const bcrypt = require('bcrypt');

function buatUser(username, password, role = 'kasir') {
  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  stmt.run(username, hash, role);
}

function login(username, password) {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return null;

  return { id: user.id, username: user.username, role: user.role };
}

module.exports = { login, buatUser };
