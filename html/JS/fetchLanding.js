// Base URL del endpoint de landing (hero + relaciones)
const LandingUrl = 'http://localhost:3000/api/landing';


// GET: devuelve el listado de landings en JSON
function getLandings() {
  return fetch(LandingUrl).then(res => res.json());
}

//put
// PUT: actualiza un landing por id, enviando el objeto landing como JSON
function updateLanding(id, landing) {
  return fetch(`${LandingUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }, // le decimos al backend que enviamos JSON
    body: JSON.stringify(landing)
  })
    .then(response => {
      if (!response.ok) { // si el servidor responde con error (400, 404, 500, etc)
        return response.json().then(err => Promise.reject(err)); // rechazamos manualmente con detalle del error
      }
      return response.json();
    });
}
//delete
// DELETE: elimina un landing por id
function deleteLanding(id) {
  return fetch(`${LandingUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    });
}
