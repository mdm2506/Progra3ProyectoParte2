const LandingUrl = 'http://localhost:3000/api/landing';

// ==========GET==========
//  para devolver el listado de landings en JSON
function getLandings() {
  return fetch(LandingUrl).then(res => res.json());
}

// ==========PUT==========
//  actualiza un landing por id, enviando el objeto landing como JSON
function updateLanding(id, landing) {
  return fetch(`${LandingUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(landing)
  })
    .then(response => {
      // si el servidor responde con error (400, 404, 500, etc)
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    });
}
// ==========DELETE==========
// para elimina un landing por id
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