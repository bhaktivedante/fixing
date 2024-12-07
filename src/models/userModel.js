const db = require("../config/database");

// Función para crear la tabla de usuarios si no existe
const createUserTable = () => {
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
};

// Ejecutar la creación de la tabla
createUserTable();

// Funciones para interactuar con la base de datos de usuarios
module.exports = {
  // Obtener todos los usuarios
  getAllUsers: (callback) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
      callback(err, rows);
    });
  },

  // Registrar un nuevo usuario
  registerUser: (userData, callback) => {
    const { nombre, rut, codigoRegistro, email, contraseña, rol } = userData;
    const sql = `INSERT INTO usuarios (nombre, rut, codigoRegistro, email, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(
      sql,
      [nombre, rut, codigoRegistro, email, contraseña, rol],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },
  deleteUser: (userId, callback) => {
    const sql = `DELETE FROM usuarios WHERE id_usuario = ?`;
    db.run(sql, [userId], (err) => {
      callback(err);
    });
  },

  // Buscar un usuario por email
  findUserByEmail: (email, callback) => {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      callback(err, row);
    });
  },
};
