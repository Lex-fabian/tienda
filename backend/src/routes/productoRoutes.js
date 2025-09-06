const express = require('express');
const router = express.Router();
const productoController = require('../controller/productoControl');

router.get('/', productoController.getVerTodo);
router.get('/bajo-stock', productoController.getBajoStock);
router.get('/categoria/:categoria', productoController.getVerCategoria);
router.get('/:id', productoController.getVerPorId);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;