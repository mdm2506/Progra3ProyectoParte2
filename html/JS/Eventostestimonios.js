// =============== CARGAR TESTIMONIOS EN EL CARRUSEL ===============
window.addEventListener("load", () => { // Espera a que la página cargue completamente
  TestimoniosAPI.getAll() // Llama a la API para traer todos los testimonios
    .then(testimonios => { // Cuando se reciben los testimonios
      const carousel = document.querySelector(".carousel"); // Selecciona el contenedor del carrusel
      carousel.innerHTML = ''; // Limpia el contenido anterior

      // Agrupar de 3 en 3
      for (let i = 0; i < testimonios.length; i += 3) { // recorre de 3 en 3 los testimonios
        const group = document.createElement("div"); // crea un div para el grupo
        group.classList.add("carousel-group"); // le asigna la clase 'carousel-group'

        const subset = testimonios.slice(i, i + 3); // toma un subconjunto de 3 testimonios
        subset.forEach(testimonio => { // para cada testimonio en el subconjunto
          const item = crearItemTestimonio(testimonio); // crea el item del testimonio
          group.appendChild(item); // lo agrega al grupo
        });

        carousel.appendChild(group); // agrega el grupo al carrusel
      }

      iniciarCarrusel(); // inicializa la funcionalidad del carrusel
    })
    .catch(err => console.error("Error cargando testimonios:", err)); // Manejo de errores
});

// Crear un item individual de testimonio
function crearItemTestimonio(testimonio) { // recibe un objeto testimonio
  const item = document.createElement("div"); // crea un div para el item
  item.classList.add("carousel-item"); // le asigna la clase 'carousel-item'

  // Imagen
  if (testimonio.img) {
    const img = document.createElement("img"); // crea una etiqueta de imagen
    img.src = testimonio.img; // asigna la URL de la imagen
    img.alt = testimonio.name; // texto alternativo con el nombre del autor
    img.classList.add("testimonial-img"); // le asigna la clase 'testimonial-img'
    item.appendChild(img); // agrega la imagen al item
  }

  // Estrellas
  const stars = document.createElement("div"); // crea un div para las estrellas
  stars.classList.add("testimonial-stars"); // le asigna la clase 'testimonial-stars'
  const rating = Math.min(Math.max(Number(testimonio.rating) || 0, 0), 5); // asegura que el rating esté entre 0 y 5
  stars.innerHTML = "⭐".repeat(rating) + "☆".repeat(5 - rating); // crea las estrellas llenas y vacías
  item.appendChild(stars); // agrega las estrellas al item

  // Texto
  const p = document.createElement("p"); // crea un párrafo para el texto del testimonio
  p.textContent = testimonio.text; // asigna el texto del testimonio
  item.appendChild(p); // agrega el párrafo al item

  // Nombre
  const h3 = document.createElement("h3"); // crea un encabezado h3 para el nombre del autor
  h3.textContent = testimonio.name; // asigna el nombre del autor
  item.appendChild(h3); // agrega el encabezado al item

  return item; // retorna el item completo
}

// Inicializar carrusel
function iniciarCarrusel() { // función para manejar la navegación del carrusel
  const grupos = document.querySelectorAll(".carousel-group"); // selecciona todos los grupos de testimonios
  const btnIzq = document.querySelector(".left.arrow"); // selecciona el botón izquierdo
  const btnDer = document.querySelector(".right.arrow"); // selecciona el botón derecho

  let indiceActual = 0; // índice del grupo actualmente visible

  function limitarPalabras() { // función para limitar palabras en los testimonios
    document.querySelectorAll('.carousel-item p').forEach(p => { // selecciona todos los párrafos de testimonios
      const palabras = p.textContent.trim().split(/\s+/); // divide el texto en palabras
      if (palabras.length > 20) { // si hay más de 20 palabras
        p.textContent = palabras.slice(0, 20).join(' ') + '...'; // limita a 20 palabras y agrega '...'
      }
    });
  }

  function mostrarGrupo() { // función para mostrar el grupo actual
    grupos.forEach((grupo, index) => { // recorre todos los grupos
      grupo.style.display = (index === indiceActual) ? "flex" : "none"; // muestra solo el grupo actual
    });
    limitarPalabras(); // aplica la limitación de palabras
  }

  function irSiguiente() { // función para ir al siguiente grupo
    indiceActual = (indiceActual + 1) % grupos.length; // incrementa el índice y lo envuelve si es necesario
    mostrarGrupo(); // muestra el grupo actualizado
  }

  function irAnterior() { // funcoción para ir al grupo anterior
    indiceActual = (indiceActual - 1 + grupos.length) % grupos.length; // decrementa el índice y lo envuelve si es necesario
    mostrarGrupo(); // muestra el grupo actualizado
  }

  btnIzq.addEventListener("click", irAnterior); // asigna el evento click al botón izquierdo
  btnDer.addEventListener("click", irSiguiente); // asigna el evento click al botón derecho

  mostrarGrupo(); // muestra el grupo inicial
}