const API_URL = 'http://localhost:3000/api/testimonies'; // URL base donde está la API de testimonios en el backend local

// API simplificada de testimonios
const TestimoniosAPI = {
  // Obtener todos los testimonios
  getAll() {
    return fetch(API_URL).then(res => res.json()); // hace fetch a la ruta y retorna la respuesta en JSON
  },

  // Obtener un testimonio por id
  getById(id) {
    return fetch(`${API_URL}/${id}`).then(res => res.json()); // hace fetch a la ruta con id y retorna la respuesta en JSON
  },

  // Crear un testimonio
  create(testimonio) {
    return fetch(API_URL, { // hace un POST a la ruta base
      method: 'POST', //metodo POST
      headers: { 'Content-Type': 'application/json' }, //tipo de contenido JSON
      body: JSON.stringify(testimonio) //convierte el objeto testimonio a JSON
    }).then(res => res.json()); //retorna la respuesta en JSON
  },

  // Actualizar un testimonio
  update(id, testimonio) {
    return fetch(`${API_URL}/${id}`, { // hace un PUT a la ruta con id
      method: 'PUT', //metodo PUT
      headers: { 'Content-Type': 'application/json' }, //tipo de contenido JSON
      body: JSON.stringify(testimonio) //convierte el objeto testimonio a JSON
    }).then(res => res.json()); //retorna la respuesta en JSON
  },

  // Eliminar un testimonio
  delete(id) {
    return fetch(`${API_URL}/${id}`, { // hace un DELETE a la ruta con id
      method: 'DELETE' //metodo DELETE
    }).then(res => res.json()); //retorna la respuesta en JSON
  }
};

// Uso globalmente
window.TestimoniosAPI = TestimoniosAPI; // hace que el objeto esté disponible en toda la página