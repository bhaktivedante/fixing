const db = require("../config/db");

// Crear la tabla de usuarios si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    rut TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('cliente', 'profesional')),
    codigoRegistro TEXT UNIQUE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
