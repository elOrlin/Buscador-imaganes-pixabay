const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')
const paginacion = document.querySelector('#paginacion')

let registros = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario )
}

function validarFormulario(e){
    e.preventDefault();

    const termino = document.querySelector('#termino').value;

    if(termino === ''){
        imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    buscarImagenes()
}

function imprimirAlerta(mensaje, tipo) {
    
    const alerta = document.querySelector('.alerta');

    if(!alerta) {
        // crear la alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

        if(tipo === 'error') {
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const key = '19036013-46d5e5c7ef01557fd79e5a98f';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registros}&page=${paginaActual}`;

    spinner()

    fetch(url)
    .then(respuesta => respuesta.json())
       .then(datos => {
        totalPaginas = calcularPaginas(datos.totalHits)

        mostrarImganes(datos.hits)
   })
}

function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registros))
}

function mostrarImganes(imagenes){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Me Gusta</span></p>

                        <a 
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"   
                        href="${largeImageURL}" target="_blanck rel="noopener noreferrer">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    })
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild)
    }

        imprimirPaginador()
}

function spinner(){
    const spinnerGif = document.createElement('div')

    const alerta = document.querySelector('.spinner')
 if(!alerta){
        
    spinnerGif.innerHTML = `
    <div class="spinner">
         <div class="bounce1"></div>
        <div class="bounce2"></div>
         <div class="bounce3"></div>
     </div>
    `;

    formulario.appendChild(spinnerGif)

     setTimeout(() => {
           spinnerGif.remove();
     }, 1000)
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas)

    while(true){
        const {value, done} = iterador.next()
        if(done) return;

        const boton = document.createElement('a')
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'mx-auto', 'px-4', 'py-1', 'mr-1', 'font-bold' ,'mb-1', 'rounded', 'cursor-pointer')

        boton.onclick = () => {

            paginaActual = value;

            buscarImagenes()
        }

       paginacion.appendChild(boton)
    }
}

