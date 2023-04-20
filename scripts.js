const container = document.getElementById("container");

// Charger le son de la casserole
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const source = audioContext.createBufferSource();
const gainNode = audioContext.createGain();
source.connect(gainNode);
gainNode.connect(audioContext.destination);
fetch("casserole_sound.wav")
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioContext.decodeAudioData(buffer))
  .then((decodedData) => {
    source.buffer = decodedData;
    source.loop = true;
  });

// Gestion des événements tactiles
container.addEventListener("touchstart", (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  const pressure = touch.force || touch.webkitForce || 0.5;
  gainNode.gain.value = pressure;
  source.start(0);
});

container.addEventListener("touchmove", (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  const pressure = touch.force || touch.webkitForce || 0.5;
  gainNode.gain.value = pressure;
});

container.addEventListener("touchend", (event) => {
  event.preventDefault();
  source.stop(0);
  source.disconnect();
  gainNode.disconnect();
});
