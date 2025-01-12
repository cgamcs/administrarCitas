import { pacienteInput, propietarioInput, emailInput, fechaInput, sintomasInput, formulario } from './selectores.js'
import { datosCita, submitCita, crearDB  } from './funciones.js'

// Eventos
function eventListeners() {
    pacienteInput.addEventListener('change', datosCita)
    propietarioInput.addEventListener('change', datosCita)
    emailInput.addEventListener('change', datosCita)
    fechaInput.addEventListener('change', datosCita)
    sintomasInput.addEventListener('change', datosCita)
    formulario.addEventListener('submit', submitCita)
}

window.onload = () => {
    eventListeners()

    crearDB()
}