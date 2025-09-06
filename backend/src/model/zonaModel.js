const db = require('../config/conexion');

class ZonaModel {
    static async obtenerTodas() {
        const [rows] = await db.query('SELECT * FROM zona');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM zona WHERE id_zona = ?', [id]);
        return rows[0];
    }

    static async crear(datosZona) {
        const { nombre_zona, descripcion, referencia } = datosZona;
        const [result] = await db.query(
            'INSERT INTO zona (nombre_zona, descripcion, referencia) VALUES (?, ?, ?)',
            [nombre_zona, descripcion, referencia]
        );
        return result.insertId;
    }

    static async actualizar(id, datosZona) {
        const { nombre_zona, descripcion, referencia } = datosZona;
        const [result] = await db.query(
            'UPDATE zona SET nombre_zona = ?, descripcion = ?, referencia = ? WHERE id_zona = ?',
            [nombre_zona, descripcion, referencia, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM zona WHERE id_zona = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = ZonaModel;