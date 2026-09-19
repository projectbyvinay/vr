const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

window.addEventListener("load", () => {
  const loader = $(".loader");
  const bar = $(".loader-bar i");

  setTimeout(() => {
    if (bar) bar.style.width = "100%";
  }, 80);

  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 650);
    }
  }, 1250);


  /* =========================================================
     FLOATING HEARTS
     Reduced from 34 → 14 for smoother mobile scrolling
     ========================================================= */

  const hearts = $(".global-hearts");

  if (hearts) {
    for (let i = 0; i < 14; i++) {
      const h = document.createElement("span");

      h.className = "heart";
      h.textContent = Math.random() > 0.28 ? "♡" : "♥";

      h.style.left = Math.random() * 100 + "%";
      h.style.fontSize = 9 + Math.random() * 19 + "px";
      h.style.animationDuration = 8 + Math.random() * 11 + "s";
      h.style.animationDelay = -Math.random() * 15 + "s";

      h.style.setProperty(
        "--drift",
        Math.random() * 180 - 90 + "px"
      );

      hearts.appendChild(h);
    }
  }


  /* =========================================================
     SCROLL BUTTONS
     ========================================================= */

  $$("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const target = $(button.dataset.scroll);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });


  /* =========================================================
     SCROLL PROGRESS + CHAPTER + PARALLAX
     
     Everything is handled inside ONE animation frame loop.
     This is much lighter than having multiple scroll handlers.
     ========================================================= */

  const progress = $(".scroll-progress i");
  const chapter = $("#chapter");
  const scenes = $$(".scene");

  let ticking = false;

  function updateScroll() {

    /* ---------- Scroll progress ---------- */

    const max = Math.max(
      1,
      document.documentElement.scrollHeight - innerHeight
    );

    if (progress) {
      progress.style.width =
        Math.min(100, scrollY / max * 100) + "%";
    }


    /* ---------- Active chapter + parallax ---------- */

    let active = "01";

    scenes.forEach(scene => {

      const rect = scene.getBoundingClientRect();

      /*
       * Only perform expensive work on scenes that are close
       * to the viewport.
       */

      const near =
        rect.bottom > -innerHeight * 0.25 &&
        rect.top < innerHeight * 1.25;


      if (near) {

        scene.classList.add("is-near");


        /* ---------- Active chapter ---------- */

        if (
          rect.top < innerHeight * 0.58 &&
          rect.bottom > innerHeight * 0.38
        ) {
          active = scene.dataset.index;
        }


        /* ---------- Image parallax ---------- */

        const photo = scene.querySelector(".photo");

        if (photo) {

          const n =
            (innerHeight - rect.top) /
            (innerHeight + rect.height);

          const movement =
            (n - 0.5) * 36;

          photo.style.transform =
            `scale(1.045) translate3d(0, ${movement}px, 0)`;
        }

      } else {

        scene.classList.remove("is-near");
      }
    });


    if (chapter) {
      chapter.textContent = active + " / 05";
    }

    ticking = false;
  }


  function requestScrollUpdate() {

    if (!ticking) {

      ticking = true;

      requestAnimationFrame(updateScroll);
    }
  }


  addEventListener(
    "scroll",
    requestScrollUpdate,
    { passive: true }
  );

  addEventListener(
    "resize",
    requestScrollUpdate,
    { passive: true }
  );


  /* Initial update */
  updateScroll();


  /* =========================================================
     SCENE VISIBILITY OBSERVER
     ========================================================= */

  const sceneObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          entry.target.classList.toggle(
            "is-visible",
            entry.isIntersecting
          );

        });

      },
      {
        rootMargin: "20% 0px 20% 0px",
        threshold: 0
      }
    );


  scenes.forEach(scene => {
    sceneObserver.observe(scene);
  });


  /* =========================================================
     TEXT / CONTENT REVEAL ANIMATION
     ========================================================= */

  const copyObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const copy =
            entry.target.querySelector(".scene-copy");

          if (copy) {

            copy.animate(
              [
                {
                  opacity: 0,
                  transform: "translateY(35px)"
                },
                {
                  opacity: 1,
                  transform: "translateY(0)"
                }
              ],
              {
                duration: 700,
                easing: "cubic-bezier(.2,.8,.2,1)",
                fill: "forwards"
              }
            );
          }


          /*
           * Once the animation has happened, stop observing
           * this scene so the browser has less work to do.
           */

          copyObserver.unobserve(entry.target);

        });

      },
      {
        threshold: 0.18
      }
    );


  scenes.forEach(scene => {
    copyObserver.observe(scene);
  });


  /* =========================================================
     LIGHTBOX
     ========================================================= */

  const light = $(".lightbox");
  const lightboxImage = $("#lightbox-img");
  const lightboxTitle = $("#lightbox-title");


  $$(".open-lightbox").forEach(button => {

    button.addEventListener("click", () => {

      if (lightboxImage) {
        lightboxImage.src = button.dataset.img;
      }

      if (lightboxTitle) {
        lightboxTitle.textContent =
          button.dataset.title ||
          "our favourite frame";
      }

      if (light) {

        light.classList.add("show");

        light.setAttribute(
          "aria-hidden",
          "false"
        );
      }

    });

  });


  function closeLightbox() {

    if (!light) return;

    light.classList.remove("show");

    light.setAttribute(
      "aria-hidden",
      "true"
    );
  }


  const closeButton =
    $(".close-lightbox");

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeLightbox
    );
  }


  if (light) {

    light.addEventListener(
      "click",
      event => {

        if (event.target === light) {
          closeLightbox();
        }

      }
    );

  }


  addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeLightbox();
      }

    }
  );


  /* =========================================================
     LIGHT / DARK MODE
     ========================================================= */

  const toggle = $("#themeToggle");
  const themeColor = $("#themeColor");

  const savedTheme =
    localStorage.getItem("vr-theme");


  function setTheme(dark) {

    document.body.classList.toggle(
      "dark-mode",
      dark
    );


    if (toggle) {

      toggle.setAttribute(
        "aria-pressed",
        String(dark)
      );

      toggle.setAttribute(
        "aria-label",
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    }


    const label =
      $(".toggle-label");

    if (label) {
      label.textContent =
        dark ? "light" : "dark";
    }


    if (themeColor) {

      themeColor.content =
        dark
          ? "#100910"
          : "#f7e7e2";
    }


    localStorage.setItem(
      "vr-theme",
      dark ? "dark" : "light"
    );
  }


  setTheme(savedTheme === "dark");


  if (toggle) {

    toggle.addEventListener(
      "click",
      () => {

        setTheme(
          !document.body.classList.contains(
            "dark-mode"
          )
        );

      }
    );

  }


  /* =========================================================
     AMBIENT MODE
     
     Important:
     We no longer apply a filter to the entire body.
     That caused expensive full-page repaints on mobile.
     ========================================================= */

  let ambient = false;
  let timer;


  const soundButton = $("#sound");


  if (soundButton) {

    soundButton.addEventListener(
      "click",
      event => {

        ambient = !ambient;


        event.currentTarget.textContent =
          ambient ? "✦" : "♫";


        /*
         * CSS can use:
         *
         * body.ambient-mode
         *
         * instead of applying a filter to the whole page.
         */

        document.body.classList.toggle(
          "ambient-mode",
          ambient
        );


        clearInterval(timer);


        if (ambient) {

          timer = setInterval(() => {

            document.documentElement.style.setProperty(
              "--pulse",
              Math.random() * 0.04
            );

          }, 1600);

        }

      }
    );

  }

});
