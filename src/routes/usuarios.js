// src/routes/usuarios.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Ruta para registrar un nuevo usuario
router.post("/registrar", userController.registerUser);

router.delete(
  "/:id", // Parámetro dinámico para el ID del usuario
  userController.deleteUser // Llama al controlador de eliminación
);

// Ruta para iniciar sesión del usuario
router.post("/login", userController.loginUser);

// Ruta para obtener todos los usuarios (opcional, si deseas protegerla)
router.get("/", userController.getAllUsers);

module.exports = router;
