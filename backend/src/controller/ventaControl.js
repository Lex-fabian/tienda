const VentaModel = require('../model/ventaModel');

const ventaController = {
    obtenerVentas: async (req, res) => {
        try {
            const ventas = await VentaModel.obtenerTodas();
            res.json(ventas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerVentaPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const venta = await VentaModel.obtenerPorId(id);
            
            if (!venta) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }
            
            res.json(venta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearVenta: async (req, res) => {
        try {
            const datosVenta = req.body;
            const id = await VentaModel.crear(datosVenta);
            res.status(201).json({ id, message: 'Venta creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminarVenta: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await VentaModel.eliminar(id);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }
            
            res.json({ message: 'Venta eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getDashboard: async (req, res) => {
        try {
            const dashboard = await VentaModel.obtenerTotalesDashboard();
            res.json(dashboard);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerReporteVentasPorVendedor: async (req, res) => {
        try {
            const ventas = await VentaModel.obtenerVentasPorVendedor();
            res.json(ventas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerReporteVendedoresSinVentas: async (req, res) => {
        try {
            const { fecha_inicio: fechaInicio, fecha_fin: fechaFin } = req.query;
            const vendedores = await VentaModel.obtenerVendedoresSinVentas(fechaInicio, fechaFin);
            res.json(vendedores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerReporteZonasSinVentas: async (req, res) => {
        try {
            const { fecha_inicio: fechaInicio, fecha_fin: fechaFin } = req.query;
            const zonas = await VentaModel.obtenerZonasSinVentas(fechaInicio, fechaFin);
            res.json(zonas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerReporteVentasAnuales: async (req, res) => {
        try {
            const ventas = await VentaModel.obtenerVentasAnualesPorCliente();
            res.json(ventas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ventaController;