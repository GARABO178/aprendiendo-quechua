// Tabs
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Juego 1: Drag & Drop
const items = [
  { text: 'maestro', target: 'personas' },
  { text: 'niña', target: 'personas' },
  { text: 'escuela', target: 'lugares' },
  { text: 'parque', target: 'lugares' },
  { text: 'libro', target: 'cosas' },
  { text: 'pelota', target: 'cosas' }
];

const targets = ['personas', 'lugares', 'cosas'];

function initDrag() {
  const words = document.getElementById('words');
  const t = document.getElementById('targets');
  words.innerHTML = '';
  t.innerHTML = '';

  items.sort(() => Math.random() - 0.5).forEach(obj => {
    const w = document.createElement('div');
    w.className = 'word';
    w.textContent = obj.text;
    w.draggable = true;
    w.dataset.target = obj.target;

    // Eventos Mouse
    w.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text', obj.text);
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

      w.classList.add('dragging'); // Asegúrate de tener estilos para esto si es necesario
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
        // Lógica de drop manual
        dropZone.appendChild(w);
      }
    });

    words.appendChild(w);
  });

  targets.forEach(name => {
    const box = document.createElement('div');
    box.className = 'target';
    box.dataset.box = name;
    box.textContent = name.toUpperCase();

    box.addEventListener('dragover', e => e.preventDefault());
    box.addEventListener('drop', e => {
      const text = e.dataTransfer.getData('text');
      const el = [...document.querySelectorAll('.word')].find(w => w.textContent === text);
      box.appendChild(el);
    });

    t.appendChild(box);
  });
}

initDrag();

document.getElementById('check-drag').onclick = () => {
  let good = 0;
  document.querySelectorAll('.word').forEach(w => {
    const parent = w.parentElement.dataset.box;
    if (parent === w.dataset.target) good++;
  });
  const fb = document.getElementById('drag-feedback');
  fb.textContent = `Acertaste ${good} de ${items.length}`;
  fb.style.color = good === items.length ? 'green' : 'red';
};

document.getElementById('reset-drag').onclick = initDrag;

// Juego 2: BR o BL
const data = [
  { rest: 'isa', correct: 'BR', base: 'La ___isa del mar me calma.' },
  { rest: 'anco', correct: 'BL', base: 'El color ___anco es bonito.' },
  { rest: 'illo', correct: 'BR', base: 'El sol produce un ___illo.' }
];

function buildBRBL() {
  const container = document.getElementById('brbl-game');
  container.innerHTML = '';

  data.forEach((item, i) => {
    const row = document.createElement('div');
    const sentence = document.createElement('p');
    sentence.innerHTML = item.base.replace('___', `<span id="blank${i}">___</span>`);

    const choices = document.createElement('div');
    ['BR', 'BL'].forEach(op => {
      const c = document.createElement('span');
      c.className = 'choice';
      c.textContent = op;

      c.onclick = () => {
        choices.querySelectorAll('.choice').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        document.getElementById(`blank${i}`).textContent = op.toLowerCase() + item.rest;
        sentence.dataset.choice = op;
      };

      choices.appendChild(c);
    });

    row.appendChild(sentence);
    row.appendChild(choices);
    container.appendChild(row);
  });
}

buildBRBL();

document.getElementById('check-brbl').onclick = () => {
  let good = 0;
  data.forEach((d, i) => {
    const chosen = document.querySelector(`#brbl-game p:nth-child(${i + 1})`).dataset.choice;
    if (chosen === d.correct) good++;
  });
  const fb = document.getElementById('brbl-feedback');
  fb.textContent = `Correctos: ${good} de ${data.length}`;
  fb.style.color = good === data.length ? 'green' : 'red';
};

document.getElementById('reset-brbl').onclick = buildBRBL;
