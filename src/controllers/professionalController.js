// src/controllers/professionalController.js

const db = require("../config/database");

// Controlador para obtener todos los profesionales
exports.getAllProfessionals = (req, res) => {
  db.all("SELECT * FROM profesionales", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ data: rows });
    }
  });
};

// Controlador para registrar un nuevo profesional
exports.registerProfessional = (req, res) => {
  const { id_usuario, especialidad, tarifa_hora, disponibilidad } = req.body;

  if (!id_usuario || !especialidad || !tarifa_hora || !disponibilidad) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  db.run(
    `INSERT INTO profesionales (id_usuario, especialidad, tarifa_hora, disponibilidad) VALUES (?, ?, ?, ?)`,
    [id_usuario, especialidad, tarifa_hora, disponibilidad],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error al registrar el profesional." });
      } else {
        res.json({
          message: "Profesional registrado con éxito",
          id: this.lastID,
        });
      }
    }
  );
};
