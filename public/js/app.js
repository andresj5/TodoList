// Selección de elementos del DOM
const tarea = document.getElementById("tarea");           // Input de texto
const fechaTarea = document.getElementById("fechaTarea"); // Input de fecha
const nuevaTarea = document.getElementById("agregarTarea"); // Botón de agregar
const listaTareas = document.getElementById("listaTareas"); // Lista donde se mostrarán las tareas

// Configuración de la API
const API_URL = 'http://localhost:5000/api/tasks';

// Función para formatear la fecha
function formatearFecha(fecha) {
    if (!fecha) return '';
    const f = new Date(fecha);
    return f.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para agregar una tarea
async function agregarTarea(texto = null, completada = false, fecha = null, id = null) {
    // Si no se proporciona texto (al cargar desde la BD), no crear nueva tarea
    if (texto === null) {
        texto = tarea.value.trim();
        fecha = fechaTarea.value;
    }

    // Validar que la tarea no esté vacía
    if (texto === "") {
        alert("Por favor escribe una tarea");
        return;
    }

    try {
        let nuevaTarea;
        
        // Si no se proporciona ID, crear nueva tarea en el servidor
        if (!id) {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    texto: texto,
                    fecha: fecha
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear la tarea');
            }

            nuevaTarea = await response.json();
        } else {
            nuevaTarea = { _id: id, texto, completada, fecha };
        }
        
        // Crear el elemento de la tarea en el DOM
        const itemTarea = document.createElement("li");
        itemTarea.classList.add("tarea");
        itemTarea.dataset.id = nuevaTarea._id;
        
        // Si la tarea está completada, agregar la clase
        if (completada) {
            itemTarea.classList.add("completada");
        }

        // Agregar la fecha si existe
        let fechaFormateada = fecha ? `<span class="fecha">(Vence: ${formatearFecha(fecha)})</span>` : "";
        
        // Agregar el contenido HTML
        itemTarea.innerHTML = `${texto} ${fechaFormateada} <button class="boton-borrar">X</button>`;

        // Marcar como completada al hacer clic
        itemTarea.addEventListener("click", async function() {
            try {
                const response = await fetch(`${API_URL}/${itemTarea.dataset.id}`, {
                    method: 'PATCH'
                });
                
                if (!response.ok) {
                    throw new Error('Error al actualizar la tarea');
                }
                
                itemTarea.classList.toggle("completada");
            } catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar la tarea');
            }
        });

        // Eliminar tarea
        itemTarea.querySelector(".boton-borrar").addEventListener("click", async function(e) {
            e.stopPropagation();
            
            try {
                const response = await fetch(`${API_URL}/${itemTarea.dataset.id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Error al eliminar la tarea');
                }
                
                itemTarea.classList.add("eliminando");
                setTimeout(() => {
                    itemTarea.remove();
                }, 300);
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar la tarea');
            }
        });

        // Agregar la tarea a la lista
        listaTareas.appendChild(itemTarea);
        
        // Limpiar los inputs solo si es una nueva tarea
        if (!id) {
            tarea.value = "";
            fechaTarea.value = "";
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear la tarea');
    }
}

// Función para cargar tareas desde el servidor
async function cargarTareas() {
    try {
        // Limpiar la lista antes de cargar
        listaTareas.innerHTML = '';
        
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al cargar las tareas');
        }
        
        const tareas = await response.json();
        for (const tarea of tareas) {
            await agregarTarea(tarea.texto, tarea.completada, tarea.fecha, tarea._id);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar las tareas');
    }
}

// Eventos principales
nuevaTarea.addEventListener("click", () => agregarTarea());

tarea.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        agregarTarea();
    }
});

// Cargar tareas al iniciar la página
cargarTareas();
