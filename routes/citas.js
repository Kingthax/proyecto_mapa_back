const express = require('express');
const router = express.Router();
const db = require('../db/connections.js'); // Asegúrate de que este archivo existe y configura tu base de datos
const nodemailer = require('nodemailer');

// Obtener todas las citas
router.get('/', (req, res) => {
  const query = 'SELECT * FROM citas order by Fecha';
  console.log("query:",query);
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las citas', error: err });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { idUsuario, idgasfiter, Fecha, Estado, calificacion } = req.body; // Obtener los valores desde el cuerpo de la solicitud
  const query = 'INSERT INTO citas (idUsuario, idgasfiter, Fecha, Estado, calificacion) VALUES (?, ?, ?, ?, ?)';

  // Ejecutar la consulta de inserción con los datos proporcionados
  db.query(query, [idUsuario, idgasfiter, Fecha, Estado, calificacion], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear la cita', error: err });
    }

    // Respuesta de éxito
    res.status(200).json({
      message: 'Cita creada exitosamente',
      citaId: results.insertId, // ID de la nueva cita insertada
    });
  });
});

// Actualizar una cita (toda la información por el body)
router.post('/update', (req, res) => {
  const { idCitas, Estado ,descripcion } = req.body;

  // Verificar que los campos requeridos estén presentes
  if (!idCitas || !descripcion) {
    return res.status(400).json({ message: 'El ID de la cita y la descripción son obligatorios' });
  }

  // Query de actualización
  const query = 'UPDATE citas SET descripcion = ?, Estado = ? WHERE idCitas = ?';

  // Ejecutar la consulta con los valores del body
  db.query(query, [descripcion, Estado ,idCitas], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar la cita', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json({ message: 'Cita actualizada exitosamente' });
  });
});


// Actualizar una cita (toda la información por el body)
router.post('/calificacion', (req, res) => {
  const { idCitas, calificacion } = req.body;

  // Verificar que los campos requeridos estén presentes
  if (!idCitas || !calificacion) {
    return res.status(400).json({ message: 'El ID de la cita y la descripción son obligatorios' });
  }

  // Query de actualización
  const query = 'UPDATE citas SET calificacion = ? WHERE idCitas = ?';

  // Ejecutar la consulta con los valores del body
  db.query(query, [calificacion, idCitas], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar la cita', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json({ message: 'Cita actualizada exitosamente' });
  });
});

// Actualizar estado de la cita (toda la información por el body)
router.post('/updateEstado', (req, res) => {
  const { idCitas, Estado } = req.body;

  // Verificar que los campos requeridos estén presentes
  if (!idCitas) {
    return res.status(400).json({ message: 'El ID de la cita y la descripción son obligatorios' });
  }

  // Query de actualización estado
  const query = 'UPDATE citas SET Estado = ? WHERE idCitas = ?';

  // Ejecutar la consulta con los valores del body
  db.query(query, [Estado ,idCitas], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar la cita', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json({ message: 'Cita actualizada exitosamente' });
  });
});

// Eliminar una cita
router.post('/delete', (req, res) => {
  const citaId = req.body.id; // Cambiado para obtener de req.body, no req.params

  // Validar que el ID sea un número válido
  if (!citaId || isNaN(citaId)) {
    return res.status(400).json({ message: 'ID de cita inválido' });
  }

  // Verificar si la cita existe
  const queryCheck = 'SELECT * FROM citas WHERE idCitas = ?';
  db.query(queryCheck, [citaId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al verificar la existencia de la cita', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'La cita no existe' });
    }

    // Si existe, proceder a eliminar
    const queryDelete = 'DELETE FROM citas WHERE idCitas = ?';
    db.query(queryDelete, [citaId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar la cita', error: err });
      }
      res.json({ message: 'Cita eliminada exitosamente' });
    });
  });
});
// Configurar transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto según el proveedor que uses
  auth: {
    user: 'proyectohogarenapuros05@gmail.com', // Correo desde donde se enviará
    pass: 'ifpx itzw ebbq fkde',       // Contraseña o App Password
  },
});

// Nueva ruta para enviar un correo
router.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: to, subject o text' });
  }

  const mailOptions = {
    from: 'proyectohogarenapuros05@gmail.com', // Dirección del remitente
    to,                         // Dirección del destinatario
    subject,                    // Asunto del correo
    text,                       // Cuerpo del mensaje
  };

  // Enviar correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).json({ message: 'Error al enviar el correo', error });
    }
    res.json({ message: 'Correo enviado exitosamente', info });
  });
});
module.exports = router;