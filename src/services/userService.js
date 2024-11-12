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
    console.log("Attempting to log in with email:", email); // Log para verificar el email enviado al servicio
    userModel.findUserByEmail(email, (err, user) => {
      if (err) {
        console.error("Error in findUserByEmail:", err);
        reject(err);
      } else if (user) {
        console.log("User found:", user); // Log para verificar si el usuario existe
        bcrypt.compare(password, user.contraseña, (err, isMatch) => {
          if (err) {
            console.error("Error in bcrypt compare:", err);
            reject(err);
          } else if (isMatch) {
            console.log("Password match successful"); // Log para confirmar que la contraseña coincide
            resolve(user);
          } else {
            console.log("Password match failed"); // Log si la contraseña no coincide
            reject(new Error("Credenciales inválidas"));
          }
        });
      } else {
        console.log("User not found with email:", email); // Log si el usuario no existe
        reject(new Error("Credenciales inválidas"));
      }
    });
  });
};
