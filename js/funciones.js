import Notificacion from './classes/Notificacion.js'
import AdminCitas from './classes/AdminCitas.js'
import { citaObj, editando, contenedorDB } from './variables.js'
import { formulario, formularioInput, pacienteInput, propietarioInput, emailInput, fechaInput, sintomasInput } from './selectores.js'

const citas = new AdminCitas()

let state;

export function datosCita(e) {
    citaObj[e.target.name] = e.target.value
}

export function submitCita(e) {
    e.preventDefault()

    // Mostrar notificacion de error en caso de que falte ingresar algun input
    if( Object.values(citaObj).some(valor => valor.trim() === '') ) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return
    }

    if(editando.value) {
        citas.editar(structuredClone(citaObj))

        // Edita en IndexedDB
        const transaction = contenedorDB.DB.transaction(['citas'], 'readwrite')
        const objectStore = transaction.objectStore('citas')

        objectStore.put(citaObj)

        transaction.oncomplete = () => {
            new Notificacion({
                texto: 'Guardado correctamente',
                tipo: 'exito'
            })

            citas.mostrar()
        }

        transaction.onerror = () => {
            console.log('Hubo un error')
        }
    } else {
        // Almacena una copia de citaObj
        citas.agregar(structuredClone(citaObj))

        // Insertar registro en IdexedDB
        const transaction = contenedorDB.DB.transaction(['citas'], 'readwrite')

        // Habilitar el objectstore
        const objectStore = transaction.objectStore('citas')

        // Insertar en la BD
        objectStore.add(citaObj)

        transaction.oncomplete = () => {
            new Notificacion({
                texto: 'Paciente registrado',
                tipo: 'exito'
            })

            console.log('Cita agregada')

            citas.mostrar()
        }
    }

    /*
        Existen dos formas puede ser
        como citas.agregar({...citaObj}) o con
        la funcion mas reciente de JS
        citas.agregar(structuredClone(citaObj))
    */

    formulario.reset()
    reiniciarObjetoCita()
    formularioInput.value = 'Registrar paciente'
    editando.value = false
}

export function reiniciarObjetoCita() {
    // citaObj.id = generarId();
    // citaObj.paciente = '';
    // citaObj.propietario = '';
    // citaObj.email = '';
    // citaObj.fecha = '';
    // citaObj.sintomas = '';

    // Reiniciar el objeto
    Object.assign(citaObj, {
        id: generarId(),
        paciente: '',
        propietario: '',
        email: '',
        fecha: '',
        sintomas: ''
    })
}

export function generarId() {
    return Math.random().toString(36).substring(2) + Date.now()
}

export function cargarEdicion(cita) {
    Object.assign(citaObj, cita)

    pacienteInput.value = cita.paciente
    propietarioInput.value = cita.propietario
    emailInput.value = cita.email
    fechaInput.value = cita.fecha
    sintomasInput.value = cita.sintomas

    editando.value = true

    formularioInput.value = 'Guardar cambios'
}

export function crearDB() {
    // Crear la base de datos en version 1.0
    const crearDB = window.indexedDB.open('citas', 1)

    // Si hay un error
    crearDB.onerror = function() {
        console.log('Hubo un error')
    }

    // Si todo sale bien
    crearDB.onsuccess = function() {
        console.log('Se creo la base de datos correctamente')
        contenedorDB.DB = crearDB.result

        // Mostrar las citas almacenadas
        citas.mostrar()
    }

    // Definimos el esquema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        })

        // Definir todas las columnas
        objectStore.createIndex('paciente', 'paciente', { unique: false })
        objectStore.createIndex('propietario', 'propietario', { unique: false })
        objectStore.createIndex('email', 'email', { unique: false })
        objectStore.createIndex('fecha', 'fecha', { unique: false })
        objectStore.createIndex('sintomas', 'sintomas', { unique: false })
        objectStore.createIndex('id', 'id', { unique: true })

        console.log('Base de datos creada y lista')
    }
}

export function animateDOMChange(action) {
    state = Flip.getState('.members-table-rows')
    action();
    runAnimation(state);
}
  
function runAnimation(state) {
    let timeline = Flip.from(state, {
        absolute: true,
        ease: "power1.inOut",
        targets: ".members-table-rows",
        scale: true,
        simple: true,
    })
    timeline.play()
}