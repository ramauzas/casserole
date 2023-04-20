const container = document.getElementById("container");
const casseroleButton = document.getElementById("casseroleButton");
const baton = document.getElementById("baton");

// Charger le son de la casserole
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// ... Le reste du code de chargement audio et d'initialisation reste inchangé ...

function animateBaton(event) {
  const rect = casseroleButton.getBoundingClientRect();
  const x = event.clientX || event.touches[0].clientX;
  const y = event.clientY || event.touches[0].clientY;
  const offsetX = x - rect.left;
  const offsetY = y - rect.top;
  const rotation = Math.atan2(offsetY - rect.height / 2, offsetX - rect.width / 2) * 180 / Math.PI;

  baton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scaleY(1.5)`;
  setTimeout(() => {
    baton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scaleY(1)`;
  }, 100);
}

function playSound(event) {
  event.preventDefault();
  animateBaton(event);

  // ... Le reste du code pour arrêter la source précédente et démarrer le son reste inchangé ...
}

// Gestion des événements tactiles
casseroleButton.addEventListener("touchend", playSound);

// Gestion des événements de la souris
casseroleButton.addEventListener("click", playSound);

// Initialisation
init();
