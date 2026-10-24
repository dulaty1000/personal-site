// ============================================================
//  ФОТОЛАР ТІЗІМІ
//  Фото қосу / өшіру / рет ауыстыру үшін — ТЕК осы массивті түзет.
//  Файлдар assets/photos/ ішінде жатуы керек.
// ============================================================
const photos = [
  "assets/photos/photo1.jpg",
  "assets/photos/photo2.jpg",
  "assets/photos/photo3.jpg",
  "assets/photos/photo4.jpg",
  "assets/photos/photo5.jpg",
  "assets/photos/photo6.jpg",
];

// Бір суреттен екіншісіне ауысу аралығы (миллисекунд). 4500 = 4.5 секунд.
const INTERVAL = 4500;

// ============================================================
//  Логика
// ============================================================
const slideshow = document.getElementById("slideshow");

// 1) Әр фото үшін бір <div class="slide"> жасап, контейнерге саламыз.
const slides = photos.map((src, index) => {
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.style.backgroundImage = `url("${src}")`;

  // Бірінші сурет бетті ашқанда бірден көрінеді.
  if (index === 0) {
    slide.classList.add("is-active");
  }

  slideshow.appendChild(slide);
  return slide;
});

// 2) Суреттерді кезекпен ауыстыру.
//    Фото 1 не 0 болса — ауыстырудың қажеті жоқ.
if (slides.length > 1) {
  let current = 0;

  setInterval(() => {
    const next = (current + 1) % slides.length; // соңғыдан кейін қайта 0-ге

    slides[current].classList.remove("is-active"); // ескісі — жайлап жоғалады
    slides[next].classList.add("is-active");       // жаңасы — жайлап пайда болады

    current = next;
  }, INTERVAL);
}

// ============================================================
//  ФОНДЫҚ МУЗЫКА
//  Музыка файлы: assets/audio/music.mp3  (өз файлыңмен ауыстыр)
// ============================================================
const music = document.getElementById("bg-music");
const soundToggle = document.getElementById("sound-toggle");

if (music && soundToggle) {
  // localStorage кілттері — таңдау беттер арасында сақталады
  const MUTED_KEY = "bgMusic.muted"; // "true" / "false" / жоқ (әлі шешілмеген)
  const TIME_KEY = "bgMusic.time";   // ойнату орны — беттер арасында жалғасу үшін

  // 1) Алдыңғы беттен қалған ойнату уақытын қалпына келтіру
  const savedTime = parseFloat(localStorage.getItem(TIME_KEY));
  if (!Number.isNaN(savedTime)) {
    music.addEventListener("loadedmetadata", () => {
      try { music.currentTime = savedTime; } catch (e) {}
    });
  }

  // 2) Бастапқы күй: браузер autoplay-ге рұқсат етуі үшін muted-пен бастаймыз.
  //    Пайдаланушы бұрын дыбысты өз қалауымен қосқан болса ("false") — бірден дыбыспен.
  music.muted = localStorage.getItem(MUTED_KEY) !== "false";
  music.play().catch(() => {}); // autoplay атрибуты істемей қалса — қосымша талпыныс

  updateIcon();

  // 3) Пайдаланушы бетпен БІРІНШІ рет әрекеттескенде (қай жерге болса да):
  //    егер ол бұрын өз қалауымен өшірмеген болса — дыбысты қосамыз.
  const interactionEvents = ["pointerdown", "keydown", "touchstart"];

  function enableSoundOnce(e) {
    // Toggle батырмасының өз басуын елемейміз — оны төмендегі handler өңдейді
    if (e && e.target && e.target.closest && e.target.closest("#sound-toggle")) {
      return;
    }
    if (localStorage.getItem(MUTED_KEY) !== "true") {
      music.muted = false;
      localStorage.setItem(MUTED_KEY, "false");
      music.play().catch(() => {});
      updateIcon();
    }
    interactionEvents.forEach((ev) =>
      document.removeEventListener(ev, enableSoundOnce)
    );
  }

  interactionEvents.forEach((ev) =>
    document.addEventListener(ev, enableSoundOnce)
  );

  // 4) Дыбысты қосу/өшіру батырмасы — қонақ кез келген уақытта басқара алады
  soundToggle.addEventListener("click", () => {
    music.muted = !music.muted;
    localStorage.setItem(MUTED_KEY, music.muted ? "true" : "false");
    if (!music.muted) music.play().catch(() => {});
    updateIcon();
  });

  // 5) Иконка мен aria-label-ды ағымдағы күйге сәйкестендіру
  function updateIcon() {
    soundToggle.textContent = music.muted ? "🔇" : "🔊";
    soundToggle.setAttribute(
      "aria-label",
      music.muted ? "Дыбысты қосу" : "Дыбысты өшіру"
    );
  }
  music.addEventListener("volumechange", updateIcon);

  // 6) Ойнату орнын сақтап отыру — беттер арасында музыка жалғасқандай болады
  setInterval(() => {
    if (!music.paused) localStorage.setItem(TIME_KEY, music.currentTime);
  }, 1000);
  window.addEventListener("pagehide", () => {
    localStorage.setItem(TIME_KEY, music.currentTime);
  });
}
