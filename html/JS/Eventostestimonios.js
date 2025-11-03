// =============== CARGAR TESTIMONIOS EN EL CARRUSEL ===============
window.addEventListener("load", () => {

  TestimoniesAPI.getAll().then(testimonies => {
    const carousel = document.querySelector(".carousel");
    carousel.innerHTML = ''; // Limpiar contenido previo

    const testimoniesPerGroup = 3;
    for (let i = 0; i < testimonies.length; i += testimoniesPerGroup) {
      const group = document.createElement("div");
      group.classList.add("carousel-group");

      const subset = testimonies.slice(i, i + testimoniesPerGroup);
      subset.forEach(testimony => {
        const item = document.createElement("div");
        item.classList.add("carousel-item");

        // Imagen
        if (testimony.img) {
          const img = document.createElement("img");
          img.src = testimony.img;
          img.alt = testimony.name;
          img.classList.add("testimonial-img");
          item.appendChild(img);
        }

        // Estrellas
        const stars = document.createElement("div");
        stars.classList.add("testimonial-stars");
        const maxStars = 5;
        let rating = Number(testimony.rating) || 0;
        rating = Math.min(Math.max(rating, 0), maxStars);
        stars.innerHTML = "⭐".repeat(rating) + "☆".repeat(maxStars - rating);
        item.appendChild(stars);

        // Texto del testimonio
        const p = document.createElement("p");
        p.textContent = testimony.text;
        item.appendChild(p);

        // Nombre
        const h3 = document.createElement("h3");
        h3.textContent = testimony.name;
        item.appendChild(h3);

        group.appendChild(item);
      });

      carousel.appendChild(group);
    }

    // Mostrar primer grupo
    initCarousel();
  }).catch(err => {
    console.error("Error cargando testimonios:", err);
  });
});

function initCarousel() {
  const groups = document.querySelectorAll(".carousel-group");
  const btnIzquierda = document.querySelector(".left.arrow");
  const btnDerecha = document.querySelector(".right.arrow");

  let currentIndex = 0;
  const totalGroups = groups.length;

  function limitWordsInTestimonies() {
    const items = document.querySelectorAll('.carousel-item p');
    items.forEach(p => {
      const original = p.getAttribute('data-original') || p.textContent;
      const words = original.trim().split(/\s+/);
      if (words.length > 20) {
        p.textContent = words.slice(0, 20).join(' ') + '...';
      } else {
        p.textContent = original;
      }
      p.setAttribute('data-original', original);
    });
  }

  function showGroup() {
    groups.forEach((group, index) => {
      group.style.display = (index === currentIndex) ? "flex" : "none";
    });
    limitWordsInTestimonies();
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % totalGroups;
    showGroup();
  }

  function goToPrevious() {
    currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
    showGroup();
  }

  // Eventos solo manuales
  btnIzquierda.addEventListener("click", goToPrevious);
  btnDerecha.addEventListener("click", goToNext);

  // Inicial
  showGroup();
}
