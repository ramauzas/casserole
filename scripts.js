const container = document.getElementById("container");

// Charger le son de la casserole
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let source;
let gainNode;

function createSource() {
  source = audioContext.createBufferSource();
  gainNode = audioContext.createGain();
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  fetch("casserole_sound.wav")
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer))
    .then((decodedData) => {
      source.buffer = decodedData;
      source.loop = true;
    });
}

function startSound(event) {
  event.preventDefault();
  createSource();
  gainNode.gain.value = 1;
  source.start(0);
}

function stopSound(event) {
  event.preventDefault();
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
