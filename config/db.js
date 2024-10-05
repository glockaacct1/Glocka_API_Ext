const mysql = require('mysql');
const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_extension',
    charset: 'utf8mb4',
    timezone: '+00:00'
})

conn.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

module.exports = conn;