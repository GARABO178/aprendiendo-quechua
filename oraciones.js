document.addEventListener("DOMContentLoaded", () => {
  const sonidoBien = new Audio("correcto.mp3");
  const sonidoMal = new Audio("incorrecto.mp3");

  // --- Datos del juego con varias oraciones por ronda ---
  const rounds = [
    {
      sentences: [
        { text: ["ATUQ PHIRITA SAPALLAN ", "_","."], targets: ["MIKHUYKUN"] },
        { text: ["ALLQU MANCHAY YARQHAYWAN ", "_","."], targets: ["PURIN"] }
      ]
    },
    {
      sentences: [
        { text: ["PILI QUCHAPI", "_"], targets: ["TUYTUN"] },
        { text: ["KAWALLU ATUQTA", "_", , "_", "."], targets: ["JAYT’ASPA", "WAÑUYKUCHIN"] }
      ]
    },
    {
      sentences: [
        { text: ["P’ISAQA WICHHU K´UCHUPI THAPANTA", "_", "RUNTUTA", "_","."], targets: ["RUWAN", "CHURANAMPAQ"] },
        { text: ["MAMA PILI WAWANTA", "_", "MANA ATIQTIN", "_","."], targets: ["TUYTUYTA", "K’AMIN"] }
      ]
    }
  ];

  let currentRound = 0;

  function initRound() {
    const sentencesDiv = document.getElementById('sentences');
    const wordsDiv = document.getElementById('words');
    sentencesDiv.innerHTML = '';
    wordsDiv.innerHTML = '';

    const roundData = rounds[currentRound];
    let allTargets = [];

    // --- Crear todas las oraciones ---
    roundData.sentences.forEach(sentenceData => {
      const sentenceEl = document.createElement('div');
      sentenceEl.className = 'sentence';

      sentenceData.text.forEach(word => {
        if (word === "_") {
          const target = document.createElement('span');
          target.className = 'target';
          target.dataset.filled = ""; // para controlar si ya se completó
          target.dataset.correct = sentenceData.targets.shift(); // asigna la palabra correcta
            
          target.addEventListener('dragover', e => e.preventDefault());
          target.addEventListener('drop', e => {
            const draggedText = e.dataTransfer.getData('text');
            const el = [...document.querySelectorAll('.word-pill')].find(w => w.textContent === draggedText);

            if (draggedText === target.dataset.correct && !target.dataset.filled) {
              sonidoBien.play();
              target.textContent = draggedText;
              target.style.color = "#4f46e5";
              target.dataset.filled = "true";
              el.remove();

              // Verificar si todas las palabras se completaron
              const remainingTargets = document.querySelectorAll('.target:not([data-filled="true"])');
              if (remainingTargets.length === 0) {
                setTimeout(() => {
                  currentRound++;
                  if (currentRound < rounds.length) {
                    initRound();
                  } else {
                    if (confirm("¡Juego terminado! ¿Deseas reiniciar?")) {
                      currentRound = 0;
                      initRound();
                    }
                  }
                }, 500);
              }

            } else {
              sonidoMal.play();

              // Animación de error
              el.style.transition = "transform 0.2s";
              el.style.transform = "translateY(-10px)";
              setTimeout(() => el.style.transform = "translateY(0)", 200);
            }
          });

          sentenceEl.appendChild(target);
          allTargets.push(target);
        } else {
          sentenceEl.appendChild(document.createTextNode(word + " "));
        }
      });

      sentencesDiv.appendChild(sentenceEl);
    });

    // --- Crear todas las palabras disponibles para esta ronda ---
    const allWords = Array.from(allTargets).map(t => t.dataset.correct).sort(() => Math.random() - 0.5);
    allWords.forEach(word => {
      const w = document.createElement('div');
      w.className = 'word-pill';
      w.textContent = word;
      w.draggable = true;

      w.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', word);
        w.classList.add('dragging');
      });

      w.addEventListener('dragend', () => w.classList.remove('dragging'));
      wordsDiv.appendChild(w);
    });

    document.getElementById('page-indicator').textContent = `${currentRound + 1} / ${rounds.length}`;
  }

  // --- Inicializar primera ronda ---
  initRound();

  document.getElementById('reset-btn').onclick = () => {
    currentRound = 0;
    initRound();
  };
});
