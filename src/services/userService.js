// src/services/userService.js

const bcrypt = require("bcrypt"); // Importar bcrypt para el manejo de contraseñas
const userModel = require("../models/userModel");

const SALT_ROUNDS = 10; // Número de rondas de sal para el hash

// Servicio para obtener todos los usuarios
exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    userModel.getAllUsers((err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    userModel.deleteUser(userId, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Servicio para registrar un nuevo usuario
exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    // Verificar si el correo ya está registrado
    userModel.findUserByEmail(userData.email, (err, existingUser) => {
      if (err) {
        reject(err);
      } else if (existingUser) {
        // Si el usuario ya existe, rechazar con un mensaje específico
        reject(
          new Error("El correo ya está registrado. ¿Olvidaste tu contraseña?")
        );
      } else {
        // Encriptar la contraseña y registrar el usuario
        bcrypt.hash(userData.contraseña, SALT_ROUNDS, (err, hashedPassword) => {
          if (err) {
            reject(err);
          } else {
            userData.contraseña = hashedPassword;
            userModel.registerUser(userData, (err, id) => {
              if (err) {
                reject(err);
              } else {
                resolve({ message: "Usuario registrado exitosamente", id });
              }
            });
          }
        });
      }
    });
  });
};

// Servicio para iniciar sesión del usuario
// src/services/userService.js

exports.loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    console.log("Intentando iniciar sesión con email:", email); // Log para depuración
    userModel.findUserByEmail(email, (err, user) => {
      if (err) {
        console.error("Error al buscar usuario:", err); // Log para errores
        reject(err);
      } else if (user) {
        console.log("Usuario encontrado:", user); // Log para confirmar el usuario encontrado
        bcrypt.compare(password, user.contraseña, (err, isMatch) => {
          if (err) {
            console.error("Error al comparar contraseñas:", err); // Log para errores en bcrypt
            reject(err);
          } else if (isMatch) {
            resolve(user);
          } else {
            console.log("La contraseña no coincide."); // Log si la contraseña no coincide
            reject(new Error("Credenciales inválidas"));
          }
        });
      } else {
        console.log("No se encontró un usuario con el email:", email); // Log si no se encuentra el usuario
        reject(new Error("Credenciales inválidas"));
      }
    });
  });
};
