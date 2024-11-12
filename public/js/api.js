// frontend/js/api.js

// Función para registrar un usuario
function registerUser(data) {
  fetch("http://localhost:3000/api/usuarios/registrar", {
    // Asegúrate de usar la ruta correcta aquí
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Función para obtener todos los usuarios (si es necesario)
function getUsers() {
  fetch("http://localhost:3000/api/usuarios")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error:", error));
}
