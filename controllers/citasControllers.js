const getPendingAppointments = (req, res) => {
    const query = `
        SELECT c.idCitas, u.Nombre_completo, c.Fecha, c.Estado 
        FROM citas c 
        JOIN usuarios u ON c.idUsuario = u.idUsuario 
        WHERE c.Estado = 'pendiente' AND c.idgasfiter = ?
    `;
    const { idGasfiter } = req.params;

    db.query(query, [idGasfiter], (err, results) => {
        if (err) {
            console.error('Error al obtener citas pendientes:', err);
            return res.status(500).json({ message: 'Error al obtener citas pendientes' });
        }
        res.json(results);
    });
};

module.exports = { getPendingAppointments };