// src/server.js

require("dotenv").config(); // Cargar las variables de entorno desde .env
const app = require("./app");

// Configurar el puerto desde las variables de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app
  .listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error al iniciar el servidor:", err);
  });
