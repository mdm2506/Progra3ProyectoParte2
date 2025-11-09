window.addEventListener("load", () => { // esperamos a que toda la página termine de cargar

    getServicios().then((services) => { // llamamos a la función que trae todos los servicios de la API
        const container = document.getElementById('Services-flex-cards'); // seleccionamos el contenedor donde se mostrarán los servicios
        // container.innerHTML = ''; // Limpia el contenedor

        services.forEach(service => { // recorremos cada servicio obtenido
            const card = document.createElement('div'); // creamos un div para cada servicio
            card.classList.add('card'); // le asignamos la clase 'card' para estilos

            const img = document.createElement('img'); // creamos una etiqueta de imagen
            img.src = service.urlImagen; // asignamos la URL de la imagen del servicio
            img.alt = service.titulo; // texto alternativo para la imagen
            img.classList.add('service-img'); // le asignamos la clase 'service-img' para estilos

            const intro = document.createElement('div'); // creamos un div para el contenido del servicio
            intro.classList.add('intro'); // le asignamos la clase 'intro' para estilos

            const h2 = document.createElement('h2'); // creamos un encabezado h2
            h2.textContent = service.titulo; // asignamos el título del servicio

            const p = document.createElement('p'); // creamos un párrafo
            p.innerHTML = service.descripcion; // asignamos la descripción del servicio (usamos innerHTML para permitir formato)

            intro.appendChild(h2); // agregamos el título al div de contenido
            intro.appendChild(p); // agregamos la descripción al div de contenido

            card.appendChild(img); // agregamos la imagen a la tarjeta
            card.appendChild(intro); // agregamos el contenido a la tarjeta

            container.appendChild(card); // agregamos la tarjeta completa al contenedor principal
        });
    });

});