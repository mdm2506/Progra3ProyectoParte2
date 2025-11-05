
(function () {
    const tblBody = document.getElementById('tbl-body');
    const btnRefresh = document.getElementById('btn-refresh');
    const btnNew = document.getElementById('btn-new');
    const form = document.getElementById('form');
    const idI = document.getElementById('id');
    const nameI = document.getElementById('name');
    const ratingI = document.getElementById('rating');
    const imgI = document.getElementById('img');
    const textI = document.getElementById('text');
    const imgPreview = document.getElementById('img-preview');
    const previewName = document.getElementById('preview-name');
    const previewRating = document.getElementById('preview-rating');
    const status = document.getElementById('status');
    const btnCancel = document.getElementById('btn-cancel');
    const btnDelete = document.getElementById('btn-delete');

    let data = [];

    function setStatus(msg, isError) { status.textContent = msg || ''; status.style.color = isError ? '#b00020' : '#333'; }
    function setLoading(el, on) { el.disabled = on; }

    async function apiGetAll() {
        try {
            if (window.TestimoniesAPI && window.TestimoniesAPI.getAll) return await window.TestimoniesAPI.getAll();
            const r = await fetch('/testimonies'); if (!r.ok) throw new Error(r.status);
            return await r.json();
        } catch (e) { throw e; }
    }

    function renderTable(items) {
        data = items || [];
        if (!data.length) { tblBody.innerHTML = '<tr><td colspan="4" class="small">No hay testimonios</td></tr>'; return; }
        tblBody.innerHTML = '';
        data.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${escapeHtml(t.name || '')}</strong><div class="small">${new Date(t.createdAt || '').toLocaleString() || ''}</div></td>
              <td>${escapeHtml(t.rating || '')}</td>
              <td class="small">${escapeHtml((t.text || '').slice(0, 120))}</td>
              <td style="text-align:right"><button data-id="${t.id}" class="ghost btn-edit">Editar</button></td>
            `;
            tblBody.appendChild(tr);
        });
        // attach edit handlers
        tblBody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => selectForEdit(b.dataset.id)));
    }

    function escapeHtml(str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

    async function loadAndRender() {
        setStatus('Cargando...');
        try {
            const list = await apiGetAll();
            renderTable(list);
            setStatus('');
        } catch (err) { console.error(err); setStatus('Error cargando testimonios: ' + (err.message || err), true); }
    }

    function clearForm() { idI.value = ''; nameI.value = ''; ratingI.value = ''; imgI.value = ''; textI.value = ''; imgPreview.src = 'IMG/Logo.png'; previewName.textContent = ''; previewRating.textContent = ''; document.getElementById('form-title').textContent = 'Crear / Editar'; }

    async function selectForEdit(id) {
        const t = data.find(x => String(x.id) === String(id));
        if (!t) return setStatus('Registro no encontrado', true);
        idI.value = t.id; nameI.value = t.name || ''; ratingI.value = t.rating || ''; imgI.value = t.img || ''; textI.value = t.text || '';
        imgPreview.src = t.img || 'IMG/Logo.png'; previewName.textContent = t.name || ''; previewRating.textContent = t.rating || '';
        document.getElementById('form-title').textContent = 'Editar — ' + (t.name || '');
    }

    imgI.addEventListener('input', () => { imgPreview.src = imgI.value || 'IMG/Logo.png'; });
    [nameI, ratingI].forEach(i => i.addEventListener('input', () => { previewName.textContent = nameI.value; previewRating.textContent = ratingI.value; }));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = { name: nameI.value.trim(), rating: ratingI.value.trim(), img: imgI.value.trim(), text: textI.value.trim() };
        if (!payload.name || !payload.text) return setStatus('Nombre y testimonio son requeridos', true);
        const id = idI.value;
        try {
            setStatus(id ? 'Guardando cambios...' : 'Creando...');
            setLoading(btnSave, true);
            if (id) {
                await (window.TestimoniesAPI && window.TestimoniesAPI.update ? window.TestimoniesAPI.update(id, payload) : fetch(`/testimonies/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }));
                setStatus('Cambios guardados');
            } else {
                const created = await (window.TestimoniesAPI && window.TestimoniesAPI.create ? window.TestimoniesAPI.create(payload) : (async () => { const r = await fetch('/testimonies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); return await r.json(); })());
                setStatus('Testimonio creado');
                if (created && created.id) idI.value = created.id;
            }
            await loadAndRender();
            notifyParent();
        } catch (err) { console.error(err); setStatus('Error al guardar: ' + (err.message || err), true); }
        finally { setLoading(btnSave, false); }
    });

    function notifyParent() { try { if (window.opener) window.opener.postMessage(JSON.stringify({ type: 'testimonies-updated' }), '*'); } catch (e) { } }

    btnNew.addEventListener('click', () => { clearForm(); });
    btnRefresh.addEventListener('click', () => loadAndRender());
    btnCancel.addEventListener('click', () => clearForm());

    btnDelete.addEventListener('click', async () => {
        const id = idI.value; if (!id) return setStatus('Selecciona un testimonio para eliminar', true);
        if (!confirm('Confirmar eliminación')) return;
        try {
            setStatus('Eliminando...'); setLoading(btnDelete, true);
            await (window.TestimoniesAPI && window.TestimoniesAPI.remove ? window.TestimoniesAPI.remove(id) : fetch(`/testimonies/${id}`, { method: 'DELETE' }));
            setStatus('Eliminado'); clearForm(); await loadAndRender(); notifyParent();
        } catch (err) { console.error(err); setStatus('Error al eliminar: ' + (err.message || err), true); }
        finally { setLoading(btnDelete, false); }
    });

    // wire btnSave reference (needed earlier)
    const btnSave = document.getElementById('btn-save');

    // init
    window.addEventListener('load', () => loadAndRender());
    window.addEventListener('message', (ev) => { try { const m = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data; if (m && m.type === 'testimonies-updated') loadAndRender(); } catch (e) { } });

})();
