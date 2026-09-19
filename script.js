const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];


/* =========================================================
   START WEBSITE
   ========================================================= */

window.addEventListener("load", () => {

  /* =======================================================
     LOADER
     
     Maximum visible time: 1 second.
     It does NOT wait for anything else after page load.
     ======================================================= */

  const loader = $(".loader");
  const loaderBar = $(".loader-bar i");

  if (loader) {

    if (loaderBar) {
      loaderBar.style.width = "100%";
    }

    setTimeout(() => {

      loader.style.transition =
        "opacity 0.2s ease";

      loader.style.opacity = "0";

      loader.style.pointerEvents = "none";

      setTimeout(() => {

        if (loader && loader.parentNode) {
          loader.remove();
        }

      }, 200);

    }, 800);
  }


  /* =======================================================
     FLOATING HEARTS
     
     Reduced from 34 to 14 for smoother scrolling.
     ======================================================= */

  const hearts = $(".global-hearts");

  if (hearts) {

    for (let i = 0; i < 14; i++) {

      const heart =
        document.createElement("span");

      heart.className = "heart";

      heart.textContent =
        Math.random() > 0.28
          ? "♡"
          : "♥";

      heart.style.left =
        Math.random() * 100 + "%";

      heart.style.fontSize =
        9 + Math.random() * 19 + "px";

      heart.style.animationDuration =
        8 + Math.random() * 11 + "s";

      heart.style.animationDelay =
        -Math.random() * 15 + "s";

      heart.style.setProperty(
        "--drift",
        Math.random() * 180 - 90 + "px"
      );

      hearts.appendChild(heart);
    }
  }


  /* =======================================================
     SCROLL BUTTONS
     ======================================================= */

  $$("[data-scroll]").forEach(button => {

    button.addEventListener("click", () => {

      const target =
        $(button.dataset.scroll);

      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =======================================================
     SCROLL PROGRESS + CHAPTER + PARALLAX
     
     One requestAnimationFrame loop handles everything.
     ======================================================= */

  const progress =
    $(".scroll-progress i");

  const chapter =
    $("#chapter");

  const scenes =
    $$(".scene");

  let ticking = false;


  function updateScroll() {

    /* -----------------------------------------------------
       Scroll progress
       ----------------------------------------------------- */

    const max =
      Math.max(
        1,
        document.documentElement.scrollHeight -
        window.innerHeight
      );


    if (progress) {

      progress.style.width =
        Math.min(
          100,
          window.scrollY / max * 100
        ) + "%";

    }


    /* -----------------------------------------------------
       Active chapter
       ----------------------------------------------------- */

    let active = "01";


    /* -----------------------------------------------------
       Scene parallax
       ----------------------------------------------------- */

    scenes.forEach(scene => {

      const rect =
        scene.getBoundingClientRect();


      /*
       * Only calculate expensive effects for scenes
       * close to the viewport.
       */

      const near =
        rect.bottom >
          -window.innerHeight * 0.25 &&
        rect.top <
          window.innerHeight * 1.25;


      if (!near) {

        scene.classList.remove(
          "is-near"
        );

        return;
      }


      scene.classList.add(
        "is-near"
      );


      /* Active chapter detection */

      if (
        rect.top <
          window.innerHeight * 0.58 &&
        rect.bottom >
          window.innerHeight * 0.38
      ) {

        active =
          scene.dataset.index || "01";

      }


      /* Image parallax */

      const photo =
        scene.querySelector(".photo");


      if (photo) {

        const n =
          (window.innerHeight - rect.top) /
          (window.innerHeight + rect.height);


        const movement =
          (n - 0.5) * 36;


        photo.style.transform =
          `scale(1.045) translate3d(0, ${movement}px, 0)`;

      }

    });


    if (chapter) {

      chapter.textContent =
        active + " / 05";

    }


    ticking = false;
  }


  function requestScrollUpdate() {

    if (!ticking) {

      ticking = true;

      requestAnimationFrame(
        updateScroll
      );

    }

  }


  window.addEventListener(
    "scroll",
    requestScrollUpdate,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    requestScrollUpdate,
    { passive: true }
  );


  /* Initial calculation */

  updateScroll();


  /* =======================================================
     SCENE VISIBILITY OBSERVER
     ======================================================= */

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
        rootMargin:
          "20% 0px 20% 0px",

        threshold: 0
      }
    );


  scenes.forEach(scene => {

    sceneObserver.observe(
      scene
    );

  });


  /* =======================================================
     SCENE TEXT REVEAL
     ======================================================= */

  const copyObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          const copy =
            entry.target.querySelector(
              ".scene-copy"
            );


          if (copy) {

            copy.animate(

              [
                {
                  opacity: 0,
                  transform:
                    "translateY(35px)"
                },

                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],

              {
                duration: 700,

                easing:
                  "cubic-bezier(.2,.8,.2,1)",

                fill: "forwards"
              }

            );

          }


          /*
           * Animate each scene only once.
           */

          copyObserver.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.18
      }
    );


  scenes.forEach(scene => {

    copyObserver.observe(
      scene
    );

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


  $$(".open-lightbox").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (lightboxImage) {

          lightboxImage.src =
            button.dataset.img;

        }


        if (lightboxTitle) {

          lightboxTitle.textContent =
            button.dataset.title ||
            "our favourite frame";

        }


        if (lightbox) {

          lightbox.classList.add(
            "show"
          );

          lightbox.setAttribute(
            "aria-hidden",
            "false"
          );

        }

      }
    );

  });


  function closeLightbox() {

    if (!lightbox) {
      return;
    }


    lightbox.classList.remove(
      "show"
    );


    lightbox.setAttribute(
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


  if (lightbox) {

    lightbox.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          lightbox
        ) {

          closeLightbox();

        }

      }
    );

  }


  window.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        closeLightbox();

      }

    }
  );


  /* =======================================================
     LIGHT / DARK MODE
     ======================================================= */

  const themeToggle =
    $("#themeToggle");

  const themeColor =
    $("#themeColor");

  const savedTheme =
    localStorage.getItem(
      "vr-theme"
    );


  function setTheme(dark) {

    document.body.classList.toggle(
      "dark-mode",
      dark
    );


    if (themeToggle) {

      themeToggle.setAttribute(
        "aria-pressed",
        String(dark)
      );


      themeToggle.setAttribute(
        "aria-label",

        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

    }


    const toggleLabel =
      $(".toggle-label");


    if (toggleLabel) {

      toggleLabel.textContent =
        dark
          ? "light"
          : "dark";

    }


    if (themeColor) {

      themeColor.content =
        dark
          ? "#100910"
          : "#f7e7e2";

    }


    localStorage.setItem(
      "vr-theme",

      dark
        ? "dark"
        : "light"
    );

  }


  /* Apply saved theme */

  setTheme(
    savedTheme === "dark"
  );


  if (themeToggle) {

    themeToggle.addEventListener(
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


  /* =======================================================
     AMBIENT MODE
     ======================================================= */

  const sound =
    $("#sound");

  let ambient = false;
  let ambientTimer = null;


  if (sound) {

    sound.addEventListener(
      "click",
      event => {

        ambient =
          !ambient;


        event.currentTarget.textContent =
          ambient
            ? "✦"
            : "♫";


        /*
         * Use a CSS class instead of applying
         * a filter to the entire page.
         */

        document.body.classList.toggle(
          "ambient-mode",
          ambient
        );


        if (ambientTimer) {

          clearInterval(
            ambientTimer
          );

          ambientTimer = null;
        }


        if (ambient) {

          ambientTimer =
            setInterval(
              () => {

                document.documentElement.style.setProperty(
                  "--pulse",
                  Math.random() * 0.04
                );

              },
              1600
            );

        }

      }
    );

  }

});
