(() => {
  "use strict";

  const steps = [
    { label: "Turn on the lights", note: "The room is still a little sleepy", icon: "✦" },
    { label: "Do the decorations", note: "Clouds, bows, and birthday chaos", icon: "☁" },
    { label: "Cut the cake", note: "Three layers. One very important wish.", icon: "♢" },
    { label: "Music, softly", note: "One last tiny touch", icon: "♪" },
  ];

  const titles = [
    "Psst… the birthday room is still asleep.",
    "Oh! There you are, little lights.",
    "Now it looks properly birthday-ish.",
    "Wish made. Cake officially approved.",
    "Okay, Monsoon. This one is for you.",
  ];

  const copies = [
    "Four tiny things before the birthday magic begins.",
    "Warm lights: on. Next, we make it extra cute.",
    "Clouds, ribbons, and a three-layer emergency cake.",
    "Birthday calories have now left the group chat.",
    "Music low. Lights soft. A little magic, loading…",
  ];

  const photos = [
    {
      src: "https://res.cloudinary.com/dxrqlmgcz/image/upload/v1786428218/WhatsApp_Image_2026-08-11_at_11.29.41_swfblj.jpg",
      caption: "A very convincing case for main-character weather.",
    },
    {
      src: "https://res.cloudinary.com/dxrqlmgcz/image/upload/v1786428218/WhatsApp_Image_2026-08-11_at_11.29.41_2_xyttsy.jpg",
      caption: "Cute, caught in 4K. The evidence is undeniable.",
    },
    {
      src: "https://res.cloudinary.com/dxrqlmgcz/image/upload/v1786428218/WhatsApp_Image_2026-08-11_at_11.29.41_1_jqfkll.jpg",
      caption: "One of those moments that deserves to stay.",
    },
  ];

  const ceremony = document.querySelector("#ceremony");
  const ceremonyButton = document.querySelector("#ceremonyButton");
  const ceremonyEyebrow = document.querySelector("#ceremonyEyebrow");
  const ceremonyWords = document.querySelector("#ceremonyWords");
  const ceremonyTitle = document.querySelector("#ceremonyTitle");
  const ceremonyCopy = document.querySelector("#ceremonyCopy");
  const ceremonyIcon = document.querySelector("#ceremonyIcon");
  const ceremonyLabel = document.querySelector("#ceremonyLabel");
  const ceremonyNote = document.querySelector("#ceremonyNote");
  const ceremonyProgress = document.querySelector("#ceremonyProgress");
  const cake = document.querySelector("#cake");
  const candle = document.querySelector("#candle");
  const audio = document.querySelector("#birthdayAudio");
  const musicButton = document.querySelector("#musicButton");
  const musicBars = document.querySelector("#musicBars");
  const musicLabel = document.querySelector("#musicLabel");
  let stage = 0;
  let revealStarted = false;
  let fadeTimer = null;

  document.body.style.overflow = "hidden";

  function restartWordAnimation() {
    ceremonyWords.style.animation = "none";
    void ceremonyWords.offsetWidth;
    ceremonyWords.style.animation = "";
  }

  function renderStage(nextStage) {
    stage = nextStage;
    ceremony.className = `ceremony ceremony--stage-${stage}`;
    ceremonyTitle.textContent = titles[stage];
    ceremonyCopy.textContent = copies[stage];
    ceremonyEyebrow.textContent = stage < 4 ? `A tiny ceremony · ${stage + 1} of 4` : "Everything is ready";
    ceremonyProgress.setAttribute("aria-label", `Step ${Math.min(stage + 1, 4)} of 4`);
    [...ceremonyProgress.children].forEach((pip, index) => pip.classList.toggle("is-done", index <= stage));
    cake.classList.toggle("cake--ready", stage >= 2);
    cake.classList.toggle("cake--cut", stage >= 3);
    candle.classList.toggle("candle--out", stage >= 3);
    restartWordAnimation();

    if (stage < 4) {
      ceremonyIcon.textContent = steps[stage].icon;
      ceremonyLabel.textContent = steps[stage].label;
      ceremonyNote.textContent = steps[stage].note;
      ceremonyButton.hidden = false;
    } else {
      ceremonyButton.hidden = true;
    }
  }

  function setMusicUi(playing) {
    musicBars.classList.toggle("music-bars--active", playing);
    musicLabel.textContent = playing ? "playing softly" : "play music";
    musicButton.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  }

  function fadeMusicIn() {
    window.clearInterval(fadeTimer);
    audio.volume = 0;
    audio.play().then(() => {
      setMusicUi(true);
      let volume = 0;
      fadeTimer = window.setInterval(() => {
        volume = Math.min(volume + 0.01, 0.13);
        audio.volume = volume;
        if (volume >= 0.13) window.clearInterval(fadeTimer);
      }, 90);
    }).catch(() => setMusicUi(false));
  }

  function beginReveals() {
    if (revealStarted) return;
    revealStarted = true;

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-revealed"));
      document.querySelectorAll("[data-sequence]").forEach((node) => node.classList.add("is-in-view"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -9%" });

    const sequenceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.22, rootMargin: "0px 0px -10%" });

    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
    document.querySelectorAll("[data-sequence]").forEach((node) => sequenceObserver.observe(node));
  }

  ceremonyButton.addEventListener("click", () => {
    if (stage < 3) {
      renderStage(stage + 1);
      return;
    }

    renderStage(4);
    fadeMusicIn();
    window.setTimeout(() => {
      ceremony.remove();
      document.body.style.overflow = "";
      window.setTimeout(beginReveals, 100);
    }, 1750);
  });

  musicButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.volume = 0.13;
      audio.play().then(() => setMusicUi(true)).catch(() => setMusicUi(false));
    } else {
      audio.pause();
      setMusicUi(false);
    }
  });

  const envelopeScene = document.querySelector("#envelopeScene");
  const envelopeButton = document.querySelector("#envelopeButton");
  const envelopePrompt = document.querySelector("#envelopePrompt");
  const envelopeCaption = document.querySelector("#envelopeCaption");
  envelopeButton.addEventListener("click", () => {
    envelopeScene.classList.add("envelope-scene--open");
    envelopeButton.setAttribute("aria-expanded", "true");
    envelopePrompt.hidden = true;
    envelopeCaption.hidden = false;
  });

  const modal = document.querySelector("#photoModal");
  const modalImage = document.querySelector("#modalImage");
  const modalCaption = document.querySelector("#modalCaption");

  function closeModal() {
    modal.hidden = true;
    modalImage.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-photo-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.photoIndex);
      modalImage.src = photos[index].src;
      modalImage.alt = `A birthday memory of Monsoon, photo ${index + 1}`;
      modalCaption.textContent = photos[index].caption;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });
  document.querySelector("#modalClose").addEventListener("click", closeModal);
  document.querySelector("#modalBackdrop").addEventListener("click", closeModal);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  const rainLayer = document.querySelector("#ambientRain");
  for (let index = 0; index < 32; index += 1) {
    const drop = document.createElement("i");
    drop.style.setProperty("--x", `${(index * 37 + 7) % 100}%`);
    drop.style.setProperty("--delay", `${-((index * 173) % 2100)}ms`);
    drop.style.setProperty("--duration", `${1400 + ((index * 97) % 1100)}ms`);
    drop.style.setProperty("--height", `${10 + ((index * 11) % 19)}px`);
    rainLayer.appendChild(drop);
  }

  const dustLayer = document.querySelector(".stardust-layer");
  let dustId = 0;
  let lastDust = 0;

  function makeDust(x, y, amount = 1) {
    for (let index = 0; index < amount; index += 1) {
      const star = document.createElement("i");
      const id = dustId++;
      star.textContent = id % 4 === 0 ? "♡" : id % 3 === 0 ? "✦" : id % 3 === 1 ? "·" : "✧";
      star.style.left = `${x + (Math.random() - 0.5) * 30}px`;
      star.style.top = `${y + (Math.random() - 0.5) * 24}px`;
      star.style.setProperty("--dust-x", `${(Math.random() - 0.5) * 58}px`);
      star.style.setProperty("--dust-y", `${-20 - Math.random() * 44}px`);
      dustLayer.appendChild(star);
      window.setTimeout(() => star.remove(), 1050);
    }
  }

  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastDust < 58) return;
    lastDust = now;
    makeDust(event.clientX, event.clientY, event.pointerType === "touch" ? 5 : 1);
  }, { passive: true });
  window.addEventListener("pointerdown", (event) => makeDust(event.clientX, event.clientY, 5), { passive: true });
  window.addEventListener("scroll", () => {
    const now = performance.now();
    if (now - lastDust < 120) return;
    lastDust = now;
    makeDust(window.innerWidth * (0.12 + Math.random() * 0.76), window.innerHeight * (0.58 + Math.random() * 0.28), 2);
  }, { passive: true });

  const confetti = document.querySelector("#confetti");
  document.querySelector("#confettiButton").addEventListener("click", () => {
    confetti.replaceChildren();
    for (let index = 0; index < 84; index += 1) {
      const piece = document.createElement("i");
      piece.style.setProperty("--x", `${(index * 37) % 100}vw`);
      piece.style.setProperty("--delay", `${(index % 14) * 42}ms`);
      piece.style.setProperty("--drift", `${(index % 2 ? 1 : -1) * (24 + (index % 8) * 9)}px`);
      piece.style.setProperty("--spin", `${180 + (index % 7) * 90}deg`);
      confetti.appendChild(piece);
    }
    window.setTimeout(() => confetti.replaceChildren(), 3800);
  });
})();
