const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function probarConexion() {
    try {
        const [rows] = await pool.query("SELECT 'CONEXION EXITOSA' as resultado");
        console.log(rows[0].resultado);
    }
    catch (error) {
        console.error('ERROR AL CONECTAR A LA BDD', error.message);
    }
}

probarConexion();

module.exports = pool;