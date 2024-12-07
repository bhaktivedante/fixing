// Función para manejar el login de administrador
async function adminLogin(event) {
  event.preventDefault(); // Prevenir la recarga del formulario

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
    // Petición al servidor
    const response = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Decodificar el token y verificar el rol
      const token = data.token;
      const decodedToken = parseJwt(token);

      console.log("Token decodificado:", decodedToken); // Log para depuración

      if (decodedToken.rol === "administrador") {
        // Ajuste aquí
        // Guardar el token en localStorage
        localStorage.setItem("token", token);

        // Redirigir al panel de administración
        alert("Inicio de sesión exitoso");
        window.location.href = "admin.html";
      } else {
        errorMessage.innerText =
          "No tienes permisos para acceder al panel de administración.";
        errorMessage.style.display = "block";
      }
    } else {
      errorMessage.innerText = data.error || "Credenciales incorrectas.";
      errorMessage.style.display = "block";
    }
  } catch (error) {
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
    console.error("Error al decodificar el token:", e); // Log en caso de error
    return null;
  }
}

// Evento para ejecutar la función al cargar
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  loginForm.addEventListener("submit", adminLogin);
});
