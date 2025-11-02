(function () {
  const API_HOST = 'http://localhost:3000';
  const API_BASE = API_HOST + '/api/testimonies';

  async function parseResponse(res) {
    const text = await res.text();
    try { return JSON.parse(text); } catch (e) { return text; }
  }

  async function getAll() {
    console.log('[TestimoniesAPI] GET', API_BASE);
    const r = await fetch(API_BASE);
    const parsed = await parseResponse(r);
    console.log('[TestimoniesAPI] GET response', r.status, parsed);
    if (!r.ok) throw new Error('GET failed: ' + r.status + ' - ' + (typeof parsed === 'string' ? parsed : JSON.stringify(parsed)));
    return parsed;
  }

  async function create(payload) {
    console.log('[TestimoniesAPI] POST', API_BASE, payload);
    const r = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const parsed = await parseResponse(r);
    console.log('[TestimoniesAPI] POST response', r.status, parsed);
    if (!r.ok) throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    return parsed;
  }

  async function update(id, payload) {
    console.log('[TestimoniesAPI] PUT', `${API_BASE}/${id}`, payload);
    const r = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const parsed = await parseResponse(r);
    console.log('[TestimoniesAPI] PUT response', r.status, parsed);
    if (!r.ok) throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    return parsed;
  }

  async function remove(id) {
    console.log('[TestimoniesAPI] DELETE', `${API_BASE}/${id}`);
    const r = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const parsed = await parseResponse(r);
    console.log('[TestimoniesAPI] DELETE response', r.status, parsed);
    if (!r.ok) throw new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    return parsed;
  }

  window.TestimoniesAPI = { getAll, create, update, remove, API_BASE };
})();
