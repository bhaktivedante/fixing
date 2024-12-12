const db = require("../config/db"); // Asegúrate de no declarar `db` nuevamente

// Controlador para obtener todos los profesionales
exports.getAllProfessionals = (req, res) => {
  db.all(
    `
    SELECT profesionales.*, usuarios.nombre, usuarios.email 
    FROM profesionales 
    INNER JOIN usuarios ON profesionales.id_usuario = usuarios.id_usuario
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    }
  );
};

// Controlador para registrar un nuevo profesional
exports.registerProfessional = (req, res) => {
  const {
    nombre,
    rut,
    codigoRegistro,
    email,
    contraseña,
    especialidad,
    tarifa_hora,
    disponibilidad,
  } = req.body;

  if (
    !nombre ||
    !rut ||
    !codigoRegistro ||
    !email ||
    !contraseña ||
    !especialidad ||
    !tarifa_hora ||
    !disponibilidad
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  // Registrar el usuario en la tabla 'usuarios'
  const rol = "profesional";
  db.run(
    `INSERT INTO usuarios (nombre, rut, codigoRegistro, email, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, rut, codigoRegistro, email, contraseña, rol],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al registrar el usuario." });
      }

      const id_usuario = this.lastID; // ID del usuario recién registrado

      // Registrar la información adicional en la tabla 'profesionales'
      db.run(
        `INSERT INTO profesionales (id_usuario, especialidad, tarifa_hora, disponibilidad) VALUES (?, ?, ?, ?)`,
        [id_usuario, especialidad, tarifa_hora, disponibilidad],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error al registrar el profesional." });
          }

          res.status(201).json({
            message: "Profesional registrado con éxito",
            id_profesional: this.lastID,
          });
        }
      );
    }
  );
};
