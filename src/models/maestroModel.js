const db = require('../config/db');

const Maestro = {
  // Obtener registros activos de cualquier tabla maestra
  getAll: async (tabla) => {
    const query = `SELECT * FROM ${tabla} WHERE activo = true ORDER BY nombre ASC`;
    const { rows } = await db.query(query);
    return rows;
  },

  // Crear nuevo registro con retorno inmediato
  create: async (tabla, datos) => {
    const query = `
      INSERT INTO ${tabla} (dni_ruc, nombre) 
      VALUES ($1, $2) 
      RETURNING *`;
    const { rows } = await db.query(query, [datos.dni_ruc, datos.nombre]);
    return rows[0];
  },

  // Soft Delete (Eliminación Lógica) para no romper el histórico de ventas
  delete: async (tabla, idFieldName, id) => {
    const query = `
      UPDATE ${tabla} 
      SET activo = false, fecha_eliminacion = CURRENT_TIMESTAMP 
      WHERE ${idFieldName} = $1 
      RETURNING *`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Maestro;