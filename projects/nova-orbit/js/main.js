/**
 * NOVA ORBIT — Core Application Controller (main.js)
 * Interactive UI, Mission Explorer, 3D Tilt, Live Telemetry Radar Engine,
 * Modal Specs, Real-Time Form Validation & Cyber Toast Notifications.
 */

(function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════════════════
  // 1. DATASETS & MISSION REPOSITORY
  // ═════════════════════════════════════════════════════════════════════════
  const MISSIONS_DATA = [
    {
      id: 'artemis-core',
      category: 'deep-space',
      categoryLabel: 'Deep Space',
      badgeClass: 'badge-cyan',
      name: 'Artemis Core V',
      designation: 'NV-DEEP-01',
      status: 'En Route',
      target: 'Lagrange Point L2',
      distance: '1.5M km',
      velocity: '10.8 km/s',
      launchDate: '2026-03-12',
      apogee: '1,520,000 km',
      perigee: '380,000 km',
      inclination: '28.5°',
      fuelMargin: '94.2%',
      transponderFreq: '8.45 GHz (X-Band)',
      payload: 'Autonomous Deep-Space Deep Field Optical Array',
      propulsion: 'Quad Hall-Effect Ion Propulsion Cluster',
      description: 'Primary long-range relay architecture stationed at the Sun-Earth L2 libration point, serving as the high-bandwidth quantum transponder node for future interplanetary missions.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="34" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.4"/>
        <circle cx="40" cy="40" r="22" stroke="currentColor" stroke-width="2"/>
        <ellipse cx="40" cy="40" rx="36" ry="12" stroke="#00F0FF" stroke-width="2" transform="rotate(-30 40 40)"/>
        <circle cx="20" cy="28" r="4" fill="#00F0FF"/>
        <circle cx="40" cy="40" r="8" fill="#8A2BE2"/>
      </svg>`
    },
    {
      id: 'ares-valkyrie',
      category: 'mars',
      categoryLabel: 'Mars Expedition',
      badgeClass: 'badge-orange',
      name: 'Ares Valkyrie',
      designation: 'NV-MARS-04',
      status: 'Active Surface Ops',
      target: 'Jezero Crater, Mars',
      distance: '248.4M km',
      velocity: '3.4 km/s',
      launchDate: '2025-07-28',
      apogee: 'Surface',
      perigee: 'Surface',
      inclination: '18.2° N',
      fuelMargin: '88.6%',
      transponderFreq: '32.1 GHz (Ka-Band)',
      payload: 'Deep Crust Subsurface Percussive Drill & Mass Spectrometer',
      propulsion: 'RTG Nuclear-Electric Thermal Generator',
      description: 'Subsurface autonomous rover scanning pre-Noachian subterranean strata for hydrothermal organic signatures and ancient mineralized hydrological deposits.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="26" stroke="#FB923C" stroke-width="2.5" fill="rgba(251,146,60,0.1)"/>
        <ellipse cx="40" cy="40" rx="38" ry="14" stroke="#FB923C" stroke-width="1.5" stroke-dasharray="3 3"/>
        <circle cx="40" cy="40" r="14" stroke="#F97316" stroke-width="1.8"/>
        <path d="M28 54L40 40L52 54" stroke="#FED7AA" stroke-width="2" stroke-linecap="round"/>
        <circle cx="64" cy="40" r="3.5" fill="#FB923C"/>
      </svg>`
    },
    {
      id: 'selene-x1',
      category: 'lunar',
      categoryLabel: 'Lunar Gateway',
      badgeClass: 'badge-purple',
      name: 'Selene X-1 Foundry',
      designation: 'NV-LUN-09',
      status: 'In Polar Orbit',
      target: 'Shackleton Crater, Moon',
      distance: '384,400 km',
      velocity: '1.63 km/s',
      launchDate: '2025-11-04',
      apogee: '112 km',
      perigee: '42 km',
      inclination: '89.9° (Polar)',
      fuelMargin: '91.8%',
      transponderFreq: '14.2 GHz (Ku-Band)',
      payload: 'Automated Regolith Sintering 3D Extruder Array',
      propulsion: 'Hydrazine Monopropellant RCS + Solar Ion Hybrid',
      description: 'Autonomous lunar orbital surveyor coordinating robotic in-situ resource utilization (ISRU) experiments to extract trapped water ice inside permanently shadowed craters.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="28" stroke="#A78BFA" stroke-width="2"/>
        <path d="M40 12A28 28 0 0 1 40 68A20 20 0 0 0 40 12Z" fill="#A78BFA" opacity="0.3"/>
        <circle cx="30" cy="32" r="3" fill="#DDD6FE"/>
        <circle cx="48" cy="48" r="4.5" fill="#C4B5FD"/>
        <circle cx="36" cy="54" r="2.5" fill="#DDD6FE"/>
        <ellipse cx="40" cy="40" rx="36" ry="18" stroke="#8A2BE2" stroke-width="1.2" transform="rotate(25 40 40)"/>
      </svg>`
    },
    {
      id: 'europa-cryo',
      category: 'deep-space',
      categoryLabel: 'Deep Space',
      badgeClass: 'badge-cyan',
      name: 'Europa CryoProbe',
      designation: 'NV-JUP-12',
      status: 'Interplanetary Cruise',
      target: 'Europa, Jovian System',
      distance: '628.3M km',
      velocity: '22.4 km/s',
      launchDate: '2024-10-18',
      apogee: '815M km',
      perigee: '147M km',
      inclination: '1.8°',
      fuelMargin: '76.4%',
      transponderFreq: '34.2 GHz (Deep Space Ka)',
      payload: 'Ice-Penetrating Radar (REASON) & Magnetometer',
      propulsion: 'Next-Gen Bimodal Nuclear Thermal Rocket Engine',
      description: 'Long-range explorer mapped for orbital insertion around Jupiter’s icy moon Europa to verify global subsurface ocean salinity and cryo-volcanic plume vapor dynamics.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="32" stroke="#00F0FF" stroke-width="1.5"/>
        <circle cx="40" cy="40" r="20" stroke="#38BDF8" stroke-width="2.5" fill="rgba(0,240,255,0.08)"/>
        <path d="M22 36C28 32 36 34 40 42C44 50 52 48 58 44" stroke="#E0F2FE" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M26 48C32 44 46 44 54 36" stroke="#BAE6FD" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="62" cy="22" r="4" fill="#00F0FF"/>
      </svg>`
    },
    {
      id: 'zenith-relay',
      category: 'satellites',
      categoryLabel: 'Orbital Satellites',
      badgeClass: 'badge-cyan',
      name: 'Zenith Quantum Relay',
      designation: 'NV-SAT-77',
      status: 'Nominal Operational',
      target: 'Geostationary Belt',
      distance: '35,786 km',
      velocity: '3.07 km/s',
      launchDate: '2026-01-14',
      apogee: '35,792 km',
      perigee: '35,780 km',
      inclination: '0.04°',
      fuelMargin: '96.5%',
      transponderFreq: 'Optical Laser 1550 nm (Quantum Encrypted)',
      payload: 'Entangled Photon Quantum Key Distribution Terminal',
      propulsion: 'Pure Electric Xenon Grid Thrusters',
      description: 'World-first zero-latency quantum entangled communications node operating at GEO altitude, providing terabit-per-second encrypted relays for ground stations.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <rect x="26" y="26" width="28" height="28" rx="6" stroke="#00F0FF" stroke-width="2" fill="rgba(0,240,255,0.1)"/>
        <line x1="8" y1="40" x2="26" y2="40" stroke="#00F0FF" stroke-width="2"/>
        <line x1="54" y1="40" x2="72" y2="40" stroke="#00F0FF" stroke-width="2"/>
        <rect x="6" y="32" width="12" height="16" rx="2" stroke="#38BDF8" stroke-width="1.5"/>
        <rect x="62" y="32" width="12" height="16" rx="2" stroke="#38BDF8" stroke-width="1.5"/>
        <circle cx="40" cy="40" r="5" fill="#00F0FF"/>
      </svg>`
    },
    {
      id: 'helios-corona',
      category: 'deep-space',
      categoryLabel: 'Deep Space',
      badgeClass: 'badge-orange',
      name: 'Helios Corona Scout',
      designation: 'NV-SOL-02',
      status: 'Perihelion Approach',
      target: 'Solar Corona (0.045 AU)',
      distance: '6.7M km from Sun',
      velocity: '185.0 km/s',
      launchDate: '2024-06-20',
      apogee: '149.6M km',
      perigee: '6.5M km',
      inclination: '3.4°',
      fuelMargin: '82.3%',
      transponderFreq: '8.4 GHz (High-Temp Steerable X-Band)',
      payload: 'Carbon-Composite Heat Shield & Solar Wind Flux Particle Collector',
      propulsion: 'Gravity Assist Multi-Venus Resonant Trajectory',
      description: 'Fastest artificial vehicle in human history plunging through the extreme superheated atmosphere of the Sun to unlock coronal heating and magnetic reconnection dynamics.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="16" fill="#F59E0B"/>
        <circle cx="40" cy="40" r="28" stroke="#FBBF24" stroke-width="2" stroke-dasharray="4 6"/>
        <circle cx="40" cy="40" r="36" stroke="#F97316" stroke-width="1" opacity="0.6"/>
        <path d="M40 8V18M40 62V72M8 40H18M62 40H72M17 17L24 24M56 56L63 63M17 63L24 56M56 24L63 17" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'titan-drifter',
      category: 'deep-space',
      categoryLabel: 'Deep Space',
      badgeClass: 'badge-purple',
      name: 'Titan Drifter IX',
      designation: 'NV-SATURN-05',
      status: 'Target Ingress',
      target: 'Kraken Mare, Titan',
      distance: '1.4B km',
      velocity: '14.1 km/s',
      launchDate: '2023-11-12',
      apogee: '1.51B km',
      perigee: '1.38B km',
      inclination: '26.7°',
      fuelMargin: '79.2%',
      transponderFreq: '8.4 GHz (Ultra-Gain High Aperture)',
      payload: 'Methane-Proof Nautical Floater Pod & Drone Rotorcraft',
      propulsion: 'Next-Gen Stirling Radioisotope Electric Propulsion',
      description: 'Hybrid atmospheric glider and liquid methane lake rover engineered to traverse the nitrogen skies and hydrocarbon oceans of Saturn’s largest enigmatic moon.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="24" fill="rgba(167,139,250,0.15)" stroke="#A78BFA" stroke-width="2"/>
        <ellipse cx="40" cy="40" rx="36" ry="12" stroke="#DDD6FE" stroke-width="1.8" transform="rotate(-15 40 40)"/>
        <path d="M30 40C34 44 46 44 50 40" stroke="#8A2BE2" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="34" cy="32" r="3" fill="#8A2BE2"/>
      </svg>`
    },
    {
      id: 'orbital-nexus',
      category: 'satellites',
      categoryLabel: 'Orbital Satellites',
      badgeClass: 'badge-cyan',
      name: 'Nexus Microgravity Hub',
      designation: 'NV-LEO-10',
      status: 'Fully Operational',
      target: 'Low Earth Orbit (410 km)',
      distance: '410 km',
      velocity: '7.66 km/s',
      launchDate: '2026-02-01',
      apogee: '418 km',
      perigee: '408 km',
      inclination: '51.6°',
      fuelMargin: '98.0%',
      transponderFreq: '26.5 GHz (Ka Broadband)',
      payload: 'Automated Semiconductor Crystal Growth Vacuum Chambers',
      propulsion: 'Green Ionic Liquid Micro-Thrusters',
      description: 'Commercial microgravity research facility fabricating high-purity ZBLAN fiber optics, artificial protein macromolecular crystals, and next-gen photonic chips in pure vacuum.',
      iconSvg: `<svg viewBox="0 0 80 80" width="48" height="48" fill="none">
        <circle cx="40" cy="40" r="14" stroke="#00F0FF" stroke-width="2" fill="rgba(0,240,255,0.15)"/>
        <line x1="40" y1="12" x2="40" y2="68" stroke="#00F0FF" stroke-width="2"/>
        <line x1="12" y1="40" x2="68" y2="40" stroke="#00F0FF" stroke-width="2"/>
        <rect x="22" y="8" width="36" height="8" rx="2" stroke="#38BDF8" stroke-width="1.5"/>
        <rect x="22" y="64" width="36" height="8" rx="2" stroke="#38BDF8" stroke-width="1.5"/>
        <circle cx="40" cy="40" r="5" fill="#FFFFFF"/>
      </svg>`
    }
  ];

  // ═════════════════════════════════════════════════════════════════════════
  // 2. TELEMETRY SPACECRAFT DATASETS
  // ═════════════════════════════════════════════════════════════════════════
  const TELEMETRY_CRAFT = {
    'ares-v': {
      name: 'ARES-V SURVEYOR',
      destination: 'Mars Polar Reconnaissance',
      statusText: 'TELEMETRY NOMINAL // POLAR INSERTION',
      statusClass: 'status-active',
      rightAscension: '14h 28m 33.2s',
      declination: '-18° 14\' 42.1"',
      inclination: '93.2° (Sun-Synchronous)',
      distanceKm: 248419200,
      velocityKms: 24.28,
      signalDbm: -78.4,
      thermalKelvin: 284,
      fuelPercent: 88,
      solarKw: 4.8,
      orbitCenter: 'Mars',
      orbitRadius: 75,
      orbitPeriodSec: 12,
      logHistory: [
        'Uplink carrier locked on Deep Space Network (Canberra 70m).',
        'Sub-surface radiometer sweep complete. No anomalies detected.',
        'Star tracker recalibrated against Vega reference vector.'
      ]
    },
    'artemis-x': {
      name: 'ARTEMIS-X ORBITER',
      destination: 'Lunar Gateway Station (NRHO)',
      statusText: 'STATIONARY // QUASI-HALO ORBIT',
      statusClass: 'status-active',
      rightAscension: '08h 12m 44.8s',
      declination: '+24° 51\' 12.0"',
      inclination: '89.4° (Polar Halo)',
      distanceKm: 384400,
      velocityKms: 1.63,
      signalDbm: -42.1,
      thermalKelvin: 298,
      fuelPercent: 94,
      solarKw: 18.5,
      orbitCenter: 'Moon',
      orbitRadius: 55,
      orbitPeriodSec: 8,
      logHistory: [
        'Docking adapter pressurized to 101.3 kPa.',
        'Telemetry ping returned in 1.28 sec (Round Trip).',
        'Lunar south pole visual reconnaissance stream nominal.'
      ]
    },
    'kepler-deep': {
      name: 'KEPLER-DEEP PROBE',
      destination: 'Interstellar Heliopause Vector',
      statusText: 'OUTER BOUND // TERMINATION SHOCK',
      statusClass: 'status-warning',
      rightAscension: '19h 45m 18.1s',
      declination: '+34° 02\' 55.4"',
      inclination: '31.8° (Ecliptic Exit)',
      distanceKm: 18452090000,
      velocityKms: 47.82,
      signalDbm: -114.6,
      thermalKelvin: 46,
      fuelPercent: 62,
      solarKw: 0.4,
      orbitCenter: 'Solar Core',
      orbitRadius: 95,
      orbitPeriodSec: 24,
      logHistory: [
        'Interstellar magnetic flux threshold registered at 0.48 nT.',
        'RTG power generator delivering steady 310 Watts.',
        'Deep Space Network Goldstone 70m beacon synchronizing.'
      ]
    },
    'helios-iii': {
      name: 'HELIOS-III SCOUT',
      destination: 'Solar Corona Perihelion (0.045 AU)',
      statusText: 'EXTREME ENVIRONMENT // THERMAL MAX',
      statusClass: 'status-active',
      rightAscension: '02h 58m 09.7s',
      declination: '+11° 39\' 18.3"',
      inclination: '3.4° (Solar Equator)',
      distanceKm: 6720000,
      velocityKms: 185.4,
      signalDbm: -64.2,
      thermalKelvin: 1680,
      fuelPercent: 81,
      solarKw: 84.0,
      orbitCenter: 'Sun',
      orbitRadius: 38,
      orbitPeriodSec: 6,
      logHistory: [
        'Carbon-carbon heat shield temperature steady at 1,680 K.',
        'Solar wind alpha particle velocity logged at 740 km/s.',
        'Plasma wave sensor recorded Type-III coronal burst.'
      ]
    }
  };

  let activeCraftKey = 'ares-v';

  // ═════════════════════════════════════════════════════════════════════════
  // 3. TOP SCROLL PROGRESS BAR & STICKY NAVBAR
  // ═════════════════════════════════════════════════════════════════════════
  function initScrollProgressAndNavbar() {
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    // Scroll progress & sticky navbar state
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = progress + '%';
      }

      if (navbar) {
        if (scrollTop > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollTop > 450) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // Scroll Spy for active navigation highlighting
      const sections = ['hero', 'explorer', 'telemetry', 'architecture', 'launch'];
      let currentSection = 'hero';

      sections.forEach((secId) => {
        const secEl = document.getElementById(secId);
        if (secEl) {
          const rect = secEl.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            currentSection = secId;
          }
        }
      });

      navLinks.forEach((link) => {
        const target = link.getAttribute('href');
        if (target === `#${currentSection}`) {
          link.classList.add('active');
        } else if (target && target.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle && mobileDrawer) {
      navToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          closeMobileDrawer();
        } else {
          openMobileDrawer();
        }
      });

      drawerLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileDrawer();
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (
          mobileDrawer.classList.contains('open') &&
          !mobileDrawer.contains(e.target) &&
          !navToggle.contains(e.target)
        ) {
          closeMobileDrawer();
        }
      });
    }

    function openMobileDrawer() {
      mobileDrawer.classList.add('open');
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
      mobileDrawer.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Back to top button
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 4. ANIMATED COUNT-UP NUMBERS (HERO STATS)
  // ═════════════════════════════════════════════════════════════════════════
  function initCountUpStats() {
    const statElements = document.querySelectorAll('.stat-count');
    if (!statElements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = parseFloat(el.getAttribute('data-target') || '0');
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const duration = 2000; // ms
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease Out Cubic
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = easeProgress * targetVal;

              el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    statElements.forEach((el) => observer.observe(el));
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 5. MISSION EXPLORER GRID & 3D TILT EFFECT
  // ═════════════════════════════════════════════════════════════════════════
  function renderMissionCards(filter = 'all') {
    const grid = document.getElementById('mission-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = filter === 'all'
      ? MISSIONS_DATA
      : MISSIONS_DATA.filter((m) => m.category === filter);

    filtered.forEach((mission) => {
      const card = document.createElement('article');
      card.className = 'mission-card reveal';
      card.setAttribute('data-id', mission.id);
      card.setAttribute('data-tilt', 'true');

      card.innerHTML = `
        <div class="card-glow" aria-hidden="true"></div>
        <div class="card-media-head">
          <div class="card-brand-insignia">
            ${mission.iconSvg}
          </div>
          <div class="mission-status-pill ${mission.badgeClass}">
            <span class="status-dot"></span>
            <span>${mission.status}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="card-meta-row">
            <span class="mission-tag">${mission.categoryLabel}</span>
            <span class="mission-code">${mission.designation}</span>
          </div>

          <h3 class="card-title">${mission.name}</h3>
          <p class="card-desc">${mission.description}</p>

          <div class="card-specs-matrix">
            <div class="spec-cell">
              <span class="spec-label">Target</span>
              <span class="spec-val">${mission.target}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Range</span>
              <span class="spec-val">${mission.distance}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Velocity</span>
              <span class="spec-val">${mission.velocity}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Telemetry Freq</span>
              <span class="spec-val">${mission.transponderFreq.split(' ')[0]}</span>
            </div>
          </div>

          <div class="card-action-row">
            <button class="btn btn-outline-cyan btn-card-inspect" data-action="inspect" data-id="${mission.id}" aria-label="Inspect ${mission.name} specifications">
              <span>Inspect Telemetry</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Reattach 3D tilt listeners
    init3DTilt();
  }

  function initMissionFilters() {
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter') || 'all';
        renderMissionCards(filterVal);
      });
    });
  }

  // 3D Card Tilt with Specular Mouse Lighting
  function init3DTilt() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const tiltCards = document.querySelectorAll('[data-tilt="true"]');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        const glowEl = card.querySelector('.card-glow');
        if (glowEl) {
          glowEl.style.opacity = '1';
          glowEl.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.18), transparent 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        const glowEl = card.querySelector('.card-glow');
        if (glowEl) {
          glowEl.style.opacity = '0';
        }
      });
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 6. MISSION DETAILS MODAL ENGINE
  // ═════════════════════════════════════════════════════════════════════════
  function initMissionModal() {
    const modal = document.getElementById('mission-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody = document.getElementById('modal-content-container');

    if (!modal || !modalBody) return;

    // Delegate inspect clicks from grid
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action="inspect"]');
      if (target) {
        const missionId = target.getAttribute('data-id');
        const mission = MISSIONS_DATA.find((m) => m.id === missionId);
        if (mission) {
          openModal(mission);
        }
      }
    });

    function openModal(m) {
      modalBody.innerHTML = `
        <div class="modal-header-block">
          <div class="modal-badge-group">
            <span class="mission-status-pill ${m.badgeClass}">
              <span class="status-dot"></span>
              <span>${m.status}</span>
            </span>
            <span class="modal-code">${m.designation}</span>
          </div>
          <h2 class="modal-title">${m.name}</h2>
          <p class="modal-sub">${m.description}</p>
        </div>

        <div class="modal-grid-specs">
          <div class="modal-spec-card">
            <span class="spec-caption">Orbital Target</span>
            <strong class="spec-highlight">${m.target}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Distance to Earth</span>
            <strong class="spec-highlight text-cyan">${m.distance}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Current Velocity</span>
            <strong class="spec-highlight">${m.velocity}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Orbital Inclination</span>
            <strong class="spec-highlight">${m.inclination}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Apogee Altitude</span>
            <strong class="spec-highlight">${m.apogee}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Perigee Altitude</span>
            <strong class="spec-highlight">${m.perigee}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Fuel Reserves</span>
            <strong class="spec-highlight text-cyan">${m.fuelMargin}</strong>
          </div>
          <div class="modal-spec-card">
            <span class="spec-caption">Telemetry Frequency</span>
            <strong class="spec-highlight">${m.transponderFreq}</strong>
          </div>
        </div>

        <div class="modal-detail-section">
          <h4 class="detail-heading">Scientific Payload Architecture</h4>
          <p class="detail-text">${m.payload}</p>
        </div>

        <div class="modal-detail-section">
          <h4 class="detail-heading">Propulsion & Vectoring Mechanics</h4>
          <p class="detail-text">${m.propulsion}</p>
        </div>

        <div class="modal-interactive-ping-row">
          <button id="modal-ping-btn" class="btn btn-glow-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
            <span>Simulate Transponder Ping</span>
          </button>
          <div id="modal-ping-output" class="ping-output-text">Carrier frequency synchronized. Standing by for ping...</div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Attach ping handler
      const pingBtn = document.getElementById('modal-ping-btn');
      const pingOut = document.getElementById('modal-ping-output');
      if (pingBtn && pingOut) {
        pingBtn.addEventListener('click', () => {
          pingOut.innerHTML = `<span class="text-cyan">Transmitting carrier pulse...</span>`;
          setTimeout(() => {
            const rtt = (Math.random() * 2.4 + 0.6).toFixed(3);
            pingOut.innerHTML = `<strong>Acknowledge received:</strong> Transponder response in <span class="text-cyan">${rtt}s</span> (SNR: +31.2 dB | Carrier: Locked)`;
          }, 650);
        });
      }
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 7. LIVE ORBITAL TELEMETRY DASHBOARD & RADAR CANVAS ENGINE
  // ═════════════════════════════════════════════════════════════════════════
  function initTelemetryDashboard() {
    const craftButtons = document.querySelectorAll('.telemetry-craft-btn');
    const craftNameEl = document.getElementById('hud-craft-name');
    const craftDestEl = document.getElementById('hud-craft-dest');
    const craftStatusEl = document.getElementById('hud-craft-status');
    const valVelocity = document.getElementById('val-velocity');
    const valDistance = document.getElementById('val-distance');
    const valSignal = document.getElementById('val-signal');
    const valThermal = document.getElementById('val-thermal');
    const valFuel = document.getElementById('val-fuel');
    const valSolar = document.getElementById('val-solar');
    const barFuel = document.getElementById('bar-fuel');
    const barSignal = document.getElementById('bar-signal');
    const barThermal = document.getElementById('bar-thermal');
    const coordRa = document.getElementById('coord-ra');
    const coordDec = document.getElementById('coord-dec');
    const coordInc = document.getElementById('coord-inc');
    const terminalLogs = document.getElementById('telemetry-terminal-logs');

    // Spacecraft switcher tabs
    craftButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        craftButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCraftKey = btn.getAttribute('data-craft') || 'ares-v';
        updateTelemetryHUD();
      });
    });

    function updateTelemetryHUD() {
      const craft = TELEMETRY_CRAFT[activeCraftKey];
      if (!craft) return;

      if (craftNameEl) craftNameEl.textContent = craft.name;
      if (craftDestEl) craftDestEl.textContent = craft.destination;
      if (craftStatusEl) {
        craftStatusEl.textContent = craft.statusText;
        craftStatusEl.className = `hud-status-badge ${craft.statusClass}`;
      }

      if (valVelocity) valVelocity.textContent = `${craft.velocityKms} km/s`;
      if (valDistance) valDistance.textContent = formatDistance(craft.distanceKm);
      if (valSignal) valSignal.textContent = `${craft.signalDbm} dBm`;
      if (valThermal) valThermal.textContent = `${craft.thermalKelvin} K`;
      if (valFuel) valFuel.textContent = `${craft.fuelPercent}%`;
      if (valSolar) valSolar.textContent = `${craft.solarKw} kW`;

      if (barFuel) barFuel.style.width = `${craft.fuelPercent}%`;
      if (barSignal) {
        // Map -120 to -30 dBm to 0-100%
        const sigPercent = Math.max(10, Math.min(100, ((craft.signalDbm + 120) / 90) * 100));
        barSignal.style.width = `${sigPercent}%`;
      }
      if (barThermal) {
        // Map 0 to 2000K to 0-100%
        const thermPercent = Math.max(10, Math.min(100, (craft.thermalKelvin / 2000) * 100));
        barThermal.style.width = `${thermPercent}%`;
      }

      if (coordRa) coordRa.textContent = craft.rightAscension;
      if (coordDec) coordDec.textContent = craft.declination;
      if (coordInc) coordInc.textContent = craft.inclination;

      // Append terminal switch notice
      logTerminal(`Switched active transponder uplink to [${craft.name}]. Orbit center: ${craft.orbitCenter}`);
    }

    function formatDistance(km) {
      if (km >= 1e9) {
        return `${(km / 1e9).toFixed(2)}B km`;
      }
      if (km >= 1e6) {
        return `${(km / 1e6).toFixed(1)}M km`;
      }
      return `${km.toLocaleString()} km`;
    }

    function logTerminal(message) {
      if (!terminalLogs) return;
      const timeStr = new Date().toISOString().substring(11, 19) + ' UTC';
      const logLine = document.createElement('div');
      logLine.className = 'terminal-row';
      logLine.innerHTML = `<span class="time-stamp">[${timeStr}]</span> <span class="log-txt">${message}</span>`;
      terminalLogs.appendChild(logLine);
      terminalLogs.scrollTop = terminalLogs.scrollHeight;

      // Keep only last 25 lines
      while (terminalLogs.children.length > 25) {
        terminalLogs.removeChild(terminalLogs.firstChild);
      }
    }

    // Telemetry action buttons
    const btnPing = document.getElementById('btn-telemetry-ping');
    const btnRecalibrate = document.getElementById('btn-telemetry-recal');
    const btnDump = document.getElementById('btn-telemetry-dump');

    if (btnPing) {
      btnPing.addEventListener('click', () => {
        triggerRadarPulse();
        logTerminal(`Carrier ping emitted to ${TELEMETRY_CRAFT[activeCraftKey].name}... Ack received in ${(Math.random() * 0.9 + 0.3).toFixed(3)}s`);
        showToast('Transponder Uplink Synchronized', 'Telemetry carrier locked with 0 packet drops.');
      });
    }

    if (btnRecalibrate) {
      btnRecalibrate.addEventListener('click', () => {
        logTerminal('Executing Star Tracker gyro and sensor array zero-offset recalibration...');
        setTimeout(() => {
          logTerminal('Sensor calibration confirmed. Offsets: Δθ=0.002°, Δω=0.0001 rad/s.');
          showToast('Array Recalibrated', 'Orbital attitude gyro drift corrected to nominal.');
        }, 500);
      });
    }

    if (btnDump) {
      btnDump.addEventListener('click', () => {
        const hex = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ').toUpperCase();
        logTerminal(`HEX DUMP [0x7FF0]: ${hex} // TELEMETRY FRAME VALID`);
        showToast('Telemetry Frame Logged', `Hex checksum: 0x${hex.substring(0, 5)} verified.`);
      });
    }

    // Live micro-fluctuations (subtle realism)
    setInterval(() => {
      const craft = TELEMETRY_CRAFT[activeCraftKey];
      if (!craft) return;
      // Slight fluctuation ±0.03
      const delta = (Math.random() - 0.5) * 0.04;
      const liveVel = (craft.velocityKms + delta).toFixed(2);
      if (valVelocity) valVelocity.textContent = `${liveVel} km/s`;
    }, 2200);

    // Initial render
    updateTelemetryHUD();
    initRadarCanvas();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 8. INTERACTIVE RADAR & ORBIT VISUALIZER (HTML5 CANVAS)
  // ═════════════════════════════════════════════════════════════════════════
  let triggerPulse = false;
  let pulseRadius = 0;

  function triggerRadarPulse() {
    triggerPulse = true;
    pulseRadius = 10;
  }

  function initRadarCanvas() {
    const radar = document.getElementById('radar-canvas');
    if (!radar) return;

    const ctx = radar.getContext('2d');
    if (!ctx) return;

    let rWidth = 320;
    let rHeight = 320;
    let radarAngle = 0;
    let orbitAngle = 0;

    function resizeRadar() {
      const rect = radar.parentElement.getBoundingClientRect();
      rWidth = rect.width || 320;
      rHeight = rect.height || 320;
      radar.width = rWidth * 2;
      radar.height = rHeight * 2;
      radar.style.width = rWidth + 'px';
      radar.style.height = rHeight + 'px';
      ctx.scale(2, 2);
    }

    resizeRadar();
    window.addEventListener('resize', resizeRadar, { passive: true });

    function renderRadar() {
      ctx.clearRect(0, 0, rWidth, rHeight);

      const centerX = rWidth / 2;
      const centerY = rHeight / 2;
      const maxR = Math.min(centerX, centerY) * 0.88;

      // 1. Concentric Range Circles
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 1; i <= 4; i++) {
        const ringR = (maxR / 4) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringR, 0, Math.PI * 2);
        ctx.stroke();

        // Ring label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px monospace';
        ctx.fillText(`${i * 25}%`, centerX + 4, centerY - ringR + 11);
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - maxR);
      ctx.lineTo(centerX, centerY + maxR);
      ctx.moveTo(centerX - maxR, centerY);
      ctx.lineTo(centerX + maxR, centerY);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.stroke();

      // Degree tick marks
      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const x1 = centerX + Math.cos(rad) * maxR;
        const y1 = centerY + Math.sin(rad) * maxR;
        const x2 = centerX + Math.cos(rad) * (maxR - 6);
        const y2 = centerY + Math.sin(rad) * (maxR - 6);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.stroke();
      }

      // 2. Rotating Radar Sweep Beam
      radarAngle += 0.025;
      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxR);
      sweepGradient.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      sweepGradient.addColorStop(1, 'rgba(0, 240, 255, 0.01)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxR, radarAngle - 0.45, radarAngle);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sweep leading beam line
      const beamX = centerX + Math.cos(radarAngle) * maxR;
      const beamY = centerY + Math.sin(radarAngle) * maxR;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(beamX, beamY);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Central Gravitational Planetary Body
      const craft = TELEMETRY_CRAFT[activeCraftKey];
      let planetColor = '#38BDF8';
      let planetGlow = 'rgba(56, 189, 248, 0.25)';

      if (craft.orbitCenter === 'Mars') {
        planetColor = '#FB923C';
        planetGlow = 'rgba(251, 146, 60, 0.35)';
      } else if (craft.orbitCenter === 'Sun') {
        planetColor = '#FBBF24';
        planetGlow = 'rgba(251, 191, 36, 0.45)';
      } else if (craft.orbitCenter === 'Moon') {
        planetColor = '#C4B5FD';
        planetGlow = 'rgba(196, 181, 253, 0.3)';
      }

      // Atmospheric halo
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Core planet
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fillStyle = planetColor;
      ctx.fill();

      // 4. Spacecraft Orbit Ellipse Trajectory
      const orbitRx = (craft.orbitRadius / 100) * maxR;
      const orbitRy = orbitRx * 0.65; // Inclination perspective

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, orbitRx, orbitRy, -Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.55)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Spacecraft Marker & Blinking Transponder
      orbitAngle += (2 * Math.PI) / (craft.orbitPeriodSec * 60);
      const rot = -Math.PI / 6;
      const unrotX = Math.cos(orbitAngle) * orbitRx;
      const unrotY = Math.sin(orbitAngle) * orbitRy;
      const craftX = centerX + unrotX * Math.cos(rot) - unrotY * Math.sin(rot);
      const craftY = centerY + unrotX * Math.sin(rot) + unrotY * Math.cos(rot);

      // Ping wavefront animation
      if (triggerPulse) {
        pulseRadius += 2.5;
        ctx.beginPath();
        ctx.arc(craftX, craftY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - pulseRadius / 60)})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (pulseRadius > 60) {
          triggerPulse = false;
        }
      }

      // Spacecraft beacon dot
      ctx.beginPath();
      ctx.arc(craftX, craftY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Spacecraft label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(craft.name.split(' ')[0], craftX + 8, craftY - 6);

      ctx.restore();
      requestAnimationFrame(renderRadar);
    }

    renderRadar();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 9. LAUNCH INQUIRY FORM VALIDATION & CYBER TOAST ENGINE
  // ═════════════════════════════════════════════════════════════════════════
  function initLaunchForm() {
    const form = document.getElementById('launch-inquiry-form');
    if (!form) return;

    const nameInput = document.getElementById('field-commander');
    const agencySelect = document.getElementById('field-agency');
    const orbitSelect = document.getElementById('field-orbit');
    const emailInput = document.getElementById('field-email');
    const notesInput = document.getElementById('field-directive');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Real-time input listeners to clear errors
    [nameInput, agencySelect, orbitSelect, emailInput, notesInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        clearFieldError(input);
      });
      input.addEventListener('change', () => {
        clearFieldError(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Commander Name Validation
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'Enter valid Commander or Officer designation (min 2 chars).');
        isValid = false;
      }

      // 2. Agency Validation
      if (!agencySelect.value) {
        setFieldError(agencySelect, 'Select requesting space agency or enterprise entity.');
        isValid = false;
      }

      // 3. Orbit Target Validation
      if (!orbitSelect.value) {
        setFieldError(orbitSelect, 'Select requested deployment trajectory or target orbit.');
        isValid = false;
      }

      // 4. Email Validation
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, 'Provide a valid telemetry downlink email address.');
        isValid = false;
      }

      // 5. Directive Notes Validation
      if (!notesInput.value.trim() || notesInput.value.trim().length < 12) {
        setFieldError(notesInput, 'Specify mission payload specifications & directive (min 12 chars).');
        isValid = false;
      }

      if (isValid) {
        // Generate random registration reference
        const refCode = `NV-ORB-${Math.floor(Math.random() * 8999 + 1000)}-X`;
        showToast(
          'Launch Directive Confirmed',
          `Payload scheduled for trajectory calculation. Reference: <strong>${refCode}</strong>. Telemetry packet dispatched to ${emailInput.value}.`
        );
        form.reset();
      }
    });

    function setFieldError(field, msg) {
      field.classList.add('field-invalid');
      const errEl = field.parentElement.querySelector('.field-error-msg');
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('visible');
      }
    }

    function clearFieldError(field) {
      field.classList.remove('field-invalid');
      const errEl = field.parentElement.querySelector('.field-error-msg');
      if (errEl) {
        errEl.classList.remove('visible');
      }
    }
  }

  // Cyber Toast Notification System
  function showToast(title, message) {
    const toast = document.getElementById('cyber-toast');
    if (!toast) return;

    const titleEl = toast.querySelector('.toast-title');
    const msgEl = toast.querySelector('.toast-desc');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message;

    toast.classList.add('show');

    // Auto-dismiss after 5 seconds
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 5200);

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        toast.classList.remove('show');
      };
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 10. SCROLL REVEAL OBSERVER
  // ═════════════════════════════════════════════════════════════════════════
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // ═════════════════════════════════════════════════════════════════════════
  // INITIALIZATION ON DOM READY
  // ═════════════════════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgressAndNavbar();
    initCountUpStats();
    renderMissionCards('all');
    initMissionFilters();
    initMissionModal();
    initTelemetryDashboard();
    initLaunchForm();
    initScrollReveal();
  });
})();
