const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect(err => {
  console.log(process.env.DB_HOST, process.env.DB_USER);
  if (err) {
    console.error('❌ Kết nối MySQL thất bại:', err.message);
  } else {
    console.log('✅ Kết nối MySQL thành công!');
  }
});

module.exports = db;
