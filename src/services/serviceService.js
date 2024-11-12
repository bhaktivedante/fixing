// src/services/serviceService.js

const serviceModel = require("../models/serviceModel");

// Servicio para obtener todos los servicios
exports.getAllServices = () => {
  return new Promise((resolve, reject) => {
    serviceModel.getAllServices((err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Servicio para registrar un nuevo servicio
exports.registerService = (serviceData) => {
  return new Promise((resolve, reject) => {
    serviceModel.registerService(serviceData, (err, id) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Servicio registrado con éxito", id });
      }
    });
  });
};
