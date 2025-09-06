const express = require('express');
const router = express.Router();
const zonaController = require('../controller/zonaControl');

router.get('/', zonaController.obtenerZonas);
router.get('/:id', zonaController.obtenerZonaPorId);
router.post('/', zonaController.crearZona);
router.put('/:id', zonaController.actualizarZona);
router.delete('/:id', zonaController.eliminarZona);

module.exports = router;