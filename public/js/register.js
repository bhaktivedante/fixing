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

    if (isValid) {
      // Si todo es válido, enviar la solicitud
      registerUser({ nombre, rut, email, contraseña, rol });
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
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } else {
      // Mostrar mensaje de error en el formulario si el correo ya está registrado
      document.getElementById("register-error").innerText = data.error;
    }
  } catch (error) {
    console.error("Error durante el registro:", error);
    document.getElementById("register-error").innerText =
      "Ocurrió un error al intentar registrar. Inténtalo de nuevo.";
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

// Validación del RUT (mínimo 8 caracteres, al menos un número, y al menos una K mayúscula)
function validateRut(rut) {
  const rutRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
  if (!rutRegex.test(rut)) {
    document.getElementById("rut-error").textContent =
      "El RUT debe tener el formato 12345678-9 o 12345678-K y contener 8 caracteres.";
    return false;
  }

  const [number, verifier] = rut.split("-");
  let sum = 0;
  let multiplier = 2;

  for (let i = number.length - 1; i >= 0; i--) {
    sum += multiplier * parseInt(number.charAt(i));
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const mod11 = 11 - (sum % 11);
  const expectedVerifier =
    mod11 === 11 ? "0" : mod11 === 10 ? "K" : mod11.toString();

  if (expectedVerifier.toLowerCase() !== verifier.toLowerCase()) {
    document.getElementById("rut-error").textContent = "El RUT no es válido.";
    return false;
  } else {
    document.getElementById("rut-error").textContent = "";
  }

  return true;
}

// Validación de email (verificación simple)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("email-error").textContent =
      "El correo electrónico no es válido.";
    return false;
  } else {
    document.getElementById("email-error").textContent = "";
  }
  return true;
}

// Validación de la contraseña (mínimo 6 caracteres)
function validatePassword(contraseña) {
  if (contraseña.length < 6) {
    document.getElementById("password-error").textContent =
      "La contraseña debe tener al menos 6 caracteres.";
    return false;
  } else {
    document.getElementById("password-error").textContent = "";
  }
  return true;
}

// Validación del rol (debe ser una opción seleccionada)
function validateRole(rol) {
  if (!rol) {
    document.getElementById("role-error").textContent =
      "Debes seleccionar un rol.";
    return false;
  } else {
    document.getElementById("role-error").textContent = "";
  }
  return true;
}

// Validación de la confirmación de la contraseña
function validateConfirmPassword(confirmPassword, password) {
  if (confirmPassword !== password) {
    document.getElementById("confirm-password-error").textContent =
      "Las contraseñas no coinciden.";
    return false;
  } else {
    document.getElementById("confirm-password-error").textContent = "";
  }
  return true;
}
