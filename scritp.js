const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];


/* =========================================================
   START APP
   ========================================================= */

function startWebsite() {

  /* =======================================================
     LOADER
     ======================================================= */

  const loader = $(".loader");
  const loaderBar = $(".loader-bar i");

  if (loader) {

    if (loaderBar) {
      loaderBar.style.width = "100%";
    }

    /*
     * Give the page a short moment to render,
     * then hide the loader.
     */

    setTimeout(() => {

      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";

      setTimeout(() => {

        if (loader && loader.parentNode) {
          loader.remove();
        }

      }, 500);

    }, 700);
  }


  /* =======================================================
     FLOATING HEARTS
     ======================================================= */

  const hearts = $(".global-hearts");

  if (hearts) {

    for (let i = 0; i < 14; i++) {

      const heart = document.createElement("span");

      heart.className = "heart";

      heart.textContent =
        Math.random() > 0.28 ? "♡" : "♥";

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
     SCROLL / PARALLAX
     ======================================================= */

  const progress =
    $(".scroll-progress i");

  const chapter =
    $("#chapter");

  const scenes =
    $$(".scene");

  let ticking = false;


  function updateScroll() {

    const max =
      Math.max(
        1,
        document.documentElement.scrollHeight -
        window.innerHeight
      );


    /* Scroll progress */

    if (progress) {

      progress.style.width =
        Math.min(
          100,
          window.scrollY / max * 100
        ) + "%";

    }


    let active = "01";


    scenes.forEach(scene => {

      const rect =
        scene.getBoundingClientRect();


      /*
       * Only calculate parallax when the scene
       * is close to the screen.
       */

      const near =
        rect.bottom > -window.innerHeight * 0.25 &&
        rect.top < window.innerHeight * 1.25;


      if (near) {

        scene.classList.add("is-near");


        /* Chapter */

        if (
          rect.top < window.innerHeight * 0.58 &&
          rect.bottom > window.innerHeight * 0.38
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

      } else {

        scene.classList.remove("is-near");

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


  /*
   * Initial calculation
   */

  updateScroll();


  /* =======================================================
     SCENE OBSERVER
     ======================================================= */

  if ("IntersectionObserver" in window) {

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

  }


  /* =======================================================
     TEXT REVEAL
     ======================================================= */

  if ("IntersectionObserver" in window) {

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

      copyObserver.observe(scene);

    });

  }


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

          lightbox.classList.add("show");

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

        if (event.target === lightbox) {

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
     DARK / LIGHT MODE
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

  const soundButton =
    $("#sound");

  let ambient = false;

  let ambientTimer = null;


  if (soundButton) {

    soundButton.addEventListener(
      "click",
      event => {

        ambient =
          !ambient;


        event.currentTarget.textContent =
          ambient
            ? "✦"
            : "♫";


        document.body.classList.toggle(
          "ambient-mode",
          ambient
        );


        if (ambientTimer) {

          clearInterval(
            ambientTimer
          );

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

}


/* =========================================================
   START SAFELY
   ========================================================= */

/*
 * IMPORTANT:
 *
 * We do NOT wait for window "load".
 *
 * This means a slow/broken video or image can never
 * keep the loading screen stuck forever.
 */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startWebsite,
    { once: true }
  );

} else {

  startWebsite();

}


/* =========================================================
   EMERGENCY LOADER FAILSAFE
   ========================================================= */

/*
 * Even if another JavaScript error happens later,
 * the loader will disappear after 3 seconds.
 */

setTimeout(() => {

  const loader =
    document.querySelector(".loader");

  if (loader) {

    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {

      if (loader && loader.parentNode) {
        loader.remove();
      }

    }, 500);

  }

}, 3000);
