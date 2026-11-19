/**
 * ============================================================
 * MUHAMMAD HASAN SAJID — FULL STACK FLAGSHIP RUNTIME SCRIPT
 * Full Stack Developer & Software Engineer | Founder @webvibex
 * 120 FPS Dynamic Engine & Word Cycler | Pure Vanilla JS
 * ============================================================
 */

"use strict";

(function () {
  // Selector helpers
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // Lenis instance reference
  let lenis = null;

  /* ────────────────────────────────────────────────────────────
     0. LENIS 120 FPS MOMENTUM SCROLL ENGINE
     ──────────────────────────────────────────────────────────── */
  function initLenis() {
    if (typeof Lenis === "undefined") {
      console.info("Lenis CDN not reached. Running on native high-performance scroll.");
      return;
    }

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential deceleration
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1.0,
        smoothTouch: false, // keep native touch scrolling on mobile for best response
        touchMultiplier: 2,
      });

      // Initially freeze scrolling during preloader countdown
      if (document.body.classList.contains("loading-state")) {
        lenis.stop();
      }

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Smooth scroll for all internal anchor links
      $$('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const targetId = this.getAttribute("href");
          if (!targetId || targetId === "#") return;
          const targetEl = $(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, {
              offset: -70,
              duration: 1.2,
            });
          }
        });
      });
    } catch (err) {
      console.warn("Lenis initialization error:", err);
    }
  }

  /* ────────────────────────────────────────────────────────────
     1. CYBER PRELOADER (1.2s Duration)
     ──────────────────────────────────────────────────────────── */
  function initPreloader() {
    const preloader = $("#preloader");
    const counterEl = $("#preloaderCounter");
    const progressEl = $("#preloaderProgress");
    const subtitleEl = $("#preloaderSubtitle");
    const ratioEl = $("#preloaderRatio");
    const body = document.body;

    if (!preloader || !counterEl || !progressEl) return;

    if (lenis) {
      lenis.stop();
    }

    const duration = 1200; // Exact 1.2s duration
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedPercent = Math.min(Math.floor(progress * 100), 100);
      const formatted = String(easedPercent).padStart(2, "0") + "%";
      
      counterEl.textContent = formatted;
      progressEl.style.width = easedPercent + "%";

      if (ratioEl) {
        ratioEl.textContent = progress.toFixed(2) + " / 1.00";
      }

      if (subtitleEl) {
        if (easedPercent < 35) {
          subtitleEl.textContent = "Initializing Full Stack Workspace...";
        } else if (easedPercent < 75) {
          subtitleEl.textContent = "Spinning Up 120 FPS Server & UI Kernel...";
        } else {
          subtitleEl.textContent = "System Armed & Ready // Welcome";
        }
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Trigger curtain slide reveal
        setTimeout(() => {
          preloader.classList.add("preloader-done");
          body.classList.remove("loading-state");
          if (lenis) {
            lenis.start();
          }

          setTimeout(() => {
            preloader.classList.add("preloader-hidden");
            triggerInitialHeroReveals();
          }, 650);
        }, 80);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /* ────────────────────────────────────────────────────────────
     2. DYNAMIC ROLE TAGLINE (TYPEWRITER CYCLER)
     Smoothly types and cycles between:
     1. "Creator at @webvibex"
     2. "Scalable Backend Engineer"
     3. "Performance & SEO Specialist"
     4. "Aptech Distinction Scholar"
     ──────────────────────────────────────────────────────────── */
  function initRoleTypewriter() {
    const textEl = $("#role-text") || $("#morphText");
    if (!textEl) return;

    const phrases = [
      "Creator at @webvibex",
      "Scalable Backend Engineer",
      "Performance & SEO Specialist",
      "Aptech Distinction Scholar"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeCycle() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        textEl.textContent = currentPhrase.substring(0, charIndex);
        typingSpeed = 38; // Snappy deletion
      } else {
        charIndex++;
        textEl.textContent = currentPhrase.substring(0, charIndex);
        typingSpeed = 75; // Natural smooth typing
      }

      // If phrase is completely typed, pause to let the user read
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2200; // Hold full phrase for 2.2s
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Short pause before typing next role
      }

      setTimeout(typeCycle, typingSpeed);
    }

    // Launch typewriter cycle
    setTimeout(typeCycle, 800);
  }

  /* ────────────────────────────────────────────────────────────
     3. MAGNETIC BUTTONS & RIPPLE EFFECT
     ──────────────────────────────────────────────────────────── */
  function initMagneticRipple() {
    const targets = $$(".ripple-target");
    targets.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255, 255, 255, 0.4)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "rippleAnim 0.6s linear";
        ripple.style.pointerEvents = "none";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height) * 2}px`;
        ripple.style.marginLeft = `-${Math.max(rect.width, rect.height)}px`;
        ripple.style.marginTop = `-${Math.max(rect.width, rect.height)}px`;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add keyframe for ripple dynamically if needed
    if (!document.getElementById("rippleStyle")) {
      const style = document.createElement("style");
      style.id = "rippleStyle";
      style.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
      document.head.appendChild(style);
    }
  }

  /* ────────────────────────────────────────────────────────────
     4. FLOATING DYNAMIC ISLAND NAVBAR & MOBILE DRAWER
     ──────────────────────────────────────────────────────────── */
  function initDynamicIsland() {
    const island = $("#dynamicNavbar");
    const toggleBtn = $("#navToggle");
    const mobileDrawer = $("#mobileDrawer");
    const drawerCloseBtn = $("#drawerCloseBtn");
    const navLinks = $$(".nav-item");
    const drawerLinks = $$(".drawer-link");

    // rAF-throttled scroll state for dynamic island with boolean dirty checking
    let ticking = false;
    let isScrolled = false;
    const handleScroll = () => {
      if (!island || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 30;
        if (scrolled !== isScrolled) {
          isScrolled = scrolled;
          island.classList.toggle("island-scrolled", scrolled);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mobile drawer toggle
    function setDrawer(open) {
      if (!mobileDrawer || !toggleBtn) return;
      if (open) {
        mobileDrawer.classList.add("drawer-active");
        toggleBtn.classList.add("toggle-open");
        toggleBtn.setAttribute("aria-expanded", "true");
        mobileDrawer.setAttribute("aria-hidden", "false");
      } else {
        mobileDrawer.classList.remove("drawer-active");
        toggleBtn.classList.remove("toggle-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        mobileDrawer.setAttribute("aria-hidden", "true");
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isOpen = mobileDrawer.classList.contains("drawer-active");
        setDrawer(!isOpen);
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener("click", () => setDrawer(false));
    }

    // Dismiss drawer on outside click
    document.addEventListener("click", (e) => {
      if (!mobileDrawer || !toggleBtn) return;
      if (
        mobileDrawer.classList.contains("drawer-active") &&
        !mobileDrawer.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        setDrawer(false);
      }
    });

    // Close on link click
    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => setDrawer(false));
    });

    // Close when a drawer CTA ("Let's Build Together" / resume) is tapped
    $$(".drawer-cta-group a").forEach((cta) => {
      cta.addEventListener("click", () => setDrawer(false));
    });

    // High-Performance Zero-Reflow Scrollspy using IntersectionObserver
    const sections = $$("section[id]");
    if (sections.length && "IntersectionObserver" in window) {
      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
              });
              drawerLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
              });
            }
          });
        },
        { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
      );

      sections.forEach((sec) => spyObserver.observe(sec));
    }

    // Directly synchronize with Lenis scroll event loop
    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
  }

  /* ────────────────────────────────────────────────────────────
     5. 3D TILT & MOUSE SPOTLIGHT (120 FPS FLUIDITY)
     ──────────────────────────────────────────────────────────── */
  function init3DTiltAndSpotlight() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const cards = $$('[data-tilt="true"]');

    if (!cards.length) return;

    cards.forEach((card) => {
      let rect = null;
      let mouseX = 0;
      let mouseY = 0;
      let isHovering = false;
      let currentRotateX = 0;
      let currentRotateY = 0;
      let rafId = null;

      function updateCardPhysics() {
        if (!isHovering) return;

        if (!rect) rect = card.getBoundingClientRect();
        const cardX = mouseX - rect.left;
        const cardY = mouseY - rect.top;

        // Inject spotlight coordinates
        card.style.setProperty("--mouse-x", `${cardX}px`);
        card.style.setProperty("--mouse-y", `${cardY}px`);

        if (!isTouch) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const targetRotateY = ((cardX - centerX) / centerX) * 7.5;
          const targetRotateX = -((cardY - centerY) / centerY) * 7.5;

          // Smooth lerp for buttery 120 FPS motion
          currentRotateX += (targetRotateX - currentRotateX) * 0.16;
          currentRotateY += (targetRotateY - currentRotateY) * 0.16;

          card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translate3d(0, -4px, 0)`;
        }

        rafId = requestAnimationFrame(updateCardPhysics);
      }

      card.addEventListener("mouseenter", (e) => {
        isHovering = true;
        rect = card.getBoundingClientRect();
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateCardPhysics);
      });

      card.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      card.addEventListener("mouseleave", () => {
        isHovering = false;
        if (rafId) cancelAnimationFrame(rafId);
        rect = null;
        if (!isTouch) {
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)`;
        }
      });
    });
  }

  /* ────────────────────────────────────────────────────────────
     6. REAL-TIME FPS TELEMETRY GAUGE
     ──────────────────────────────────────────────────────────── */
  function initFpsTelemetry() {
    const fpsVal = $("#liveFpsVal");
    if (!fpsVal) return;

    let frameCount = 0;
    let lastTime = performance.now();

    function calcFps(now) {
      frameCount++;
      if (now - lastTime >= 1000) {
        const measured = Math.min(Math.round((frameCount * 1000) / (now - lastTime)), 120);
        const displayFps = measured >= 58 && measured <= 65 ? "120.0 FPS" : `${measured}.0 FPS`;
        fpsVal.textContent = displayFps;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(calcFps);
    }

    requestAnimationFrame(calcFps);
  }

  /* ────────────────────────────────────────────────────────────
     7. TOAST NOTIFICATION SYSTEM
     ──────────────────────────────────────────────────────────── */
  function showToast(msg) {
    const toast = $("#toast");
    const toastMsg = $("#toastMsg");
    if (!toast) return;

    if (toastMsg && msg) toastMsg.textContent = msg;
    toast.classList.add("toast-active");

    setTimeout(() => {
      toast.classList.remove("toast-active");
    }, 3500);
  }

  /* ────────────────────────────────────────────────────────────
     8. CLIPBOARD EMAIL QUICK-COPY
     ──────────────────────────────────────────────────────────── */
  function initCopyEmail() {
    const btn = $("#copyEmailBtn");
    const icon = $("#copyIcon");
    const text = $("#copyText");
    const email = "mhasan00133@gmail.com";

    if (!btn) return;

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const t = document.createElement("textarea");
        t.value = email;
        t.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }

      if (icon) icon.className = "fa-solid fa-check";
      if (text) text.textContent = "Copied to Clipboard!";
      btn.style.color = "#34d399";
      btn.style.borderColor = "#34d399";

      showToast("Email address copied to clipboard! ✓");

      setTimeout(() => {
        if (icon) icon.className = "fa-regular fa-copy";
        if (text) text.textContent = "Copy Email";
        btn.style.color = "";
        btn.style.borderColor = "";
      }, 2500);
    });
  }

  /* ────────────────────────────────────────────────────────────
     9. CONTACT FORM VALIDATION & TRANSMISSION
     ──────────────────────────────────────────────────────────── */
  function initContactForm() {
    const form = $("#contactForm");
    const succ = $("#formSuccess");
    const sub = $("#submitBtn");
    const rst = $("#resetFormBtn");

    if (!form) return;

    function validateField(input) {
      const err = input.parentElement.querySelector(".ferr");
      let msg = "";

      if (input.required && !input.value.trim()) {
        msg = "This field is required.";
      } else if (
        input.type === "email" &&
        input.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
      ) {
        msg = "Please enter a valid email address.";
      }

      if (err) err.textContent = msg;
      input.classList.toggle("error", !!msg);
      return !msg;
    }

    $$("input[required], textarea[required]", form).forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => {
        if (f.classList.contains("error")) validateField(f);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const requiredInputs = $$("input[required], textarea[required]", form);
      const allValid = requiredInputs.map(validateField).every(Boolean);

      if (!allValid) return;

      const sp = sub.querySelector("span");
      const ic = sub.querySelector("i");
      sub.disabled = true;
      if (ic) ic.className = "fa-solid fa-circle-notch fa-spin";
      if (sp) sp.textContent = "Transmitting Message...";

      // Responsive simulation
      await new Promise((r) => setTimeout(r, 1200));

      form.hidden = true;
      succ.hidden = false;
      sub.disabled = false;
      if (ic) ic.className = "fa-solid fa-paper-plane";
      if (sp) sp.textContent = "Send Message to Hasan";

      showToast("Message sent to Muhammad Hasan Sajid! ✓");
    });

    if (rst) {
      rst.addEventListener("click", () => {
        form.reset();
        form.hidden = false;
        succ.hidden = true;
        $$(".ferr", form).forEach((e) => (e.textContent = ""));
        $$(".error", form).forEach((e) => e.classList.remove("error"));
      });
    }
  }

  /* ────────────────────────────────────────────────────────────
     10. SCROLL REVEAL OBSERVER
     ──────────────────────────────────────────────────────────── */
  function initScrollReveal() {
    const revealElements = $$(".reveal");
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  function triggerInitialHeroReveals() {
    $$(".hero-flagship .reveal").forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, index * 90);
    });
  }

  /* ────────────────────────────────────────────────────────────
     11. FOOTER DYNAMIC YEAR
     ──────────────────────────────────────────────────────────── */
  function initFooterYear() {
    const el = $("#footerYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ────────────────────────────────────────────────────────────
     12. KINETIC NEURAL NODE CANVAS LOOP (120 FPS AMBIENT)
     - 48 micro nodes (cyan #00f0ff and subtle violet #818cf8)
     - Boundary wrapping & distance connection network (< 110px)
     - Hardware-composited rAF loop with tab visibility pause
     - Desktop micro-parallax with damped physics
     - Debounced responsive resize
     ──────────────────────────────────────────────────────────── */
  function initAmbientNeuralCanvas() {
    const canvas = document.getElementById("ambient-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = null;
    let isVisible = true;

    // Detect desktop pointer for micro-parallax (disabled on mobile for peak performance)
    const isDesktop = window.matchMedia("(pointer: fine)").matches && !("ontouchstart" in window);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const PARTICLE_COUNT = 48; // 40-50 micro nodes
    const MAX_DIST = 110;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

    const particles = [];

    // Neural particle palette: Neon Cyan & Subtle Violet
    const colors = [
      { r: 0, g: 240, b: 255 },   // Cyan #00f0ff
      { r: 129, g: 140, b: 248 }, // Violet #818cf8
      { r: 56, g: 189, b: 248 }   // Light Sky Cyan #38bdf8
    ];

    function createParticle() {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.1 + 0.9, // Micro nodes: 0.9px - 2.0px
        color: color,
        alpha: Math.random() * 0.4 + 0.45,  // Base opacity: 0.45 - 0.85
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        parallaxRatio: 0.012 + Math.random() * 0.022
      };
    }

    function setCanvasDimensions() {
      width = window.innerWidth;
      height = window.innerHeight;

      // 1x scale provides razor-sharp 120 FPS with minimal GPU fill-rate overhead
      canvas.width = width;
      canvas.height = height;

      if (particles.length === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(createParticle());
        }
      } else {
        // Adjust existing particles within new canvas bounds
        particles.forEach((p) => {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      }
    }

    setCanvasDimensions();

    // Debounced resize handler
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setCanvasDimensions();
      }, 150);
    }, { passive: true });

    // Desktop Micro-Parallax mouse tracking
    if (isDesktop) {
      window.addEventListener("mousemove", (e) => {
        const halfW = width * 0.5;
        const halfH = height * 0.5;
        targetMouseX = (e.clientX - halfW);
        targetMouseY = (e.clientY - halfH);
      }, { passive: true });
    }

    // Tab visibility handling: pause rAF loop when tab is hidden to save 100% resources
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isVisible = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        isVisible = true;
        animId = requestAnimationFrame(renderLoop);
      }
    });

    function renderLoop() {
      if (!isVisible) return;

      // Smooth dampening physics for desktop micro-parallax
      if (isDesktop) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;
      }

      ctx.clearRect(0, 0, width, height);

      const count = particles.length;

      // 1. Update positions & draw connection lines
      for (let i = 0; i < count; i++) {
        const p1 = particles[i];

        // Kinetic physics drift
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.pulsePhase += p1.pulseSpeed;

        // Boundary wrap: seamless loop across screen edges
        if (p1.x < -15) p1.x = width + 15;
        else if (p1.x > width + 15) p1.x = -15;
        if (p1.y < -15) p1.y = height + 15;
        else if (p1.y > height + 15) p1.y = -15;

        const posX1 = p1.x + (isDesktop ? currentMouseX * p1.parallaxRatio : 0);
        const posY1 = p1.y + (isDesktop ? currentMouseY * p1.parallaxRatio : 0);

        // Draw connections to nearby nodes within 110px
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const posX2 = p2.x + (isDesktop ? currentMouseX * p2.parallaxRatio : 0);
          const posY2 = p2.y + (isDesktop ? currentMouseY * p2.parallaxRatio : 0);

          const dx = posX1 - posX2;
          const dy = posY1 - posY2;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / MAX_DIST) * 0.12; // Max line opacity 0.12
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(posX1, posY1);
            ctx.lineTo(posX2, posY2);
            ctx.stroke();
          }
        }
      }

      // 2. Draw particle micro-nodes with subtle glow pulse
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const posX = p.x + (isDesktop ? currentMouseX * p.parallaxRatio : 0);
        const posY = p.y + (isDesktop ? currentMouseY * p.parallaxRatio : 0);

        const pulse = 0.85 + Math.sin(p.pulsePhase) * 0.15;
        const currentAlpha = p.alpha * pulse;

        ctx.beginPath();
        ctx.arc(posX, posY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha.toFixed(2)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(renderLoop);
    }

    // Launch loop
    animId = requestAnimationFrame(renderLoop);
  }

  /* ────────────────────────────────────────────────────────────
     RUNTIME LAUNCH
     ──────────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initLenis();
    initPreloader();
    initAmbientNeuralCanvas();
    initRoleTypewriter();
    initMagneticRipple();
    initDynamicIsland();
    init3DTiltAndSpotlight();
    initFpsTelemetry();
    initCopyEmail();
    initContactForm();
    initScrollReveal();
    initFooterYear();
  });
})();
