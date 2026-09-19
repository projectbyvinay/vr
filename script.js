const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* =========================================================
   FAST LOADER
   Loader does NOT wait for images/video/window.load
   ========================================================= */

(() => {
  const loader = $(".loader");
  const loaderBar = $(".loader-bar i");

  if (!loader) return;

  if (loaderBar) {
    requestAnimationFrame(() => {
      loaderBar.style.width = "100%";
    });
  }

  // Start immediately — maximum about 1 second
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.remove();
    }, 220);
  }, 700);
})();


/* =========================================================
   APP INITIALIZATION
   ========================================================= */

function initApp() {

  /* =======================================================
     FLOATING HEARTS
     Reduced from heavy amount to 10
     ======================================================= */

  const heartLayer = $(".hearts");

  if (heartLayer) {
    const heartCount = 0;

    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement("span");

      heart.className = "heart";
      heart.innerHTML = "♡";

      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDelay = `${Math.random() * 6}s`;
      heart.style.animationDuration = `${5 + Math.random() * 4}s`;
      heart.style.fontSize = `${10 + Math.random() * 14}px`;

      heartLayer.appendChild(heart);
    }
  }


  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const target = $(id);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });


  /* =======================================================
     SCROLL PROGRESS + CHAPTER + PARALLAX
     ONE REQUESTANIMATIONFRAME LOOP
     ======================================================= */

  const progress = $(".progress");
  const scenes = $$(".scene");
  const photos = $$(".photo");

  let ticking = false;

  function updateScroll() {

    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progress) {
      progress.style.width = `${percentage}%`;
    }

    /* -----------------------------------------------------
       Parallax
       Only process scenes near the viewport
       ----------------------------------------------------- */

    scenes.forEach(scene => {

      const rect = scene.getBoundingClientRect();

      const nearViewport =
        rect.bottom > -window.innerHeight &&
        rect.top < window.innerHeight * 1.5;

      if (!nearViewport) {
        scene.classList.remove("is-near");
        return;
      }

      scene.classList.add("is-near");

      const photo = $(".photo", scene);

      if (!photo) return;

      const center =
        rect.top + rect.height / 2;

      const distance =
        center - window.innerHeight / 2;

      const movement =
        Math.max(-36, Math.min(36, distance * -0.045));

      photo.style.transform =
        `translate3d(0, ${movement}px, 0) scale(1.045)`;
    });

    ticking = false;
  }

  function requestScrollUpdate() {

    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  window.addEventListener(
    "scroll",
    requestScrollUpdate,
    { passive: true }
  );

  updateScroll();


  /* =======================================================
     SCENE REVEAL
     ======================================================= */

  const sceneObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }

      });

    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  scenes.forEach(scene => {
    sceneObserver.observe(scene);
  });


  /* =======================================================
     TEXT / COPY REVEAL
     ======================================================= */

  const copyObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          copyObserver.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.15
    }
  );

  $$(".reveal, .story-copy, .scene-copy").forEach(el => {
    copyObserver.observe(el);
  });


  /* =======================================================
     LIGHTBOX
     ======================================================= */

  const lightbox = $(".lightbox");
  const lightboxImage = $(".lightbox img");
  const lightboxClose = $(".lightbox-close");

  const galleryImages = $$(
    ".story-grid img, .memory img, .photo img"
  );

  function openLightbox(src, alt = "") {

    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = src;
    lightboxImage.alt = alt;

    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");
  }

  galleryImages.forEach(img => {

    img.addEventListener("click", () => {
      openLightbox(img.currentSrc || img.src, img.alt);
    });

  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {

    lightbox.addEventListener("click", e => {

      if (e.target === lightbox) {
        closeLightbox();
      }

    });

  }

  document.addEventListener("keydown", e => {

    if (e.key === "Escape") {
      closeLightbox();
    }

  });


  /* =======================================================
     THEME / DARK MODE
     ======================================================= */

  const themeToggle =
    $(".theme-toggle") ||
    $(".theme-switch") ||
    $('[data-theme-toggle]');

  const savedTheme =
    localStorage.getItem("vem-theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  }

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      document.documentElement.classList.toggle("dark");

      const isDark =
        document.documentElement.classList.contains("dark");

      localStorage.setItem(
        "vem-theme",
        isDark ? "dark" : "light"
      );

    });

  }


  /* =======================================================
     AMBIENT MODE
     ======================================================= */

  const ambientButton =
    $(".ambient-toggle") ||
    $('[data-ambient]');

  if (ambientButton) {

    ambientButton.addEventListener("click", () => {

      document.body.classList.toggle("ambient");

      const active =
        document.body.classList.contains("ambient");

      localStorage.setItem(
        "vem-ambient",
        active ? "1" : "0"
      );

    });

  }

  if (localStorage.getItem("vem-ambient") === "1") {
    document.body.classList.add("ambient");
  }


  /* =======================================================
     VIDEO
     ======================================================= */

  const video = $(".quote-video");

  if (video) {

    // Make sure video doesn't block page interaction
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");

    // Try playing after page is ready
    const tryPlay = () => {

      const promise = video.play();

      if (promise && promise.catch) {
        promise.catch(() => {
          // Autoplay can be blocked by some browsers.
          // Poster image will remain visible.
        });
      }

    };

    setTimeout(tryPlay, 300);
  }


  /* =======================================================
     IMAGE PERFORMANCE
     ======================================================= */

  const allImages = $$("img");

  allImages.forEach((img, index) => {

    // First few visible images should load normally
    if (index > 2 && !img.hasAttribute("loading")) {
      img.loading = "lazy";
    }

    if (!img.hasAttribute("decoding")) {
      img.decoding = "async";
    }

  });


  /* =======================================================
     PAGE READY
     ======================================================= */

  document.documentElement.classList.add("app-ready");
}


/* =========================================================
   START APP WITHOUT WAITING FOR VIDEO / IMAGES
   ========================================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initApp,
    { once: true }
  );

} else {

  initApp();

}
