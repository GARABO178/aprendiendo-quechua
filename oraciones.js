document.addEventListener("DOMContentLoaded", () => {
  const sonidoBien = new Audio("correcto.mp3");
  const sonidoMal = new Audio("incorrecto.mp3");

  // --- Datos del juego con varias oraciones por ronda ---
  const rounds = [
    {
      sentences: [
        { text: ["ATUQ PHIRITA SAPALLAN ", "_", "."], targets: ["MIKHUYKUN"] },
        { text: ["ALLQU MANCHAY YARQHAYWAN ", "_", "."], targets: ["PURIN"] }
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
        { text: ["P’ISAQA WICHHU K´UCHUPI THAPANTA", "_", "RUNTUTA", "_", "."], targets: ["RUWAN", "CHURANAMPAQ"] },
        { text: ["MAMA PILI WAWANTA", "_", "MANA ATIQTIN", "_", "."], targets: ["K’AMIN", "TUYTUYTA"] }
      ]
    }
  ];

  let currentRound = 0;

  function initRound() {
    const sentencesDiv = document.getElementById('sentences');
    const wordsDiv = document.getElementById('words');
    document.addEventListener("DOMContentLoaded", () => {
      const sonidoBien = new Audio("correcto.mp3");
      const sonidoMal = new Audio("incorrecto.mp3");

      // --- Datos del juego con varias oraciones por ronda ---
      const rounds = [
        {
          sentences: [
            { text: ["ATUQ PHIRITA SAPALLAN ", "_", "."], targets: ["MIKHUYKUN"] },
            { text: ["ALLQU MANCHAY YARQHAYWAN ", "_", "."], targets: ["PURIN"] }
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
            { text: ["P’ISAQA WICHHU K´UCHUPI THAPANTA", "_", "RUNTUTA", "_", "."], targets: ["RUWAN", "CHURANAMPAQ"] },
            { text: ["MAMA PILI WAWANTA", "_", "MANA ATIQTIN", "_", "."], targets: ["K’AMIN", "TUYTUYTA"] }
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

        // Función reutilizable para drop
        function handleDrop(target, draggedText, el) {
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
        }

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
                handleDrop(target, draggedText, el);
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

          // Eventos Touch
          let touchStartX = 0;
          let touchStartY = 0;
          let initialLeft = 0;
          let initialTop = 0;

          w.addEventListener('touchstart', e => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;

            w.classList.add('dragging');
            w.style.position = 'fixed';
            w.style.zIndex = '1000';
            w.style.width = w.offsetWidth + 'px';

            const rect = w.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            w.style.left = initialLeft + 'px';
            w.style.top = initialTop + 'px';
          }, { passive: false });

          w.addEventListener('touchmove', e => {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            w.style.left = (initialLeft + deltaX) + 'px';
            w.style.top = (initialTop + deltaY) + 'px';
          }, { passive: false });

          w.addEventListener('touchend', e => {
            w.classList.remove('dragging');
            w.style.position = '';
            w.style.zIndex = '';
            w.style.left = '';
            w.style.top = '';
            w.style.width = '';

            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

            if (!elementBelow) return;

            const dropZone = elementBelow.closest('.target');

            if (dropZone) {
              handleDrop(dropZone, word, w);
            }
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
