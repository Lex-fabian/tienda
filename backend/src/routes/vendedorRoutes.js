const express = require('express');
const router = express.Router();
const vendorController = require('../controller/vendedorControl');

router.get('/', vendorController.getVerVendedores);
router.get('/:id', vendorController.getVerVendedorId);
router.post('/', vendorController.crear);
router.put('/:id', vendorController.actualizar);
router.delete('/:id', vendorController.eliminar);

module.exports = router;