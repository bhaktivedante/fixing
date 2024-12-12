const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Función para generar un código de registro único
function generateUniqueCode() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

// Controlador para registrar un usuario
exports.registerUser = async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const codigoRegistro = generateUniqueCode();

    db.run(
      `INSERT INTO usuarios (nombre, rut, email, contraseña, rol, codigoRegistro) VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, rut, email, hashedPassword, rol, codigoRegistro],
      function (err) {
        if (err) {
          console.error("Error al registrar usuario:", err.message);
          return res
            .status(500)
            .json({ error: `Error al registrar el usuario: ${err.message}` });
        }

        const idUsuario = this.lastID;

        if (rol === "profesional") {
          db.run(
            `INSERT INTO profesionales (id_usuario, especialidad, tarifa_cotizacion, codigoRegistro) VALUES (?, ?, ?, ?)`,
            [idUsuario, especialidad, tarifa_cotizacion, codigoRegistro],
            function (err) {
              if (err) {
                console.error("Error al registrar profesional:", err.message);
                return res.status(500).json({
                  error: `Error al registrar el profesional: ${err.message}`,
                });
              }
              res.json({
                message: "Profesional registrado con éxito.",
                codigoRegistro,
              });
            }
          );
        } else {
          res.json({
            message: "Cliente registrado con éxito.",
            codigoRegistro,
          });
        }
      }
    );
  } catch (error) {
    console.error("Error en el proceso de registro:", error.message);
    res.status(500).json({ error: `Error en el servidor: ${error.message}` });
  }
};

// Controlador para iniciar sesión
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) {
        console.error("Error al buscar el usuario:", err.message);
        return res.status(500).json({ error: "Error en el servidor." });
      }

      if (!user) {
        return res
          .status(400)
          .json({ error: "Correo o contraseña incorrectos." });
      }

      // Comparar la contraseña
      const isMatch = await bcrypt.compare(password, user.contraseña);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Correo o contraseña incorrectos." });
      }

      // Verificar que JWT_SECRET está definido
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET no está definido en el archivo .env");
        return res
          .status(500)
          .json({ error: "Error en la configuración del servidor." });
      }

      // Crear token JWT
      const token = jwt.sign(
        { id: user.id_usuario, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Inicio de sesión exitoso", token, rol: user.rol });
    }
  );
};

// Función para el login de administrador
// Asegúrate de tener esta función en userController.js
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE email = ? AND rol = 'administrador'`,
    [email],
    async (err, user) => {
      if (err) {
        console.error("Error al buscar el administrador:", err.message);
        return res.status(500).json({ error: "Error en el servidor." });
      }

      if (!user) {
        return res
          .status(400)
          .json({ error: "Correo o contraseña incorrectos." });
      }

      const isMatch = await bcrypt.compare(password, user.contraseña);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Correo o contraseña incorrectos." });
      }

      const token = jwt.sign(
        { id: user.id_usuario, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Inicio de sesión de administrador exitoso",
        token,
        rol: user.rol,
      });
    }
  );
};
