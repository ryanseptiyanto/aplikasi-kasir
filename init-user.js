// init-user.js
const { buatUser } = require('./backend/auth');

// Sesuaikan username & password default
buatUser('admin', 'admin123', 'admin');
console.log('🟢 User admin berhasil dibuat.');
