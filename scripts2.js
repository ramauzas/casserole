const container = document.getElementById("container");
const casseroleButtons = document.querySelectorAll(".casserole-button");
const baton = document.getElementById("baton");
const audio = new Audio("casserole-sound.wav");

let isPlaying = false;

function animateBaton(event) {
  const rect = container.getBoundingClientRect();
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
    audio.pause();
    audio.currentTime = 0;
  }

  audio.play();
  isPlaying = true;
}

// Gestion des événements tactiles
container.addEventListener("touchend", animateBaton);

// Gestion des événements de la souris
container.addEventListener("click", animateBaton);

// Déverrouiller l'AudioContext sur la première interaction de l'utilisateur
function unlockAudioContext() {
  if (audio.paused) {
    audio.play();
    audio.pause();
    document.body.removeEventListener("click", unlockAudioContext);
    document.body.removeEventListener("touchend", unlockAudioContext);
  }
}

// Ajouter des écouteurs d'événements pour détecter la première interaction de l'utilisateur
document.body.addEventListener("click", unlockAudioContext);
document.body.addEventListener("touchend", unlockAudioContext);

// Gestion des événements de sélection de casserole
casseroleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const casseroleImage = button.querySelector("img").getAttribute("src");
    container.style.backgroundImage = `url(${casseroleImage})`;
  });
});
