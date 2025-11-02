const ServicioUrl = 'http://localhost:3000/api/servicios';

//este metodo obtiene los servicios
function getServicios() {
    return fetch(ServicioUrl)//esto retorna una promesa
        .then(response => response.json());
}
//este metodo crea un servicio
function CreateServicio(servicio) {
    return fetch(ServicioUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(servicio)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        });
}