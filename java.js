document.addEventListener("DOMContentLoaded", () => {

    const sonidoBien = new Audio("correcto.mp3");
    const sonidoMal = new Audio("incorrecto.mp3");

    const pageIndicator = document.getElementById('page-indicator'); // indicador de ronda

    // 36 palabras, 6 por ronda
    const allItems = [
        {text:'MIKHUY', target:'plural'}, {text:'QHAWAY', target:'plural'},
        {text:'ÑUQA ', target:'singular'}, {text:'PAY', target:'singular'},
        {text:'PURIY', target:'plural'}, {text:'PUKLLAY', target:'plural'},
        {text:'ÑUQANCHIK', target:'singular'}, {text:'PAYKUNA', target:'singular'},

        {text:'TAWA', target:'singular'}, {text:'ATUQ', target:'plural'},
        {text:'JUK', target:'singular'}, {text:'ALLQU', target:'plural'},
        {text:'CHUNKA', target:'singular'}, {text:'P’ISAQA', target:'plural'},
        {text:'PHICHQA', target:'singular'}, {text:'UWIJA', target:'plural'},
    ];

    let round = 0; // ronda actual 0-5

    function startRound() {
        const words = document.getElementById('word-strip');
        const singularDrop = document.querySelector('[data-box="singular"]');
        const pluralDrop = document.querySelector('[data-box="plural"]');

        words.innerHTML = '';
        singularDrop.innerHTML = '';
        pluralDrop.innerHTML = '';

        // Seleccionar las 6 palabras de la ronda actual
        const startIndex = round * 8;
        const roundItems = allItems.slice(startIndex, startIndex + 8);

        let totalPalabras = roundItems.length;

        // Actualizar indicador de ronda
        pageIndicator.textContent = `${round + 1} / 2`;

        // Crear palabras
        roundItems.sort(() => Math.random() - 0.5).forEach(obj => {
            const w = document.createElement('div');
            w.className = 'word-pill';
            w.textContent = obj.text;
            w.draggable = true;
            w.dataset.target = obj.target;

            w.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text', obj.text);
                e.dataTransfer.setData('target', obj.target);
                w.classList.add('dragging');
            });

            w.addEventListener('dragend', () => {
                w.classList.remove('dragging');
            });

            words.appendChild(w);
        });
            // Cambiar nombres de las cajas según el nivel
const labelSing = document.querySelector('#singular-target .target-label');
const labelPlur = document.querySelector('#plural-target .target-label');

if (round === 0) {
    labelSing.textContent = "SUTIKUNAP RANTIN";
    labelPlur.textContent = "RIMACHIQ";
}
else if (round === 1) {
    labelSing.textContent = "YUPAYKUNA";
    labelPlur.textContent = "UYWAKUNA";
}
        // Configurar drop
        [singularDrop, pluralDrop].forEach(box => {
            box.addEventListener('dragover', e => e.preventDefault());

            box.addEventListener('drop', e => {
                e.preventDefault();
                const text = e.dataTransfer.getData('text');
                const target = e.dataTransfer.getData('target');
                const el = [...document.querySelectorAll('.word-pill')].find(w => w.textContent === text);

                if (!el) return;

                if (box.dataset.box === target) {
                    sonidoBien.play();
                    el.draggable = false;
                    el.style.transition = "opacity 0.3s, transform 0.3s";
                    el.style.opacity = "0";
                    el.style.transform = "scale(0.5)";

                    setTimeout(() => {
                        el.remove();
                        totalPalabras--;

                        // Cuando se terminen las 6 palabras
                        if (totalPalabras === 0) {
                            round++;
                            if (round < 2) {
                                setTimeout(startRound, 800); // siguiente ronda
                            } else {
                                // Fin del juego
                                setTimeout(() => {
                                    if (confirm("¡Juego terminado! ¿Deseas reiniciar todas las rondas?")) {
                                        round = 0;
                                        startRound();
                                    }
                                }, 500);
                            }
                        }
                    }, 350);
                } else {
                    sonidoMal.play();
                    words.appendChild(el);
                    el.style.transition = "transform 0.2s";
                    el.style.transform = "translateX(-10px)";
                    setTimeout(() => el.style.transform = "translateX(0)", 200);
                }
            });
        });
    }

    startRound();

    // Reinicio manual
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("¿Deseas reiniciar todas las rondas?")) {
            round = 0;
            startRound();
        }
    });


});
