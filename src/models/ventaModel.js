const db = require('../config/db');

const Venta = {
  // Sincroniza los datos del portal con tus dos tablas
  upsertSolicitud: async (s) => {
    // 1. Actualizamos o creamos la solicitud base
    const querySolicitud = `
      INSERT INTO solicitudes (num_solicitud, dni_solicitante, nombre_cliente, estado_solicitud, fecha_aprobacion, malla, anulada)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (num_solicitud) DO UPDATE SET
        estado_solicitud = EXCLUDED.estado_solicitud,
        fecha_aprobacion = EXCLUDED.fecha_aprobacion,
        malla = EXCLUDED.malla,
        anulada = EXCLUDED.anulada,
        ultima_actualizacion = CURRENT_TIMESTAMP;`;
    
    await db.query(querySolicitud, [s.num_solicitud, s.dni_solicitante, s.nombre_cliente, s.estado_solicitud, s.fecha_aprobacion, s.malla, s.anulada]);

    // 2. Aseguramos que exista una entrada en gestion_ventas para los datos manuales
    const queryGestion = `
      INSERT INTO gestion_ventas (num_solicitud)
      VALUES ($1)
      ON CONFLICT (num_solicitud) DO NOTHING;`;
    
    await db.query(queryGestion, [s.num_solicitud]);
  },

  // Obtener todo desde la VISTA activa
  getVentasActivas: async () => {
    const { rows } = await db.query('SELECT * FROM vista_gestion_ventas_activa');
    return rows;
  }
};

module.exports = Venta;