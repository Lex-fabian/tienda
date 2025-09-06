const db = require('../config/conexion');

class ClienteModel {
    static async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM cliente WHERE estado = "A"');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM cliente WHERE id_cliente = ? AND estado = "A"', [id]);
        return rows[0];
    }

    static async crear(datosCliente) {
        const { nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion } = datosCliente;
        const [result] = await db.query(
            'INSERT INTO cliente (nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion]
        );
        return result.insertId;
    }

    static async actualizar(id, datosCliente) {
        const { nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion } = datosCliente;
        const [result] = await db.query(
            'UPDATE cliente SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, tipo_identificacion = ?, identificacion = ? WHERE id_cliente = ?',
            [nombre, apellido, email, telefono, direccion, tipo_identificacion, identificacion, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await db.query('UPDATE cliente SET estado = "I" WHERE id_cliente = ?', [id]);
        return result.affectedRows;
    }

    static async obtenerPorIdentificacion(identificacion) {
        const [rows] = await db.query('SELECT * FROM cliente WHERE identificacion = ? AND estado = "A"', [identificacion]);
        return rows[0];
    }
}

module.exports = ClienteModel;