// Wrapper simple para la API de testimonios (frontend editable)
const API_URL = 'http://localhost:3000/api/testimonies';

const TestimoniosAPI = {
  // getAll: devuelve todos los testimonios (promesa JSON)
  getAll() {
    return fetch(API_URL).then(res => res.json());
  },

  // getById: devuelve un testimonio por id
  getById(id) {
    return fetch(`${API_URL}/${id}`).then(res => res.json());
  },

  // create: crea un testimonio (POST)
  create(testimonio) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonio)
    }).then(res => res.json());
  },

  // update: actualiza un testimonio por id (PUT)
  update(id, testimonio) {
    return fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonio)
    }).then(res => res.json());
  },

  // delete: elimina un testimonio por id
  delete(id) {
    return fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(res => res.json());
  }
};

// Exponer como global para que los scripts de la UI lo usen
window.TestimoniosAPI = TestimoniosAPI;