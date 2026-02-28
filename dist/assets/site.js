(() => {
  const body = document.body;
  if (!body) {
    return;
  }

  body.classList.add("js-ready");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const headerInner = header?.querySelector(".header-inner");
  const nav = headerInner?.querySelector(".nav");
  let navToggle = null;

  const updateHeaderHeight = () => {
    if (!header) {
      return;
    }
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };
  updateHeaderHeight();
  window.addEventListener("resize", updateHeaderHeight);

  // Keep main target consistent and add a keyboard skip link.
  const main = document.querySelector("main");
  if (main) {
    if (!main.id) {
      main.id = "main-content";
    }
    if (!main.hasAttribute("tabindex")) {
      main.setAttribute("tabindex", "-1");
    }
  }
  if (main && !document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to main content";
    body.insertBefore(skipLink, body.firstChild);
  }

  const closeNav = () => {
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "Menu";
    }
  };

  if (nav && headerInner && header) {
    nav.setAttribute("aria-label", nav.getAttribute("aria-label") || "Main");
    if (!nav.id) {
      nav.id = "site-nav";
    }

    navToggle = headerInner.querySelector(".nav-toggle");
    if (!navToggle) {
      navToggle = document.createElement("button");
      navToggle.type = "button";
      navToggle.className = "nav-toggle";
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-controls", nav.id);
      navToggle.textContent = "Menu";
      headerInner.appendChild(navToggle);
    }

    let backdrop = header.querySelector(".nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      header.appendChild(backdrop);
    }

    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });

    backdrop.addEventListener("click", closeNav);

    nav.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  // Active nav state
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }

    let url;
    try {
      url = new URL(href, window.location.origin);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) {
      return;
    }

    const path = url.pathname.replace(/\/+$/, "") || "/";
    const isActive = currentPath === path || (path !== "/" && currentPath.startsWith(`${path}/`));
    if (isActive) {
      link.classList.add("active");
    }
  });

  // Simple scroll reveal
  const revealTargets = Array.from(
    document.querySelectorAll(
      ".hero > *, .hero-grid > *, .split-hero > *, .panel, .card, .article, .metric, .lane, .signal-tile, .verify-card, .cv-card, .post-side, .footer"
    )
  );

  if (reduceMotion) {
    revealTargets.forEach((el) => el.classList.add("in"));
  } else {
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  // Animate bars and radial values if present
  const fillBars = () => {
    document.querySelectorAll(".skill-fill[data-fill], .progress-done[data-done]").forEach((el) => {
      const value = Number.parseFloat(el.dataset.fill || el.dataset.done || "0");
      const clamped = Math.max(0, Math.min(100, value));
      requestAnimationFrame(() => {
        el.style.width = `${clamped}%`;
      });
    });

    document.querySelectorAll(".radial-meter[data-target]").forEach((el) => {
      const value = Number.parseFloat(el.dataset.target || "0");
      const clamped = Math.max(0, Math.min(100, value));
      el.style.setProperty("--pct", clamped.toFixed(2));
      el.dataset.label = `${Math.round(clamped)}%`;
    });
  };

  fillBars();
})();
