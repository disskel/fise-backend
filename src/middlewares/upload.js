const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que la carpeta 'uploads' exista en la raíz
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceptar solo archivos Excel
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no válido. Solo se permiten archivos Excel.'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;