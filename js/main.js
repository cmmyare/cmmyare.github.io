/* =========================================================
   Abdullahi Mohamed — Portfolio scripts
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  // Hide once the page has loaded, but never keep visitors waiting on slow CDNs.
  document.body.classList.add("loading");
  let preloaderDone = false;
  const hidePreloader = () => {
    if (preloaderDone) return;
    preloaderDone = true;
    $("#preloader").classList.add("hide");
    document.body.classList.remove("loading");
  };
  window.addEventListener("load", () => setTimeout(hidePreloader, 400));
  setTimeout(hidePreloader, 1800);

  /* ---------- Theme toggle (remembered per browser) ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    themeBtn.innerHTML = theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    try { localStorage.setItem("theme", theme); } catch (_) { /* storage unavailable */ }
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("theme"); } catch (_) { /* storage unavailable */ }
  setTheme(savedTheme || "dark");
  themeBtn.addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
  );

  /* ---------- Mobile nav ---------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
  };
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    navToggle.classList.toggle("open");
  });
  $$(".nav__link").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
  });

  /* ---------- Scroll: header, progress bar, back-to-top ---------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const backTop = $("#backTop");
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 40);
    backTop.classList.toggle("show", y > 600);
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Active nav link on scroll ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || "0", 10);
        setTimeout(() => entry.target.classList.add("visible"), delay);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  $$(".counter").forEach((c) => counterObserver.observe(c));

  /* ---------- Typing effect ---------- */
  const roles = [
    "Backend Software Engineer",
    "Node.js & Go Developer",
    "MERN Stack Developer",
    "MongoDB Certified Developer",
    "API Architect",
  ];
  const typed = $("#typed");
  let roleIdx = 0, charIdx = 0, deleting = false;
  const type = () => {
    const word = roles[roleIdx];
    typed.textContent = word.slice(0, charIdx);
    if (!deleting && charIdx < word.length) { charIdx++; setTimeout(type, 75); }
    else if (!deleting) { deleting = true; setTimeout(type, 1800); }
    else if (charIdx > 0) { charIdx--; setTimeout(type, 35); }
    else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 350); }
  };
  if (prefersReducedMotion) typed.textContent = roles[0];
  else setTimeout(type, 900);

  /* ---------- Cursor glow ---------- */
  const glow = $("#cursorGlow");
  if (window.matchMedia("(hover: hover)").matches && !prefersReducedMotion) {
    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
    const follow = () => {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx - 210}px, ${cy - 210}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- 3D tilt on project cards ---------- */
  if (window.matchMedia("(hover: hover)").matches && !prefersReducedMotion) {
    $$(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Project filters ---------- */
  const filters = $$(".filter");
  const cards = $$(".project-card");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const show = f === "all" || card.dataset.category === f;
        card.classList.toggle("hidden", !show);
        card.classList.remove("pop");
        if (show) {
          card.classList.add("visible");
          void card.offsetWidth; // restart animation
          card.classList.add("pop");
        }
      });
    })
  );

  /* ---------- Hero particles (connected network) ---------- */
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w = 0, h = 0;
  const mouse = { x: null, y: null };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.floor((w * h) / 14000), 90);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.6,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const isDark = root.getAttribute("data-theme") === "dark";
    const rgb = isDark ? "45, 212, 191" : "13, 148, 136";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, 0.7)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(${rgb}, ${0.18 * (1 - d / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 160) {
          ctx.strokeStyle = `rgba(${rgb}, ${0.35 * (1 - d / 160)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };

  const hero = $(".hero");
  hero.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });

  if (!prefersReducedMotion) {
    resize();
    draw();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    $$(".field", form).forEach((field) => {
      const input = $("input, textarea", field);
      const ok = input.value.trim() !== "" && (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      field.classList.toggle("error", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.className = "form-status err";
      status.textContent = "Please fill in all fields with a valid email.";
      return;
    }

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const subject = $("#subject").value.trim();
    const message = $("#message").value.trim();
    const body = `${message}\n\n— ${name}\n${email}`;
    window.location.href =
      `mailto:cmmyare24@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.className = "form-status ok";
    status.textContent = "Opening your email app… Thank you for reaching out!";
    form.reset();
  });

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
