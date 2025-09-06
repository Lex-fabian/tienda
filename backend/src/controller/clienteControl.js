const ClienteModel = require('../model/clienteModel');

const clienteController = {
    obtenerClientes: async (req, res) => {
        try {
            const clientes = await ClienteModel.obtenerTodos();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerClientePorId: async (req, res) => {
        try {
            const { id } = req.params;
            const cliente = await ClienteModel.obtenerPorId(id);
            
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearCliente: async (req, res) => {
        try {
            const datosCliente = req.body;
            const id = await ClienteModel.crear(datosCliente);
            res.status(201).json({ id, message: 'Cliente creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizarCliente: async (req, res) => {
        try {
            const { id } = req.params;
            const datosCliente = req.body;
            const filasAfectadas = await ClienteModel.actualizar(id, datosCliente);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            
            res.json({ message: 'Cliente actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminarCliente: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await ClienteModel.eliminar(id);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            
            res.json({ message: 'Cliente eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = clienteController;