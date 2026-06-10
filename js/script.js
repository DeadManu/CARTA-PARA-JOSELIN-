const countdownEl = document.getElementById("countdown");
const fireMessageEl = document.getElementById("fireMessage");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
const envelope = document.getElementById("envelope");
const sparkCanvas = document.getElementById("sparkCanvas");
const ctx = sparkCanvas.getContext("2d");
const musicToggle = document.getElementById("musicToggle");
const typewriterText = document.getElementById("typewriterText");
const showFullLetterBtn = document.getElementById("showFullLetter");

let width = 0;
let height = 0;
let particles = [];
let emberMode = false;
let typewriterStarted = false;
let typewriterStopped = false;

// ==================== CONTADOR CON FUEGO ====================

function resizeCanvas() {
  width = sparkCanvas.width = window.innerWidth;
  height = sparkCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles() {
  const amount = window.innerWidth < 640 ? 30 : 48;
  particles = Array.from({ length: amount }, () => makeParticle());
}

function makeParticle() {
  const warm = !emberMode;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.2 + 0.6,
    speedY: Math.random() * (warm ? 1.2 : 0.55) + (warm ? 0.45 : 0.12),
    speedX: (Math.random() - 0.5) * (warm ? 0.55 : 0.18),
    alpha: Math.random() * 0.7 + 0.2,
    hue: warm ? (Math.random() < 0.55 ? 32 : 9) : 0
  };
}

createParticles();

function drawParticles() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.x += p.speedX;
    p.y -= p.speedY;
    p.alpha -= emberMode ? 0.0018 : 0.001;

    if (p.y < -10 || p.x < -10 || p.x > width + 10 || p.alpha <= 0) {
      Object.assign(p, makeParticle(), {
        x: Math.random() * width,
        y: height + Math.random() * 60
      });
    }

    const color = emberMode
      ? `rgba(185,185,195,${Math.max(p.alpha, 0)})`
      : p.hue === 32
        ? `rgba(255,176,74,${Math.max(p.alpha, 0)})`
        : `rgba(255,96,56,${Math.max(p.alpha, 0)})`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = emberMode ? 4 : 16;
    ctx.shadowColor = emberMode ? "rgba(255,255,255,0.25)" : "rgba(255,130,40,0.8)";
    ctx.fill();
  }

  requestAnimationFrame(drawParticles);
}

drawParticles();

function formatBox(value, label) {
  return `
    <div class="time-box">
      <span class="time-number">${value}</span>
      <span class="time-label">${label}</span>
    </div>
  `;
}

function extinguishFire() {
  countdownEl.classList.remove("fire-active");
  countdownEl.classList.add("fire-out");
  fireMessageEl.textContent = "El fuego se apagó cuando el contador llegó a cero.";
  emberMode = true;
  createParticles();

  countdownEl.innerHTML =
    formatBox("0", "Días") +
    formatBox("0", "Horas") +
    formatBox("0", "Minutos") +
    formatBox("0", "Segundos");
}

function updateCountdown() {
  const endDate = new Date(countdownEl.dataset.end).getTime();
  const now = Date.now();
  const diff = endDate - now;

  if (diff <= 0) {
    extinguishFire();
    return false;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownEl.innerHTML =
    formatBox(days, "Días") +
    formatBox(hours, "Horas") +
    formatBox(minutes, "Minutos") +
    formatBox(seconds, "Segundos");

  return true;
}

let timerActive = updateCountdown();

const timer = setInterval(() => {
  if (!timerActive) {
    clearInterval(timer);
    return;
  }
  timerActive = updateCountdown();
}, 1000);

// ==================== SOBRE QUE SE ABRE ====================

function createFloatingHeart() {
  const el = document.createElement("div");
  el.textContent = Math.random() > 0.5 ? "❤" : "♡";
  el.style.position = "fixed";
  el.style.left = Math.random() * 100 + "vw";
  el.style.bottom = "-30px";
  el.style.fontSize = (14 + Math.random() * 20) + "px";
  el.style.opacity = "0.7";
  el.style.color = "rgba(255, 209, 227, 0.9)";
  el.style.pointerEvents = "none";
  el.style.zIndex = "1";
  el.style.textShadow = "0 0 10px rgba(255,95,147,0.6)";
  el.style.transition = "transform 7s linear, opacity 7s linear";
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translateY(-110vh) translateX(${(Math.random()-0.5)*70}px) rotate(${220 + Math.random()*180}deg)`;
    el.style.opacity = "0";
  });

  setTimeout(() => el.remove(), 7200);
}

setInterval(createFloatingHeart, 1200);

function openEnvelope() {
  envelope.classList.add("open");

  for (let i = 0; i < 18; i++) {
    setTimeout(createFloatingHeart, i * 90);
  }

  setTimeout(() => {
    document.getElementById("carta").scrollIntoView({ behavior: "smooth" });
    startTypewriter();
  }, 950);
}

openEnvelopeBtn.addEventListener("click", openEnvelope);
envelope.addEventListener("click", openEnvelope);

// ==================== MÁQUINA DE ESCRIBIR ====================

const letterParagraphs = [
  "Hoy es nuestro último día como compañeros de universidad. Después de tantos semestres compartiendo salones, trabajos, preocupaciones y momentos que quedarán para siempre en mi memoria, siento que ha llegado el momento de escribir estas palabras.",
  "Durante más de un año y medio intenté acercarme a tu corazón. No porque creyera que el amor se puede forzar, sino porque lo que sentí por ti fue real. Desde que comenzamos a convivir descubrí en ti una persona que admiré, respeté y quise profundamente.",
  "A lo largo de este tiempo te entregué pequeños detalles que quizá parecían sencillos, pero que para mí llevaban mucho significado. Cada carta que te escribí, cada mensaje, cada gesto y cada momento compartido fueron mi forma de demostrarte lo importante que eras para mí.",
  "Nunca olvidaré los abrazos que me permitiste darte. Tal vez para ti fueron solo abrazos, pero para mí eran instantes que guardaba con mucho cariño. Tampoco olvidaré aquel beso en la frente que te di, porque en él intenté expresar todo aquello que muchas veces las palabras no pudieron decir.",
  "Hubo días en los que imaginé un futuro contigo. Hubo momentos en los que una sonrisa tuya era suficiente para cambiar por completo mi día. Y aunque muchas veces quise alcanzar tu amor, entendí que los sentimientos tienen sus propios tiempos y caminos.",
  "Hoy termina nuestra etapa universitaria. Los caminos que recorríamos todos los días comenzarán a separarse y cada uno seguirá construyendo su propia historia. Por eso quería que supieras algo que jamás cambiará: nunca me arrepentiré de haberte querido.",
  "Gracias por cada conversación, por cada sonrisa, por cada abrazo, por cada recuerdo y por cada momento que compartimos. Gracias por formar parte de una etapa tan importante de mi vida.",
  "No escribo esta carta para despedirme de ti para siempre. La escribo para despedirme de esta etapa, de estos pasillos, de estos días en los que podía verte casi a diario.",
  "La vida da muchas vueltas. Quizá nuestros caminos solo estaban destinados a cruzarse aquí. O quizá este no era nuestro momento y el destino tenga preparada otra página para nosotros más adelante. No lo sé.",
  "Lo único que sé es que el cariño que siento por ti siempre será sincero y que, pase lo que pase, siempre recordaré con una sonrisa a la persona que inspiró tantos sentimientos bonitos en mí.",
  "Lo que comenzó con amor, hoy continúa con amor, pero también con respeto, gratitud y esperanza.",
  "Si algún día la vida vuelve a encontrarnos en el mismo camino, me alegrará saber de ti. Y si no sucede, aun así estaré agradecido por haber coincidido contigo.",
  "Gracias por ser parte de mi historia, Joselin."
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function renderFullLetter() {
  typewriterStopped = true;
  typewriterText.classList.remove("typewriter-cursor");
  typewriterText.innerHTML = letterParagraphs.map(p => `<p>${p}</p>`).join("");
}

async function startTypewriter() {
  if (typewriterStarted) return;

  typewriterStarted = true;
  typewriterStopped = false;
  typewriterText.innerHTML = "";
  typewriterText.classList.add("typewriter-cursor");

  for (const paragraph of letterParagraphs) {
    if (typewriterStopped) return;

    const p = document.createElement("p");
    typewriterText.appendChild(p);

    for (const char of paragraph) {
      if (typewriterStopped) return;

      p.textContent += char;

      if (char === "." || char === "," || char === ";") {
        await sleep(65);
      } else {
        await sleep(18);
      }
    }

    await sleep(280);
  }

  typewriterText.classList.remove("typewriter-cursor");
}

showFullLetterBtn.addEventListener("click", renderFullLetter);

// También inicia la escritura cuando la carta entra en pantalla.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startTypewriter();
    }
  });
}, { threshold: 0.35 });

observer.observe(document.getElementById("carta"));

// ==================== MÚSICA DE FONDO GENERADA ====================
// No usa archivos externos. La música se genera con Web Audio API.
// Por políticas de los navegadores, debe activarse con un toque.

let audioCtx = null;
let musicPlaying = false;
let musicTimer = null;
let masterGain = null;

const chordProgression = [
  [261.63, 329.63, 392.00],
  [220.00, 261.63, 329.63],
  [196.00, 246.94, 293.66],
  [174.61, 220.00, 261.63]
];

function playTone(freq, start, duration, gainValue = 0.045) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function scheduleMusic() {
  if (!audioCtx || !musicPlaying) return;

  const now = audioCtx.currentTime;
  const chord = chordProgression[Math.floor(Math.random() * chordProgression.length)];

  chord.forEach((freq, index) => {
    playTone(freq, now + index * 0.08, 2.6, 0.035);
    playTone(freq * 2, now + 1.25 + index * 0.12, 1.8, 0.018);
  });

  const melody = chord[Math.floor(Math.random() * chord.length)] * 2;
  playTone(melody, now + 0.55, 0.75, 0.025);
  playTone(melody * 1.122, now + 1.55, 0.65, 0.02);

  musicTimer = setTimeout(scheduleMusic, 2850);
}

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.55;
    masterGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  musicPlaying = true;
  musicToggle.classList.add("playing");
  musicToggle.textContent = "♪ Pausar";
  scheduleMusic();
}

function stopMusic() {
  musicPlaying = false;
  musicToggle.classList.remove("playing");
  musicToggle.textContent = "♪ Música";

  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
}

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});
