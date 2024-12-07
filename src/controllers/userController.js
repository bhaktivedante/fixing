const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// Controlador para registrar un nuevo usuario
exports.registerUser = (req, res) => {
  const { nombre, rut, email, contraseña, rol, ...additionalData } = req.body;

  // Validar campos comunes
  if (!nombre || !rut || !email || !contraseña || !rol) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  // Validar que el rol sea válido
  if (!["cliente", "profesional", "administrador"].includes(rol)) {
    return res.status(400).json({ error: "Rol no válido para este endpoint." });
  }

  const codigoRegistro = Math.floor(100000 + Math.random() * 900000).toString();
  const userData = { nombre, rut, codigoRegistro, email, contraseña, rol };

  userService
    .registerUser(userData)
    .then((result) => {
      if (rol === "profesional") {
        // Si el rol es "profesional", registrar en la tabla profesionales
        const { especialidad, tarifa_hora, disponibilidad } = additionalData;

        // Validar datos adicionales para profesionales
        if (!especialidad || !tarifa_hora || !disponibilidad) {
          return res
            .status(400)
            .json({
              error: "Datos adicionales para profesional son requeridos.",
            });
        }

        const professionalData = {
          id_usuario: result.id,
          especialidad,
          tarifa_hora,
          disponibilidad,
        };

        professionalService
          .registerProfessional(professionalData)
          .then(() =>
            res
              .status(201)
              .json({ message: "Profesional registrado exitosamente." })
          )
          .catch((err) => res.status(500).json({ error: err.message }));
      } else {
        // Si no es profesional, devolver éxito directamente
        res.status(201).json(result);
      }
    })
    .catch((err) => res.status(400).json({ error: err.message }));
};

// Controlador para obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  userService
    .getAllUsers()
    .then((users) => res.json({ data: users }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Controlador para iniciar sesión del usuario
// Controlador para iniciar sesión del usuario
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son requeridos." });
  }

  userService
    .loginUser(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { id: user.id_usuario, rol: user.rol },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        // Aseguramos enviar tanto el token como el rol explícitamente
        res.json({ message: "Inicio de sesión exitoso", token, rol: user.rol });
      } else {
        res.status(401).json({ error: "Credenciales incorrectas." });
      }
    })
    .catch((err) => {
      console.error("Error en loginUser:", err.message);
      res.status(500).json({ error: "Error interno del servidor." });
    });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "ID de usuario requerido" });
  }

  userService
    .deleteUser(userId)
    .then(() => res.json({ message: "Usuario eliminado con éxito" }))
    .catch((err) => {
      console.error("Error al eliminar usuario:", err.message);
      res.status(500).json({ error: "No se pudo eliminar el usuario" });
    });
};

// Controlador para crear tablas en la base de datos (opcional)
exports.createTables = (req, res) => {
  // Este método se puede usar para verificar o crear tablas faltantes
  userService
    .initializeTables()
    .then((message) => res.json({ message }))
    .catch((err) => res.status(500).json({ error: err.message }));
};
