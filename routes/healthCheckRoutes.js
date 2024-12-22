// routes/healthCheckRoutes.js
const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController');
const router = express.Router();

// Definir la ruta para el health check
router.get('/', healthCheck);

module.exports = router;