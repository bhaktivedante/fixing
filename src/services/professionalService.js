// src/services/professionalService.js

const professionalModel = require("../models/professionalModel");

// Servicio para obtener todos los profesionales
exports.getAllProfessionals = () => {
  return new Promise((resolve, reject) => {
    professionalModel.getAllProfessionals((err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Servicio para registrar un nuevo profesional
exports.registerProfessional = (professionalData) => {
  return new Promise((resolve, reject) => {
    professionalModel.registerProfessional(professionalData, (err, id) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Profesional registrado con éxito", id });
      }
    });
  });
};
