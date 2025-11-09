const LandingUrl = 'http://localhost:3000/api/landing'; // URL base donde está la API de landings en el backend local

function getLandings() { // GET
  return fetch(LandingUrl).then(res => res.json()); // hace fetch a la ruta y retorna la respuesta en JSON
}

window.addEventListener("load", () => { // espera a que la página cargue completamente
  getLandings() // llama a la función que trae los datos de landing
    .then((landings) => { // maneja la respuesta
      const heroLogo = document.getElementById("hero-logo"); // selecciona el elemento del logo del hero
      const heroSlogan = document.getElementById("hero-slogan"); // selecciona el elemento del slogan del hero

      if (!landings || landings.length === 0) { // verifica si hay datos de landing
        console.warn("[EventoLanding] No hay datos de landing disponibles."); // muestra una advertencia si no hay datos
        return;
      }

      const landing = landings[0]; // toma el primer landing (asumiendo que solo hay uno)

      // ===== LOGO DEL HEADER =====
      if (landing.logoUrl) { // si hay una URL de logo
        heroLogo.src = landing.logoUrl; // asigna la URL al src del logo
        heroLogo.alt = `Logo Landing #${landing.id}`; // asigna el texto alternativo
        heroLogo.style.display = "inline-block"; // muestra el logo
      } else {
        heroLogo.style.display = "none"; // oculta el logo si no hay URL
      }

      // ===== SLOGAN DEL HERO =====
      if (heroSlogan) { // verifica que el elemento exista
        heroSlogan.textContent = landing.slogan || "Vestimos tus sueños"; // asigna el slogan o un valor por defecto
      }

      console.log("[EventoLanding] Landing actualizado:", landing); // muestra en consola el landing actualizado
    })
    .catch((err) => {
      console.error("[EventoLanding] Error cargando landing:", err); // Manejo de errores
    });
});
