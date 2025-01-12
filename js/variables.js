import { generarId } from "./funciones.js"

let editando = {
    value: false
}

let contenedorDB = {
    DB: null
}

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
    editando,
    contenedorDB
}