// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // VARIABLES
    const startButton = document.getElementById("botonInicio");
    const cronometro = document.getElementById("cronometro");
    const formularioExamen = document.getElementById("formularioExamen");
    const botonEnviar = formularioExamen.querySelector("input[type='submit']");
    const inicio = document.getElementById("inicio");
    let tiempoRestante = 10 * 60; // Tiempo inicial del cronómetro (ajustar para hacer pruebas)
    let timerInterval; // Variable para almacenar el intervalo del cronómetro
    let cronometroActivo = false; // Estado del cronómetro (activo o no)
    let tiempoFinalizado = false; // Estado del tiempo (finalizado o no)

    // Función para validar el nombre
    function validarNombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return regex.test(nombre) && nombre.trim().includes(" "); // Verifica que el nombre tenga al menos un espacio (nombre y apellido)
    }

    // Función para validar el DNI/NIE
    function validarDNI(dni) {
        const regexDNI = /^\d{8}[A-Z]$/; // Formato de DNI: 8 números + 1 letra
        const regexNIE = /^[XYZ]\d{7}[A-Z]$/; // Formato de NIE: X/Y/Z + 7 números + 1 letra
        return regexDNI.test(dni) || regexNIE.test(dni);
    }

    // Función para validar nombre y DNI antes de empezar el examen
    function validarNombreDNI() {
        const nombre = document.getElementById("name").value.trim(); // Obtiene el nombre
        const dni = document.getElementById("dni").value.trim(); // Obtiene el DNI/NIE

        // Verifica que se hayan ingresado nombre y DNI
        if (!nombre || !dni) {
            alert("Por favor, introduce tu nombre y DNI/NIE antes de empezar.");
            return false;
        }

        // Valida el nombre
        if (!validarNombre(nombre)) {
            alert("Introduce un nombre válido (solo letras y al menos un nombre y un apellido).");
            return false;
        }

        // Valida el DNI/NIE
        if (!validarDNI(dni)) {
            alert("Introduce un DNI/NIE válido (las letras en mayúsculas).");
            return false;
        }

        return true;
    }

    // Función para iniciar el cronómetro
    function iniciarCronometro() {
        startButton.style.visibility = "hidden"; // Oculta el botón de inicio
        inicio.style.display = "none"; // Oculta la sección de inicio
        formularioExamen.style.display = "block"; // Muestra el formulario del examen
        cronometro.style.display = "block"; // Muestra el cronómetro
        cronometroActivo = true; // Marca el cronómetro como activo

        // Intervalo para actualizar el cronómetro cada segundo
        timerInterval = setInterval(function () {
            const minutos = Math.floor(tiempoRestante / 60); // Calcula los minutos restantes
            const segundos = tiempoRestante % 60; // Calcula los segundos restantes
            cronometro.textContent = `Tiempo restante: ${minutos}:${segundos < 10 ? "0" + segundos : segundos}`; // Muestra el tiempo en formato MM:SS

            // Si el tiempo se acaba
            if (tiempoRestante <= 0) {
                clearInterval(timerInterval); // Detiene el intervalo
                alert("¡El tiempo ha finalizado!"); // Muestra pop-up
                tiempoFinalizado = true; // Marca el tiempo como finalizado

                // Deshabilita todos los elementos del formulario
                formularioExamen.querySelectorAll("input, select, button").forEach(element => {
                    element.disabled = true;
                });

                botonEnviar.disabled = true; // Deshabilita el botón de enviar
                corregirExamen(); // Corrige el examen automáticamente

            } else {
                tiempoRestante--; // Reduce el tiempo restante
            }
        }, 1000); // Intervalo de 1 segundo
    }

    // Función para corregir las respuestas y calcular la puntuación
    function corregirExamen() {
        // Respuestas correctas
        const respuestasCorrectas = {
            pregunta1: "a",
            pregunta2: "b",
            pregunta3: "b",
            pregunta4: "b",
            pregunta5: "b",
            pregunta6: "c",
            pregunta7: "c",
            pregunta8: "a",
            pregunta9: "c",
            pregunta10: "c",
        };

        let puntuacion = 0; // Inicializa la puntuación
        let mensajePregunta10Texto = ""; // Mensaje para la pregunta 10

        // Recorre las preguntas
        for (let pregunta in respuestasCorrectas) {

            const seleccionada = document.querySelector(`input[name="${pregunta}"]:checked`); // Obtiene la respuesta seleccionada

            if (seleccionada) {
                // Compara la respuesta seleccionada con la correcta
                if (seleccionada.value === respuestasCorrectas[pregunta]) {
                    puntuacion++; // Suma un punto si es correcta
                } else {
                    puntuacion -= 0.5; // Resta 0.5 puntos si es incorrecta
                    if (puntuacion < 0) puntuacion = 0; // Evita puntuaciones negativas
                    seleccionada.parentElement.classList.add("incorrecta"); // Marca la respuesta como incorrecta
                }

                // Marca la respuesta correcta
                const respuestaCorrecta = document.querySelector(`input[name="${pregunta}"][value="${respuestasCorrectas[pregunta]}"]`);

                if (respuestaCorrecta) {
                    respuestaCorrecta.parentElement.classList.add("correcta");
                }
            } else if (pregunta === "pregunta10") { // Manejo especial para la pregunta 10 (desplegable)

                const seleccionadaSelect = document.querySelector(`select[name="${pregunta}"]`).value;

                if (!seleccionadaSelect) continue; // Si no se seleccionó nada, continúa

                const selectPregunta10 = document.querySelector(`select[name="${pregunta}"]`);

                if (seleccionadaSelect === respuestasCorrectas[pregunta]) {
                    puntuacion++; // Suma un punto si es correcta
                    selectPregunta10.classList.add("select-correcta"); // Marca como correcta
                } else {
                    puntuacion -= 0.5; // Resta 0.5 puntos si es incorrecta
                    if (puntuacion < 0) puntuacion = 0; // Evita puntuaciones negativas
                    selectPregunta10.classList.add("select-incorrecta"); // Marca como incorrecta
                    mensajePregunta10Texto = "Respuesta incorrecta. La respuesta correcta es: C) Cuando los vehículos van marcha atrás."; // Mensaje de error
                }
            }
        }

        // Muestra la puntuación final (pop-up)
        alert(`Puntuación final: ${puntuacion} / 10`);

        // Muestra el mensaje de error para la pregunta 10 si es necesario
        if (mensajePregunta10Texto) {
            const mensajePregunta10 = document.getElementById("mensajePregunta10");
            mensajePregunta10.style.display = "block";
            mensajePregunta10.textContent = mensajePregunta10Texto;
        }
    }

    // Función para verificar si al menos una pregunta ha sido respondida
    function validarFormulario() {
        const preguntas = formularioExamen.querySelectorAll("input[type='radio'], select");
        return Array.from(preguntas).some(pregunta => (pregunta.type === "radio" && pregunta.checked) || (pregunta.type === "select-one" && pregunta.value));
    }

    // Evento para iniciar el examen al hacer clic en el botón
    startButton.addEventListener("click", function () {
        if (validarNombreDNI()) { // Si el nombre y DNI son válidos
            iniciarCronometro(); // Inicia el cronómetro
        }
    });

    // Evento para enviar respuestas y corregir el examen
    botonEnviar.addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault(); // Evita el envío del formulario

        // Verifica si se ha respondido al menos una pregunta
        if (!validarFormulario()) {
            alert("¡Selecciona al menos una respuesta antes de enviar el examen!");
            return;
        }

        clearInterval(timerInterval); // Detiene el cronómetro

        corregirExamen(); // Corrige el examen

        // Deshabilita todos los elementos del formulario
        formularioExamen.querySelectorAll("input, select, button").forEach(element => element.disabled = true);

        botonEnviar.disabled = true; // Deshabilita el botón de enviar
    });
});
