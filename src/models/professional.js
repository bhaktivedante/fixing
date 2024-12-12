const db = require("../config/db");

// Crear la tabla de profesionales si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS profesionales (
    id_profesional INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    especialidad TEXT NOT NULL,
    tarifa_cotizacion REAL NOT NULL,
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
  )
`);

module.exports = db;
