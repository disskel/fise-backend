const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/db');

const app = express();

// SOLUCIÓN DEFINITIVA AL CORS
// Permitimos que tu frontend (localhost o nube) se comunique sin bloqueos
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Prueba de conexión a Supabase al arrancar
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a Supabase:', err.stack);
  } else {
    console.log('Conexión exitosa a Supabase establecida:', res.rows[0].now);
  }
});

// Importación de Rutas (las crearemos en los siguientes pasos)
app.use('/api/maestros', require('./src/routes/maestros.routes'));
app.use('/api/ventas', require('./src/routes/ventas.routes'));
app.use('/api/solicitudes', require('./src/routes/solicitudes.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor FISE Cloud en puerto ${PORT}`);
});