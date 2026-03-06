const Venta = require('../models/ventaModel');
const importService = require('../services/importService');

exports.getVentasActivas = async (req, res) => {
    try {
        const ventas = await Venta.getVentasActivas(); //
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las ventas activas' });
    }
};

exports.syncSolicitudes = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }

        // 1. Procesar el Excel usando el servicio
        const solicitudesJson = await importService.processExcel(req.file.path);

        // 2. Guardar/Actualizar cada registro en la DB
        let procesados = 0;
        for (const solicitud of solicitudesJson) {
            await Venta.upsertSolicitud(solicitud);
            procesados++;
        }

        res.json({ 
            message: 'Sincronización completada', 
            detalles: { total: solicitudesJson.length, procesados } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error durante la sincronización del Excel' });
    }
};

// Este método servirá para cuando edites manualmente en la web
exports.updateGestionVenta = async (req, res) => {
    try {
        const { num_solicitud } = req.params;
        const datos = req.body;
        // Aquí llamaremos a una función del modelo para actualizar la tabla gestion_ventas
        res.json({ message: 'Gestión actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la gestión' });
    }
};