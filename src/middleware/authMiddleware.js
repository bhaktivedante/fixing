const jwt = require("jsonwebtoken");

// Middleware para verificar el token y el rol del usuario
exports.verifyTokenAndRole = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ error: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token del header

  if (!token) {
    return res.status(403).json({ error: "Formato de token inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si el rol del usuario coincide con el rol requerido
    if (requiredRole && decoded.rol !== requiredRole) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para acceder a esta ruta." });
    }

    req.user = decoded; // Adjuntar información del usuario al request
    next();
  } catch (err) {
    console.error("Error al verificar el token:", err.message); // Log para depuración
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// Middleware genérico para validar solo el token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ error: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token del header

  if (!token) {
    return res.status(403).json({ error: "Formato de token inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjuntar información del usuario al request
    next();
  } catch (err) {
    console.error("Error al verificar el token:", err.message); // Log para depuración
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};
