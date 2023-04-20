const container = document.getElementById("container");
const casseroleButton = document.getElementById("casseroleButton");
const baton = document.getElementById("baton");

// Charger le son de la casserole
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer;
let source;
let gainNode = audioContext.createGain();

async function fetchAudioFile() {
  try {
    const response = await fetch("casserole-sound.wav");
    const buffer = await response.arrayBuffer();
    const decodedData = await audioContext.decodeAudioData(buffer);
    return decodedData;
  } catch (error) {
    console.error("Erreur lors du chargement du fichier audio :", error);
    return null;
  }
}

async function init() {
  audioBuffer = await fetchAudioFile();
}

function createSource() {
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
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

    baton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scaleY(1.5)`;
    setTimeout(() => {
      baton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scaleY(1)`;
    }, 100);

    playSound(event);
  }
}

function playSound(event) {
  event.preventDefault();
  animateBaton(event);

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

// Déverrouiller l'AudioContext sur la première interaction de l'utilisateur
function unlockAudioContext() {
  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("AudioContext déverrouillé");
      document.body.removeEventListener("click", unlockAudioContext);
      document.body.removeEventListener("touchend", unlockAudioContext);
    });
  }
}

// Ajouter des écouteurs d'événements pour détecter la première interaction de l'utilisateur
document.body.addEventListener("click", unlockAudioContext);
document.body.addEventListener("touchend", unlockAudioContext);

// Initialisation
init();
