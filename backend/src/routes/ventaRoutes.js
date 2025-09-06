const express = require('express');
const router = express.Router();
const ventaController = require('../controller/ventaControl');

router.get('/', ventaController.obtenerVentas);
router.get('/dashboard', ventaController.getDashboard);
router.get('/por-vendedor', ventaController.obtenerReporteVentasPorVendedor);
router.get('/vendedores-sin-ventas', ventaController.obtenerReporteVendedoresSinVentas);
router.get('/zonas-sin-ventas', ventaController.obtenerReporteZonasSinVentas);
router.get('/anuales', ventaController.obtenerReporteVentasAnuales);
router.get('/:id', ventaController.obtenerVentaPorId);
router.post('/', ventaController.crearVenta);
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;