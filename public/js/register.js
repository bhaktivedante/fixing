document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  // Asignar validaciones en tiempo real para cada campo
  document.getElementById("name").addEventListener("input", function () {
    validateName(this.value);
  });

  document.getElementById("rut").addEventListener("input", function () {
    validateRut(this.value);
  });

  document.getElementById("email").addEventListener("input", function () {
    validateEmail(this.value);
  });

  document.getElementById("password").addEventListener("input", function () {
    validatePassword(this.value);
  });

  document
    .getElementById("confirm-password")
    .addEventListener("input", function () {
      validateConfirmPassword(
        this.value,
        document.getElementById("password").value
      );
    });

  document.getElementById("role").addEventListener("input", function () {
    validateRole(this.value);
    toggleProfessionalFields(this.value);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Captura los valores de los campos del formulario
    const nombre = document.getElementById("name").value.trim();
    const rut = document.getElementById("rut").value.trim();
    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("password").value.trim();
    const confirmarContraseña = document
      .getElementById("confirm-password")
      .value.trim();
    const rol = document.getElementById("role").value;

    // Campos adicionales para profesionales
    const especialidad = document.getElementById("especialidad")?.value.trim();
    const tarifa_hora = document.getElementById("tarifa_hora")?.value.trim();
    const disponibilidad = document
      .getElementById("disponibilidad")
      ?.value.trim();

    // Limpiar mensajes de error previos
    clearErrors();

    // Validar campos
    let isValid = true;
    if (!validateName(nombre)) isValid = false;
    if (!validateRut(rut)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validatePassword(contraseña)) isValid = false;
    if (!validateConfirmPassword(confirmarContraseña, contraseña))
      isValid = false;
    if (!validateRole(rol)) isValid = false;

    if (rol === "profesional") {
      if (
        !validateProfessionalFields(especialidad, tarifa_hora, disponibilidad)
      ) {
        isValid = false;
      }
    }

    if (isValid) {
      // Si todo es válido, enviar la solicitud
      const userData = {
        nombre,
        rut,
        email,
        contraseña,
        rol,
      };

      if (rol === "profesional") {
        Object.assign(userData, { especialidad, tarifa_hora, disponibilidad });
      }

      registerUser(userData);
    }
  });
});

// Función para limpiar mensajes de error
function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
}

// Función para registrar usuario en el backend
async function registerUser(userData) {
  try {
    const response = await fetch("/api/usuarios/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } else {
      document.getElementById("register-error").innerText = data.error;
    }
  } catch (error) {
    console.error("Error durante el registro:", error);
    document.getElementById("register-error").innerText =
      "Ocurrió un error al intentar registrar. Inténtalo de nuevo.";
  }
}

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("name").value.trim();
  const rut = document.getElementById("rut").value.trim();
  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value.trim();
  const confirmarContraseña = document
    .getElementById("confirm-password")
    .value.trim();
  const rol = document.getElementById("role").value;

  if (rol === "profesional") {
    const especialidad = document.getElementById("especialidad").value.trim();
    const tarifa_hora = parseFloat(
      document.getElementById("tarifa_hora").value
    );
    const disponibilidad = document
      .getElementById("disponibilidad")
      .value.trim();

    registerUser({
      nombre,
      rut,
      email,
      contraseña,
      rol,
      especialidad,
      tarifa_hora,
      disponibilidad,
    });
  } else {
    registerUser({ nombre, rut, email, contraseña, rol });
  }
});

// Mostrar/ocultar campos adicionales para profesionales
function toggleProfessionalFields(rol) {
  const extraFields = document.querySelectorAll(".extra-fields");
  if (rol === "profesional") {
    extraFields.forEach((field) => (field.style.display = "block"));
  } else {
    extraFields.forEach((field) => (field.style.display = "none"));
  }
}

// Validación del nombre (mínimo 3 caracteres)
function validateName(nombre) {
  if (nombre.length < 3) {
    document.getElementById("name-error").textContent =
      "El nombre debe tener al menos 3 caracteres.";
    return false;
  } else {
    document.getElementById("name-error").textContent = "";
  }
  return true;
}

// Validación del RUT (mínimo 8 caracteres, formato correcto)
function validateRut(rut) {
  const rutRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
  if (!rutRegex.test(rut)) {
    document.getElementById("rut-error").textContent =
      "El RUT debe tener el formato 12345678-9 o 12345678-K.";
    return false;
  }
  document.getElementById("rut-error").textContent = "";
  return true;
}

// Validación del email (formato simple)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("email-error").textContent =
      "El correo electrónico no es válido.";
    return false;
  }
  document.getElementById("email-error").textContent = "";
  return true;
}

// Validación de la contraseña (mínimo 6 caracteres)
function validatePassword(contraseña) {
  if (contraseña.length < 6) {
    document.getElementById("password-error").textContent =
      "La contraseña debe tener al menos 6 caracteres.";
    return false;
  }
  document.getElementById("password-error").textContent = "";
  return true;
}

// Validación de la confirmación de contraseña
function validateConfirmPassword(confirmPassword, password) {
  if (confirmPassword !== password) {
    document.getElementById("confirm-password-error").textContent =
      "Las contraseñas no coinciden.";
    return false;
  }
  document.getElementById("confirm-password-error").textContent = "";
  return true;
}

// Validación del rol
// Validación del rol (debe ser una opción seleccionada válida)
function validateRole(rol) {
  const validRoles = ["cliente", "profesional", "administrador"];
  if (!validRoles.includes(rol)) {
    document.getElementById("role-error").textContent =
      "Debes seleccionar un rol válido.";
    return false;
  } else {
    document.getElementById("role-error").textContent = "";
  }
  return true;
}

// Validación de campos adicionales para profesionales
function validateProfessionalFields() {
  const especialidad = document.getElementById("specialty");
  const tarifaHora = document.getElementById("hourly-rate");
  const disponibilidad = document.getElementById("availability");
  let isValid = true;

  // Validar especialidad
  if (!especialidad || especialidad.value.trim() === "") {
    const errorElement = document.getElementById("specialty-error");
    if (errorElement) {
      errorElement.textContent = "La especialidad es requerida.";
    }
    isValid = false;
  } else if (document.getElementById("specialty-error")) {
    document.getElementById("specialty-error").textContent = "";
  }

  // Validar tarifa por hora
  if (
    !tarifaHora ||
    tarifaHora.value.trim() === "" ||
    isNaN(tarifaHora.value)
  ) {
    const errorElement = document.getElementById("hourly-rate-error");
    if (errorElement) {
      errorElement.textContent =
        "La tarifa por hora debe ser un número válido.";
    }
    isValid = false;
  } else if (document.getElementById("hourly-rate-error")) {
    document.getElementById("hourly-rate-error").textContent = "";
  }

  // Validar disponibilidad
  if (!disponibilidad || disponibilidad.value.trim() === "") {
    const errorElement = document.getElementById("availability-error");
    if (errorElement) {
      errorElement.textContent = "La disponibilidad es requerida.";
    }
    isValid = false;
  } else if (document.getElementById("availability-error")) {
    document.getElementById("availability-error").textContent = "";
  }

  return isValid;
}
