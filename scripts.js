const container = document.getElementById("container");
const casseroleButton = document.getElementById("casseroleButton");

// Charger le son de la casserole
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// ... Le reste du code de chargement audio et d'initialisation reste inchangé ...

function playSound(event) {
  event.preventDefault();

  // Arrête la source précédente, si elle est en cours de lecture
  if (source) {
    source.stop(0);
    source.disconnect();
    gainNode.disconnect();
  }

  // Crée une nouvelle source et démarre le son
  createSource();
  gainNode.gain.value = 1;
  source.start(0);
}

// Gestion des événements tactiles
casseroleButton.addEventListener("touchend", playSound);

// Gestion des événements de la souris
casseroleButton.addEventListener("click", playSound);

// Initialisation
init();
