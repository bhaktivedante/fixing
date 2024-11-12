// src/routes/servicios.js

const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// Ruta para obtener todos los servicios
router.get("/", serviceController.getAllServices);

// Ruta para registrar un nuevo servicio
router.post("/", serviceController.registerService);

module.exports = router;
