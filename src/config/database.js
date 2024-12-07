// src/config/database.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta de la base de datos
const dbPath = path.resolve(__dirname, "../../database/fixingup.db");

// Crear la conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos de Fixing Up.");
  }
});

// Exportar el objeto db antes de cualquier operación
module.exports = db;

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

// Crear tabla de profesionales si no existe
db.run(
  `
  CREATE TABLE IF NOT EXISTS profesionales (
  id_profesional INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  rut TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contraseña TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  tarifa_hora REAL NOT NULL,
  disponibilidad TEXT NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
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

// Crear tabla de servicios si no existe
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
