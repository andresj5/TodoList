// Selección de elementos del DOM
const tarea = document.getElementById("tarea");           // Input de texto
const fechaTarea = document.getElementById("fechaTarea"); // Input de fecha
const nuevaTarea = document.getElementById("agregarTarea"); // Botón de agregar
const listaTareas = document.getElementById("listaTareas"); // Lista donde se mostrarán las tareas

// Función para agregar una tarea
function agregarTarea(texto = null, completada = false, fecha = null) {
    // Obtener el texto de la tarea
    const textoTarea = texto || tarea.value.trim();
    const fechaVencimiento = fecha || fechaTarea.value;

    // Validar que la tarea no esté vacía
    if (textoTarea === "") {
        alert("Por favor escribe una tarea");
        return;
    }

    // Crear el elemento de la tarea
    const itemTarea = document.createElement("li");
    itemTarea.classList.add("tarea");  // Agregar la clase "tarea" al elemento
    
    // Si la tarea está completada, agregar la clase
    if (completada) {
        itemTarea.classList.add("completada");
    }

    // Agregar la fecha si existe
    let fechaTexto = fechaVencimiento ? `<span class="fecha">(Vence: ${fechaVencimiento})</span>` : "";
    
    // Agregar el contenido HTML (solo una vez)
    itemTarea.innerHTML = `${textoTarea} ${fechaTexto} <button class="boton-borrar">X</button>`;

    // Marcar como completada al hacer clic
    itemTarea.addEventListener("click", function() {
        itemTarea.classList.toggle("completada");
        guardarTareas();
    });

    // Eliminar tarea
    itemTarea.querySelector(".boton-borrar").addEventListener("click", function(e) {
        e.stopPropagation(); // Evitar que se active el evento de completar
        itemTarea.classList.add("eliminando");
        setTimeout(() => {
            itemTarea.remove();
            guardarTareas();
        }, 300); // Esperar 300ms para que se vea la animación
    });

    // Agregar la tarea a la lista
    listaTareas.appendChild(itemTarea);
    
    // Limpiar los inputs
    tarea.value = "";
    fechaTarea.value = "";
    
    // Guardar en localStorage
    guardarTareas();
}

//Función para guardar tareas en localStorage
function guardarTareas() {
    const tareas = [];
    document.querySelectorAll(".tarea").forEach(item => {
        // Obtener solo el texto de la tarea, excluyendo la fecha y el botón
        const textoCompleto = item.textContent.replace(/X$/, "").trim();
        const fechaSpan = item.querySelector(".fecha");
        const fecha = fechaSpan ? fechaSpan.textContent.replace(/[()]/g, "").replace("Vence: ", "").trim() : null;
        
        // Obtener el texto sin la fecha
        const texto = fechaSpan ? 
            textoCompleto.replace(fechaSpan.textContent, "").trim() : 
            textoCompleto;

        tareas.push({
            texto: texto,
            completada: item.classList.contains("completada"),
            fecha: fecha
        });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

//Función para cargar tareas desde localStorage
function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(tareaObj => {
        agregarTarea(tareaObj.texto, tareaObj.completada, tareaObj.fecha);
    });
}

//Eventos principales
//Agregar tarea al hacer clic en el botón
nuevaTarea.addEventListener("click", () => agregarTarea());

//Agregar tarea al presionar Enter
tarea.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        agregarTarea();
    }
});

//Cargar tareas al iniciar la página
cargarTareas();