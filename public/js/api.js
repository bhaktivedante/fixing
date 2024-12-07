// Configuración base para la API
const API_BASE_URL = "http://localhost:3000/api";

// Función genérica para manejar errores de respuesta
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error en la solicitud");
  }
  return response.json();
}

// Función para registrar un usuario
async function registerUser(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseData = await handleResponse(response);
    alert(responseData.message || "Usuario registrado con éxito");
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    alert(`Error: ${error.message}`);
  }
}

// Función para obtener todos los usuarios
async function getUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    const data = await handleResponse(response);
    console.log("Usuarios obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
  }
}

// Función para obtener todos los profesionales
async function getProfessionals() {
  try {
    const response = await fetch(`${API_BASE_URL}/profesionales`);
    const data = await handleResponse(response);
    console.log("Profesionales obtenidos:", data);
    return data.data; // Devuelve la lista de profesionales
  } catch (error) {
    console.error("Error al obtener profesionales:", error.message);
    alert(`Error: ${error.message}`);
  }
}

// Función para contratar un profesional
async function hireProfessional(professionalId, clientId, description) {
  try {
    const response = await fetch(`${API_BASE_URL}/contratos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_profesional: professionalId,
        id_cliente: clientId,
        descripcion: description,
      }),
    });
    const responseData = await handleResponse(response);
    alert(responseData.message || "Profesional contratado con éxito");
  } catch (error) {
    console.error("Error al contratar profesional:", error.message);
    alert(`Error: ${error.message}`);
  }
}

// Función para obtener contrataciones de un cliente
async function getContracts(clientId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contratos?clienteId=${clientId}`
    );
    const data = await handleResponse(response);
    console.log("Contratos obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener contratos:", error.message);
  }
}

// Función para obtener el historial de pagos de un cliente
async function getPaymentHistory(clientId) {
  try {
    const response = await fetch(`${API_BASE_URL}/pagos?clienteId=${clientId}`);
    const data = await handleResponse(response);
    console.log("Historial de pagos obtenido:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener historial de pagos:", error.message);
  }
}
