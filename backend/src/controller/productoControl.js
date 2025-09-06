const Producto = require('../model/productoModel');

const productoController = {
    getVerTodo: async (req, res) => {
        try {
            const productos = await Producto.getVerProductos();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getVerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Producto.getVerProductoPorId(id);
            
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const productoData = req.body;
            const id = await Producto.crearProducto(productoData);
            res.status(201).json({ id, message: 'Producto creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const productoData = req.body;
            const affectedRows = await Producto.actualizarProducto(id, productoData);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            
            res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await Producto.eliminarProducto(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            
            res.json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getVerCategoria: async (req, res) => {
        try {
            const { categoria } = req.params;
            const productos = await Producto.getVerCategoria(categoria);
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBajoStock: async (req, res) => {
        try {
            const { limite } = req.query;
            const productos = await Producto.getBajoStock(limite || 10);
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productoController;