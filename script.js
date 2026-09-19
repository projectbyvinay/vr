const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];


/* =========================================================
   FAST LOADER
   Does NOT wait for video/photos.
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

  setTimeout(() => {

    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {

      if (loader.parentNode) {
        loader.remove();
      }

    }, 220);

  }, 700);

})();


/* =========================================================
   MAIN APP
========================================================= */

function initApp() {


  /* =======================================================
     HEARTS
     
     Intentionally disabled for smooth mobile scrolling.
     Set to 4 later if you want a small amount.
  ======================================================= */

  const heartLayer = $(".global-hearts");

  if (heartLayer) {

    const heartCount = 0;

    for (let i = 0; i < heartCount; i++) {

      const heart =
        document.createElement("span");

      heart.className = "heart";

      heart.innerHTML = "♡";

      heart.style.left =
        `${Math.random() * 100}%`;

      heart.style.setProperty(
        "--drift",
        `${-50 + Math.random() * 100}px`
      );

      heart.style.animationDelay =
        `${Math.random() * 6}s`;

      heart.style.animationDuration =
        `${5 + Math.random() * 4}s`;

      heart.style.fontSize =
        `${10 + Math.random() * 14}px`;

      heartLayer.appendChild(heart);

    }

  }


  /* =======================================================
     DATA-SCROLL BUTTONS
  ======================================================= */

  $$("[data-scroll]").forEach(button => {

    button.addEventListener("click", () => {

      const selector =
        button.dataset.scroll;

      const target =
        $(selector);

      if (!target) return;

      target.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

    });

  });


  /* =======================================================
     NORMAL ANCHOR LINKS
  ======================================================= */

  $$('a[href^="#"]').forEach(link => {

    link.addEventListener("click", e => {

      const id =
        link.getAttribute("href");

      if (!id || id === "#") return;

      const target =
        $(id);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

    });

  });


  /* =======================================================
     HERO VIDEO
  ======================================================= */

  const heroVideo =
    $(".hero-video");

  if (heroVideo) {

    heroVideo.muted = true;

    heroVideo.setAttribute(
      "muted",
      ""
    );

    heroVideo.setAttribute(
      "playsinline",
      ""
    );

    const playVideo = () => {

      const promise =
        heroVideo.play();

      if (
        promise &&
        typeof promise.catch === "function"
      ) {

        promise.catch(() => {
          /*
            Some mobile browsers can block autoplay.
            Poster image remains visible.
          */
        });

      }

    };

    /*
      Give browser a moment to paint the hero first.
    */

    setTimeout(
      playVideo,
      250
    );

  }


  /* =======================================================
     NIGHT MODE
  ======================================================= */

  const themeToggle =
    $("#themeToggle");

  const savedTheme =
    localStorage.getItem("vem-theme");

  function setTheme(isDark) {

    document.body.classList.toggle(
      "dark-mode",
      isDark
    );

    if (themeToggle) {

      themeToggle.setAttribute(
        "aria-pressed",
        isDark ? "true" : "false"
      );

      themeToggle.setAttribute(
        "aria-label",
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      const label =
        $(".toggle-label", themeToggle);

      if (label) {

        label.textContent =
          isDark
            ? "light"
            : "dark";

      }

    }

    localStorage.setItem(
      "vem-theme",
      isDark
        ? "dark"
        : "light"
    );

    const themeColor =
      $("#themeColor");

    if (themeColor) {

      themeColor.setAttribute(
        "content",
        isDark
          ? "#190019"
          : "#FBE4D8"
      );

    }

  }


  if (savedTheme === "dark") {

    setTheme(true);

  } else {

    setTheme(false);

  }


  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        const isDark =
          document.body.classList.contains(
            "dark-mode"
          );

        setTheme(!isDark);

      }
    );

  }


  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  const progress =
    $(".scroll-progress i");

  const scenes =
    $$(".scene");

  let ticking = false;


  /* =======================================================
     CHAPTER INDICATOR
  ======================================================= */

  const chapter =
    $("#chapter");


  /* =======================================================
     SCROLL + PARALLAX
     
     One requestAnimationFrame loop.
     This is intentionally lightweight.
  ======================================================= */

  function updateScroll() {

    const scrollTop =
      window.scrollY;

    const docHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;


    /* progress */

    const percentage =
      docHeight > 0
        ? (scrollTop / docHeight) * 100
        : 0;


    if (progress) {

      progress.style.width =
        `${percentage}%`;

    }


    /* scene parallax */

    let closestScene = null;
    let closestDistance = Infinity;


    scenes.forEach(scene => {

      const rect =
        scene.getBoundingClientRect();


      const nearViewport =
        rect.bottom >
          -window.innerHeight &&
        rect.top <
          window.innerHeight * 1.5;


      if (!nearViewport) {

        scene.classList.remove(
          "is-near"
        );

        return;

      }


      scene.classList.add(
        "is-near"
      );


      const photo =
        $(".photo", scene);


      if (photo) {

        const center =
          rect.top +
          rect.height / 2;

        const distance =
          center -
          window.innerHeight / 2;

        const movement =
          Math.max(
            -36,
            Math.min(
              36,
              distance * -0.045
            )
          );


        photo.style.transform =
          `translate3d(0,${movement}px,0) scale(1.045)`;

      }


      /* closest chapter */

      const sceneDistance =
        Math.abs(
          rect.top -
          window.innerHeight * .28
        );


      if (
        sceneDistance <
        closestDistance
      ) {

        closestDistance =
          sceneDistance;

        closestScene =
          scene;

      }

    });


    if (
      chapter &&
      closestScene
    ) {

      const index =
        closestScene.dataset.index;

      if (index) {

        chapter.textContent =
          `${index} / 05`;

      }

    }


    ticking = false;

  }


  function requestScrollUpdate() {

    if (!ticking) {

      requestAnimationFrame(
        updateScroll
      );

      ticking = true;

    }

  }


  window.addEventListener(
    "scroll",
    requestScrollUpdate,
    {
      passive:true
    }
  );


  updateScroll();


  /* =======================================================
     SCENE REVEAL
  ======================================================= */

  const sceneObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "show"
            );

          }

        });

      },
      {
        threshold:.15,

        rootMargin:
          "0px 0px -8% 0px"
      }
    );


  scenes.forEach(scene => {

    sceneObserver.observe(
      scene
    );

  });


  /* =======================================================
     COPY REVEAL
  ======================================================= */

  const copyObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "revealed"
            );

            copyObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold:.15
      }
    );


  $$(".reveal, .story-copy, .scene-copy")
    .forEach(el => {

      copyObserver.observe(el);

    });


  /* =======================================================
     LIGHTBOX
  ======================================================= */

  const lightbox =
    $(".lightbox");

  const lightboxImage =
    $("#lightbox-img");

  const lightboxTitle =
    $("#lightbox-title");

  const lightboxClose =
    $(".close-lightbox");


  function openLightbox(
    src,
    title = ""
  ) {

    if (
      !lightbox ||
      !lightboxImage
    ) return;


    lightboxImage.src =
      src;

    lightboxImage.alt =
      title;


    if (lightboxTitle) {

      lightboxTitle.textContent =
        title;

    }


    lightbox.classList.add(
      "show"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "lightbox-open"
    );

  }


  function closeLightbox() {

    if (!lightbox) return;


    lightbox.classList.remove(
      "show"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "lightbox-open"
    );

  }


  /* story-card images */

  $$(".story-image img").forEach(img => {

    img.style.cursor =
      "zoom-in";


    img.addEventListener(
      "click",
      () => {

        openLightbox(
          img.currentSrc ||
          img.src,

          img.alt
        );

      }
    );

  });


  /* view-frame buttons */

  $$(".open-lightbox").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openLightbox(
          button.dataset.img,
          button.dataset.title || ""
        );

      }
    );

  });


  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );

  }


  if (lightbox) {

    lightbox.addEventListener(
      "click",
      e => {

        if (
          e.target === lightbox
        ) {

          closeLightbox();

        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape"
      ) {

        closeLightbox();

      }

    }
  );


  /* =======================================================
     AMBIENT BUTTON
  ======================================================= */

  const ambientButton =
    $("#sound");

  if (ambientButton) {

    ambientButton.addEventListener(
      "click",
      () => {

        document.body.classList.toggle(
          "ambient"
        );

        const active =
          document.body.classList.contains(
            "ambient"
          );

        localStorage.setItem(
          "vem-ambient",
          active ? "1" : "0"
        );

      }
    );

  }


  if (
    localStorage.getItem(
      "vem-ambient"
    ) === "1"
  ) {

    document.body.classList.add(
      "ambient"
    );

  }


  /* =======================================================
     IMAGE PERFORMANCE
  ======================================================= */

  const allImages =
    $$("img");


  allImages.forEach(
    (img, index) => {

      /*
        First three images:
        browser can load normally.

        Everything after that:
        lazy load.
      */

      if (
        index > 2 &&
        !img.hasAttribute(
          "loading"
        )
      ) {

        img.loading =
          "lazy";

      }


      if (
        !img.hasAttribute(
          "decoding"
        )
      ) {

        img.decoding =
          "async";

      }

    }
  );


  /* =======================================================
     PAGE READY
  ======================================================= */

  document.documentElement.classList.add(
    "app-ready"
  );

}


/* =========================================================
   START WITHOUT WAITING FOR VIDEO/IMAGES
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initApp,
    {
      once:true
    }
  );

} else {

  initApp();

}
