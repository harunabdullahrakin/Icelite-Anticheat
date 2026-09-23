let rotatorTimer = null;
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
  initHeroVideo();
}

function cleanupTimers() {
  if (rotatorTimer) {
    clearInterval(rotatorTimer);
    rotatorTimer = null;
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

function handleCopyServerIP() {
  const ipTextEl = document.getElementById('serverIpText');
  const toast = document.getElementById('toastNotice');
  const serverIP = ipTextEl ? ipTextEl.textContent.trim() : 'icelite.top';

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

    const time = Date.now() * 0.001;
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00f2fe';

    ctx.beginPath();
    for (let x = 0; x <= width; x += 10) {
      const y = height * 0.58 + Math.sin(x * 0.003 + time * 1.3) * 38 + Math.cos(x * 0.0016 + time * 0.7) * 22;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.16)';
    ctx.stroke();

    ctx.beginPath();
    for (let x = 0; x <= width; x += 10) {
      const y = height * 0.68 + Math.sin(x * 0.0024 - time * 0.95) * 44 + Math.cos(x * 0.0038 + time * 1.05) * 24;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.stroke();
    ctx.restore();

    canvasAnimId = requestAnimationFrame(render);
  }

  render();
}

function initHeroVideo() {
  const video = document.querySelector('.hero-bg-video');
  if (!video) return;

  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      const startOnGesture = () => {
        video.play();
        window.removeEventListener('pointerdown', startOnGesture);
        window.removeEventListener('keydown', startOnGesture);
      };
      window.addEventListener('pointerdown', startOnGesture, { once: true });
      window.addEventListener('keydown', startOnGesture, { once: true });
    });
  }
}
