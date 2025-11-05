(function () {
    const API_HOST = 'http://localhost:3000';
    const API_BASE = API_HOST + '/api/servicios';

    async function parseResponse(res) {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    // Obtener todos los servicios
    async function getAll() {
        console.log('[ServicesAPI] GET', API_BASE);
        const r = await fetch(API_BASE);
        const parsed = await parseResponse(r);
        console.log('[ServicesAPI] GET response', r.status, parsed);
        if (!r.ok)
            throw new Error(`GET failed: ${r.status} - ${JSON.stringify(parsed)}`);
        return parsed;
    }

    // Actualizar un servicio por ID
    async function update(id, payload) {
        console.log('[ServicesAPI] PUT', `${API_BASE}/${id}`, payload);
        const r = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const parsed = await parseResponse(r);
        console.log('[ServicesAPI] PUT response', r.status, parsed);
        if (!r.ok)
            throw new Error(`PUT failed: ${r.status} - ${JSON.stringify(parsed)}`);
        return parsed;
    }

    window.ServicesAPI = { getAll, update, API_BASE };
})();
