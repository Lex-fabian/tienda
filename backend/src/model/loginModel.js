const conexion = require('../config/conexion');

class loginModel {
  async getUsuarioPorNombre(usuario) {
    const sql = 'SELECT * FROM vendedor WHERE usuario = ? AND estado = "A"';
    const [rows] = await conexion.query(sql, [usuario]);
    return rows[0];
  }
}

module.exports = new loginModel();