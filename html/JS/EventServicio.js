window.addEventListener("load", () => {

    getServicios().then((services) => {
        const container = document.getElementById('Services-flex-cards');
        // container.innerHTML = ''; // Limpia el contenedor

        services.forEach(service => {
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = service.urlImagen;
            img.alt = service.titulo;
            img.classList.add('service-img');

            const intro = document.createElement('div');
            intro.classList.add('intro');

            const h2 = document.createElement('h2');
            h2.textContent = service.titulo;

            const p = document.createElement('p');
            p.innerHTML = service.descripcion;

            intro.appendChild(h2);
            intro.appendChild(p);

            card.appendChild(img);
            card.appendChild(intro);

            container.appendChild(card);
        });
    });

});