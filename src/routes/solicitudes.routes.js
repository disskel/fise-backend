const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const ventaController = require('../controllers/ventaController');

// Ruta para subir el Excel
router.post('/sync', upload.single('file'), ventaController.syncSolicitudes);

module.exports = router;