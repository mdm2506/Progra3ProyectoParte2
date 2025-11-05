const ServicioUrl = 'http://localhost:3000/api/servicios';

//este metodo obtiene los servicios
function getServicios() {
    return fetch(ServicioUrl)//esto retorna una promesa
        .then(response => response.json());//La transformo a Yeison
}
//Updatear servicio

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