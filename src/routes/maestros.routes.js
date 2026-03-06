const express = require('express');
const router = express.Router();
const maestroController = require('../controllers/maestroController');

// Rutas dinámicas para todos tus maestros
router.get('/:tabla', maestroController.getMaestros);
router.post('/:tabla', maestroController.createMaestro);
router.delete('/:tabla/:id', maestroController.softDeleteMaestro);

module.exports = router;