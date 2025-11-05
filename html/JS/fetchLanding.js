const LandingUrl = 'http://localhost:3000/api/landing';


// GET
function getLandings() {
  return fetch(LandingUrl).then(res => res.json());
}

//put
function updateLanding(id, landing) {
  return fetch(`${LandingUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(landing)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    });
}
//delete
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
