// Archivo para editar los datos de la sección Landing (Hero)
// Usamos una IIFE para mantener variables en un scope privado
(function () {
    // ====== ELEMENTOS DE LISTA ======
    const tblBody = document.getElementById('landing-tbl-body');
    const btnRefresh = document.getElementById('btn-refresh-landing');

    // ====== ELEMENTOS DEL FORM ======
    const form = document.getElementById('landing-form');
    const idI = document.getElementById('landing-id');
    const logoI = document.getElementById('landing-logo');
    const sloganI = document.getElementById('landing-slogan');
    const ctaI = document.getElementById('landing-cta');
    const logoPreview = document.getElementById('landing-logo-preview');
    const previewSlogan = document.getElementById('preview-slogan-landing');
    const previewCta = document.getElementById('landing-cta-preview');
    const btnSave = document.getElementById('btn-save-landing');
    const btnCancel = document.getElementById('btn-cancel-landing');
    const btnDelete = document.getElementById('btn-delete-landing');
    const status = document.getElementById('status-landing');

    // Memoria local
    let data = [];

    function setStatus(msg, isError = false) {
        if (status) {
            status.textContent = msg || '';
            status.style.color = isError ? '#b00020' : '#333';
        }
    }

    function setLoading(el, on) {
        if (el) el.disabled = on;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ====== CARGAR Y RENDERIZAR LISTA ======
    async function loadAndRenderLanding() {
        setStatus('Cargando landing...');
        try {
            if (typeof getLandings !== 'function') {
                console.warn('[eventosLandingEditable] getLandings() no está definido. Asegura que fetchLanding.js esté cargado antes.');
                data = [];
            } else {
                const list = await getLandings();
                data = Array.isArray(list) ? list : [];
            }

            if (!data.length) {
                tblBody.innerHTML = '<tr><td colspan="4" class="small">No hay registros de landing</td></tr>';
                setStatus('');
                return;
            }

            tblBody.innerHTML = '';
            data.forEach((item) => { // recorre cada landing
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td class="small">${escapeHtml(item.logoUrl || '').slice(0, 80)}</td>
          <td>${escapeHtml(item.slogan || '')}</td>
          <td class="small">${escapeHtml(item.cta || '')}</td>
          <td style="text-align:right">
            <button data-id="${item.id}" class="ghost btn-edit-landing">Editar</button>
          </td>
        `;
                tblBody.appendChild(tr);
            });

            tblBody.querySelectorAll('.btn-edit-landing').forEach((b) =>
                b.addEventListener('click', () => selectForEdit(b.dataset.id))
            );

            setStatus('');
        } catch (err) {
            console.error('[LandingAPI] Error', err);
            setStatus('Error cargando landing: ' + (err.message || err), true);
        }
    }

    // ====== SELECT/EDIT ======
    function clearForm() {
        if (idI) idI.value = '';
        if (logoI) logoI.value = '';
        if (sloganI) sloganI.value = '';
        if (ctaI) ctaI.value = '';
        if (logoPreview) logoPreview.src = '../html/IMG/Logo.png';
        if (previewSlogan) previewSlogan.textContent = '';
        if (previewCta) {
            previewCta.textContent = '';
            previewCta.style.display = 'none';
        }
        const titleEl = document.getElementById('form-title-landing');
        if (titleEl) titleEl.textContent = 'Editar Landing (Hero)';
    }

    function selectForEdit(id) {
        const item = data.find((x) => String(x.id) === String(id));
        if (!item) return setStatus('Registro no encontrado', true);

        if (idI) idI.value = item.id;
        if (logoI) logoI.value = item.logoUrl || '';
        if (sloganI) sloganI.value = item.slogan || '';
        if (ctaI) ctaI.value = item.cta || '';
        if (logoPreview) logoPreview.src = item.logoUrl || '../html/IMG/Logo.png';
        if (previewSlogan) previewSlogan.textContent = item.slogan || '';
        if (previewCta) {
            if (item.cta) {
                previewCta.textContent = item.cta;
                previewCta.style.display = 'inline-block';
            } else {
                previewCta.textContent = '';
                previewCta.style.display = 'none';
            }
        }

        const titleEl = document.getElementById('form-title-landing');
        if (titleEl) titleEl.textContent = 'Editar — Landing #' + item.id;
    }

    // ====== PREVIEW EN TIEMPO REAL ======
    if (logoI) logoI.addEventListener('input', () => {
        if (logoPreview) logoPreview.src = logoI.value || '../html/IMG/Logo.png';
    });

    if (sloganI) sloganI.addEventListener('input', () => {
        if (previewSlogan) previewSlogan.textContent = sloganI.value;
    });

    if (ctaI) ctaI.addEventListener('input', () => {
        if (!previewCta) return;
        const v = ctaI.value || '';
        previewCta.textContent = v;
        previewCta.style.display = v ? 'inline-block' : 'none';
    });

    // ====== SUBMIT (UPDATE) ======
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                logoUrl: (logoI && logoI.value ? logoI.value.trim() : ''),
                slogan: (sloganI && sloganI.value ? sloganI.value.trim() : ''),
                cta: (ctaI && ctaI.value ? ctaI.value.trim() : ''),
            };

            if (!payload.logoUrl || !payload.slogan) return setStatus('Logo URL y Slogan son requeridos', true);

            const id = idI && idI.value;
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
    }

    // ====== DELETE ======
    if (btnDelete) {
        btnDelete.addEventListener('click', async () => {
            const id = idI && idI.value;
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
    }

    // ====== CANCEL / REFRESH / INIT ======
    if (btnCancel) btnCancel.addEventListener('click', () => clearForm());
    if (btnRefresh) btnRefresh.addEventListener('click', () => loadAndRenderLanding());
    window.addEventListener('load', () => loadAndRenderLanding());

})();
