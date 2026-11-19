/**
 * NOVA ORBIT — Cosmic Canvas Engine (space-canvas.js)
 * 60fps Multi-Layer Starfield, Twinkling Constellations, Nebula Clouds,
 * Dynamic Parallax Depth & Realistic Meteor Streaks.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Configuration Constants
  const CONFIG = {
    starCountLayer1: 280, // Far background micro-stars
    starCountLayer2: 120, // Midground twinkling stars
    starCountLayer3: 35,  // Foreground bright stars with cross-flares
    nebulaCount: 4,       // Soft radial gas nebulas
    meteorIntervalMin: 2500,
    meteorIntervalMax: 6000,
    parallaxFactor: 0.035, // Lerp factor
  };

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Mouse & Parallax State
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    hasMoved: false
  };

  // State collections
  let starsL1 = [];
  let starsL2 = [];
  let starsL3 = [];
  let nebulas = [];
  let meteors = [];
  let nextMeteorTime = Date.now() + 1500;
  let animationFrameId = null;
  let isRunning = true;

  // Star Colors Palette
  const STAR_COLORS = [
    '#FFFFFF',
    '#F8FAFC',
    '#00F0FF', // Electric Cyan
    '#A78BFA', // Cosmic Purple
    '#BAE6FD', // Soft Ice Blue
    '#FDE047'  // Distant Golden Core
  ];

  class Star {
    constructor(depth) {
      this.depth = depth; // 1 (far), 2 (mid), 3 (close)
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

      if (this.depth === 1) {
        this.baseSize = Math.random() * 0.9 + 0.3;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
        this.twinkleSpeed = 0.005 + Math.random() * 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.parallaxSpeed = 0.15;
      } else if (this.depth === 2) {
        this.baseSize = Math.random() * 1.4 + 0.8;
        this.baseAlpha = Math.random() * 0.5 + 0.4;
        this.twinkleSpeed = 0.015 + Math.random() * 0.025;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.parallaxSpeed = 0.45;
      } else {
        // Foreground star
        this.baseSize = Math.random() * 2.2 + 1.6;
        this.baseAlpha = Math.random() * 0.3 + 0.7;
        this.twinkleSpeed = 0.02 + Math.random() * 0.03;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.parallaxSpeed = 0.85;
        this.hasSpikes = Math.random() > 0.35;
      }
    }

    update(time, offsetX, offsetY) {
      // Calculate twinkling alpha oscillation
      this.twinklePhase += this.twinkleSpeed;
      const alphaMod = (Math.sin(this.twinklePhase) + 1) * 0.35;
      this.currentAlpha = Math.max(0.1, Math.min(1, this.baseAlpha + alphaMod));

      // Parallax coordinate offset
      this.renderX = this.x + offsetX * this.parallaxSpeed;
      this.renderY = this.y + offsetY * this.parallaxSpeed;

      // Infinite wraparound
      if (this.renderX < 0) this.renderX += width;
      if (this.renderX > width) this.renderX -= width;
      if (this.renderY < 0) this.renderY += height;
      if (this.renderY > height) this.renderY -= height;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.currentAlpha;
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.arc(this.renderX, this.renderY, this.baseSize, 0, Math.PI * 2);
      ctx.fill();

      // For prominent foreground stars, render subtle glowing halo & diffraction spikes
      if (this.depth === 3 && this.hasSpikes) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        const spikeLen = this.baseSize * 3.5;
        // Horizontal spike
        ctx.moveTo(this.renderX - spikeLen, this.renderY);
        ctx.lineTo(this.renderX + spikeLen, this.renderY);
        // Vertical spike
        ctx.moveTo(this.renderX, this.renderY - spikeLen);
        ctx.lineTo(this.renderX, this.renderY + spikeLen);
        ctx.stroke();

        // Subtle soft glow halo
        ctx.beginPath();
        ctx.fillStyle = this.color === '#00F0FF' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(167, 139, 250, 0.15)';
        ctx.arc(this.renderX, this.renderY, this.baseSize * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  class Nebula {
    constructor(x, y, radius, colorStop1, colorStop2, speed) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.radius = radius;
      this.colorStop1 = colorStop1;
      this.colorStop2 = colorStop2;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = speed;
      this.driftDistance = 50 + Math.random() * 40;
    }

    update(time, offsetX, offsetY) {
      this.angle += this.speed;
      this.x = this.baseX + Math.cos(this.angle) * this.driftDistance + offsetX * 0.12;
      this.y = this.baseY + Math.sin(this.angle) * (this.driftDistance * 0.7) + offsetY * 0.12;
    }

    draw(ctx) {
      ctx.save();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.colorStop1);
      grad.addColorStop(0.5, this.colorStop2);
      grad.addColorStop(1, 'rgba(3, 4, 11, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Meteor {
    constructor() {
      this.reset();
    }

    reset() {
      // Spawn at random top-right coordinates
      this.x = Math.random() * (width * 0.8) + width * 0.2;
      this.y = Math.random() * (height * 0.4);
      this.length = 120 + Math.random() * 100;
      this.speed = 14 + Math.random() * 10;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // ~45 deg diagonal
      this.vx = -Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.opacity = 1;
      this.fadeRate = 0.016 + Math.random() * 0.014;
      this.tailParticles = [];
      this.alive = true;
      this.colorTheme = Math.random() > 0.5 ? '#00F0FF' : '#A78BFA';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.fadeRate;

      // Spawn dust particle along tail
      if (Math.random() > 0.3) {
        this.tailParticles.push({
          x: this.x + (Math.random() - 0.5) * 4,
          y: this.y + (Math.random() - 0.5) * 4,
          size: Math.random() * 2 + 0.5,
          alpha: this.opacity * 0.8,
          fade: 0.03
        });
      }

      // Update tail particles
      for (let i = this.tailParticles.length - 1; i >= 0; i--) {
        const p = this.tailParticles[i];
        p.alpha -= p.fade;
        if (p.alpha <= 0) {
          this.tailParticles.splice(i, 1);
        }
      }

      if (this.opacity <= 0 || this.x < -100 || this.y > height + 100) {
        this.alive = false;
      }
    }

    draw(ctx) {
      if (!this.alive) return;

      ctx.save();

      // Tail dust particles
      this.tailParticles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = this.colorTheme;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Meteor head & trail streak
      ctx.globalAlpha = Math.max(0, this.opacity);
      const tailX = this.x + Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.2, this.colorTheme);
      grad.addColorStop(1, 'rgba(3, 4, 11, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Glowing head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    initUniverse();
  }

  function initUniverse() {
    starsL1 = [];
    starsL2 = [];
    starsL3 = [];
    nebulas = [];

    // Far background stars
    for (let i = 0; i < CONFIG.starCountLayer1; i++) {
      starsL1.push(new Star(1));
    }
    // Midground stars
    for (let i = 0; i < CONFIG.starCountLayer2; i++) {
      starsL2.push(new Star(2));
    }
    // Foreground stars
    for (let i = 0; i < CONFIG.starCountLayer3; i++) {
      starsL3.push(new Star(3));
    }

    // Organic Nebula gas formations
    nebulas.push(
      new Nebula(
        width * 0.25,
        height * 0.35,
        Math.max(width, height) * 0.45,
        'rgba(0, 240, 255, 0.055)',
        'rgba(14, 165, 233, 0.02)',
        0.0003
      )
    );
    nebulas.push(
      new Nebula(
        width * 0.8,
        height * 0.65,
        Math.max(width, height) * 0.5,
        'rgba(138, 43, 226, 0.065)',
        'rgba(99, 102, 241, 0.02)',
        -0.00025
      )
    );
    nebulas.push(
      new Nebula(
        width * 0.5,
        height * 0.85,
        Math.max(width, height) * 0.38,
        'rgba(0, 240, 255, 0.04)',
        'rgba(168, 85, 247, 0.015)',
        0.0002
      )
    );
    nebulas.push(
      new Nebula(
        width * 0.75,
        height * 0.15,
        Math.max(width, height) * 0.32,
        'rgba(99, 102, 241, 0.045)',
        'rgba(138, 43, 226, 0.015)',
        -0.00035
      )
    );
  }

  // Smooth Parallax Event Tracking
  window.addEventListener('mousemove', (e) => {
    mouse.hasMoved = true;
    // Map mouse position to -1 ... +1 range
    mouse.targetX = (e.clientX / width - 0.5) * 50;
    mouse.targetY = (e.clientY / height - 0.5) * 50;
  }, { passive: true });

  // Fallback subtle ambient drift when mouse is stationary
  let ambientTick = 0;

  function render(time) {
    if (!isRunning) return;

    // Smooth lerp mouse coordinates
    if (mouse.hasMoved) {
      mouse.x += (mouse.targetX - mouse.x) * CONFIG.parallaxFactor;
      mouse.y += (mouse.targetY - mouse.y) * CONFIG.parallaxFactor;
    } else {
      ambientTick += 0.008;
      mouse.x = Math.sin(ambientTick) * 15;
      mouse.y = Math.cos(ambientTick * 0.7) * 12;
    }

    // Clear Canvas with subtle cosmic backdrop
    ctx.clearRect(0, 0, width, height);

    // Deep space dark gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#03040B');
    bgGrad.addColorStop(0.5, '#060914');
    bgGrad.addColorStop(1, '#0A0F24');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Nebulas
    nebulas.forEach((nebula) => {
      nebula.update(time, mouse.x, mouse.y);
      nebula.draw(ctx);
    });

    // 2. Draw Layer 1 Stars (Deepest)
    starsL1.forEach((star) => {
      star.update(time, mouse.x, mouse.y);
      star.draw(ctx);
    });

    // 3. Draw Layer 2 Stars (Mid)
    starsL2.forEach((star) => {
      star.update(time, mouse.x, mouse.y);
      star.draw(ctx);
    });

    // 4. Draw Layer 3 Stars (Foreground & Spikes)
    starsL3.forEach((star) => {
      star.update(time, mouse.x, mouse.y);
      star.draw(ctx);
    });

    // 5. Spawn & Draw Meteors
    const now = Date.now();
    if (now > nextMeteorTime) {
      meteors.push(new Meteor());
      const nextDelay = CONFIG.meteorIntervalMin + Math.random() * (CONFIG.meteorIntervalMax - CONFIG.meteorIntervalMin);
      nextMeteorTime = now + nextDelay;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.update();
      m.draw(ctx);
      if (!m.alive) {
        meteors.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle visibility changes to save battery & CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      animationFrameId = requestAnimationFrame(render);
    }
  });

  // Window resize handler with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  }, { passive: true });

  // Init
  resize();
  animationFrameId = requestAnimationFrame(render);
})();
