// src/controllers/serviceController.js

const db = require("../config/database");

// Controlador para obtener todos los servicios
exports.getAllServices = (req, res) => {
  db.all("SELECT * FROM servicios", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ data: rows });
    }
  });
};

// Controlador para registrar un nuevo servicio
exports.registerService = (req, res) => {
  const { id_cliente, id_profesional, descripcion, fecha_servicio, estado } =
    req.body;

  if (
    !id_cliente ||
    !id_profesional ||
    !descripcion ||
    !fecha_servicio ||
    !estado
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  db.run(
    `INSERT INTO servicios (id_cliente, id_profesional, descripcion, fecha_servicio, estado) VALUES (?, ?, ?, ?, ?)`,
    [id_cliente, id_profesional, descripcion, fecha_servicio, estado],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error al registrar el servicio." });
      } else {
        res.json({ message: "Servicio registrado con éxito", id: this.lastID });
      }
    }
  );
};
