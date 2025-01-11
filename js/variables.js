import { generarId } from "./funciones.js"

let editando = false

// Objeto de cita
const citaObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
}

export {
    citaObj,
    editando
}