
(function () {
    // ====== CONFIG API ======
    const API_BASE = 'http://localhost:3000/api/landing'; // usa absoluto si tu front corre en otro puerto

    // ====== ELEMENTOS DE LISTA ======
    const tblBody = document.getElementById('landing-tbl-body');
    const btnRefresh = document.getElementById('btn-refresh-landing');

    // ====== ELEMENTOS DEL FORM ======
    const form = document.getElementById('landing-form');
    const idI = document.getElementById('landing-id');
    const logoI = document.getElementById('landing-logo');
    const sloganI = document.getElementById('landing-slogan');
    const logoPreview = document.getElementById('landing-logo-preview');
    const previewSlogan = document.getElementById('preview-slogan-landing');
    const btnSave = document.getElementById('btn-save-landing');
    const btnCancel = document.getElementById('btn-cancel-landing');
    const btnDelete = document.getElementById('btn-delete-landing');
    const status = document.getElementById('status-landing');

    let data = [];

    function setStatus(msg, isError) {
        status.textContent = msg || '';
        status.style.color = isError ? '#b00020' : '#333';
    }

    function setLoading(el, on) { if (el) el.disabled = on; }

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
    async function loadAndRenderLanding() {
        setStatus('Cargando landing...');
        try {
            const r = await fetch(API_BASE);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            const list = await r.json();
            data = Array.isArray(list) ? list : [];
            if (!data.length) {
                tblBody.innerHTML = '<tr><td colspan="3" class="small">No hay registros de landing</td></tr>';
                setStatus('');
                return;
            }
            tblBody.innerHTML = '';
            data.forEach(item => {
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
            tblBody.querySelectorAll('.btn-edit-landing').forEach(b =>
                b.addEventListener('click', () => selectForEdit(b.dataset.id))
            );
            setStatus('');
        } catch (err) {
            console.error('[LandingAPI] Error', err);
            setStatus('Error cargando landing: ' + (err.message || err), true);
        }
    }

    function clearForm() {
        idI.value = '';
        logoI.value = '';
        sloganI.value = '';
        logoPreview.src = '../html/IMG/Logo.png';
        previewSlogan.textContent = '';
        document.getElementById('form-title-landing').textContent = 'Editar Landing (Hero)';
    }

    async function selectForEdit(id) {
        const item = data.find(x => String(x.id) === String(id));
        if (!item) return setStatus('Registro no encontrado', true);
        idI.value = item.id;
        logoI.value = item.logoUrl || '';
        sloganI.value = item.slogan || '';
        logoPreview.src = item.logoUrl || '../html/IMG/Logo.png';
        previewSlogan.textContent = item.slogan || '';
        document.getElementById('form-title-landing').textContent = 'Editar — Landing #' + item.id;
    }

    // ====== PREVIEW EN TIEMPO REAL ======
    logoI.addEventListener('input', () => {
        logoPreview.src = logoI.value || '../html/IMG/Logo.png';
    });
    sloganI.addEventListener('input', () => {
        previewSlogan.textContent = sloganI.value;
    });

    // ====== SUBMIT (CREATE / UPDATE) ======
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            logoUrl: (logoI.value || '').trim(),
            slogan: (sloganI.value || '').trim()
        };
        if (!payload.logoUrl || !payload.slogan) return setStatus('Logo URL y Slogan son requeridos', true);

        const id = idI.value;
        try {
            setStatus('Guardando...');
            setLoading(btnSave, true);
            const url = id ? `${API_BASE}/${id}` : API_BASE;
            const method = id ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            setStatus('Cambios guardados');
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
    btnDelete.addEventListener('click', async () => {
        const id = idI.value;
        if (!id) return setStatus('Selecciona un registro para eliminar', true);
        if (!confirm('Confirmar eliminación')) return;
        try {
            setStatus('Eliminando...');
            setLoading(btnDelete, true);
            const r = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            setStatus('Eliminado');
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
    btnCancel.addEventListener('click', () => clearForm());

    // ====== REFRESH ======
    btnRefresh.addEventListener('click', () => loadAndRenderLanding());

    // ====== INIT ======
    window.addEventListener('load', () => loadAndRenderLanding());
})();

