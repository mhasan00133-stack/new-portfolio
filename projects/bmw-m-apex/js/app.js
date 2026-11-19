/**
 * BMW M-APEX — Luxury Sports Car Motion Experience
 * GSAP 3 ScrollTrigger, Web Audio Engine Synthesizer, 360 Configurator,
 * Digital Cockpit RPM Rev Gauge, and Netlify Serverless API Client.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (Pure JS Engine Sound Simulation)
  // =========================================================================
  class EngineAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isRunning = false;
      this.masterGain = null;
      this.osc1 = null;
      this.osc2 = null;
      this.subOsc = null;
      this.filter = null;
      this.noiseNode = null;
      this.noiseGain = null;
      this.currentRpm = 800;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Biquad lowpass filter simulating exhaust muffler & acoustic chamber
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
        this.filter.Q.setValueAtTime(4.2, this.ctx.currentTime);
        this.filter.connect(this.masterGain);

        // Primary V8 cylinder firing harmonic (sawtooth)
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sawtooth';
        this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

        // Secondary mid-harmonic (triangle)
        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'triangle';
        this.osc2.frequency.setValueAtTime(110, this.ctx.currentTime);

        // Sub-bass rumble (sine)
        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(27.5, this.ctx.currentTime);

        // Connect oscillators to filter
        this.osc1.connect(this.filter);
        this.osc2.connect(this.filter);
        this.subOsc.connect(this.filter);

        this.osc1.start();
        this.osc2.start();
        this.subOsc.start();

        // White noise for turbo hiss & overrun exhaust pops
        this.createNoiseGenerator();

        this.isRunning = true;
      } catch (e) {
        console.warn('Web Audio initialization prevented or unsupported:', e);
      }
    }

    createNoiseGenerator() {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

      noise.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      noise.start();
    }

    setRpm(rpm) {
      this.currentRpm = rpm;
      if (!this.ctx || !this.isRunning) return;

      const now = this.ctx.currentTime;
      // Formula for V8 cylinder firing frequency: (RPM / 60) * 4 firing pulses per rev
      const baseFreq = (rpm / 60) * 4;

      this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
      this.osc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.05);
      this.subOsc.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.05);

      // Filter opens wide with high revs
      const filterCutoff = 220 + (rpm / 8000) * 3200;
      this.filter.frequency.setTargetAtTime(filterCutoff, now, 0.06);

      // Turbo spool volume increases with RPM
      if (this.noiseGain) {
        const turboVol = rpm > 3500 ? ((rpm - 3500) / 4500) * 0.08 : 0;
        this.noiseGain.gain.setTargetAtTime(turboVol, now, 0.08);
      }
    }

    triggerExhaustPop() {
      if (!this.ctx || !this.isRunning || this.isMuted) return;
      const now = this.ctx.currentTime;

      // Burst of low-frequency rumble & crackle
      const popOsc = this.ctx.createOscillator();
      popOsc.type = 'sawtooth';
      popOsc.frequency.setValueAtTime(60 + Math.random() * 40, now);

      const popGain = this.ctx.createGain();
      popGain.gain.setValueAtTime(0.35, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      popOsc.connect(popGain);
      popGain.connect(this.masterGain);

      popOsc.start(now);
      popOsc.stop(now + 0.2);
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (!this.ctx) {
        this.init();
      } else if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime, 0.05);
      }
      return this.isMuted;
    }
  }

  const engineSound = new EngineAudio();

  // =========================================================================
  // 2. CONFIGURATOR STATE & SPECS
  // =========================================================================
  const CONFIG_MODELS = {
    'm4-cs': {
      name: 'BMW M4 CS',
      tagline: 'High-Performance Track Weapon',
      engine: '3.0L M TwinPower Turbo Inline-6',
      power: '550 HP / 650 Nm',
      acceleration: '3.4s (0-100 km/h)',
      topSpeed: '302 km/h',
      basePrice: 123500
    },
    'm8-comp': {
      name: 'BMW M8 Competition Gran Coupé',
      tagline: 'The Apex of Luxury Motorsport',
      engine: '4.4L M TwinPower Turbo V8',
      power: '625 HP / 750 Nm',
      acceleration: '3.2s (0-100 km/h)',
      topSpeed: '305 km/h',
      basePrice: 138800
    },
    'm3-touring': {
      name: 'BMW M3 Touring Competition xDrive',
      tagline: 'The Everyday High-Speed Beast',
      engine: '3.0L M TwinPower Turbo Inline-6',
      power: '510 HP / 650 Nm',
      acceleration: '3.6s (0-100 km/h)',
      topSpeed: '280 km/h',
      basePrice: 115000
    },
    'm-hybrid-v8': {
      name: 'BMW M Hybrid V8 LMDh Hypercar',
      tagline: 'Pure Le Mans Prototype Electrification',
      engine: '4.0L Twin-Turbo V8 + M Hybrid E-Motor',
      power: '640 HP / 1,000 Nm',
      acceleration: '2.6s (0-100 km/h)',
      topSpeed: '345 km/h',
      basePrice: 285000
    }
  };

  const COLOR_PALETTES = {
    'isle-of-man': { name: 'Isle of Man Green Metallic', hex: '#164e3b', glow: '#10b981', price: 0 },
    'marina-bay': { name: 'Marina Bay Blue Metallic', hex: '#1d4ed8', glow: '#38bdf8', price: 950 },
    'toronto-red': { name: 'Toronto Red Metallic', hex: '#b91c1c', glow: '#ef4444', price: 950 },
    'frozen-black': { name: 'Frozen Black Metallic (Matte)', hex: '#111318', glow: '#64748b', price: 3600 },
    'sao-paulo': { name: 'Sao Paulo Yellow', hex: '#eab308', glow: '#facc15', price: 0 }
  };

  const WHEELS = {
    'style-826m': { name: '19"/20" M Forged Style 826M Bicolor', price: 0 },
    'style-1000m': { name: '20"/21" M Performance Style 1000M Frozen Bronze', price: 4200 },
    'style-827m': { name: '19"/20" M Style 827M Stealth Jet Black', price: 1800 }
  };

  let currentBuild = {
    modelKey: 'm4-cs',
    colorKey: 'isle-of-man',
    wheelKey: 'style-826m',
    carbonPackage: true,
    ceramicBrakes: true,
    driversPackage: true,
    interior: 'Kyalami Orange / Black Merino Leather',
    buildCode: 'M-APEX-' + Math.random().toString(36).substring(2, 7).toUpperCase()
  };

  // =========================================================================
  // 3. UI INITIALIZATION & EVENT HANDLERS
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroAnimations();
    initModelShowroom();
    initCustomizer();
    initCockpitMeter();
    initNetlifyBooking();
    initSoundToggle();
    initScrollToTop();
  });

  // Sound toggle button in navigation
  function initSoundToggle() {
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      engineSound.init();
      const isMuted = engineSound.toggleMute();
      soundBtn.setAttribute('aria-pressed', (!isMuted).toString());
      soundBtn.classList.toggle('active', !isMuted);

      const label = soundBtn.querySelector('.sound-label');
      const icon = soundBtn.querySelector('i');
      if (label) label.textContent = isMuted ? 'M Engine Audio: Off' : 'M Engine Audio: On';
      if (icon) icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high pulse-sound';

      showToast(isMuted ? 'M Engine Audio Muted' : 'M Engine Audio Active (V8 Synthesizer)');
    });
  }

  // Navigation, mobile menu & scroll spy
  function initNavigation() {
    const navbar = document.querySelector('.apex-navbar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.apex-nav-links');

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      });
    }

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen.toString());
      });

      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // Hero animations with GSAP fallback
  function initHeroAnimations() {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge-wrap', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
        .from('.hero-title-main', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
        .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
        .from('.hero-stats-bar .stat-item', { opacity: 0, y: 25, stagger: 0.12, duration: 0.8 }, '-=0.5')
        .from('.hero-car-stage', { opacity: 0, scale: 0.94, duration: 1.2 }, '-=0.7')
        .from('.hero-actions .btn-apex', { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, '-=0.6');

      // Scroll-driven car parallax if ScrollTrigger is loaded
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to('.hero-car-svg-wrap', {
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          },
          x: 120,
          scale: 1.05,
          opacity: 0.3
        });
      }
    }

    // Hero Quick Rev Button
    const heroRevBtn = document.getElementById('btn-hero-rev');
    if (heroRevBtn) {
      heroRevBtn.addEventListener('click', () => {
        engineSound.init();
        if (window.setApexWarpSpeed) window.setApexWarpSpeed(true, 1.8);

        let revRpm = 1000;
        const climb = setInterval(() => {
          revRpm += 400;
          engineSound.setRpm(revRpm);
          if (revRpm >= 7200) {
            clearInterval(climb);
            setTimeout(() => {
              const drop = setInterval(() => {
                revRpm -= 350;
                engineSound.setRpm(revRpm);
                if (Math.random() > 0.65) engineSound.triggerExhaustPop();
                if (revRpm <= 900) {
                  clearInterval(drop);
                  engineSound.setRpm(800);
                  if (window.setApexWarpSpeed) window.setApexWarpSpeed(false);
                }
              }, 40);
            }, 300);
          }
        }, 30);

        showToast('Revving 4.4L M TwinPower Turbo V8 to 7,200 RPM!');
      });
    }
  }

  // Model Showroom Switcher & Specs Modal
  function initModelShowroom() {
    const modelCards = document.querySelectorAll('.showroom-card');
    const modal = document.getElementById('specs-modal');
    const modalClose = document.getElementById('modal-specs-close');

    modelCards.forEach((card) => {
      const modelKey = card.dataset.model;
      const btnSpecs = card.querySelector('.btn-inspect-specs');
      const btnConfigure = card.querySelector('.btn-quick-config');

      if (btnSpecs) {
        btnSpecs.addEventListener('click', (e) => {
          e.preventDefault();
          openSpecsModal(modelKey);
        });
      }

      if (btnConfigure) {
        btnConfigure.addEventListener('click', (e) => {
          e.preventDefault();
          selectModelForConfig(modelKey);
          const configSection = document.getElementById('configurator');
          if (configSection) {
            configSection.scrollIntoView({ behavior: 'smooth' });
          }
          showToast(`Loaded ${CONFIG_MODELS[modelKey].name} into 360° Configurator`);
        });
      }
    });

    if (modalClose && modal) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.apex-modal.active');
        activeModals.forEach((m) => m.classList.remove('active'));
      }
    });
  }

  function openSpecsModal(key) {
    const modal = document.getElementById('specs-modal');
    const info = CONFIG_MODELS[key];
    if (!modal || !info) return;

    document.getElementById('modal-specs-title').textContent = info.name;
    document.getElementById('modal-specs-tagline').textContent = info.tagline;
    document.getElementById('modal-spec-engine').textContent = info.engine;
    document.getElementById('modal-spec-power').textContent = info.power;
    document.getElementById('modal-spec-accel').textContent = info.acceleration;
    document.getElementById('modal-spec-speed').textContent = info.topSpeed;
    document.getElementById('modal-spec-price').textContent = `$${info.basePrice.toLocaleString()}`;

    modal.classList.add('active');
  }

  function selectModelForConfig(key) {
    if (!CONFIG_MODELS[key]) return;
    currentBuild.modelKey = key;

    const selectorButtons = document.querySelectorAll('.model-tab-btn');
    selectorButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.model === key);
    });

    updateConfiguratorView();
  }

  // 360 Configurator Logic
  function initCustomizer() {
    // Model tabs
    const modelBtns = document.querySelectorAll('.model-tab-btn');
    modelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectModelForConfig(btn.dataset.model);
      });
    });

    // Color Swatches
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        colorSwatches.forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        currentBuild.colorKey = swatch.dataset.color;
        updateConfiguratorView();
        showToast(`Selected Finish: ${COLOR_PALETTES[currentBuild.colorKey].name}`);
      });
    });

    // Wheel Options
    const wheelOptions = document.querySelectorAll('.wheel-option-btn');
    wheelOptions.forEach((btn) => {
      btn.addEventListener('click', () => {
        wheelOptions.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentBuild.wheelKey = btn.dataset.wheel;
        updateConfiguratorView();
      });
    });

    // Package Checkboxes
    const carbonCheck = document.getElementById('pkg-carbon');
    const ceramicCheck = document.getElementById('pkg-ceramic');
    const driversCheck = document.getElementById('pkg-drivers');

    if (carbonCheck) {
      carbonCheck.addEventListener('change', () => {
        currentBuild.carbonPackage = carbonCheck.checked;
        updateConfiguratorView();
      });
    }

    if (ceramicCheck) {
      ceramicCheck.addEventListener('change', () => {
        currentBuild.ceramicBrakes = ceramicCheck.checked;
        updateConfiguratorView();
      });
    }

    if (driversCheck) {
      driversCheck.addEventListener('change', () => {
        currentBuild.driversPackage = driversCheck.checked;
        updateConfiguratorView();
      });
    }

    // Save Custom Build Button
    const saveBtn = document.getElementById('btn-save-build');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveCustomBuild();
      });
    }

    // Direct "Book Drive with This Build"
    const bookWithBuildBtn = document.getElementById('btn-book-with-build');
    if (bookWithBuildBtn) {
      bookWithBuildBtn.addEventListener('click', () => {
        openBookingModalWithBuild();
      });
    }

    updateConfiguratorView();
  }

  function updateConfiguratorView() {
    const model = CONFIG_MODELS[currentBuild.modelKey];
    const color = COLOR_PALETTES[currentBuild.colorKey];
    const wheel = WHEELS[currentBuild.wheelKey];

    // Calculate total MSRP
    let total = model.basePrice + color.price + wheel.price;
    if (currentBuild.carbonPackage) total += 5400;
    if (currentBuild.ceramicBrakes) total += 8500;
    if (currentBuild.driversPackage) total += 2500;

    // Update text labels
    const titleEl = document.getElementById('config-selected-name');
    const engineEl = document.getElementById('config-spec-engine');
    const powerEl = document.getElementById('config-spec-power');
    const accelEl = document.getElementById('config-spec-accel');
    const priceEl = document.getElementById('config-calculated-price');
    const buildCodeEl = document.getElementById('config-build-code');

    if (titleEl) titleEl.textContent = model.name;
    if (engineEl) engineEl.textContent = model.engine;
    if (powerEl) powerEl.textContent = model.power;
    if (accelEl) accelEl.textContent = model.acceleration;
    if (priceEl) priceEl.textContent = `$${total.toLocaleString()}`;
    if (buildCodeEl) buildCodeEl.textContent = currentBuild.buildCode;

    // Update SVG Car Visual styling
    const carBodyElements = document.querySelectorAll('.svg-car-body');
    carBodyElements.forEach((el) => {
      el.style.fill = color.hex;
      el.style.transition = 'fill 0.4s ease';
    });

    const carGlowElements = document.querySelectorAll('.svg-car-ambient');
    carGlowElements.forEach((el) => {
      el.style.stopColor = color.glow;
    });

    // Calipers (gold for ceramic, red for steel)
    const caliperElements = document.querySelectorAll('.svg-caliper');
    caliperElements.forEach((el) => {
      el.style.fill = currentBuild.ceramicBrakes ? '#eab308' : '#e22718';
    });

    // Carbon fiber elements visibility/styling
    const carbonAero = document.querySelectorAll('.svg-carbon-aero');
    carbonAero.forEach((el) => {
      el.style.opacity = currentBuild.carbonPackage ? '1' : '0.25';
    });
  }

  function saveCustomBuild() {
    const model = CONFIG_MODELS[currentBuild.modelKey];
    const color = COLOR_PALETTES[currentBuild.colorKey];
    const wheel = WHEELS[currentBuild.wheelKey];

    const buildRecord = {
      ...currentBuild,
      modelName: model.name,
      colorName: color.name,
      wheelName: wheel.name,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('bmw_m_apex_last_build', JSON.stringify(buildRecord));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    showToast(`Build Saved! Code: ${currentBuild.buildCode} stored.`);
  }

  function openBookingModalWithBuild() {
    const bookingModal = document.getElementById('booking-modal');
    const modelSelect = document.getElementById('book-model-select');
    if (!bookingModal) return;

    if (modelSelect) {
      modelSelect.value = CONFIG_MODELS[currentBuild.modelKey].name;
    }

    const buildNotice = document.getElementById('booking-build-attached-notice');
    if (buildNotice) {
      buildNotice.textContent = `Attached Custom Build: ${currentBuild.buildCode} (${COLOR_PALETTES[currentBuild.colorKey].name})`;
      buildNotice.style.display = 'block';
    }

    bookingModal.classList.add('active');
  }

  // =========================================================================
  // 4. COCKPIT RPM REV METER & DRIVE MODES
  // =========================================================================
  function initCockpitMeter() {
    const needle = document.getElementById('tach-needle');
    const rpmValueEl = document.getElementById('cockpit-rpm-value');
    const speedValueEl = document.getElementById('cockpit-speed-value');
    const gearValueEl = document.getElementById('cockpit-gear-value');
    const throttleBtn = document.getElementById('btn-throttle-rev');
    const shiftLeds = document.querySelectorAll('.shift-led');
    const driveModeBtns = document.querySelectorAll('.drive-mode-pill');

    let currentRpm = 800;
    let targetRpm = 800;
    let currentSpeed = 0;
    let isHoldingThrottle = false;
    let animationId = null;
    let driveMode = 'SPORT';

    driveModeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        driveModeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        driveMode = btn.dataset.mode;
        showToast(`M Drive Mode Engaged: ${driveMode}`);
      });
    });

    function startThrottle() {
      engineSound.init();
      isHoldingThrottle = true;
      if (window.setApexWarpSpeed) window.setApexWarpSpeed(true, driveMode === 'TRACK' ? 2.5 : 1.6);
    }

    function stopThrottle() {
      isHoldingThrottle = false;
      if (window.setApexWarpSpeed) window.setApexWarpSpeed(false);
      if (currentRpm > 4500) {
        setTimeout(() => engineSound.triggerExhaustPop(), 80);
        setTimeout(() => engineSound.triggerExhaustPop(), 240);
      }
    }

    if (throttleBtn) {
      throttleBtn.addEventListener('mousedown', startThrottle);
      throttleBtn.addEventListener('mouseup', stopThrottle);
      throttleBtn.addEventListener('mouseleave', stopThrottle);

      throttleBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startThrottle();
      });
      throttleBtn.addEventListener('touchend', stopThrottle);
    }

    // Smooth RPM Loop
    function updateCockpit() {
      if (isHoldingThrottle) {
        const climbRate = driveMode === 'TRACK' ? 180 : 130;
        targetRpm = Math.min(7400, targetRpm + climbRate);
      } else {
        targetRpm = Math.max(800, targetRpm - 95);
      }

      currentRpm += (targetRpm - currentRpm) * 0.14;
      engineSound.setRpm(currentRpm);

      // Needle angle: -120deg (0 RPM) to +120deg (8,000 RPM)
      const needleAngle = -120 + (currentRpm / 8000) * 240;
      if (needle) {
        needle.style.transform = `rotate(${needleAngle}deg)`;
      }

      // Digital speed and gear simulation
      let speed = 0;
      let gear = 'P';

      if (currentRpm > 1000) {
        if (currentRpm < 3000) gear = 'D1';
        else if (currentRpm < 4600) gear = 'D2';
        else if (currentRpm < 6000) gear = 'D3';
        else gear = driveMode === 'TRACK' ? 'S4' : 'D4';

        speed = Math.floor((currentRpm / 7200) * (driveMode === 'TRACK' ? 305 : 240));
      }

      if (rpmValueEl) rpmValueEl.textContent = Math.floor(currentRpm).toLocaleString();
      if (speedValueEl) speedValueEl.textContent = speed;
      if (gearValueEl) gearValueEl.textContent = gear;

      // Update shift light LEDs (10 LEDs)
      const activeCount = Math.floor((currentRpm / 7200) * 10);
      shiftLeds.forEach((led, idx) => {
        led.classList.toggle('active', idx < activeCount);
        led.classList.toggle('redline', currentRpm >= 6800 && idx >= 7);
      });

      animationId = requestAnimationFrame(updateCockpit);
    }

    animationId = requestAnimationFrame(updateCockpit);
  }

  // =========================================================================
  // 5. TEST DRIVE BOOKING & NETLIFY FUNCTION CLIENT
  // =========================================================================
  function initNetlifyBooking() {
    const bookingModal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.btn-open-booking');
    const closeBtn = document.getElementById('modal-booking-close');
    const form = document.getElementById('test-drive-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmCloseBtn = document.getElementById('modal-confirm-close');

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (bookingModal) bookingModal.classList.add('active');
      });
    });

    if (closeBtn && bookingModal) {
      closeBtn.addEventListener('click', () => {
        bookingModal.classList.remove('active');
      });
    }

    if (confirmCloseBtn && confirmationModal) {
      confirmCloseBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Confirm VIP Pass';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reserving VIP Slot...';
        }

        const formData = {
          name: document.getElementById('book-name').value.trim(),
          email: document.getElementById('book-email').value.trim(),
          phone: document.getElementById('book-phone').value.trim() || 'N/A',
          model: document.getElementById('book-model-select').value,
          track: document.getElementById('book-track-select').value,
          date: document.getElementById('book-date').value,
          buildCode: currentBuild.buildCode,
          customSpecs: {
            color: COLOR_PALETTES[currentBuild.colorKey].name,
            wheels: WHEELS[currentBuild.wheelKey].name,
            carbonPackage: currentBuild.carbonPackage,
            ceramicBrakes: currentBuild.ceramicBrakes
          }
        };

        let resultData = null;

        try {
          // Attempt Netlify Serverless Function endpoint with fallback
          const endpoints = ['/api/book-drive', '/.netlify/functions/book-drive'];
          let fetchSuccess = false;

          for (const url of endpoints) {
            try {
              const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
              });

              if (res.ok) {
                resultData = await res.json();
                fetchSuccess = true;
                break;
              }
            } catch (networkErr) {
              // Try next endpoint or proceed to client-side fallback
            }
          }

          // Client-side fallback if serverless function is not hosted locally
          if (!fetchSuccess || !resultData) {
            const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            resultData = {
              success: true,
              bookingId: `M-APEX-${randomCode}`,
              status: 'CONFIRMED',
              client: { name: formData.name, email: formData.email, phone: formData.phone },
              reservation: {
                model: formData.model,
                track: formData.track,
                date: formData.date,
                driveMode: 'Track / Sport+ (Instructor Led)',
                instructorAssigned: 'BMW M Factory Certified Pilot',
                buildCode: formData.buildCode
              },
              message: `Congratulations ${formData.name}! Your VIP BMW M Track Session has been officially confirmed.`
            };
          }
        } catch (err) {
          console.warn('Booking fallback activated:', err);
        }

        // Store reservation locally
        try {
          const past = JSON.parse(localStorage.getItem('bmw_m_apex_bookings') || '[]');
          past.unshift(resultData);
          localStorage.setItem('bmw_m_apex_bookings', JSON.stringify(past.slice(0, 10)));
        } catch (e) {
          // localStorage fallback
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        // Close form modal and open confirmation pass
        if (bookingModal) bookingModal.classList.remove('active');
        displayConfirmationPass(resultData);
        form.reset();
      });
    }
  }

  function displayConfirmationPass(data) {
    const confirmationModal = document.getElementById('confirmation-modal');
    if (!confirmationModal || !data) return;

    document.getElementById('pass-booking-id').textContent = data.bookingId;
    document.getElementById('pass-driver-name').textContent = data.client ? data.client.name : 'VIP Pilot';
    document.getElementById('pass-model').textContent = data.reservation.model;
    document.getElementById('pass-track').textContent = data.reservation.track;
    document.getElementById('pass-date').textContent = data.reservation.date;
    document.getElementById('pass-build-code').textContent = data.reservation.buildCode;

    confirmationModal.classList.add('active');
    showToast(`VIP Track Session Confirmed! Pass ID: ${data.bookingId}`);
  }

  // =========================================================================
  // 6. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message) {
    let container = document.getElementById('apex-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'apex-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'apex-toast';
    toast.innerHTML = `
      <div class="toast-m-strip"></div>
      <i class="fa-solid fa-gauge-high"></i>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // =========================================================================
  // 7. SMOOTH SCROLL TO TOP
  // =========================================================================
  function initScrollToTop() {
    const btn = document.getElementById('btn-scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
