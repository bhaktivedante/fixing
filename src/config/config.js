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

module.exports = db;
