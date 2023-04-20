const container = document.getElementById("container");
const casseroleButton = document.getElementById("casseroleButton");
const baton = document.getElementById("baton");

let audioCtx;
let buffer;
let isPlaying = false;

function init() {
  // Créer un nouveau contexte audio
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Charger le fichier audio
  fetchAudioFile("casserole-sound.wav")
    .then(arrayBuffer => {
      // Décode l'audio
      return audioCtx.decodeAudioData(arrayBuffer);
    })
    .then(decodedData => {
      // Stocker les données audio décodées dans le buffer
      buffer = decodedData;
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors du chargement du fichier audio :", error);
    });
}

function animateBaton(event) {
  const rect = casseroleButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = event.clientX || event.touches[0].clientX;
  const y = event.clientY || event.touches[0].clientY;
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

  if (distance <= rect.width / 2) {
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;
    const rotation = Math.atan2(offsetY - rect.height / 2, offsetX - rect.width / 2) * 180 / Math.PI;

    baton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${-rotation}deg) scaleY(1.5)`;
    setTimeout(() => {
      baton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${-rotation}deg) scaleY(1)`;
    }, 100);

    playSound();
  }
}

function playSound() {
  if (isPlaying) {
    return;
  }

  // Créer un nouveau nœud source audio
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  // Connecter le nœud source à la destination de sortie audio
  source.connect(audioCtx.destination);

  // Lancer la lecture du son
  source.start();

  isPlaying = true;
}

// Gestion des événements tactiles
casseroleButton.addEventListener("touchend", animateBaton);

// Gestion des événements de la souris
casseroleButton.addEventListener("click", animateBaton);

// Déverrouiller l'AudioContext sur la première interaction de l'utilisateur
function unlockAudioContext() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  document.body.removeEventListener("click", unlockAudioContext);
  document.body.removeEventListener("touchend", unlockAudioContext);
}

// Ajouter des écouteurs d'événements pour détecter la première interaction de l'utilisateur
document.body.addEventListener("click", unlockAudioContext);
document.body.addEventListener("touchend", unlockAudioContext);

// Initialiser le contexte audio
init();
