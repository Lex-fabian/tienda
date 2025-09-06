const ZonaModel = require('../model/zonaModel');

const zonaController = {
    obtenerZonas: async (req, res) => {
        try {
            const zonas = await ZonaModel.obtenerTodas();
            res.json(zonas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerZonaPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const zona = await ZonaModel.obtenerPorId(id);
            
            if (!zona) {
                return res.status(404).json({ error: 'Zona no encontrada' });
            }
            
            res.json(zona);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearZona: async (req, res) => {
        try {
            const datosZona = req.body;
            const id = await ZonaModel.crear(datosZona);
            res.status(201).json({ id, message: 'Zona creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizarZona: async (req, res) => {
        try {
            const { id } = req.params;
            const datosZona = req.body;
            const filasAfectadas = await ZonaModel.actualizar(id, datosZona);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Zona no encontrada' });
            }
            
            res.json({ message: 'Zona actualizada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminarZona: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await ZonaModel.eliminar(id);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Zona no encontrada' });
            }
            
            res.json({ message: 'Zona eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = zonaController;