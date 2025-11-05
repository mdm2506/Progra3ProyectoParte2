const LandingUrl = 'http://localhost:3000/api/landing';

function getLandings() {
  return fetch(LandingUrl).then(res => res.json());
}

window.addEventListener("load", () => {
  getLandings()
    .then((landings) => {
      const heroLogo = document.getElementById("hero-logo");
      const heroSlogan = document.getElementById("hero-slogan");

      if (!landings || landings.length === 0) {
        console.warn("[EventoLanding] No hay datos de landing disponibles.");
        return;
      }

      const landing = landings[0];

      // ===== LOGO DEL HEADER =====
      if (landing.logoUrl) {
        heroLogo.src = landing.logoUrl;
        heroLogo.alt = `Logo Landing #${landing.id}`;
        heroLogo.style.display = "inline-block";
      } else {
        heroLogo.style.display = "none";
      }

      // ===== SLOGAN DEL HERO =====
      if (heroSlogan) {
        heroSlogan.textContent = landing.slogan || "Vestimos tus sueños";
      }

      console.log("[EventoLanding] Landing actualizado:", landing);
    })
    .catch((err) => {
      console.error("[EventoLanding] Error cargando landing:", err);
    });
});
