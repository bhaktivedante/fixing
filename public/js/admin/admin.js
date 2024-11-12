// frontend/js/admin.js

// Función para obtener y mostrar usuarios
function fetchUsers() {
  fetch("http://localhost:3000/api/usuarios")
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data.data);
    })
    .catch((error) => console.error("Error al obtener usuarios:", error));
}

// Función para mostrar usuarios en una tabla
function displayUsers(users) {
  const container = document.getElementById("user-table-container");
  container.innerHTML = ""; // Limpiar el contenedor

  const table = document.createElement("table");
  table.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
    `;

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${user.id_usuario}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${user.rol}</td>
        <td>
          <button onclick="editUser(${user.id_usuario})">Editar</button>
          <button onclick="deleteUser(${user.id_usuario})">Eliminar</button>
        </td>
      `;
    table.appendChild(row);
  });

  container.appendChild(table);
}

// Mostrar formulario para crear usuario
function showCreateUserForm() {
  // Aquí puedes implementar el formulario de creación de usuario
  alert("Mostrar formulario de creación de usuario");
}

// Función para editar usuario (implementación básica)
function editUser(userId) {
  alert(`Editar usuario con ID: ${userId}`);
  // Aquí puedes implementar la lógica de edición
  fetch(`http://localhost:3000/api/usuarios/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      const user = data.data;
      const form = document.createElement("form");
      form.innerHTML = `
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" value="${user.nombre}">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${user.email}">
        <label for="rol">Rol:</label>
        <input type="text" id="rol" name="rol" value="${user.rol}">
        <button type="submit">Guardar</button>
      `;

      form.onsubmit = function (event) {
        event.preventDefault();
        const updatedUser = {
          nombre: form.nombre.value,
          email: form.email.value,
          rol: form.rol.value,
        };

        fetch(`http://localhost:3000/api/usuarios/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            fetchUsers(); // Actualizar la lista de usuarios
          })
          .catch((error) =>
            console.error("Error al actualizar usuario:", error)
          );
      };

      const container = document.getElementById("user-form-container");
      container.innerHTML = ""; // Limpiar el contenedor
      container.appendChild(form);
    })
    .catch((error) => console.error("Error al obtener usuario:", error));
}

// Función para eliminar usuario
function deleteUser(userId) {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchUsers(); // Actualizar la lista de usuarios
      })
      .catch((error) => console.error("Error al eliminar usuario:", error));
  }
}
