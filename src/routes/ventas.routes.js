const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas para consultar la vista y actualizar gestión
router.get('/activas', ventaController.getVentasActivas);
router.put('/gestion/:num_solicitud', ventaController.updateGestionVenta);

module.exports = router;