const express = require('express');
const path = require('path');
const citasRoutes = require('./routes/citas'); // Importación de rutas
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const app = express();
const cors = require('cors');
app.use(cors());


// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/citas', citasRoutes); // Ruta para citas
app.use('/api/healthcheck', healthCheckRoutes); // Ruta de health check

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicio del servidor
if (require.main === module) {
  // Si el archivo se ejecuta directamente (node server.js), inicia el servidor
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app; // Exporta la app para las pruebas

