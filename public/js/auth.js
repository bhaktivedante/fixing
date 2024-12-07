// auth.js

async function loginFunction(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Correo y contraseña son requeridos.");
    return;
  }

  try {
    const response = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const { token, rol } = data;

      // Almacenar el token en localStorage
      localStorage.setItem("token", token);

      // Redirigir según el rol
      switch (rol) {
        case "cliente":
          window.location.href = "menu_cliente.html";
          break;
        case "profesional":
          window.location.href = "menu_profesional.html";
          break;
        case "administrador":
          window.location.href = "admin.html";
          break;
        default:
          alert("Rol desconocido. Contacta al soporte.");
          localStorage.removeItem("token");
      }
    } else {
      const data = await response.json();
      alert(data.error || "Credenciales incorrectas.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error en el servidor. Inténtalo de nuevo.");
  }
}

// Función para cerrar sesión
function logoutFunction() {
  localStorage.removeItem("token");
  alert("Has cerrado sesión");
  window.location.href = "login.html";
}

// Verifica si el usuario está autenticado y tiene el rol adecuado en páginas protegidas
function checkAuthAndRole(requiredRole) {
  const token = localStorage.getItem("token");

  if (!token) {
    if (requiredRole) {
      alert("No has iniciado sesión. Redirigiendo al inicio de sesión.");
      window.location.href = "login.html";
    }
    return;
  }

  const decodedToken = parseJwt(token);

  if (!decodedToken) {
    alert("Token inválido. Por favor, inicia sesión nuevamente.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  if (decodedToken.exp < now) {
    alert("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  if (requiredRole && decodedToken.rol !== requiredRole) {
    alert("No tienes permiso para acceder a esta página.");
    window.location.href = "index.html";
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
    return null;
  }
}

// Lógica de verificación de rol en cada página
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("menu_cliente.html")) {
    checkAuthAndRole("cliente");
  } else if (path.includes("menu_profesional.html")) {
    checkAuthAndRole("profesional");
  } else if (path.includes("admin.html")) {
    checkAuthAndRole("administrador");
  }
});
