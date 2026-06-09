let indiceCara = 1;
const totalCaras = 4;
let intervaloCarrusel = setInterval(autoCambiar, 5000);

function mostrarCara(n) {
    let caras = document.querySelectorAll('.caras');

    if (n > totalCaras) {
        indiceCara = 1;
    }
    if (n < 1) {
        indiceCara = totalCaras;
    }

    caras.forEach(cara => {
        cara.classList.remove('activo');
    });

    let caraActiva = document.getElementById(`cara${indiceCara}`);
    if (caraActiva) {
        caraActiva.classList.add('activo');
    }
}

function cambiarCara(n) {
    clearInterval(intervaloCarrusel);
    indiceCara += n;
    mostrarCara(indiceCara);
    intervaloCarrusel = setInterval(autoCambiar, 5000);
}

function autoCambiar() {
    indiceCara++;
    mostrarCara(indiceCara);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarCara(indiceCara);
});