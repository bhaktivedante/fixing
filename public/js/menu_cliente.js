document.addEventListener("DOMContentLoaded", () => {
  fetchProfessionals();
});

// Obtener y renderizar profesionales en la sección "Contratar Profesional"
async function renderProfessionals() {
  console.log("Intentando obtener profesionales...");

  try {
    const response = await fetch("http://localhost:3000/api/profesionales");
    if (!response.ok) throw new Error("Error al obtener profesionales");

    const data = await response.json();
    console.log("Profesionales recibidos:", data);

    const professionals = data.data;

    const container = document.getElementById("professional-list");
    container.innerHTML = ""; // Limpiar contenedor

    if (professionals.length === 0) {
      container.innerHTML = `<p>No hay profesionales disponibles en este momento.</p>`;
      return;
    }

    professionals.forEach((professional) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-4");

      card.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${professional.especialidad}</h5>
            <p class="card-text">Tarifa: $${professional.tarifa_hora}/hora</p>
            <p class="card-text">Disponibilidad: ${professional.disponibilidad}</p>
            <button 
              class="btn btn-primary w-100"
              onclick="hireProfessional(${professional.id_profesional})"
            >
              Contratar
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error al renderizar profesionales:", error.message);
    const container = document.getElementById("professional-list");
    container.innerHTML = `<p>Error al cargar la lista de profesionales.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfessionals();
});

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderProfessionals();
});

function hireProfessional(professionalId) {
  alert(`Contratar profesional con ID: ${professionalId}`);
  // Aquí puedes implementar la lógica para contratar al profesional.
}
