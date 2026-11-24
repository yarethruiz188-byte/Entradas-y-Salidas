// Seleccionamos los elementos del HTML que vamos a usar
const formulario = document.getElementById('formRegistro');
const tablaUsuarios = document.getElementById('tablaUsuarios');
const contadorActivos = document.getElementById('contadorActivos');

// Arreglo para guardar la lista de registros
let registros = [];

// Función para obtener la hora actual en formato HH:MM:SS
function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-MX', { hour12: false });
}

// Evento cuando se envía el formulario
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    // Capturamos los valores de los inputs
    const matricula = document.getElementById('matricula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const carrera = document.getElementById('carrera').value.trim();
    const equipo = document.getElementById('equipo').value;

    // Validamos que el equipo no esté ocupado actualmente por otro usuario
    const equipoOcupado = registros.some(reg => reg.equipo === equipo && reg.horaSalida === null);
    
    if (equipoOcupado) {
        alert('Ese equipo ya está ocupado. Selecciona otra computadora.');
        return;
    }

    // Creamos el objeto del nuevo usuario
    const nuevoRegistro = {
        id: Date.now(),
        matricula: matricula,
        nombre: nombre,
        carrera: carrera,
        equipo: equipo,
        horaEntrada: obtenerHoraActual(),
        horaSalida: null
    };

    // Lo agregamos al arreglo y actualizamos la tabla
    registros.push(nuevoRegistro);
    actualizarTabla();
    formulario.reset(); // Limpia los campos del formulario
});

// Función para registrar la hora de salida de un usuario
function marcarSalida(idUsuario) {
    for (let i = 0; i < registros.length; i++) {
        if (registros[i].id === idUsuario) {
            registros[i].horaSalida = obtenerHoraActual();
            break;
        }
    }
    actualizarTabla();
}

// Función para dibujar los datos en la tabla HTML
function actualizarTabla() {
    tablaUsuarios.innerHTML = '';
    let activos = 0;

    registros.forEach(function(usuario) {
        const fila = document.createElement('tr');

        // Si no tiene hora de salida, sigue activo en el laboratorio
        if (usuario.horaSalida === null) {
            activos++;
        }

        // Definimos qué mostrar en la columna de salida y acción
        const textoSalida = usuario.horaSalida ? usuario.horaSalida : 'En uso';
        const botonAccion = usuario.horaSalida === null 
            ? `<button class="btn-salida" onclick="marcarSalida(${usuario.id})">Marcar Salida</button>`
            : `<span class="texto-finalizado">Finalizado</span>`;

        fila.innerHTML = `
            <td>${usuario.matricula}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.carrera}</td>
            <td><strong>${usuario.equipo}</strong></td>
            <td>${usuario.horaEntrada}</td>
            <td>${textoSalida}</td>
            <td>${botonAccion}</td>
        `;

        tablaUsuarios.appendChild(fila);
    });

    // Actualizamos el contador de usuarios dentro del laboratorio
    contadorActivos.textContent = 'Usuarios activos: ' + activos;
}