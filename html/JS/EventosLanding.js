window.addEventListener("load", () => {

  getLandings().then((landings) => {
    // Elementos del Hero que se van a actualizar
    const heroLogo = document.getElementById("hero-logo");
    const heroSlogan = document.getElementById("hero-slogan");

    // Si no hay registros, no hace nada
    if (!landings || landings.length === 0) {
      console.warn("[EventoLanding] No hay datos de landing disponibles.");
      return;
    }

    // Tomamos el primer registro del backend
    const landing = landings[0];

    // Cambiamos el logo (si existe)
    if (landing.logoUrl) {
      heroLogo.src = landing.logoUrl;
      heroLogo.alt = `Logo Landing #${landing.id}`;
      heroLogo.style.display = "block";
    } else {
      heroLogo.style.display = "none";
    }

    // Cambiamos el slogan (si existe)
    if (landing.slogan) {
      heroSlogan.textContent = landing.slogan;
    } else {
      heroSlogan.textContent = "Vestimos tus sueños";
    }

    console.log("[EventoLanding] Landing actualizado:", landing);
  })
  .catch((err) => {
    console.error("[EventoLanding] Error cargando landing:", err);
  });

});
