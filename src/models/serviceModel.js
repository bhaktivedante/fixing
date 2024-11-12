// src/models/serviceModel.js

const db = require("../config/database");

// Función para crear la tabla de servicios si no existe
const createServiceTable = () => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS servicios (
            id_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
            id_cliente INTEGER NOT NULL,
            id_profesional INTEGER NOT NULL,
            descripcion TEXT NOT NULL,
            fecha_servicio DATETIME NOT NULL,
            estado TEXT NOT NULL,
            FOREIGN KEY(id_cliente) REFERENCES usuarios(id_usuario),
            FOREIGN KEY(id_profesional) REFERENCES profesionales(id_profesional)
        )
    `,
    (err) => {
      if (err) {
        console.error("Error al crear la tabla de servicios:", err.message);
      } else {
        console.log("Tabla de servicios verificada o creada exitosamente.");
      }
    }
  );
};

// Ejecutar la creación de la tabla
createServiceTable();

// Funciones para interactuar con la base de datos de servicios
module.exports = {
  // Obtener todos los servicios
  getAllServices: (callback) => {
    db.all("SELECT * FROM servicios", [], (err, rows) => {
      callback(err, rows);
    });
  },

  // Registrar un nuevo servicio
  registerService: (serviceData, callback) => {
    const { id_cliente, id_profesional, descripcion, fecha_servicio, estado } =
      serviceData;
    const sql = `INSERT INTO servicios (id_cliente, id_profesional, descripcion, fecha_servicio, estado) VALUES (?, ?, ?, ?, ?)`;

    db.run(
      sql,
      [id_cliente, id_profesional, descripcion, fecha_servicio, estado],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },
};
