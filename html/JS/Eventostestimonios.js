// =============== CARGAR TESTIMONIOS EN EL CARRUSEL ===============
window.addEventListener("load", () => {
  TestimoniosAPI.getAll()
    .then(testimonios => {
      const carousel = document.querySelector(".carousel");
      carousel.innerHTML = '';

      // Agrupar de 3 en 3
      for (let i = 0; i < testimonios.length; i += 3) {
        const group = document.createElement("div");
        group.classList.add("carousel-group");

        const subset = testimonios.slice(i, i + 3);
        subset.forEach(testimonio => {
          const item = crearItemTestimonio(testimonio);
          group.appendChild(item);
        });

        carousel.appendChild(group);
      }

      iniciarCarrusel();
    })
    .catch(err => console.error("Error cargando testimonios:", err));
});

// Crear un item individual de testimonio
function crearItemTestimonio(testimonio) {
  const item = document.createElement("div");
  item.classList.add("carousel-item");

  // Imagen
  if (testimonio.img) {
    const img = document.createElement("img");
    img.src = testimonio.img;
    img.alt = testimonio.name;
    img.classList.add("testimonial-img");
    item.appendChild(img);
  }

  // Estrellas
  const stars = document.createElement("div");
  stars.classList.add("testimonial-stars");
  const rating = Math.min(Math.max(Number(testimonio.rating) || 0, 0), 5);
  stars.innerHTML = "⭐".repeat(rating) + "☆".repeat(5 - rating);
  item.appendChild(stars);

  // Texto
  const p = document.createElement("p");
  p.textContent = testimonio.text;
  item.appendChild(p);

  // Nombre
  const h3 = document.createElement("h3");
  h3.textContent = testimonio.name;
  item.appendChild(h3);

  return item;
}

// Inicializar carrusel
function iniciarCarrusel() {
  const grupos = document.querySelectorAll(".carousel-group");
  const btnIzq = document.querySelector(".left.arrow");
  const btnDer = document.querySelector(".right.arrow");

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
      grupo.style.display = (index === indiceActual) ? "flex" : "none";
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

  btnIzq.addEventListener("click", irAnterior);
  btnDer.addEventListener("click", irSiguiente);

  mostrarGrupo();
}