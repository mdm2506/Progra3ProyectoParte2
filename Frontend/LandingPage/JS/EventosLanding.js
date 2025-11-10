// Crear un item individual de testimonio 
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
  // Representación simple de la calificación con estrellas
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

// Inicializar carrusel 
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

window.addEventListener("load", () => { // espera a que la página cargue completamente
  // Pedimos al servidor los datos de landing (hero, servicios, testimonios)
  getLandings()
    .then((landings) => {
      const heroLogo = document.getElementById("hero-logo");
      const heroSlogan = document.getElementById("hero-slogan");
      const heroCta = document.getElementById("hero-cta");

      if (!landings || landings.length === 0) {
        // muestra una advertencia si no hay datos
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
      // Slogan
      if (heroSlogan) {
        heroSlogan.textContent = landing.slogan || "Vestimos tus sueños";
      }
      //  texto del botón principal 
      if (heroCta) {
        if (landing.cta) {
          heroCta.textContent = landing.cta;
          heroCta.style.display = 'inline-block';
        } else {
          heroCta.textContent = heroCta.textContent || 'Explora Nuestra Colección';
        }
      }

      // ====== RENDER SERVICIOS ======
      try {
        const servicesContainer = document.getElementById('Services-flex-cards');
        if (servicesContainer) {
          servicesContainer.innerHTML = '';
          // Si hay servicios, crea una card por cada uno
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
            // Mensaje para cuando no hay servicios
            servicesContainer.innerHTML = '<p class="small">No hay servicios disponibles</p>';
          }
        }
      } catch (err) {
        console.error('[EventoLanding] Error renderizando servicios', err);
      }
      window.LANDING_SERVICES_LOADED = true;

      // ====== RENDER TESTIMONIOS EN EL CARRUSEL ======
      try {
        const carousel = document.querySelector('.carousel');
        if (carousel) {
          carousel.innerHTML = '';
          // agrupar los testimonios de 3 en 3 para el carrusel
          const testimonies = Array.isArray(landing.testimonies) ? landing.testimonies : [];
          if (testimonies.length) {
            // agrupar de 3 en 3
            for (let i = 0; i < testimonies.length; i += 3) {
              const group = document.createElement('div');
              group.classList.add('carousel-group');
              const subset = testimonies.slice(i, i + 3);
              subset.forEach(t => {
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
            if (typeof iniciarCarrusel === 'function') {
              setTimeout(() => iniciarCarrusel(), 50);
            }

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
      // Manejo de errores
      console.error("[EventoLanding] Error cargando landing:", err);
    });
});