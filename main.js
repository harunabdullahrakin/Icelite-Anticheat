
let rotatorTimer = null;
let telemetryTimer = null;
let sliderAutoTimer = null;
let canvasAnimId = null;
let isScrollBound = false;
let isDelegationBound = false;

function initApp() {
  cleanupTimers();
  bindGlobalDelegation();

  initWordRotator();
  initScrollSlideAnimations();
  initNavbarScroll();
  initHeroCanvas();
  initBlurControl();
  initTelemetryStream();
  initInspectorDemo();
  initCounters();
  initTestimonialSlider();
}

function cleanupTimers() {
  if (rotatorTimer) {
    clearInterval(rotatorTimer);
    rotatorTimer = null;
  }
  if (telemetryTimer) {
    clearInterval(telemetryTimer);
    telemetryTimer = null;
  }
  if (sliderAutoTimer) {
    clearInterval(sliderAutoTimer);
    sliderAutoTimer = null;
  }
  if (canvasAnimId) {
    cancelAnimationFrame(canvasAnimId);
    canvasAnimId = null;
  }
}

document.addEventListener('turbo:before-cache', cleanupTimers);
document.addEventListener('turbo:load', initApp);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.Turbo) initApp();
  });
} else {
  if (!window.Turbo) initApp();
}

function bindGlobalDelegation() {
  if (isDelegationBound) return;
  isDelegationBound = true;

  document.addEventListener('click', (e) => {

    const faqTrigger = e.target.closest('.faq-trigger');
    if (faqTrigger) {
      e.preventDefault();
      handleFaqAccordionClick(faqTrigger);
      return;
    }

    const mobileToggle = e.target.closest('.mobile-toggle');
    if (mobileToggle) {
      e.preventDefault();
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.toggle('open');
      return;
    }

    const navLink = e.target.closest('.nav-links a');
    if (navLink) {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    }

    const copyBtn = e.target.closest('#btnCopyIp');
    if (copyBtn) {
      e.preventDefault();
      handleCopyServerIP();
      return;
    }

    const inspectorTab = e.target.closest('.inspector-tab');
    if (inspectorTab) {
      e.preventDefault();
      handleInspectorTabClick(inspectorTab);
      return;
    }

    const prevSlider = e.target.closest('#sliderPrev');
    if (prevSlider) {
      e.preventDefault();
      handleSliderNav(-1);
      return;
    }

    const nextSlider = e.target.closest('#sliderNext');
    if (nextSlider) {
      e.preventDefault();
      handleSliderNav(1);
      return;
    }

    const dotBtn = e.target.closest('.slider-dot');
    if (dotBtn && dotBtn.dataset.slideIndex !== undefined) {
      e.preventDefault();
      handleSliderGoTo(parseInt(dotBtn.dataset.slideIndex, 10));
      return;
    }
  });
}

function handleFaqAccordionClick(trigger) {
  const currentItem = trigger.closest('.faq-item');
  if (!currentItem) return;

  const container = currentItem.closest('.faq-container') || document;
  const isCurrentlyOpen = currentItem.classList.contains('active');

  container.querySelectorAll('.faq-item').forEach(item => {
    if (item !== currentItem) {
      item.classList.remove('active');
      const otherTrigger = item.querySelector('.faq-trigger');
      if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  if (isCurrentlyOpen) {
    currentItem.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
  } else {
    currentItem.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function initWordRotator() {
  const wordEl = document.getElementById('rotatingWord');
  if (!wordEl) return;

  const words = ['SMP', 'Server', 'Game', 'Network'];
  let index = 0;

  function rotate() {
    index = (index + 1) % words.length;
    wordEl.classList.add('fade-out');

    setTimeout(() => {
      wordEl.textContent = words[index];
      wordEl.classList.remove('fade-out');
      wordEl.classList.add('fade-in');

      setTimeout(() => {
        wordEl.classList.remove('fade-in');
      }, 300);
    }, 300);
  }

  rotatorTimer = setInterval(rotate, 2200);
}

function initScrollSlideAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('reveal-active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

function initNavbarScroll() {
  const navWrapper = document.querySelector('.nav-wrapper');
  if (!navWrapper || isScrollBound) return;
  isScrollBound = true;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const scrollThreshold = 6;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentWrapper = document.querySelector('.nav-wrapper');
        if (!currentWrapper) {
          ticking = false;
          return;
        }

        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        if (currentScrollY > 30) {
          currentWrapper.classList.add('nav-scrolled');
        } else {
          currentWrapper.classList.remove('nav-scrolled');
        }

        if (Math.abs(scrollDelta) > scrollThreshold) {
          if (scrollDelta > 0 && currentScrollY > 120) {
            currentWrapper.classList.add('nav-hidden');
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('open');
          } else if (scrollDelta < 0) {
            currentWrapper.classList.remove('nav-hidden');
          }
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

let sliderCurrentIndex = 0;

function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track || !slides.length) return;

  sliderCurrentIndex = 0;
  track.style.transform = 'translateX(0%)';

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.dataset.slideIndex = String(i);
      dotsContainer.appendChild(dot);
    });
  }

  startSliderAuto();
}

function startSliderAuto() {
  if (sliderAutoTimer) clearInterval(sliderAutoTimer);
  sliderAutoTimer = setInterval(() => {
    handleSliderNav(1);
  }, 5500);
}

function handleSliderNav(direction) {
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  if (!track || !slides.length) return;

  sliderCurrentIndex = (sliderCurrentIndex + direction + slides.length) % slides.length;
  updateSliderView();
  startSliderAuto();
}

function handleSliderGoTo(index) {
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  if (!track || !slides.length) return;

  sliderCurrentIndex = (index + slides.length) % slides.length;
  updateSliderView();
  startSliderAuto();
}

function updateSliderView() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track) return;

  track.style.transform = `translateX(-${sliderCurrentIndex * 100}%)`;

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === sliderCurrentIndex);
    });
  }
}

const inspectorData = {
  combat: {
    title: 'Combat & Rotations Detection',
    desc: 'Pinpoint precision heuristics targeting Killaura, AimAssist, Hitbox Expansion, and Reach modifications with zero false bans.',
    checks: [
      'Raycast Reach (3.00m bounding box constraint)',
      'Gaussian rotation curve analysis (SmoothAim & Snapping)',
      'Autoclicker consistency (Kurtosis & Standard Deviation)',
      'Criticals & FastBow packet timing verification'
    ],
    status: 'VIOLATION DETECTED',
    statusColor: '#ef4444',
    g1: { label: 'Reach Distance', val: '3.41m / 3.00m', width: '92%', danger: true },
    g2: { label: 'Rotation Snap Angle', val: '86.4° / 15.0°', width: '85%', danger: true },
    g3: { label: 'CPS Consistency', val: '0.12 (Macro)', width: '95%', danger: true }
  },
  movement: {
    title: 'Vanilla Physics Simulation',
    desc: 'Real-time client simulation comparing player packets with Minecraft vanilla physics equations (friction, inertia, web slowdown, ice).',
    checks: [
      'Vanilla Motion Simulation (Speed, Strafe, BHop)',
      'Ground Spoof & NoFall packet validation',
      'Flight & Glide hover-time acceleration check',
      'Scaffold yaw/pitch placement vector verification'
    ],
    status: 'PACKET INTERCEPTED',
    statusColor: '#f59e0b',
    g1: { label: 'Velocity deltaXZ', val: '0.62 / 0.36 max', width: '88%', danger: true },
    g2: { label: 'Air Ticks (Fly)', val: '38 ticks off-ground', width: '78%', danger: true },
    g3: { label: 'Pitch Consistency', val: '79.2° (Exact Scaffold)', width: '90%', danger: true }
  },
  packet: {
    title: 'Packet & Protocol Shield',
    desc: 'Inspects low-level protocol flow to catch client packet spoofing, disablers, timer exploits, and crash exploits before the main thread.',
    checks: [
      'Timer rate analysis (20.0 TPS lock)',
      'PingSpoof packet sequencing verification',
      'Invalid Handshake, BookExploit & Crash prevention',
      'FastBreak, FastPlace & Illegal block interaction'
    ],
    status: 'BLOCKED & SECURED',
    statusColor: '#38bdf8',
    g1: { label: 'Packet Rate', val: '24.8 pkts/sec (1.24x)', width: '74%', danger: true },
    g2: { label: 'Ping Drift', val: '0.2ms stddev (Spoofed)', width: '84%', danger: true },
    g3: { label: 'Protocol Anomaly Score', val: '0.00ms Tick Delay', width: '15%', danger: false }
  }
};

function initInspectorDemo() {

}

function handleInspectorTabClick(tab) {
  const tabs = document.querySelectorAll('.inspector-tab');
  const infoTitle = document.getElementById('inspectorTitle');
  const infoDesc = document.getElementById('inspectorDesc');
  const checksList = document.getElementById('inspectorChecks');
  const statusBadge = document.getElementById('inspectorStatus');
  const bar1 = document.getElementById('gaugeBar1');
  const bar2 = document.getElementById('gaugeBar2');
  const bar3 = document.getElementById('gaugeBar3');
  const label1 = document.getElementById('gaugeVal1');
  const label2 = document.getElementById('gaugeVal2');
  const label3 = document.getElementById('gaugeVal3');

  if (!infoTitle) return;

  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  const category = tab.getAttribute('data-category');
  const data = inspectorData[category];
  if (!data) return;

  infoTitle.textContent = data.title;
  infoDesc.textContent = data.desc;

  if (checksList) {
    checksList.innerHTML = data.checks.map(c => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        ${c}
      </li>
    `).join('');
  }

  if (statusBadge) {
    statusBadge.textContent = data.status;
    statusBadge.style.color = data.statusColor;
  }

  if (bar1 && label1) {
    bar1.style.width = data.g1.width;
    bar1.className = 'gauge-bar-fill' + (data.g1.danger ? ' danger' : '');
    label1.textContent = data.g1.val;
  }
  if (bar2 && label2) {
    bar2.style.width = data.g2.width;
    bar2.className = 'gauge-bar-fill' + (data.g2.danger ? ' danger' : '');
    label2.textContent = data.g2.val;
  }
  if (bar3 && label3) {
    bar3.style.width = data.g3.width;
    bar3.className = 'gauge-bar-fill' + (data.g3.danger ? ' danger' : '');
    label3.textContent = data.g3.val;
  }
}

function handleCopyServerIP() {
  const ipTextEl = document.getElementById('serverIpText');
  const toast = document.getElementById('toastNotice');
  const serverIP = ipTextEl ? ipTextEl.textContent.trim() : 'mc.icelite.gg';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(serverIP)
      .then(showToast)
      .catch(() => fallbackCopy(serverIP));
  } else {
    fallbackCopy(serverIP);
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast();
    } catch (e) {
      console.warn('Copy failed', e);
    }
    document.body.removeChild(textArea);
  }

  function showToast() {
    if (!toast) return;
    toast.textContent = `Server IP copied! (${serverIP})`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

function initBlurControl() {
  const blurSlider = document.getElementById('blurRange');
  const blurValueText = document.getElementById('blurValue');
  const heroOverlay = document.querySelector('.hero-blur-overlay');

  if (!blurSlider || !heroOverlay || blurSlider.dataset.bound === 'true') return;
  blurSlider.dataset.bound = 'true';

  blurSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    document.documentElement.style.setProperty('--hero-blur-amount', `${val}px`);
    if (blurValueText) blurValueText.textContent = `${val}px`;
  });
}

function initHeroCanvas() {
  const canvas = document.getElementById('iceGridCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();

  if (!canvas.dataset.resizeBound) {
    canvas.dataset.resizeBound = 'true';
    window.addEventListener('resize', resize);
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.03
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const gridSize = 65;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.alpha += Math.sin(Date.now() * 0.002 + i) * 0.005;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    canvasAnimId = requestAnimationFrame(render);
  }

  render();
}

function initTelemetryStream() {
  const terminalBody = document.getElementById('terminalLog');
  if (!terminalBody) return;

  const mockEvents = [
    { type: 'SCAN', text: 'PacketPlayInFlying -> Player "PvP_Master" tick=20.0 (OK)', class: 'term-safe' },
    { type: 'FLAG', text: 'Reach.A (distance=3.38m, max=3.00m, ping=22ms) -> CANCELED', class: 'term-flag' },
    { type: 'SCAN', text: 'PacketPlayInPosition -> Player "ShadowCrafter" deltaY=0.42 (Normal)', class: 'term-safe' },
    { type: 'FLAG', text: 'Killaura.Rotations (snap=74.3°, heuristic=99.2%) VL: 18/20', class: 'term-flag' },
    { type: 'WARN', text: 'BadPackets.Order (sequence desync from 185.12.92.1) -> Suppressed', class: 'term-warn' },
    { type: 'ACTION', text: 'Sanction -> Dispatched silent freeze & Discord webhook', class: 'term-action' },
    { type: 'SCAN', text: 'Timer.A (tick_speed=1.002, jitter=0.001) -> Stable', class: 'term-safe' },
    { type: 'FLAG', text: 'Speed.B (friction=0.982, ground_spoof=true) VL: 15 -> Setback', class: 'term-flag' },
    { type: 'SCAN', text: 'FastBreak.B (hardness=1.5, ticks=32) -> Legal block interaction', class: 'term-safe' },
    { type: 'FLAG', text: 'Autoclicker.CPS (cps=24.2, stddev=0.18) -> Macro detected', class: 'term-flag' }
  ];

  let currentIndex = 0;

  function addLogLine() {
    const event = mockEvents[currentIndex % mockEvents.length];
    currentIndex++;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="term-time">[${timeStr}]</span>
      <span class="term-prefix">[ICELITE]</span>
      <span class="${event.class}">${event.text}</span>
    `;

    terminalBody.appendChild(line);

    if (terminalBody.children.length > 25) {
      terminalBody.removeChild(terminalBody.children[0]);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  telemetryTimer = setInterval(addLogLine, 2400);
}

function initCounters() {
  const metricElements = document.querySelectorAll('.metric-number[data-target]');
  if (!metricElements.length) return;

  if (!('IntersectionObserver' in window)) {
    metricElements.forEach(el => {
      const target = el.getAttribute('data-target');
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = `${prefix}${target}${suffix}`;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = String(target).includes('.');
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;

          if (isDecimal) {
            el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
          } else {
            el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  metricElements.forEach(el => observer.observe(el));
}
