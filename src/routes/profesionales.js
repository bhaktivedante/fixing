const express = require("express");
const router = express.Router();
const professionalController = require("../controllers/professionalController");

// Ruta para obtener todos los profesionales
router.get("/", professionalController.getAllProfessionals);

// Ruta para registrar un nuevo profesional
router.post("/", professionalController.registerProfessional);

module.exports = router;
