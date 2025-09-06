const db = require('../config/conexion');

class VentaModel {
    static async obtenerTodas() {
        const [rows] = await db.query("CALL sp_obtener_ventas_completas()");
        return rows[0];
    }

    /**
     * Obtiene una venta específica por su ID junto con sus detalles.
     * @param {number} id - El ID de la venta a obtener.
     * @returns {Promise<object|null>} Un objeto con la venta y sus detalles, o null si no se encuentra.
     */
    static async obtenerPorId(id) {
        // Se utiliza un procedimiento almacenado para mantener la consistencia y seguridad.
        const [ventaResult] = await db.query("CALL sp_obtener_venta_por_id(?)", [id]);
        const venta = ventaResult[0];
        
        if (venta.length > 0) {
            const [detallesResult] = await db.query("CALL sp_obtener_detalles_venta(?)", [id]);
            return {
                venta: venta[0],
                detalles: detallesResult[0]
            };
        }
        return null;
    }

    /**
     * Crea una nueva venta y sus detalles.
     * @param {object} datosVenta - Los datos de la venta, incluyendo los detalles.
     * @returns {Promise<number>} El ID de la venta creada.
     */
    static async crear(datosVenta) {
        const { id_cliente, id_vendedor, id_zona, detalles } = datosVenta;
        const detallesJSON = JSON.stringify(detalles);
        const [result] = await db.query("CALL sp_crear_venta(?, ?, ?, ?)", [
            id_cliente, id_vendedor, id_zona, detallesJSON
        ]);
        return result[0][0].id_venta_creada;
    }

    static async eliminar(id) {
        const [result] = await db.query('CALL sp_eliminar_venta(?)', [id]);
        return result.affectedRows;
    }

    static async obtenerTotalesDashboard() {
        const [rows] = await db.query('CALL sp_dashboard_totales()');
        return rows[0][0];
    }

    static async obtenerVentasPorVendedor() {
        const [rows] = await db.query('CALL sp_zona_ventas_por_vendedor()');
        return rows[0];
    }

    /**
     * Obtiene vendedores que no han realizado ventas en un rango de fechas.
     * @param {string} fechaInicio - Fecha de inicio del rango.
     * @param {string} fechaFin - Fecha de fin del rango.
     * @returns {Promise<Array>} Un arreglo de vendedores.
     */
    static async obtenerVendedoresSinVentas(fechaInicio, fechaFin) {
        const [rows] = await db.query('CALL sp_vendedores_sin_ventas(?, ?)', [fechaInicio, fechaFin]);
        return rows[0];
    }

    /**
     * Obtiene zonas que no han tenido ventas en un rango de fechas.
     * @param {string} fechaInicio - Fecha de inicio del rango.
     * @param {string} fechaFin - Fecha de fin del rango.
     * @returns {Promise<Array>} Un arreglo de zonas.
     */
    static async obtenerZonasSinVentas(fechaInicio, fechaFin) {
        const [rows] = await db.query('CALL sp_zonas_sin_ventas(?, ?)', [fechaInicio, fechaFin]);
        return rows[0];
    }

    static async obtenerVentasAnualesPorCliente() {
        const [rows] = await db.query('CALL sp_ventas_anuales_cliente()');
        return rows[0];
    }
}

module.exports = VentaModel;