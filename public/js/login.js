document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inicio de sesión exitoso");
        localStorage.setItem("token", data.token); // Guardar token en localStorage
        window.location.href = `menu_${data.rol}.html`; // Redirigir según el rol
      } else {
        alert(data.error || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de conexión. Inténtalo de nuevo.");
    }
  });
