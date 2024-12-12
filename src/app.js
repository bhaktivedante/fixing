require("dotenv").config(); // Cargar variables de entorno

const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Rutas
app.use(userRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
