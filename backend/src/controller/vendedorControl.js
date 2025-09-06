const Vendedor = require('../model/vendedorModel');

const vendedorController = {
    getVerVendedores: async (req, res) => {
        try {
            const vendedores = await Vendedor.getVerTodosLosVendedores();
            res.json(vendedores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getVerVendedorId: async (req, res) => {
        try {
            const { id } = req.params;
            const vendedor = await Vendedor.getVerVendedorPorId(id);
            
            if (!vendedor) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
            
            res.json(vendedor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const vendedorData = req.body;
            const id = await Vendedor.crearNuevoVendedor(vendedorData);
            res.status(201).json({ id, message: 'Vendedor creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const vendedorData = req.body;
            const affectedRows = await Vendedor.actualizarVendedorPorId(id, vendedorData);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
            
            res.json({ message: 'Vendedor actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await Vendedor.eliminarVendedorPorId(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
            
            res.json({ message: 'Vendedor eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = vendedorController;