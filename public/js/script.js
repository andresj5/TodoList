// Seleccionamos los elementos del DOM
const tarea = document.getElementById("tarea");
const nuevaTarea = document.getElementById("agregarTarea");
const listaTareas = document.getElementById("listaTareas");


function guardarTareas() {
    const tareas = [];
    document.querySelectorAll(".tarea").forEach(item => {
        const texto = item.textContent.replace(/X$/, "").trim();
        const fechaSpan = item.querySelector(".fecha");
        const fecha = fechaSpan ? fechaSpan.textContent.replace("Vence: ", "").replace(")","").trim() : null;
        
        tareas.push({
            texto : texto,
            completada: item.classList.contains("completada"),
            fecha: fecha
        });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Función para cargar tareas desde localStorage
function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(tareaObj => {
        agregarTarea(tareaObj.texto, tareaObj.completada, tareaObj.fecha);
    });
}

// Función para agregar una tarea
function agregarTarea(texto, completada = false, fecha = null) {
    const textoTarea = texto || tarea.value.trim(); // Usa el valor del input si no hay parámetro
    const fechaVencimiento = fechaTarea.value;

    const hoy = new Date().toISOString().split("T")[0];
    if (fechaVencimiento && fechaVencimiento < hoy) { 
        itemTarea.classList.add("vencida");
    }

    if (textoTarea === "") {
        alert("Escribe una tarea antes de agregarla.");
        return;
    }

    const itemTarea = document.createElement("li");
    itemTarea.classList.add("tarea");
    if (completada) itemTarea.classList.add("completada");
    itemTarea.innerHTML = `${textoTarea}<button class="boton-borrar">X</button>`;

    let fechaTexto = fechaVencimiento ? `<span class="fecha"> (Vence: ${fechaVencimiento})</span>` : "";

    itemTarea.innerHTML = `${textoTarea} ${fechaTexto} <button class="boton-borrar">X</button>`;

    // Marcar como completada
    itemTarea.addEventListener("click", function () {
        itemTarea.classList.toggle("completada");
        guardarTareas(); // Actualizar almacenamiento local
    });

    // Botón para eliminar
    itemTarea.querySelector(".boton-borrar").addEventListener("click", function () {
        itemTarea.classList.add("eliminando");
        setTimeout(() => {
            itemTarea.remove();
            guardarTareas(); // Actualizar almacenamiento local
        }, 300);
    });

    listaTareas.appendChild(itemTarea);
    guardarTareas(); // Guardar en localStorage

    tarea.value = ""; 
    fechaTarea.value = "";
}

// Evento para agregar tarea al hacer clic en el botón
nuevaTarea.addEventListener("click", () => agregarTarea());

// Evento para agregar tarea al presionar Enter
tarea.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        agregarTarea();
    }
});

// Cargar tareas almacenadas al iniciar
cargarTareas();