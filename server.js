// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/db');

const app = express();

// CONFIGURACIÓN DE CORS PARA PRODUCCIÓN
app.use(cors({
  // Permitimos localhost para desarrollo y en el futuro agregaremos la URL de tu frontend en la nube
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Verificación de conexión (Render usará las variables de entorno configuradas)
db.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Error en Render -> Supabase:', err.stack);
  else console.log('Servidor en Render conectado a Supabase con éxito');
});

// Rutas
app.use('/api/maestros', require('./src/routes/maestros.routes'));
app.use('/api/ventas', require('./src/routes/ventas.routes'));
app.use('/api/solicitudes', require('./src/routes/solicitudes.routes'));

// Render asigna automáticamente el puerto en la variable process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend FISE operativo en puerto ${PORT}`);
});