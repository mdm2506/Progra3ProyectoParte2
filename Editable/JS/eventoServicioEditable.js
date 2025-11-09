// eventoServicioEditable.js
(function () {
     const tblBody = document.getElementById('services-tbl-body');     // <tbody> donde se pintan las filas de servicios
    const btnRefresh = document.getElementById('btn-refresh-service'); // Botón para recargar la lista de servicios
    const form = document.getElementById('service-form');              // Formulario para editar un servicio
    const idI = document.getElementById('id-service');                 // Input (hidden/read-only) con el ID del servicio
    const titleI = document.getElementById('service-title');           // Input del título del servicio
    const descI = document.getElementById('service-description');      // Textarea/entrada de la descripción
    const imgI = document.getElementById('service-img');               // Input con la URL de la imagen
    const imgPreview = document.getElementById('img-preview-service'); // Imagen de previsualización
    const previewTitle = document.getElementById('preview-title-service'); // Texto de preview del título
    const previewDesc = document.getElementById('preview-desc-service');   // Texto de preview de la descripción
    const status = document.getElementById('status-service');          // Área para mensajes de estado/errores
    const btnSave = document.getElementById('btn-save-service');       // Botón de guardar cambios

    let data = []; // Memoria local con la lista de servicios cargados

    function setStatus(msg, isError = false) { // Muestra un mensaje para el usuario
        status.textContent = msg || ''; // Escribe el texto (o lo limpia)
        status.style.color = isError ? '#b00020' : '#333'; // Rojo si es error, gris si es normal
    }

    function setLoading(el, on) { el.disabled = on; } // deshabilita si on es true y habilita si es false

    function escapeHtml(str) { // Escapa texto para evitar que se inserte HTML malicioso en la tabla
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Cargar y renderizar los servicios
    async function loadAndRenderServices() { // Trae la lista y la dibuja en la tabla
        setStatus('Cargando servicios...');
        try {
            const list = await getServicios(); // un fetch
            data = list || [];  // Guarda en memoria local

            if (!data.length) { // si ta vacio, muestra no hay sistema en columnas
                tblBody.innerHTML = '<tr><td colspan="4" class="small">No hay servicios</td></tr>';
                setStatus('');
                return;
            }

            tblBody.innerHTML = ''; // limpia
            data.forEach(s => { // recorre cada servicio
                const tr = document.createElement('tr'); // crea una fila y añade los datos de abajo
                tr.innerHTML = `
                    <td><strong>${escapeHtml(s.titulo || '')}</strong></td>
                    <td class="small">${escapeHtml(s.descripcion || '')}</td>
                    <td class="small">${escapeHtml(s.urlImagen || '').slice(0, 60)}</td>
                    <td style="text-align:right">
                        <button data-id="${s.id}" class="ghost btn-edit-service">Editar</button>
                    </td>
                `;
                tblBody.appendChild(tr); // los añade
            });

            tblBody.querySelectorAll('.btn-edit-service').forEach(b => // Por cada botón "Editar" recién creado...
                b.addEventListener('click', () => selectForEdit(b.dataset.id)) // Asignamos evento para cargar el form
            );

            setStatus(''); // quita mensaje de cargando
        } catch (err) { // manejo de errores
            console.error('[getServicios] Error', err);
            setStatus('Error cargando servicios: ' + (err.message || err), true);
        }
    }

    function clearForm() { // limpiar formulario
        idI.value = '';
        titleI.value = '';
        descI.value = '';
        imgI.value = '';
        imgPreview.src = '../html/IMG/Logo.png';
        previewTitle.textContent = '';
        previewDesc.textContent = '';
    }

    async function selectForEdit(id) { // carga un servicio en el formulario para editar
        const s = data.find(x => String(x.id) === String(id)); // Busca en la lista local por ID
        if (!s) return setStatus('Servicio no encontrado', true); // Si no existe, avisa
        // cambia los valores por los ingresados
        idI.value = s.id;
        titleI.value = s.titulo || '';
        descI.value = s.descripcion || '';
        imgI.value = s.urlImagen || '';
        imgPreview.src = s.urlImagen || '../html/IMG/Logo.png';
        previewTitle.textContent = s.titulo || '';
        previewDesc.textContent = s.descripcion || '';
    }

    imgI.addEventListener('input', () => { // preview de la imagen del logo cuando se pone una URL
        imgPreview.src = imgI.value || '../html/IMG/Logo.png';
    });

    [titleI, descI].forEach(i => i.addEventListener('input', () => { // cuando se escribe en titulo y descripción actualiza como con la imagen del logo
        previewTitle.textContent = titleI.value;
        previewDesc.textContent = descI.value;
    }));


    form.addEventListener('submit', async e => { // envia formulario
        e.preventDefault(); // evita que recargue la pagina
        const id = idI.value; // toma ID actual (si hay, es edición)
        const payload = { // datos que manda a al API
            titulo: titleI.value.trim(),
            descripcion: descI.value.trim(),
            urlImagen: imgI.value.trim()
        };
        // validaciones
        if (!payload.titulo) return setStatus('El título es requerido', true);
        if (!id) return setStatus('Seleccione un servicio para editar', true);

        try {
            setStatus('Guardando...'); // mensaje que muestra de progreso
            setLoading(btnSave, true); // deshabilita boton de guardado

            // llama al PUT pa actualizar
            await updateServicio(id, payload);
            setStatus('Servicio actualizado correctamente'); // actualiza lo de progreso

            await loadAndRenderServices(); // recarga la tabla para ver cambios
            clearForm();
        } catch (err) {
            console.error('[updateServicio] Error:', err);
            setStatus('Error al guardar: ' + (err.message || err), true);
        } finally {
            setLoading(btnSave, false);
        }
    });

    btnRefresh.addEventListener('click', () => loadAndRenderServices());
    window.addEventListener('load', () => loadAndRenderServices());
})();
