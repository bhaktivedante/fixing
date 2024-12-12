const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Para generar códigos únicos
const db = require("./db");

const router = express.Router();

// Función para generar un código de registro único
function generateUniqueCode() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

// Ruta para registrar un usuario
router.post("/api/usuarios/registrar", async (req, res) => {
  const {
    nombre,
    rut,
    email,
    contraseña,
    rol,
    especialidad,
    tarifa_cotizacion,
  } = req.body;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Generar un código de registro único
    const codigoRegistro = generateUniqueCode();

    // Insertar en la tabla usuarios
    db.run(
      `
      INSERT INTO usuarios (nombre, rut, email, contraseña, rol, codigoRegistro)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [nombre, rut, email, hashedPassword, rol, codigoRegistro],
      function (err) {
        if (err) {
          console.error("Error al registrar usuario:", err.message);
          return res
            .status(500)
            .json({ error: "Error al registrar el usuario." });
        }

        const idUsuario = this.lastID;

        // Si el rol es profesional, insertar en la tabla profesionales
        if (rol === "profesional") {
          db.run(
            `
            INSERT INTO profesionales (id_usuario, especialidad, tarifa_cotizacion, codigoRegistro)
            VALUES (?, ?, ?, ?)
            `,
            [idUsuario, especialidad, tarifa_cotizacion, codigoRegistro],
            function (err) {
              if (err) {
                console.error("Error al registrar profesional:", err.message);
                return res
                  .status(500)
                  .json({ error: "Error al registrar el profesional." });
              }

              res.json({
                message: "Profesional registrado con éxito.",
                codigoRegistro,
              });
            }
          );
        } else {
          res.json({
            message: "Usuario registrado con éxito.",
            codigoRegistro,
          });
        }
      }
    );
  } catch (error) {
    console.error("Error en el proceso de registro:", error.message);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

module.exports = router;
