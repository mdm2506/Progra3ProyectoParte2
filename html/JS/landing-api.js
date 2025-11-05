(function () {
    const API_HOST = 'http://localhost:3000';
    const API_BASE = API_HOST + '/api/landing';

    async function parseResponse(res) {
        const text = await res.text();
        try { 
            return JSON.parse(text); 
        } catch (e) { 
            return text; 
        }
    }

    // Obtener todos los landings
    async function getAll() {
        console.log('[LandingAPI] GET', API_BASE);
        const r = await fetch(API_BASE);
        const parsed = await parseResponse(r);
        console.log('[LandingAPI] GET response', r.status, parsed);
        if (!r.ok) 
            throw new Error('GET failed: ' + r.status + ' - ' + (typeof parsed === 'string' ? parsed : JSON.stringify(parsed)));
        return parsed;
    }
(function () {
  const API_HOST = 'http://localhost:3000';
  const API_BASE = API_HOST + '/api/landing'; // Cambia a '/landing' si NO usas app.setGlobalPrefix('api')

  async function parseResponse(res) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }

  // Obtener todos los landings
  async function getAll() {
    console.log('[LandingAPI] GET', API_BASE);
    const r = await fetch(API_BASE);
    const parsed = await parseResponse(r);
    console.log('[LandingAPI] GET response', r.status, parsed);
    if (!r.ok) throw new Error('GET failed: ' + r.status + ' - ' + (typeof parsed === 'string' ? parsed : JSON.stringify(parsed)));
    return parsed;
  }

  // Crear un nuevo landing
  async function create(payload) {
    console.log('[LandingAPI] POST', API_BASE, payload);
    const r = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const parsed = await parseResponse(r);
    console.log('[LandingAPI] POST response', r.status, parsed);
    if (!r.ok) throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    return parsed;
  }

  // Actualizar un landing por ID
  async function update(id, payload) {
    const url = `${API_BASE}/${id}`; 
    console.log('[LandingAPI] PUT', url, payload);
    const r = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const parsed = await parseResponse(r);
    console.log('[LandingAPI] PUT response', r.status, parsed);
    if (!r.ok) throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    return parsed;
  }

  // Eliminar un landing por ID
  async function remove(id) {
    const url = `${API_BASE}/${id}`; 
    console.log('[LandingAPI] DELETE', url);
    const r = await fetch(url, { method: 'DELETE' });
    const parsed = await parseResponse(r);
    console.log('[LandingAPI] DELETE response', r.status, parsed);
    if (!r.ok) throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    return parsed;
  }

  window.LandingAPI = { getAll, create, update, remove, API_BASE };
})();

    // Crear un nuevo landing
    async function create(payload) {
        console.log('[LandingAPI] POST', API_BASE, payload);
        const r = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const parsed = await parseResponse(r);
        console.log('[LandingAPI] POST response', r.status, parsed);
        if (!r.ok) 
            throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
        return parsed;
    }

    // Actualizar un landing por ID
    async function update(id, payload) {
        console.log('[LandingAPI] PUT', `${API_BASE}/${id}`, payload);
        const r = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const parsed = await parseResponse(r);
        console.log('[LandingAPI] PUT response', r.status, parsed);
        if (!r.ok) 
            throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
        return parsed;
    }

    // Eliminar un landing por ID
    async function remove(id) {
        console.log('[LandingAPI] DELETE', `${API_BASE}/${id}`);
        const r = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        const parsed = await parseResponse(r);
        console.log('[LandingAPI] DELETE response', r.status, parsed);
        if (!r.ok) 
            throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
        return parsed;
    }

    // Exponer las funciones globalmente
    window.LandingAPI = { getAll, create, update, remove, API_BASE };
})();
