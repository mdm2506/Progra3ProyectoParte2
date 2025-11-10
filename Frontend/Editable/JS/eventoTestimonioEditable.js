(function () {
    // Editor de testimonios: gestiona la tabla, el formulario y llamadas a la API
    // Elemento donde ponemos las filas de la tabla
    const tblBody = document.getElementById('tbl-body');
    // Botón para recargar la lista
    const btnRefresh = document.getElementById('btn-refresh');
    // Botón para crear un nuevo testimonio (limpiar formulario)
    const btnNew = document.getElementById('btn-new');
    // Formulario principal
    const form = document.getElementById('form');
    // Campo oculto o de id (para editar)
    const idI = document.getElementById('id');
    // Campo nombre
    const nameI = document.getElementById('name');
    // Campo calificación
    const ratingI = document.getElementById('rating');
    // Campo URL/imagen
    const imgI = document.getElementById('img');
    // Campo texto del testimonio
    const textI = document.getElementById('text');
    // Imagen de vista previa
    const imgPreview = document.getElementById('img-preview');
    // Elemento donde mostramos el nombre en la vista previa
    const previewName = document.getElementById('preview-name');
    // Elemento donde mostramos la calificación en la vista previa
    const previewRating = document.getElementById('preview-rating');
    // Elemento para mostrar mensajes de estado / errores
    const status = document.getElementById('status');
    // Botón cancelar
    const btnCancel = document.getElementById('btn-cancel');
    // Botón eliminar
    const btnDelete = document.getElementById('btn-delete');
    // Botón guardar
    const btnSave = document.getElementById('btn-save');

    // Array que contendrá los testimonios cargados
    let data = [];

    // Mostrar mensajes de estado (error -> rojo)
    function setStatus(msg, isError) {
        status.textContent = msg || '';
        status.style.color = isError ? '#b00020' : '#333';
    }
    
    // Función que habilita/deshabilita un elemento (botón) según 'on'
    function setLoading(el, on) { 
        el.disabled = on; // deshabilita si on es true y habilita si es false
    }

    // Llama a la API para obtener todos los testimonios (usa wrapper si existe)
    async function apiGetAll() {
        try {
            if (window.TestimoniosAPI) return await window.TestimoniosAPI.getAll();
            const r = await fetch('/testimonies');
            if (!r.ok) throw new Error(r.status);
            return await r.json();
        } catch (e) {
            throw e;
        }
    }

    // Dibuja la tabla con los testimonios recibidos
    function renderTable(items) {
        data = items || []; // actualizamos el array local
        // Si no hay datos mostramos una fila indicando que no hay testimonios
        if (!data.length) { 
            tblBody.innerHTML = '<tr><td colspan="4" class="small">No hay testimonios</td></tr>'; // mensaje de no hay datos
            return; 
        }
        // Vaciamos la tabla y añadimos una fila por cada testimonio
        tblBody.innerHTML = '';
        data.forEach(t => { // Recorre cada testimonio
            const tr = document.createElement('tr'); // crea fila
            tr.innerHTML = `
              <td><strong>${escapeHtml(t.name || '')}</strong><div class="small">${new Date(t.createdAt || '').toLocaleString() || ''}</div></td>
              <td>${escapeHtml(t.rating || '')}</td>
              <td class="small">${escapeHtml((t.text || '').slice(0, 120))}</td>
              <td style="text-align:right"><button data-id="${t.id}" class="ghost btn-edit">Editar</button></td>
            `;
            tblBody.appendChild(tr); // agrega la estructura al body
        });
        // Después de renderizar, asignamos el evento de editar a cada botón
        tblBody.querySelectorAll('.btn-edit').forEach(b => {
            b.addEventListener('click', () => selectForEdit(b.dataset.id));
        });
    }

    // Escapa texto para prevenir inyección HTML
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Carga la lista y la muestra en la tabla, manejando errores
    async function loadAndRender() {
        setStatus('Cargando...');
        try {
            const list = await apiGetAll(); // pide la data
            renderTable(list); // hace la tabla
            setStatus(''); // limpia el status
        } catch (err) { 
            console.error(err); 
            setStatus('Error cargando testimonios: ' + (err.message || err), true);  // manejo de errores
        }
    }

    // Limpiar formulario y vista previa a valores por defecto
    function clearForm() {
        idI.value = ''; 
        nameI.value = ''; 
        ratingI.value = ''; 
        imgI.value = ''; 
        textI.value = ''; 
        imgPreview.src = 'IMG/Logo.png'; 
        previewName.textContent = ''; 
        previewRating.textContent = ''; 
        document.getElementById('form-title').textContent = 'Crear / Editar'; 
    }

    // Selecciona un testimonio para editar y llena el formulario con sus datos
    async function selectForEdit(id) {
        const t = data.find(x => String(x.id) === String(id)); // busca por id en la data local
        if (!t) return setStatus('Registro no encontrado', true);
        // Rellena valores
        idI.value = t.id; 
        nameI.value = t.name || ''; 
        ratingI.value = t.rating || ''; 
        imgI.value = t.img || ''; 
        textI.value = t.text || '';
        imgPreview.src = t.img || 'IMG/Logo.png'; 
        previewName.textContent = t.name || ''; 
        previewRating.textContent = t.rating || '';
        document.getElementById('form-title').textContent = 'Editar — ' + (t.name || '');
    }

    // Actualiza la vista previa cuando se cambia la URL de la imagen
    imgI.addEventListener('input', () => {
        imgPreview.src = imgI.value || 'IMG/Logo.png';
    });
    
    // Mientras se escribe nombre o calificación, actualizamos la vista previa
    [nameI, ratingI].forEach(i => i.addEventListener('input', () => { 
        previewName.textContent = nameI.value; 
        previewRating.textContent = ratingI.value; 
    }));

    // Manejo del submit: crear o actualizar según si hay id
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Construimos el objeto que vamos a enviar a la API
        const payload = { 
            name: nameI.value.trim(), 
            rating: ratingI.value.trim(), 
            img: imgI.value.trim(), 
            text: textI.value.trim() 
        };
        
        // Validación mínima de nombre y texto obligatorios
        if (!payload.name || !payload.text) {
            return setStatus('Nombre y testimonio son requeridos', true);
        }
        
        const id = idI.value; // Si hay id es edición; si no es creación
        
        try {
            setStatus(id ? 'Guardando cambios...' : 'Creando...'); // Mensaje según acción
            setLoading(btnSave, true); // Deshabilita botón guardar
            
            if (id) {
                // Si hay id actualiza testimonio existente
                if (window.TestimoniosAPI) {
                    await window.TestimoniosAPI.update(id, payload);
                } else {
                    await fetch(`/testimonies/${id}`, { 
                        method: 'PUT', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(payload) 
                    });
                }
                setStatus('Cambios guardados');
            } else {
                // Si no hay id crea nuevo testimonio
                let created;
                if (window.TestimoniosAPI) {
                    created = await window.TestimoniosAPI.create(payload);
                } else {
                    const r = await fetch('/testimonies', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(payload) 
                    });
                    created = await r.json();
                }
                setStatus('Testimonio creado');
                if (created && created.id) idI.value = created.id;
            }
            
            // Recargar lista y notificar a ventana padre si aplica
            await loadAndRender();
            notifyParent();
        } catch (err) { 
            console.error(err); 
            setStatus('Error al guardar: ' + (err.message || err), true); 
        } finally { 
            setLoading(btnSave, false); // Rehabilita botón guardar
        }
    });

    // Enviar mensaje a la ventana padre (si esta ventana fue abierta desde otra)
    function notifyParent() { 
        try { 
            if (window.opener) {
                window.opener.postMessage(JSON.stringify({ type: 'testimonies-updated' }), '*'); 
            }
        } catch (e) { }
    }

    // Botones: nuevo, recargar y cancelar
    btnNew.addEventListener('click', () => clearForm());
    btnRefresh.addEventListener('click', () => loadAndRender());
    btnCancel.addEventListener('click', () => clearForm());

    // Eliminar registro seleccionado
    btnDelete.addEventListener('click', async () => {
        const id = idI.value; 
        if (!id) return setStatus('Selecciona un testimonio para eliminar', true);
        if (!confirm('Confirmar eliminación')) return;
        
        try {
            setStatus('Eliminando...'); 
            setLoading(btnDelete, true);
            
            if (window.TestimoniosAPI) {
                await window.TestimoniosAPI.delete(id);
            } else {
                await fetch(`/testimonies/${id}`, { method: 'DELETE' });
            }
            
            setStatus('Eliminado'); 
            clearForm(); 
            await loadAndRender(); 
            notifyParent();
        } catch (err) { 
            console.error(err); 
            setStatus('Error al eliminar: ' + (err.message || err), true); 
        } finally { 
            setLoading(btnDelete, false); 
        }
    });

    // Iniciar carga de lista al cargar la ventana
    window.addEventListener('load', () => loadAndRender());
    
    // Escuchar mensajes desde otras ventanas y recargar si es necesario
    window.addEventListener('message', (ev) => { 
        try { 
            const m = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data; 
            if (m && m.type === 'testimonies-updated') loadAndRender(); 
        } catch (e) { }
    });

})();