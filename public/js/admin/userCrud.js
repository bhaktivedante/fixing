// frontend/js/admin/userCrud.js

// Función para obtener y mostrar todos los usuarios
function fetchUsers() {
  fetch("http://localhost:3000/api/usuarios")
    .then((response) => response.json())
    .then((data) => displayUsers(data.data))
    .catch((error) => console.error("Error al obtener los usuarios:", error));
}

// Función para mostrar la lista de usuarios en una tabla
function displayUsers(users) {
  const userTableContainer = document.getElementById("user-table-container");
  let tableHTML = `
      <table>
        <tr>
          <th>Nombre</th>
          <th>RUT</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
    `;

  users.forEach((user) => {
    tableHTML += `
        <tr>
          <td>${user.nombre}</td>
          <td>${user.rut}</td>
          <td>${user.email}</td>
          <td>${user.rol}</td>
          <td>
            <button onclick="showUpdateUserForm(${user.id_usuario})">Editar</button>
            <button onclick="deleteUser(${user.id_usuario})">Eliminar</button>
          </td>
        </tr>
      `;
  });

  tableHTML += `</table>`;
  userTableContainer.innerHTML = tableHTML;
}

// Función para mostrar el formulario de creación de usuario
function showCreateUserForm() {
  const formHTML = `
      <h3>Crear Usuario</h3>
      <form onsubmit="createUser(event)">
        <label for="name">Nombre:</label>
        <input type="text" id="name" required>
        
        <label for="rut">RUT:</label>
        <input type="text" id="rut" required>
        
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" required>
        
        <label for="password">Contraseña:</label>
        <input type="password" id="password" required>
        
        <label for="role">Rol:</label>
        <select id="role" required>
          <option value="cliente">Cliente</option>
          <option value="profesional">Profesional</option>
          <option value="administrador">Administrador</option>
        </select>
        
        <button type="submit">Crear Usuario</button>
      </form>
    `;
  document.getElementById("user-table-container").innerHTML = formHTML;
}

// Función para crear un nuevo usuario
function createUser(event) {
  event.preventDefault();
  const user = {
    nombre: document.getElementById("name").value,
    rut: document.getElementById("rut").value,
    email: document.getElementById("email").value,
    contraseña: document.getElementById("password").value,
    rol: document.getElementById("role").value,
  };

  fetch("http://localhost:3000/api/usuarios/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then(() => fetchUsers())
    .catch((error) => console.error("Error al crear el usuario:", error));
}

// Función para mostrar el formulario de actualización de usuario
function showUpdateUserForm(id) {
  fetch(`http://localhost:3000/api/usuarios/${id}`)
    .then((response) => response.json())
    .then((user) => {
      const formHTML = `
          <h3>Actualizar Usuario</h3>
          <form onsubmit="updateUser(event, ${id})">
            <label for="name">Nombre:</label>
            <input type="text" id="name" value="${user.nombre}" required>
            
            <label for="rut">RUT:</label>
            <input type="text" id="rut" value="${user.rut}" required>
            
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" value="${user.email}" required>
            
            <label for="role">Rol:</label>
            <select id="role" required>
              <option value="cliente" ${
                user.rol === "cliente" ? "selected" : ""
              }>Cliente</option>
              <option value="profesional" ${
                user.rol === "profesional" ? "selected" : ""
              }>Profesional</option>
              <option value="administrador" ${
                user.rol === "administrador" ? "selected" : ""
              }>Administrador</option>
            </select>
            
            <button type="submit">Actualizar Usuario</button>
          </form>
        `;
      document.getElementById("user-table-container").innerHTML = formHTML;
    })
    .catch((error) => console.error("Error al obtener el usuario:", error));
}

// Función para actualizar un usuario
function updateUser(event, id) {
  event.preventDefault();
  const user = {
    nombre: document.getElementById("name").value,
    rut: document.getElementById("rut").value,
    email: document.getElementById("email").value,
    rol: document.getElementById("role").value,
  };

  fetch(`http://localhost:3000/api/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then(() => fetchUsers())
    .catch((error) => console.error("Error al actualizar el usuario:", error));
}

// Función para eliminar un usuario
function deleteUser(id) {
  fetch(`http://localhost:3000/api/usuarios/${id}`, {
    method: "DELETE",
  })
    .then(() => fetchUsers())
    .catch((error) => console.error("Error al eliminar el usuario:", error));
}
