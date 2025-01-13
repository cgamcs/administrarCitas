import { contenedorCitas } from '../selectores.js'
import { contenedorDB } from '../variables.js'
import { cargarEdicion, animateDOMChange } from "../funciones.js"
import Notificacion from './Notificacion.js'

export default class AdminCitas {
    
    constructor() {
        this.citas = []
    }

    agregar(cita) {
        this.citas = [...this.citas, cita]
        this.mostrar()
    }

    editar(citaActualizada) {
        // Identifica la cita y reescribe al objeto nuevo que agregamos
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita )
        this.mostrar()
    }

    eliminar(id) {
        const transaction = contenedorDB.DB.transaction(['citas'], 'readwrite')
        const objectStore = transaction.objectStore('citas')
        objectStore.delete(id)

        transaction.oncomplete = () => {
            new Notificacion({
                texto: 'Paciente eliminado',
                tipo: 'error'
            })
            this.mostrar()
        }

        transaction.onerror = () => {
            console.log('Hubo un error')
        }
    }

    mostrar() {
        // Limpiar HTML
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }

        // Verificar si la base de datos está lista
        if (!contenedorDB.DB) return;

        // Leer el contenido de la base de datos
        const objectStore = contenedorDB.DB.transaction('citas').objectStore('citas')

        const total = objectStore.count()
        total.onsuccess = () => {
            const totalCitas = total.result
            
            // Si no hay citas
            if(totalCitas === 0) {
                contenedorCitas.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>'
                return
            }

            objectStore.openCursor().onsuccess = (e) => {
                const cursor = e.target.result
    
                if(cursor) {
                    const { paciente, propietario, email, fecha, sintomas, id } = cursor.value
    
                    const divCita = document.createElement('DIV')
                    divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10', 'rounded-xl', 'members-table-rows')
    
                    const pacienteParrafo = document.createElement('P')
                    pacienteParrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                    pacienteParrafo.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${paciente}`
    
                    const propietarioParrafo = document.createElement('p');
                    propietarioParrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                    propietarioParrafo.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${propietario}`;
    
                    const emailParrafo = document.createElement('p');
                    emailParrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                    emailParrafo.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${email}`;
    
                    const fechaParrafo = document.createElement('p');
                    fechaParrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                    fechaParrafo.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${fecha}`;
    
                    const sintomasParrafo = document.createElement('p');
                    sintomasParrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                    sintomasParrafo.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${sintomas}`;
    
                    // Botones de eliminar y editar
                    const btnEditar = document.createElement('button');
                    btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-editar');
                    btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
    
                    // Escuchar el btnEditar y tomar una copia de cita
                    const clone = structuredClone(cursor.value)
                    btnEditar.onclick = () => cargarEdicion(clone)
    
                    const btnEliminar = document.createElement('button');
                    btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'eliminar');
                    btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    
                    btnEliminar.onclick = () => this.eliminar(id)
    
                    const contenedorBotones = document.createElement('DIV')
                    contenedorBotones.classList.add('flex', 'justify-between', 'mt-10')
    
                    contenedorBotones.appendChild(btnEditar)
                    contenedorBotones.appendChild(btnEliminar)
    
                    // Agregar al HTML
                    divCita.appendChild(pacienteParrafo);
                    divCita.appendChild(propietarioParrafo);
                    divCita.appendChild(emailParrafo);
                    divCita.appendChild(fechaParrafo);
                    divCita.appendChild(sintomasParrafo);
                    divCita.appendChild(contenedorBotones)
                    // contenedorCitas.appendChild(divCita);

                    animateDOMChange(() => { contenedorCitas.insertBefore(divCita, contenedorCitas.firstChild) })
    
                    // Ve al siguiente elemento
                    cursor.continue()
                }
            }
        }
    }
}