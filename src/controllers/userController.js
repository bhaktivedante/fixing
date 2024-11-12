// src/controllers/userController.js

const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// Controlador para registrar un nuevo usuario
exports.registerUser = (req, res) => {
  const { nombre, rut, email, contraseña, rol } = req.body;

  if (!nombre || !rut || !email || !contraseña || !rol) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  const codigoRegistro = Math.floor(100000 + Math.random() * 900000).toString();
  const userData = { nombre, rut, codigoRegistro, email, contraseña, rol };

  userService
    .registerUser(userData)
    .then((result) => res.status(201).json(result))
    .catch((err) => {
      // Enviar el mensaje de error al frontend
      res.status(400).json({ error: err.message });
    });
};

// Controlador para obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  userService
    .getAllUsers()
    .then((users) => res.json({ data: users }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Controlador para iniciar sesión del usuario
// src/controllers/userController.js

// src/controllers/userController.js

// src/controllers/userController.js

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  console.log("Request body:", req.body); // Log para verificar los datos recibidos en el body
  console.log("Email:", email); // Log para verificar el email extraído
  console.log("Password:", password); // Log para verificar la contraseña extraída

  if (!email || !password) {
    console.log("Error: Correo y contraseña son requeridos.");
    return res
      .status(400)
      .json({ error: "Correo y contraseña son requeridos." });
  }

  userService
    .loginUser(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { id: user.id, rol: user.rol },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log("Generated token:", token); // Log para verificar el token generado
        res.json({ message: "Inicio de sesión exitoso", token });
      } else {
        console.log("Error: Credenciales incorrectas.");
        res.status(401).json({ error: "Credenciales incorrectas" });
      }
    })
    .catch((err) => {
      console.error("Error en loginUser:", err.message);
      res.status(500).json({ error: err.message });
    });
};
