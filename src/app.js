// src/app.js

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware para permitir CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Importar rutas de la API
const userRoutes = require("./routes/usuarios");

// Enlazar rutas de la API con el prefijo /api/usuarios
app.use("/api/usuarios", userRoutes);

// Middleware de manejo de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
