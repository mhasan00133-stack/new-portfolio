/**
 * BMW M-APEX — Interactive Motion Canvas
 * High-speed perspective highway, dynamic light trails, particle sparks, and warp-speed acceleration.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('motion-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Speed and state variables
  let baseSpeed = 4;
  let targetSpeed = 4;
  let currentSpeed = 4;
  let warpFactor = 1.0;
  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = width / 2;
  let targetMouseY = height / 2;
  let isHovering = false;
  let isWarping = false;
  let isRevving = false;
  let animationFrameId = null;

  // Star / Light streak particles (highway light trails)
  const NUM_STREAKS = 140;
  const streaks = [];

  // Road grid lines
  const NUM_ROAD_LINES = 28;
  const roadLines = [];

  // Sparks / Heat embers (exhaust)
  const NUM_SPARKS = 35;
  const sparks = [];

  function initStreaks() {
    streaks.length = 0;
    for (let i = 0; i < NUM_STREAKS; i++) {
      streaks.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        prevZ: 0,
        colorType: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'red' : 'blue') : 'white',
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3
      });
      streaks[i].prevZ = streaks[i].z;
    }
  }

  function initRoadLines() {
    roadLines.length = 0;
    for (let i = 0; i < NUM_ROAD_LINES; i++) {
      roadLines.push({
        z: (i / NUM_ROAD_LINES) * width,
        length: 60
      });
    }
  }

  function initSparks() {
    sparks.length = 0;
    for (let i = 0; i < NUM_SPARKS; i++) {
      sparks.push({
        x: width * 0.5 + (Math.random() - 0.5) * 80,
        y: height * 0.65 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 4 - 2,
        vy: (Math.random() - 0.5) * 3 - 1,
        life: Math.random(),
        maxLife: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.4 ? '#e22718' : '#0066b1'
      });
    }
  }

  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStreaks();
    initRoadLines();
    initSparks();
  }

  window.addEventListener('resize', onResize);

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    isHovering = true;
  });

  window.addEventListener('mouseleave', () => {
    targetMouseX = width / 2;
    targetMouseY = height / 2;
    isHovering = false;
  });

  // Public control hook for engine rev / warp mode
  window.setApexWarpSpeed = function (active, customFactor) {
    isRevving = active;
    targetSpeed = active ? 24 * (customFactor || 1) : 4;
    warpFactor = active ? 2.8 : 1.0;
  };

  initStreaks();
  initRoadLines();
  initSparks();

  function render() {
    // Smooth mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Smooth speed transitions
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;

    // Deep space obsidian clear with motion trails
    ctx.fillStyle = isRevving ? 'rgba(5, 6, 8, 0.28)' : 'rgba(5, 6, 8, 0.45)';
    ctx.fillRect(0, 0, width, height);

    const vanishingX = width / 2 + (mouseX - width / 2) * 0.15;
    const vanishingY = height * 0.52 + (mouseY - height / 2) * 0.12;

    // 1. Perspective Road / Asphalt Surface
    const horizonY = height * 0.55;
    const roadTopWidth = 140;
    const roadBottomWidth = width * 1.4;

    const roadGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    roadGrad.addColorStop(0, 'rgba(10, 14, 23, 0.0)');
    roadGrad.addColorStop(0.3, 'rgba(13, 17, 27, 0.45)');
    roadGrad.addColorStop(1, 'rgba(5, 6, 8, 0.95)');

    ctx.fillStyle = roadGrad;
    ctx.beginPath();
    ctx.moveTo(vanishingX - roadTopWidth / 2, horizonY);
    ctx.lineTo(vanishingX + roadTopWidth / 2, horizonY);
    ctx.lineTo(width / 2 + roadBottomWidth / 2, height);
    ctx.lineTo(width / 2 - roadBottomWidth / 2, height);
    ctx.closePath();
    ctx.fill();

    // Road glowing edge borders (BMW M Colors)
    // Left edge (M Blue)
    const leftEdgeGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    leftEdgeGrad.addColorStop(0, 'rgba(0, 102, 177, 0)');
    leftEdgeGrad.addColorStop(0.6, 'rgba(0, 102, 177, 0.6)');
    leftEdgeGrad.addColorStop(1, 'rgba(28, 105, 212, 0.9)');

    ctx.strokeStyle = leftEdgeGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vanishingX - roadTopWidth / 2, horizonY);
    ctx.lineTo(width / 2 - roadBottomWidth / 2, height);
    ctx.stroke();

    // Right edge (M Racing Red)
    const rightEdgeGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    rightEdgeGrad.addColorStop(0, 'rgba(226, 39, 24, 0)');
    rightEdgeGrad.addColorStop(0.6, 'rgba(226, 39, 24, 0.6)');
    rightEdgeGrad.addColorStop(1, 'rgba(226, 39, 24, 0.9)');

    ctx.strokeStyle = rightEdgeGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vanishingX + roadTopWidth / 2, horizonY);
    ctx.lineTo(width / 2 + roadBottomWidth / 2, height);
    ctx.stroke();

    // 2. Animated Center Lane Highway Dividers
    for (let i = 0; i < roadLines.length; i++) {
      const line = roadLines[i];
      line.z -= currentSpeed * 1.8;
      if (line.z <= 1) {
        line.z += width;
      }

      const p1 = 1 - line.z / width;
      const p2 = 1 - (line.z + line.length) / width;

      if (p1 > 0 && p1 < 1) {
        const y1 = horizonY + p1 * p1 * (height - horizonY);
        const y2 = horizonY + p2 * p2 * (height - horizonY);
        const lw = 1.5 + p1 * 5;

        const lineAlpha = p1 * 0.8;
        ctx.strokeStyle = isRevving
          ? `rgba(226, 39, 24, ${lineAlpha})`
          : `rgba(0, 102, 177, ${lineAlpha})`;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(vanishingX, y1);
        ctx.lineTo(vanishingX, y2);
        ctx.stroke();
      }
    }

    // 3. Dynamic Warp Speed Lines / Highway Streaks
    for (let i = 0; i < streaks.length; i++) {
      const s = streaks[i];
      s.prevZ = s.z;
      s.z -= currentSpeed * (isRevving ? 2.5 : 1.2);

      if (s.z <= 1) {
        s.z = width;
        s.prevZ = width;
        s.x = (Math.random() - 0.5) * width * 2;
        s.y = (Math.random() - 0.5) * height * 2;
      }

      // Projection
      const k = 280 / s.z;
      const px = s.x * k + vanishingX;
      const py = s.y * k + vanishingY;

      const prevK = 280 / s.prevZ;
      const prevPx = s.x * prevK + vanishingX;
      const prevPy = s.y * prevK + vanishingY;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        let strokeColor;
        if (s.colorType === 'blue') {
          strokeColor = `rgba(0, 102, 177, ${s.alpha})`;
        } else if (s.colorType === 'red') {
          strokeColor = `rgba(226, 39, 24, ${s.alpha})`;
        } else {
          strokeColor = `rgba(226, 232, 240, ${s.alpha * 0.7})`;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isRevving ? s.size * 1.8 : s.size;
        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
    }

    // 4. Glowing Headlight Flare & Ground Reflections
    const centerGlow = ctx.createRadialGradient(
      vanishingX,
      vanishingY + 40,
      10,
      vanishingX,
      vanishingY + 40,
      width * 0.35
    );
    centerGlow.addColorStop(0, isRevving ? 'rgba(226, 39, 24, 0.16)' : 'rgba(0, 102, 177, 0.18)');
    centerGlow.addColorStop(0.5, 'rgba(28, 105, 212, 0.06)');
    centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);

    // 5. Exhaust Embers / Sparks during high revs or idle drift
    if (isRevving || Math.random() > 0.4) {
      for (let i = 0; i < sparks.length; i++) {
        const sp = sparks[i];
        sp.life += 0.02;
        sp.x += sp.vx;
        sp.y += sp.vy;

        if (sp.life >= sp.maxLife) {
          sp.life = 0;
          sp.x = vanishingX + (Math.random() - 0.5) * 120;
          sp.y = height * 0.65 + (Math.random() - 0.5) * 40;
          sp.vx = (Math.random() - 0.5) * (isRevving ? 10 : 3);
          sp.vy = -(Math.random() * (isRevving ? 6 : 2) + 1);
        }

        const sparkAlpha = (1 - sp.life / sp.maxLife) * (isRevving ? 0.9 : 0.4);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sparkAlpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, isRevving ? 2.2 : 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Visibility change handling for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }
  });

  animationFrameId = requestAnimationFrame(render);
})();
