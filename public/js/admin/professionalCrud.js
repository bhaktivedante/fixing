// js/admin/professionalCrud.js

// Obtener y mostrar profesionales
function fetchProfessionals() {
  fetch("/api/profesionales")
    .then((response) => response.json())
    .then((data) => displayProfessionals(data.data))
    .catch((error) => console.error("Error al obtener profesionales:", error));
}

// Mostrar profesionales en una tabla
function displayProfessionals(professionals) {
  const container = document.getElementById("professional-table-container");
  container.innerHTML = ""; // Limpiar contenedor

  const table = document.createElement("table");
  table.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Especialidad</th>
        <th>Tarifa/Hora</th>
        <th>Disponibilidad</th>
        <th>Acciones</th>
      </tr>
    `;

  professionals.forEach((professional) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${professional.id_profesional}</td>
        <td>${professional.especialidad}</td>
        <td>${professional.tarifa_hora}</td>
        <td>${professional.disponibilidad}</td>
        <td>
          <button onclick="editProfessional(${professional.id_profesional})">Editar</button>
          <button onclick="deleteProfessional(${professional.id_profesional})">Eliminar</button>
        </td>
      `;
    table.appendChild(row);
  });

  container.appendChild(table);
}

// Registrar un profesional
function registerProfessional(professionalData) {
  fetch("/api/profesionales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(professionalData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      fetchProfessionals();
    })
    .catch((error) => console.error("Error al registrar profesional:", error));
}

// Eliminar un profesional
function deleteProfessional(professionalId) {
  if (confirm("¿Estás seguro de eliminar este profesional?")) {
    fetch(`/api/profesionales/${professionalId}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchProfessionals();
      })
      .catch((error) => console.error("Error al eliminar profesional:", error));
  }
}

// Editar un profesional
function editProfessional(professionalId) {
  alert(`Editar profesional con ID: ${professionalId}`);
}
