const db = require('../config/conexion');

class Producto {
    static async getVerProductos() {
        const [rows] = await db.query('SELECT * FROM producto');
        return rows;
    }

    static async getVerProductoPorId(id) {
        const [rows] = await db.query('SELECT * FROM producto WHERE id_producto = ?', [id]);
        return rows[0];
    }

    static async crearProducto(producto) {
        const { nombre, descripcion, precio, stock, categoria } = producto;
        const [result] = await db.query(
            'INSERT INTO producto (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, categoria]
        );
        return result.insertId;
    }

    static async actualizarProducto(id, producto) {
        const { nombre, descripcion, precio, stock, categoria } = producto;
        const [result] = await db.query(
            'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id_producto = ?',
            [nombre, descripcion, precio, stock, categoria, id]
        );
        return result.affectedRows;
    }

    static async eliminarProducto(id) {
        const [result] = await db.query(
            'DELETE FROM producto WHERE id_producto = ?',
            [id]
        );
        return result.affectedRows;
    }

    static async actualizarStock(id, cantidad) {
        const [result] = await db.query(
            'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
            [cantidad, id]
        );
        return result.affectedRows;
    }

    static async getVerCategoria(categoria) {
        const [rows] = await db.query('SELECT * FROM producto WHERE categoria = ?', [categoria]);
        return rows;
    }

    static async getBajoStock(limite = 10) {
        const [rows] = await db.query('SELECT * FROM producto WHERE stock <= ?', [limite]);
        return rows;
    }
}

module.exports = Producto;