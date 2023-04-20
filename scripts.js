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
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
}

let isPlaying = false;


function startSound(event) {
  event.preventDefault();

  // Arrête et déconnecte la source et le gainNode précédents (Modifications à apporter)
  if (isPlaying) {
    source.stop(0);
    source.disconnect();
    gainNode.disconnect();
  }

  // Crée une nouvelle source et démarre le son (Modifications à apporter)
  createSource();
  gainNode.gain.value = 1;
  source.start(0);
  isPlaying = true;
}


function stopSound(event) {
  event.preventDefault();
  if (isPlaying) {
    source.stop(0);
    source.disconnect();
    gainNode.disconnect();
    isPlaying = false;
  }
}

// Gestion des événements tactiles
casseroleButton.addEventListener("touchstart", startSound);
casseroleButton.addEventListener("touchend", stopSound);

// Gestion des événements de la souris
casseroleButton.addEventListener("mousedown", startSound);
casseroleButton.addEventListener("mouseup", stopSound);

// Initialisation
init();
