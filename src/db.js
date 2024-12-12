const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta de la base de datos
const dbPath = path.resolve(__dirname, "../database/fixingup.db");

// Crear la conexión a la base de datos
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
    email TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('cliente', 'profesional')),
    codigoRegistro TEXT UNIQUE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      console.error("Error al crear la tabla de usuarios:", err.message);
    }
  }
);

// Crear la tabla de profesionales si no existe
db.run(
  `
  CREATE TABLE IF NOT EXISTS profesionales (
    id_profesional INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    especialidad TEXT NOT NULL,
    tarifa_cotizacion REAL NOT NULL,
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
  )
`,
  (err) => {
    if (err) {
      console.error("Error al crear la tabla de profesionales:", err.message);
    }
  }
);

// Exportar el objeto db
module.exports = db;
