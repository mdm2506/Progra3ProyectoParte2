// Wrapper sencillo para la API de servicios
const ServicioUrl = 'http://localhost:3000/api/servicios';

// getServicios: obtiene la lista de servicios (promesa JSON)
function getServicios() {
    return fetch(ServicioUrl).then(response => response.json());
}

// updateServicio: actualiza un servicio por id (PUT)
function updateServicio(id, servicioActualizado) {
    return fetch(`${ServicioUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(servicioActualizado),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar el servicio");
            }
            return response.json();
        })
        .then(json => console.log("Servicio actualizado:", json))
        .catch(error => console.error(error));
}