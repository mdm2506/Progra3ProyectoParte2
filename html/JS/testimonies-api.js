const API_URL = 'http://localhost:3000/api/testimonies';

// API simplificada de testimonios
const TestimoniosAPI = {
  // Obtener todos los testimonios
  getAll() {
    return fetch(API_URL).then(res => res.json());
  },

  // Obtener un testimonio por id
  getById(id) {
    return fetch(`${API_URL}/${id}`).then(res => res.json());
  },

  // Crear un testimonio
  create(testimonio) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonio)
    }).then(res => res.json());
  },

  // Actualizar un testimonio
  update(id, testimonio) {
    return fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonio)
    }).then(res => res.json());
  },

  // Eliminar un testimonio
  delete(id) {
    return fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    }).then(res => res.json());
  }
};

// Uso globalmente
window.TestimoniosAPI = TestimoniosAPI;