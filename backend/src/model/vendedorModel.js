const db = require('../config/conexion');
const bcrypt = require('bcryptjs');

class Vendedor {
    static async getVerTodosLosVendedores() {
        const [rows] = await db.query('SELECT * FROM vendedor WHERE estado = "A"');
        return rows;
    }

    static async getVerVendedorPorId(id) {
        const [rows] = await db.query('SELECT * FROM vendedor WHERE id_vendedor = ? AND estado = "A"', [id]);
        return rows[0];
    }

    static async crearNuevoVendedor(vendedor) {
        const { nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion, usuario, clave } = vendedor;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt);

        const [result] = await db.query(
            'INSERT INTO vendedor (nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion, usuario, clave) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion, usuario, hashedPassword]
        );
        return result.insertId;
    }

    static async actualizarVendedorPorId(id, vendedor) {
        const { nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion, usuario } = vendedor;
        const [result] = await db.query(
            'UPDATE vendedor SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, tipo_identificacion = ?, identificacion = ?, usuario = ? WHERE id_vendedor = ?',
            [nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion, usuario, id]
        );
        return result.affectedRows;
    }

    static async eliminarVendedorPorId(id) {
        const [result] = await db.query('UPDATE vendedor SET estado = "I" WHERE id_vendedor = ?', [id]);
        return result.affectedRows;
    }

    static async getVerVendedor(usuario) {
        const [rows] = await db.query('SELECT * FROM vendedor WHERE usuario = ? AND estado = "A"', [usuario]);
        return rows[0];
    }

    static async getVerEmailVendedor(email) {
        const [rows] = await db.query('SELECT * FROM vendedor WHERE email = ? AND estado = "A"', [email]);
        return rows[0];
    }
}

module.exports = Vendedor;