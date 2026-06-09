document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('buscar');
    const tarjetas = document.querySelectorAll('.card');
    const titulosSecciones = document.querySelectorAll('.seccion-titulo');

    if (!inputBuscar) return;

    inputBuscar.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();

        tarjetas.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('.cuerpo h2').textContent.toLowerCase();
            const marca = tarjeta.querySelector('.cuerpo h4').textContent.toLowerCase();

            if (termino === "" || titulo.includes(termino) || marca.includes(termino)) {
                tarjeta.classList.remove('oculto');
            } else {
                tarjeta.classList.add('oculto');
            }
        });

        titulosSecciones.forEach(seccion => {
            const tarjetasVisibles = document.querySelectorAll(`.card[data-categoria="${seccion.id}"]:not(.oculto)`);
            if (tarjetasVisibles.length === 0 && termino !== "") {
                seccion.classList.add('oculto');
            } else {
                seccion.classList.remove('oculto');
            }
        });
    });

    inputBuscar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const termino = inputBuscar.value.toLowerCase().trim();
            const tarjetasVisibles = document.querySelectorAll('.card:not(.oculto)');

            if (termino !== "" && tarjetasVisibles.length === 0) {
                alert("No hay coincidencias");
            }
        }
    });
});