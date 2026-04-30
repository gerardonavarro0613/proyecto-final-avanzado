const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

// --- ANIMACIONES REVEAL (Se mantiene igual) ---
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

// --- CONTROLES DE VIDEO (Actualizado con el tiempo) ---
const video = document.getElementById('mainVideo');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Nuevos elementos para mostrar el tiempo
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');

// Función auxiliar para convertir segundos a formato MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00"; // Evita mostrar "NaN:NaN" antes de cargar
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

if (video && playBtn && pauseBtn) {
  // Controles de reproducir y pausar que ya tenías
  playBtn.addEventListener('click', () => video.play());
  pauseBtn.addEventListener('click', () => video.pause());

  // Lógica para la duración del video
  if (currentTimeEl && durationTimeEl) {
    // 1. Muestra la duración total cuando el video carga sus datos
    video.addEventListener('loadedmetadata', () => {
      durationTimeEl.textContent = formatTime(video.duration);
    });

    // 2. Actualiza el reloj del lado izquierdo mientras el video avanza
    video.addEventListener('timeupdate', () => {
      currentTimeEl.textContent = formatTime(video.currentTime);
    });
  }
}

/* =========================
   ROMPECABEZAS
========================= */

const pieces = document.querySelectorAll('.piece');
const dropzones = document.querySelectorAll('.dropzone');
const piecesArea = document.querySelector('.pieces-area');
const resetPuzzle = document.getElementById('resetPuzzle');
const gameMessage = document.getElementById('gameMessage');

if (pieces.length && dropzones.length && piecesArea) {
  pieces.forEach((piece) => {
    piece.addEventListener('dragstart', (event) => {
      piece.classList.add('dragging');
      event.dataTransfer.setData('text/plain', piece.id);
    });

    piece.addEventListener('dragend', () => {
      piece.classList.remove('dragging');
    });
  });

  dropzones.forEach((zone) => {
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('drag-over');

      const pieceId = event.dataTransfer.getData('text/plain');
      const piece = document.getElementById(pieceId);

      if (!piece) return;

      if (zone.querySelector('.piece')) {
        if (gameMessage) {
          gameMessage.textContent = 'Ese espacio ya está ocupado.';
        }
        return;
      }

      zone.innerHTML = '';
      zone.appendChild(piece);

      if (piece.id === zone.dataset.accept) {
        zone.classList.add('correct');
        zone.classList.remove('incorrect');
      } else {
        zone.classList.add('incorrect');
        zone.classList.remove('correct');
      }

      revisarRompecabezas();
    });
  });

  piecesArea.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  piecesArea.addEventListener('drop', (event) => {
    event.preventDefault();

    const pieceId = event.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);

    if (!piece) return;

    piecesArea.appendChild(piece);

    dropzones.forEach((zone) => {
      if (!zone.querySelector('.piece')) {
        zone.classList.remove('correct', 'incorrect', 'drag-over');
        zone.textContent = 'Arrastre y suelte la imagen aquí';
      }
    });

    if (gameMessage) {
      gameMessage.textContent = '';
    }
  });

  function revisarRompecabezas() {
    const todasOcupadas = [...dropzones].every((zone) => zone.querySelector('.piece'));

    const todasCorrectas = [...dropzones].every((zone) => {
      const piece = zone.querySelector('.piece');
      return piece && piece.id === zone.dataset.accept;
    });

    if (gameMessage) {
      if (todasCorrectas) {
        gameMessage.textContent = '¡Muy bien! Completaste correctamente el rompecabezas.';
      } else if (todasOcupadas) {
        gameMessage.textContent = 'Las piezas están colocadas, pero hay posiciones incorrectas.';
      } else {
        gameMessage.textContent = '';
      }
    }
  }

  if (resetPuzzle) {
    resetPuzzle.addEventListener('click', () => {
      pieces.forEach((piece) => {
        piecesArea.appendChild(piece);
      });

      dropzones.forEach((zone) => {
        zone.classList.remove('correct', 'incorrect', 'drag-over');
        zone.textContent = 'Arrastre y suelte la imagen aquí';
      });

      if (gameMessage) {
        gameMessage.textContent = '';
      }
    });
  }
}

const cards = document.querySelectorAll(".feature-card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

cards.forEach(card => {
  observer.observe(card);
});

