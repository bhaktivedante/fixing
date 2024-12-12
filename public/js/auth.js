// auth.js

// Función de inicio de sesión
async function loginFunction(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Limpiar errores previos
  clearErrors();

  if (!validateEmail(email) || !validatePassword(password)) {
    return;
  }

  try {
    const response = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token, rol } = data;

      // Almacenar el token en localStorage
      localStorage.setItem("token", token);

      // Redirigir según el rol
      redirectByRole(rol);
    } else {
      displayLoginError(data.error || "Credenciales incorrectas.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    displayLoginError("Error en el servidor. Inténtalo de nuevo.");
  }
}

// Función para limpiar mensajes de error
function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });
}

// Función para mostrar errores generales
function displayLoginError(message) {
  const passwordError = document.getElementById("password-error");
  passwordError.textContent = message;
}

// Validación del email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailError = document.getElementById("email-error");
  if (!emailRegex.test(email)) {
    emailError.textContent = "El correo electrónico no es válido.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

// Validación de la contraseña
function validatePassword(password) {
  const passwordError = document.getElementById("password-error");
  if (password.length < 6) {
    passwordError.textContent =
      "La contraseña debe tener al menos 6 caracteres.";
    return false;
  }
  passwordError.textContent = "";
  return true;
}

// Función para redirigir según el rol
function redirectByRole(rol) {
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
}

// Función para cerrar sesión
function logoutFunction() {
  localStorage.removeItem("token");
  alert("Has cerrado sesión.");
  window.location.href = "login.html";
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
