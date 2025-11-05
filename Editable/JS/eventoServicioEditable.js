// eventoServicioEditable.js
(function () {
    const tblBody = document.getElementById('services-tbl-body');
    const btnRefresh = document.getElementById('btn-refresh-service');
    const form = document.getElementById('service-form');
    const idI = document.getElementById('id-service');
    const titleI = document.getElementById('service-title');
    const descI = document.getElementById('service-description');
    const imgI = document.getElementById('service-img');
    const imgPreview = document.getElementById('img-preview-service');
    const previewTitle = document.getElementById('preview-title-service');
    const previewDesc = document.getElementById('preview-desc-service');
    const status = document.getElementById('status-service');
    const btnSave = document.getElementById('btn-save-service');

    let data = [];

    function setStatus(msg, isError = false) {
        status.textContent = msg || '';
        status.style.color = isError ? '#b00020' : '#333';
    }

    function setLoading(el, on) { el.disabled = on; }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Cargar y renderizar los servicios
    async function loadAndRenderServices() {
        setStatus('Cargando servicios...');
        try {
            const list = await getServicios(); // usa tu función del otro script
            data = list || [];

            if (!data.length) {
                tblBody.innerHTML = '<tr><td colspan="4" class="small">No hay servicios</td></tr>';
                setStatus('');
                return;
            }

            tblBody.innerHTML = '';
            data.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(s.titulo || '')}</strong></td>
                    <td class="small">${escapeHtml(s.descripcion || '')}</td>
                    <td class="small">${escapeHtml(s.urlImagen || '').slice(0, 60)}</td>
                    <td style="text-align:right">
                        <button data-id="${s.id}" class="ghost btn-edit-service">Editar</button>
                    </td>
                `;
                tblBody.appendChild(tr);
            });

            tblBody.querySelectorAll('.btn-edit-service').forEach(b =>
                b.addEventListener('click', () => selectForEdit(b.dataset.id))
            );

            setStatus('');
        } catch (err) {
            console.error('[getServicios] Error', err);
            setStatus('Error cargando servicios: ' + (err.message || err), true);
        }
    }

    function clearForm() {
        idI.value = '';
        titleI.value = '';
        descI.value = '';
        imgI.value = '';
        imgPreview.src = '../html/IMG/Logo.png';
        previewTitle.textContent = '';
        previewDesc.textContent = '';
    }

    async function selectForEdit(id) {
        const s = data.find(x => String(x.id) === String(id));
        if (!s) return setStatus('Servicio no encontrado', true);

        idI.value = s.id;
        titleI.value = s.titulo || '';
        descI.value = s.descripcion || '';
        imgI.value = s.urlImagen || '';
        imgPreview.src = s.urlImagen || '../html/IMG/Logo.png';
        previewTitle.textContent = s.titulo || '';
        previewDesc.textContent = s.descripcion || '';
    }

    imgI.addEventListener('input', () => {
        imgPreview.src = imgI.value || '../html/IMG/Logo.png';
    });

    [titleI, descI].forEach(i => i.addEventListener('input', () => {
        previewTitle.textContent = titleI.value;
        previewDesc.textContent = descI.value;
    }));


    form.addEventListener('submit', async e => {
        e.preventDefault();
        const id = idI.value;
        const payload = {
            titulo: titleI.value.trim(),
            descripcion: descI.value.trim(),
            urlImagen: imgI.value.trim()
        };

        if (!payload.titulo) return setStatus('El título es requerido', true);
        if (!id) return setStatus('Seleccione un servicio para editar', true);

        try {
            setStatus('Guardando...');
            setLoading(btnSave, true);

            // usa la función de tu otro script
            await updateServicio(id, payload);
            setStatus('Servicio actualizado correctamente');

            await loadAndRenderServices();
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
