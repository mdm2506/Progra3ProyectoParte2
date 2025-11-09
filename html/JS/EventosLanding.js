// Crear un item individual de testimonio (misma "figura" que antes)
function crearItemTestimonio(testimonio) {
  const item = document.createElement('div');
  item.classList.add('carousel-item');

  if (testimonio.img) {
    const img = document.createElement('img');
    img.src = testimonio.img;
    img.alt = testimonio.name || '';
    img.classList.add('testimonial-img');
    item.appendChild(img);
  }

  const stars = document.createElement('div');
  stars.classList.add('testimonial-stars');
  const rating = Math.min(Math.max(Number(testimonio.rating) || 0, 0), 5);
  stars.innerHTML = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  item.appendChild(stars);

  const p = document.createElement('p');
  p.textContent = testimonio.text || '';
  item.appendChild(p);

  const h3 = document.createElement('h3');
  h3.textContent = testimonio.name || '';
  item.appendChild(h3);

  return item;
}

// Inicializar carrusel (misma lógica que antes)
function iniciarCarrusel() {
  const grupos = document.querySelectorAll('.carousel-group');
  const btnIzq = document.querySelector('.left.arrow');
  const btnDer = document.querySelector('.right.arrow');

  if (!grupos || grupos.length === 0) return;

  let indiceActual = 0;

  function limitarPalabras() {
    document.querySelectorAll('.carousel-item p').forEach(p => {
      const palabras = p.textContent.trim().split(/\s+/);
      if (palabras.length > 20) {
        p.textContent = palabras.slice(0, 20).join(' ') + '...';
      }
    });
  }

  function mostrarGrupo() {
    grupos.forEach((grupo, index) => {
      grupo.style.display = (index === indiceActual) ? 'flex' : 'none';
    });
    limitarPalabras();
  }

  function irSiguiente() {
    indiceActual = (indiceActual + 1) % grupos.length;
    mostrarGrupo();
  }

  function irAnterior() {
    indiceActual = (indiceActual - 1 + grupos.length) % grupos.length;
    mostrarGrupo();
  }

  if (btnIzq) btnIzq.addEventListener('click', irAnterior);
  if (btnDer) btnDer.addEventListener('click', irSiguiente);

  mostrarGrupo();
}

// getLandings is provided by JS/fetchLanding.js which centralizes API calls.
// If that file is not included, uncomment the local implementation below.
/*
function getLandings() { // GET
  return fetch(LandingUrl).then(res => res.json()); // hace fetch a la ruta y retorna la respuesta en JSON
}
*/

window.addEventListener("load", () => { // espera a que la página cargue completamente
  getLandings() // llama a la función que trae los datos de landing
    .then((landings) => { // maneja la respuesta
      const heroLogo = document.getElementById("hero-logo"); // selecciona el elemento del logo del hero
      const heroSlogan = document.getElementById("hero-slogan"); // selecciona el elemento del slogan del hero
      const heroCta = document.getElementById("hero-cta"); // botón/anchor principal del hero

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

      // ===== CTA DEL HERO =====
      if (heroCta) {
        if (landing.cta) {
          heroCta.textContent = landing.cta;
          heroCta.style.display = 'inline-block';
        } else {
          // si no hay CTA definida, ocultamos o dejamos el texto por defecto
          heroCta.textContent = heroCta.textContent || 'Explora Nuestra Colección';
          // opcional: mantener visible con texto por defecto; si se desea ocultar, usar: heroCta.style.display = 'none';
        }
      }

      console.log("[EventoLanding] Landing actualizado:", landing); // muestra en consola el landing actualizado

      // ====== RENDER SERVICIOS ======
      try {
        const servicesContainer = document.getElementById('Services-flex-cards');
        if (servicesContainer) {
          servicesContainer.innerHTML = '';
          if (Array.isArray(landing.servicios) && landing.servicios.length) {
            landing.servicios.forEach(s => {
              const card = document.createElement('div');
              card.className = 'card service-card';
              const img = document.createElement('img');
              img.src = s.urlImagen || '../html/IMG/Logo.png';
              img.alt = s.titulo || 'Servicio';
              img.className = 'service-img';
              const intro = document.createElement('div');
              intro.className = 'intro';
              const h2 = document.createElement('h2');
              h2.textContent = s.titulo || '';
              const p = document.createElement('p');
              p.textContent = s.descripcion || '';
              intro.appendChild(h2);
              intro.appendChild(p);
              card.appendChild(img);
              card.appendChild(intro);
              servicesContainer.appendChild(card);
            });
          } else {
            servicesContainer.innerHTML = '<p class="small">No hay servicios disponibles</p>';
          }
        }
      } catch (err) {
        console.error('[EventoLanding] Error renderizando servicios', err);
      }
          // señalizamos que servicios ya fueron cargados en el DOM
          window.LANDING_SERVICES_LOADED = true;

      // ====== RENDER TESTIMONIOS EN EL CARRUSEL ======
      try {
        const carousel = document.querySelector('.carousel');
        if (carousel) {
          carousel.innerHTML = '';
          const testimonies = Array.isArray(landing.testimonies) ? landing.testimonies : [];
          if (testimonies.length) {
            // agrupar de 3 en 3
            for (let i = 0; i < testimonies.length; i += 3) {
              const group = document.createElement('div');
              group.classList.add('carousel-group');
              const subset = testimonies.slice(i, i + 3);
                subset.forEach(t => {
                  // Use shared creator if available to keep the exact same structure
                  let item;
                  if (typeof crearItemTestimonio === 'function') {
                    item = crearItemTestimonio(t);
                  } else {
                    item = document.createElement('div');
                    item.classList.add('carousel-item');
                    if (t.img) {
                      const img = document.createElement('img');
                      img.src = t.img;
                      img.alt = t.name || '';
                      img.classList.add('testimonial-img');
                      item.appendChild(img);
                    }
                    const stars = document.createElement('div');
                    stars.classList.add('testimonial-stars');
                    const rating = Math.min(Math.max(Number(t.rating) || 0, 0), 5);
                    stars.innerHTML = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
                    item.appendChild(stars);
                    const p = document.createElement('p');
                    p.textContent = t.text || '';
                    item.appendChild(p);
                    const h3 = document.createElement('h3');
                    h3.textContent = t.name || '';
                    item.appendChild(h3);
                  }

                  group.appendChild(item);
                });
              carousel.appendChild(group);
            }

            // Inicializar el carrusel si la función existe en otros scripts
            if (typeof iniciarCarrusel === 'function') {
              // esperar un tick para asegurar que los elementos estén en DOM
              setTimeout(() => iniciarCarrusel(), 50);
            }

            // Señalamos que ya cargamos testimonios desde landing para evitar doble carga
            window.LANDING_TESTIMONIES_LOADED = true;
          } else {
            carousel.innerHTML = '<p class="small">No hay testimonios disponibles</p>';
          }
        }
      } catch (err) {
        console.error('[EventoLanding] Error renderizando testimonios', err);
      }
    })
    .catch((err) => {
      console.error("[EventoLanding] Error cargando landing:", err); // Manejo de errores
    });
});
