// Selectores
const pacienteInput = document.querySelector('#paciente')
const propietarioInput = document.querySelector('#propietario')
const emailInput = document.querySelector('#email')
const fechaInput = document.querySelector('#fecha')
const sintomasInput = document.querySelector('#sintomas')

const formulario = document.querySelector('#formulario-cita')

const contenedorCitas = document.querySelector('#citas')

// Objeto de cita
const citaObj = {
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
}

// Eventos
pacienteInput.addEventListener('change', datosCita)
propietarioInput.addEventListener('change', datosCita)
emailInput.addEventListener('change', datosCita)
fechaInput.addEventListener('change', datosCita)
sintomasInput.addEventListener('change', datosCita)

formulario.addEventListener('submit', submitCita)

class Notificacion {

    constructor( {texto, tipo} ) {
        this.texto = texto
        this.tipo = tipo

        this.mostrar()
    }

    mostrar() {
        // Crear la notificacion
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm')

        // Eliminar alertas duplicadas
        const alertaPrevia = document.querySelector('.alert')
        alertaPrevia?.remove()

        // Si es de tipo error, agregar una clase
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')

        // Mensaje de alerta
        alerta.textContent = this.texto

        // Insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario)

        // Quitar despues de 3 segundos
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

class AdminCitas {
    
    constructor() {
        this.citas = []
    }

    agregar(cita) {
        this.citas = [...this.citas, cita]
        this.mostrar()
    }

    mostrar() {
        // Limpiar HTML
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }

        // Generando las citas
        this.citas.forEach( cita => {
            const divCita = document.createElement('DIV')
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10', 'rounded-xl')

            const paciente = document.createElement('P')
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`

            // Mostrando en el HTML
            divCita.appendChild(paciente)

            contenedorCitas.appendChild(divCita)
        })
    }
}

function datosCita(e) {
    citaObj[e.target.name] = e.target.value
}

const citas = new AdminCitas()

function submitCita(e) {
    e.preventDefault()

    if( Object.values(citaObj).some(valor => valor.trim() === '') ) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return
    }

    citas.agregar(citaObj)
}