// =============== CARGAR TESTIMONIOS EN EL CARRUSEL ===============
//archivo nombre "Eventostestimonios.js"
//**ESTO SIRVE PARA CARGAR LOS TESTIMONIOS EN EL INDEX, */
window.addEventListener("load", () => {

  TestimoniesAPI.getAll().then(testimonies => {
    const carousel = document.querySelector(".carousel");
    carousel.innerHTML = ''; // Limpiar contenido previo

    // Crear un grupo
    const group = document.createElement("div");
    group.classList.add("carousel-group");
    carousel.appendChild(group);

    testimonies.forEach(testimony => {
      const item = document.createElement("div");
      item.classList.add("carousel-item");

      // Imagen del cliente
      if (testimony.img) {
        const img = document.createElement("img");
        img.src = testimony.img;
        img.alt = testimony.name;
        img.classList.add("testimonial-img");
        item.appendChild(img);
      }

      // Estrellas dinámicas según rating (seguro)
      const stars = document.createElement("div");
      stars.classList.add("testimonial-stars");
      const maxStars = 5;
      let rating = Number(testimony.rating) || 0;  // convertir a número
      rating = Math.min(Math.max(rating, 0), maxStars); // asegurar 0-5
      stars.innerHTML = "⭐".repeat(rating) + "☆".repeat(maxStars - rating);
      item.appendChild(stars);

      // 3️⃣ Descripción del testimonio
      const p = document.createElement("p");
      p.textContent = testimony.text;
      item.appendChild(p);

      // 4️⃣ Nombre del cliente
      const h3 = document.createElement("h3");
      h3.textContent = testimony.name;
      item.appendChild(h3);

      group.appendChild(item);
    });

    // Mostrar el primer grupo y limitar palabras
    showGroup();
    limitWordsInTestimonies();

  }).catch(err => {
    console.error("Error cargando testimonios:", err);
  });

});
