const ServicioUrl='https:/localhost:3000/servicios';

//este metodo obtiene los servicios
function getServicios(){
    return fetch(ServicioUrl)//esto retorna una promesa
    .then(response => response.json());//esto convierte la respuesta en json
}
//este metodo crea un servicio
function CreateServicio(servicio){//se le pasa un objeto servicio
    return fetch(ServicioUrl,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(servicio)//convierte el objeto servicio a json
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    });
}