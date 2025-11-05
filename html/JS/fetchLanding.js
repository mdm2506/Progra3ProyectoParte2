const LandingUrl = 'http://localhost:3000/api/landing'; 
// Usa 'http://localhost:3000/landing' si NO tienes app.setGlobalPrefix('api')

// GET
function getLandings() {
  return fetch(LandingUrl).then(res => res.json());
}

// POST
function createLanding(landing) {
  return fetch(LandingUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(landing)
  }).then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}
