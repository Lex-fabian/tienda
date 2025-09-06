const express = require('express');
const router = express.Router();
const clienteControl = require('../controller/clienteControl');
 
router.get('/', clienteControl.obtenerClientes);
router.get('/:id', clienteControl.obtenerClientePorId);
router.post('/', clienteControl.crearCliente);
router.put('/:id', clienteControl.actualizarCliente);
router.delete('/:id', clienteControl.eliminarCliente);

module.exports = router;