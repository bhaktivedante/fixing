const express = require("express");
const {
  registerUser,
  loginUser,
  adminLogin,
} = require("../controllers/userController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// --- Rutas para Usuarios ---

// Ruta para registrar un usuario
router.post("/api/usuarios/registrar", registerUser);

// Ruta para iniciar sesión de un usuario (cliente o profesional)
router.post("/api/usuarios/login", loginUser);

// --- Rutas para Administradores ---

// Ruta para iniciar sesión de administrador
router.post("/api/admin/login", adminLogin);

// Ruta para obtener el perfil de un usuario autenticado
router.get("/api/usuarios/perfil", verifyToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

// Middleware para manejar rutas no encontradas
router.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = router;
