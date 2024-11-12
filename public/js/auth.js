// auth.js

// Función para iniciar sesión
// auth.js

// auth.js
// auth.js
async function loginFunction(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Captured email:", email); // Log para verificar el email capturado
  console.log("Captured password:", password); // Log para verificar la contraseña capturada

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

    console.log("Response status:", response.status); // Log para verificar el estado de la respuesta

    if (response.ok) {
      const data = await response.json();
      console.log("Response data:", data); // Log para verificar los datos de la respuesta
      localStorage.setItem("token", data.token);
      alert("Inicio de sesión exitoso");
      window.location.href = "menu_cliente.html";
    } else {
      const errorText = await response.json();
      console.error("Error en la solicitud:", errorText);
      alert("Error en la solicitud: " + JSON.stringify(errorText));
    }
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
  }
}

// Función para cerrar sesión
function logoutFunction() {
  // Remueve el token de autenticación
  localStorage.removeItem("token");
  alert("Has cerrado sesión");
  window.location.href = "login.html"; // Redirige a la página de inicio de sesión
}

// Verifica si el usuario está autenticado en páginas protegidas
function checkAuth() {
  const token = localStorage.getItem("token");

  // Si no hay token y no estamos en login.html, redirige
  if (!token && window.location.pathname !== "/login.html") {
    alert("No has iniciado sesión. Redirigiendo al login.");
    window.location.href = "login.html"; // Redirige si no hay token
  }
}

// auth.js

async function registerFunction(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const contraseña = document.getElementById("password").value;
  const rol = "usuario"; // Asigna un rol predeterminado o toma el valor del formulario
  const rut = document.getElementById("rut").value; // Si tienes un campo rut en el formulario

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, contraseña, rol, rut }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } else {
      document.getElementById("register-error").innerText = data.error; // Mostrar error en el formulario
    }
  } catch (error) {
    console.error("Error durante el registro:", error);
  }
}

// Llamada de ejemplo a checkAuth() para proteger una página
// Solo ejecuta checkAuth en páginas que no sean login.html
document.addEventListener("DOMContentLoaded", checkAuth);
