const xlsx = require('xlsx');
const { formatExcelDate } = require('../utils/dateUtils');

const processExcel = async (filePath) => {
  const workbook = xlsx.readFile(filePath); //
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convertimos a JSON
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Mapeamos las columnas de Osinergmin a tu base de datos
  return data.map(row => ({
    num_solicitud: String(row['Nro. Solicitud'] || ''), // Forzamos String para evitar errores
    dni_solicitante: String(row['DNI/RUC Solicitante'] || ''),
    nombre_cliente: row['Nombre Cliente'] || '',
    estado_solicitud: row['Estado Solicitud'] || '',
    fecha_aprobacion: formatExcelDate(row['Fecha Aprobación']),
    malla: row['Malla'] || '',
    anulada: row['Estado Solicitud'] === 'Anulada' // Lógica automática de anulación
  }));
};

module.exports = { processExcel };