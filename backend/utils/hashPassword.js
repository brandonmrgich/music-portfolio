// Usage: node hashPassword.js 'yourpassword'
const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node hashPassword.js "yourpassword"');
  process.exit(1);
}

const saltRounds = 12;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('Hashed password:', hash);
}); 