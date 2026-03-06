const Maestro = require('../models/maestroModel');

exports.getMaestros = async (req, res) => {
  try {
    const { tabla } = req.params; // asesoras, tecnicos, grupos, etc.
    const validTables = ['maestro_asesoras', 'maestro_tecnicos', 'maestro_grupos', 'maestro_observaciones_gen'];
    
    if (!validTables.includes(tabla)) return res.status(400).json({ error: 'Tabla no válida' });

    const datos = await Maestro.getAll(tabla);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMaestro = async (req, res) => {
  try {
    const { tabla } = req.params;
    const nuevo = await Maestro.create(tabla, req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro maestro' });
  }
};

exports.softDeleteMaestro = async (req, res) => {
  try {
    const { tabla, id } = req.params;
    // Definimos dinámicamente el nombre de la columna ID
    const idField = tabla === 'maestro_asesoras' ? 'id_asesora' : 
                    tabla === 'maestro_tecnicos' ? 'id_tecnico' :
                    tabla === 'maestro_grupos' ? 'id_grupo' : 'id_obs_gen';
    
    await Maestro.delete(tabla, idField, id);
    res.json({ message: 'Registro desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};