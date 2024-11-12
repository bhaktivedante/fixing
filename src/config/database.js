// src/config/database.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const config = require("./config");

// Ruta de la base de datos
const dbPath = path.resolve(__dirname, "../../database/fixingup.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos de Fixing Up.");
  }
});

// Crear la tabla de usuarios si no existe
db.run(
  `
    CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        rut TEXT NOT NULL,
        codigoRegistro TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        contraseña TEXT NOT NULL,
        rol TEXT NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`,
  (err) => {
    if (err) {
      console.error("Error al crear la tabla de usuarios:", err.message);
    } else {
      console.log("Tabla de usuarios verificada o creada exitosamente.");
    }
  }
);

module.exports = db;
