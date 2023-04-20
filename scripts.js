const container = document.getElementById("container");

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
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
}

function startSound(event) {
  event.preventDefault();
  createSource();
  gainNode.gain.value = 1;
  source.start(0);
}

function stopSound(event) {
  event.preventDefault();
  if (!source) {
    console.error("Aucune source audio créée.");
    return;
  }
  source.stop(0);
  source.disconnect();
  gainNode.disconnect();
}

// Gestion des événements tactiles
container.addEventListener("touchstart", startSound);
container.addEventListener("touchend", stopSound);

// Gestion des événements de la souris
container.addEventListener("mousedown", startSound);
container.addEventListener("mouseup", stopSound);

// Initialisation
init();
