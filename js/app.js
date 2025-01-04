// Selectores
const pacienteInput = document.querySelector('#paciente')
const propietarioInput = document.querySelector('#propietario')
const emailInput = document.querySelector('#email')
const fechaInput = document.querySelector('#fecha')
const sintomasInput = document.querySelector('#sintomas')

const formulario = document.querySelector('#formulario-cita')

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

function datosCita(e) {
    citaObj[e.target.name] = e.target.value
    console.log(citaObj)
}

function submitCita(e) {
    e.preventDefault()

    console.log('Enviando formulario')
}