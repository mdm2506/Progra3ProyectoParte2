// Archivo para editar los datos de la sección Landing (Hero)
// Usamos una IIFE para mantener variables en un scope privado
(function () {
    // ====== ELEMENTOS DE LISTA ======
    // Cuerpo de la tabla donde mostramos los registros
    const tblBody = document.getElementById('landing-tbl-body');
    // Botón para recargar la lista manualmente
    const btnRefresh = document.getElementById('btn-refresh-landing');

    // ====== ELEMENTOS DEL FORM ======
    // Formulario que edita la landing
    const form = document.getElementById('landing-form');
    // Campo oculto con el id del registro seleccionado
    const idI = document.getElementById('landing-id');
    // Campo de URL del logo
    const logoI = document.getElementById('landing-logo');
    // Campo del slogan/texto principal
    const sloganI = document.getElementById('landing-slogan');
    // Imagen de vista previa del logo
    const logoPreview = document.getElementById('landing-logo-preview');
    // Elemento donde mostramos el texto del slogan en la vista previa
    const previewSlogan = document.getElementById('preview-slogan-landing');
    // Botones del formulario
    const btnSave = document.getElementById('btn-save-landing');
    const btnCancel = document.getElementById('btn-cancel-landing');
    const btnDelete = document.getElementById('btn-delete-landing');
    // Elemento para mostrar mensajes de estado o error
    const status = document.getElementById('status-landing');

    // Array donde guardamos los datos cargados de la API
    let data = [];

    // Mostrar un mensaje en el área de estado
    // isError = true pinta el mensaje en rojo
    function setStatus(msg, isError = false) {
        status.textContent = msg || '';
        status.style.color = isError ? '#b00020' : '#333';
    }

    // Habilita o deshabilita un elemento (usado para botones mientras carga)
    function setLoading(el, on) {
        if (el) el.disabled = on;
    }

    // Escapa texto para evitar que se inserte HTML malicioso en la tabla
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ====== CARGAR Y RENDERIZAR LISTA ======
    // Trae la lista desde la API y la muestra en la tabla
    async function loadAndRenderLanding() {
        setStatus('Cargando landing...');
        try {
            // getLandings() debe estar definido en otro archivo (hace fetch al backend)
            const list = await getLandings();
            data = Array.isArray(list) ? list : [];

            // Si no hay registros mostramos un mensaje en la tabla
            if (!data.length) {
                tblBody.innerHTML =
                    '<tr><td colspan="3" class="small">No hay registros de landing</td></tr>';
                setStatus('');
                return;
            }

            // Limpiamos la tabla y añadimos una fila por cada item
            tblBody.innerHTML = '';
            data.forEach((item) => { // recorre cada landing
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td class="small">${escapeHtml(item.logoUrl || '').slice(0, 80)}</td>
          <td>${escapeHtml(item.slogan || '')}</td>
          <td style="text-align:right">
            <button data-id="${item.id}" class="ghost btn-edit-landing">Editar</button>
          </td>
        `;
                tblBody.appendChild(tr);
            });

            // Asignamos el evento de editar a cada botón generado
            tblBody.querySelectorAll('.btn-edit-landing').forEach((b) =>
                b.addEventListener('click', () => selectForEdit(b.dataset.id))
            );

            setStatus('');
        } catch (err) {
            // En caso de error mostramos en consola y en el área de estado
            console.error('[LandingAPI] Error', err);
            setStatus('Error cargando landing: ' + (err.message || err), true);
        }
    }

    // Limpia el formulario y restablece la vista previa a valores por defecto
    function clearForm() {
        idI.value = '';
        logoI.value = '';
        sloganI.value = '';
        logoPreview.src = '../html/IMG/Logo.png';
        previewSlogan.textContent = '';
        document.getElementById('form-title-landing').textContent = 'Editar Landing (Hero)';
    }

    // Carga los datos de un registro seleccionado y los pone en el formulario
    async function selectForEdit(id) {
        const item = data.find((x) => String(x.id) === String(id)); // busca por id unlanding en la lista local
        if (!item) return setStatus('Registro no encontrado', true);

        idI.value = item.id;
        logoI.value = item.logoUrl || '';
        sloganI.value = item.slogan || '';
        logoPreview.src = item.logoUrl || '../html/IMG/Logo.png';
        previewSlogan.textContent = item.slogan || '';
        document.getElementById('form-title-landing').textContent =
            'Editar — Landing #' + item.id;
    }

    // ====== PREVIEW EN TIEMPO REAL ======
    // Cuando el usuario cambia la URL del logo, actualizamos la imagen de preview
    logoI.addEventListener('input', () => {
        logoPreview.src = logoI.value || '../html/IMG/Logo.png';
    });

    // Mientras escribe el slogan, lo reflejamos en la vista previa
    sloganI.addEventListener('input', () => {
        previewSlogan.textContent = sloganI.value;
    });

    // ====== SUBMIT (UPDATE) ======
    // Enviar el formulario para actualizar un registro existente
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            logoUrl: (logoI.value || '').trim(),
            slogan: (sloganI.value || '').trim(),
        };
        // Validación que debe existir logo y slogan
        if (!payload.logoUrl || !payload.slogan)
            return setStatus('Logo URL y Slogan son requeridos', true);

        const id = idI.value;
        if (!id) return setStatus('Debes seleccionar un registro para actualizar', true);

        try {
            setStatus('Guardando...');
            setLoading(btnSave, true);

            await updateLanding(id, payload);

            setStatus('Cambios guardados correctamente');
            await loadAndRenderLanding();
            clearForm();
        } catch (err) {
            console.error(err);
            setStatus('Error al guardar: ' + (err.message || err), true);
        } finally {
            setLoading(btnSave, false);
        }
    });

    // ====== DELETE ======
    // Eliminar el registro seleccionado
    btnDelete.addEventListener('click', async () => {
        const id = idI.value;
        if (!id) return setStatus('Selecciona un registro para eliminar', true);
        if (!confirm('Confirmar eliminación')) return;

        try {
            setStatus('Eliminando...');
            setLoading(btnDelete, true);

            await deleteLanding(id);

            setStatus('Eliminado correctamente');
            clearForm();
            await loadAndRenderLanding();
        } catch (err) {
            console.error(err);
            setStatus('Error al eliminar: ' + (err.message || err), true);
        } finally {
            setLoading(btnDelete, false);
        }
    });

    // ====== CANCEL ======
    // Botón para cancelar edición y limpiar formulario
    btnCancel.addEventListener('click', () => clearForm());

    // ====== REFRESH ======
    // Botón para recargar manualmente la lista
    btnRefresh.addEventListener('click', () => loadAndRenderLanding());

    // ====== INIT ======
    // Cuando la ventana carga, traemos la lista de landings
    window.addEventListener('load', () => loadAndRenderLanding());
})();
