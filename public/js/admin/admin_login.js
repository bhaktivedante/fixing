// Función para manejar el login de administrador
async function adminLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("login-error");

  // Limpiar mensajes de error previos
  errorMessage.style.display = "none";

  // Validar campos vacíos
  if (!email || !password) {
    errorMessage.innerText = "Por favor, completa todos los campos.";
    errorMessage.style.display = "block";
    return;
  }

  try {
    // Petición al servidor para el login del administrador
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Almacenar el token JWT en localStorage
      const token = data.token;
      localStorage.setItem("token", token);

      // Mensaje de éxito y redirección
      alert("Inicio de sesión de administrador exitoso");
      window.location.href = "admin.html";
    } else {
      // Mostrar mensaje de error del servidor
      errorMessage.innerText = data.error || "Credenciales incorrectas.";
      errorMessage.style.display = "block";
    }
  } catch (error) {
    // Manejar errores de conexión
    console.error("Error al iniciar sesión:", error);
    errorMessage.innerText = "Error en el servidor. Inténtalo de nuevo.";
    errorMessage.style.display = "block";
  }
}

// Función para decodificar un token JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al decodificar el token:", e);
    return null;
  }
}

// Evento para ejecutar la función al cargar
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  if (loginForm) {
    loginForm.addEventListener("submit", adminLogin);
  } else {
    console.error("Formulario de login no encontrado.");
  }
});
