document.addEventListener("DOMContentLoaded", function () {
  const professionalForm = document.getElementById(
    "register-professional-form"
  );
  const clientForm = document.getElementById("register-client-form");

  // Asignar eventos de envío a los formularios
  if (professionalForm) {
    professionalForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      await handleProfessionalRegistration();
    });
  }

  if (clientForm) {
    clientForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      await handleClientRegistration();
    });
  }
});

// Función para manejar el registro de profesionales
async function handleProfessionalRegistration() {
  const nombre = document.getElementById("nombre-profesional").value.trim();
  const rut = document.getElementById("rut-profesional").value.trim();
  const email = document.getElementById("email-profesional").value.trim();
  const contraseña = document
    .getElementById("password-profesional")
    .value.trim();
  const confirmarContraseña = document
    .getElementById("confirm-password")
    .value.trim();
  const especialidad = document.getElementById("especialidad").value.trim();
  const tarifaCotizacion = document
    .getElementById("tarifa-cotizacion")
    .value.trim();

  clearErrors();

  // Validaciones
  if (
    validateName(nombre, "nombre-profesional") &&
    validateRut(rut, "rut-profesional") &&
    validateEmail(email, "email-profesional") &&
    validatePassword(contraseña, "password-profesional") &&
    validateConfirmPassword(
      confirmarContraseña,
      contraseña,
      "confirm-password"
    ) &&
    validateField(
      especialidad,
      "especialidad",
      "La especialidad es requerida."
    ) &&
    validateTarifa(tarifaCotizacion, "tarifa-cotizacion")
  ) {
    const userData = {
      nombre,
      rut,
      email,
      contraseña,
      rol: "profesional",
      especialidad,
      tarifa_cotizacion: parseFloat(tarifaCotizacion),
    };

    await registerUser(userData);
  }
}

// Función para manejar el registro de clientes
async function handleClientRegistration() {
  const nombre = document.getElementById("nombre-cliente").value.trim();
  const rut = document.getElementById("rut-cliente").value.trim();
  const email = document.getElementById("email-cliente").value.trim();
  const contraseña = document.getElementById("password-cliente").value.trim();
  const confirmarContraseña = document
    .getElementById("confirm-password-cliente")
    .value.trim();

  clearErrors();

  // Validaciones
  if (
    validateName(nombre, "nombre-cliente") &&
    validateRut(rut, "rut-cliente") &&
    validateEmail(email, "email-cliente") &&
    validatePassword(contraseña, "password-cliente") &&
    validateConfirmPassword(
      confirmarContraseña,
      contraseña,
      "confirm-password-cliente"
    )
  ) {
    const userData = {
      nombre,
      rut,
      email,
      contraseña,
      rol: "cliente",
    };

    await registerUser(userData);
  }
}

// Función para registrar el usuario en el backend
async function registerUser(userData) {
  try {
    const response = await fetch("/api/usuarios/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      alert(
        `Registro exitoso. Tu código de registro es: ${data.codigoRegistro}`
      );
      window.location.href = "login.html";
    } else {
      alert(data.error || "Error en el registro.");
    }
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    alert("Error de conexión. Inténtalo de nuevo.");
  }
}

// Función para limpiar mensajes de error previos
function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });
}

// Validación del nombre
function validateName(value, elementId) {
  if (value.length < 3) {
    showError(elementId, "El nombre debe tener al menos 3 caracteres.");
    return false;
  }
  return true;
}

// Validación del RUT
function validateRut(value, elementId) {
  const rutRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
  if (!rutRegex.test(value)) {
    showError(
      elementId,
      "El RUT debe tener el formato 12345678-9 o 12345678-K."
    );
    return false;
  }
  return true;
}

// Validación del email
function validateEmail(value, elementId) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    showError(elementId, "El correo electrónico no es válido.");
    return false;
  }
  return true;
}

// Validación de la contraseña
function validatePassword(value, elementId) {
  if (value.length < 6) {
    showError(elementId, "La contraseña debe tener al menos 6 caracteres.");
    return false;
  }
  return true;
}

// Validación de confirmación de contraseña
function validateConfirmPassword(confirmValue, passwordValue, elementId) {
  if (confirmValue !== passwordValue) {
    showError(elementId, "Las contraseñas no coinciden.");
    return false;
  }
  return true;
}

// Validación de tarifa de cotización
function validateTarifa(value, elementId) {
  if (isNaN(value) || parseFloat(value) <= 0) {
    showError(
      elementId,
      "La tarifa de cotización debe ser un número positivo."
    );
    return false;
  }
  return true;
}

// Validación de campos genéricos
function validateField(value, elementId, errorMessage) {
  if (!value) {
    showError(elementId, errorMessage);
    return false;
  }
  return true;
}

// Función para mostrar errores
function showError(elementId, message) {
  const inputElement = document.getElementById(elementId);
  const errorElement = inputElement.nextElementSibling;
  if (errorElement) {
    errorElement.textContent = message;
  }
}
