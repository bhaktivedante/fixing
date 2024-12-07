// js/admin/serviceCrud.js

// Obtener y mostrar servicios
function fetchServices() {
  fetch("/api/servicios")
    .then((response) => response.json())
    .then((data) => displayServices(data.data))
    .catch((error) => console.error("Error al obtener servicios:", error));
}

// Mostrar servicios en una tabla
function displayServices(services) {
  const container = document.getElementById("service-table-container");
  container.innerHTML = ""; // Limpiar contenedor

  const table = document.createElement("table");
  table.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Profesional</th>
        <th>Descripción</th>
        <th>Fecha</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    `;

  services.forEach((service) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${service.id_servicio}</td>
        <td>${service.id_cliente}</td>
        <td>${service.id_profesional}</td>
        <td>${service.descripcion}</td>
        <td>${service.fecha_servicio}</td>
        <td>${service.estado}</td>
        <td>
          <button onclick="editService(${service.id_servicio})">Editar</button>
          <button onclick="deleteService(${service.id_servicio})">Eliminar</button>
        </td>
      `;
    table.appendChild(row);
  });

  container.appendChild(table);
}

// Registrar un servicio
function registerService(serviceData) {
  fetch("/api/servicios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      fetchServices();
    })
    .catch((error) => console.error("Error al registrar servicio:", error));
}

// Eliminar un servicio
function deleteService(serviceId) {
  if (confirm("¿Estás seguro de eliminar este servicio?")) {
    fetch(`/api/servicios/${serviceId}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchServices();
      })
      .catch((error) => console.error("Error al eliminar servicio:", error));
  }
}

// Editar un servicio
function editService(serviceId) {
  alert(`Editar servicio con ID: ${serviceId}`);
}
