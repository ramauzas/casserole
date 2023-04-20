const container = document.getElementById("container");
const casseroleButton = document.getElementById("casseroleButton");

// Charger le son de la casserole
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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

let source;
let gainNode;
let audioBuffer;

async function init() {
  audioBuffer = await fetchAudioFile();
}

function createSource() {
  if (!audioBuffer) {
    console.error("Le fichier audio n'est pas chargé.");
    return;
  }
  
  source = audioContext.createBufferSource();
  gainNode = audioContext.createGain();
  source.buffer = audioBuffer;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
}

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
casseroleButton.addEventListener("touchstart", playSound);

// Gestion des événements de la souris
casseroleButton.addEventListener("mousedown", playSound);

// Initialisation
init();
