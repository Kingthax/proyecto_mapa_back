const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia por tu usuario de MySQL
  password: 'root', // Cambia por tu contraseña
  database: 'gasfiteria',
  port: 3306,
  charset: 'utf8mb4', // Cambia la codificación a utf8mb4
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});

module.exports = db;
