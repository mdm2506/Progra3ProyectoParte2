const TestimoniosUrl = 'http://localhost:3000/api/testimonies';

// Obtener todos los testimonios
function getTestimonios() {
  return fetch(TestimoniosUrl)
    .then(response => response.json());
}

// Obtener un testimonio por id
function getTestimonio(id) {
  return fetch(`${TestimoniosUrl}/${id}`)
    .then(response => response.json());
}

// Crear un testimonio
function crearTestimonio(testimonio) {
  return fetch(TestimoniosUrl, {
    method: 'POST',
    body: JSON.stringify(testimonio),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al crear testimonio');
      return response.json();
    })
    .then(json => console.log('Testimonio creado:', json))
    .catch(err => { console.error(err); throw err; });
}

// Actualizar un testimonio
function actualizarTestimonio(id, testimonioActualizado) {
  return fetch(`${TestimoniosUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(testimonioActualizado),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar testimonio');
      return response.json();
    })
    .then(json => console.log('Testimonio actualizado:', json))
    .catch(error => { console.error(error); throw error; });
}

// Eliminar un testimonio
function eliminarTestimonio(id) {
  return fetch(`${TestimoniosUrl}/${id}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) throw new Error('Error al eliminar testimonio');
      return response.text().then(text => {
        try { return JSON.parse(text); } catch (e) { return text; }
      });
    })
    .then(res => console.log('Testimonio eliminado:', res))
    .catch(error => { console.error(error); throw error; });
}

// Mantener compatibilidad
window.TestimoniesAPI = {
  // nuevo API (estilo fetchServico, nombres en español internamente)
  // claves públicas antiguas -> funciones internas nuevas
  getTestimonies: getTestimonios,
  getTestimonyById: getTestimonio,
  createTestimony: crearTestimonio,
  updateTestimony: actualizarTestimonio,
  deleteTestimony: eliminarTestimonio,
  TestimoniesUrl: TestimoniosUrl,
  // alias para compatibilidad con la versión anterior y con nombres en español
  getAll: getTestimonios,
  getTestimonios: getTestimonios,
  create: crearTestimonio,
  createTestimony: crearTestimonio,
  update: actualizarTestimonio,
  updateTestimony: actualizarTestimonio,
  remove: eliminarTestimonio,
  deleteTestimony: eliminarTestimonio,
  API_BASE: TestimoniosUrl,
};

