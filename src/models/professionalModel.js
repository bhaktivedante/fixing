// src/models/professionalModel.js

const db = require("../config/database");

// Función para crear la tabla de profesionales si no existe
const createProfessionalTable = () => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS profesionales (
            id_profesional INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            especialidad TEXT NOT NULL,
            tarifa_hora REAL NOT NULL,
            disponibilidad TEXT NOT NULL,
            FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
        )
    `,
    (err) => {
      if (err) {
        console.error("Error al crear la tabla de profesionales:", err.message);
      } else {
        console.log("Tabla de profesionales verificada o creada exitosamente.");
      }
    }
  );
};

// Ejecutar la creación de la tabla
createProfessionalTable();

// Funciones para interactuar con la base de datos de profesionales
module.exports = {
  // Obtener todos los profesionales
  getAllProfessionals: (callback) => {
    db.all("SELECT * FROM profesionales", [], (err, rows) => {
      callback(err, rows);
    });
  },

  // Registrar un nuevo profesional
  registerProfessional: (professionalData, callback) => {
    const { id_usuario, especialidad, tarifa_hora, disponibilidad } =
      professionalData;
    const sql = `INSERT INTO profesionales (id_usuario, especialidad, tarifa_hora, disponibilidad) VALUES (?, ?, ?, ?)`;

    db.run(
      sql,
      [id_usuario, especialidad, tarifa_hora, disponibilidad],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },
};
