let isBound = false;
let scrollTicking = false;

function initApp() {
  if (isBound) return;
  isBound = true;
  bindGlobalDelegation();
  initScrollReveal();
  initNavbarScroll();
  initScrollProgress();
  initHeroVideo();
  initHeroParallax();
}

function bindGlobalDelegation() {
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
      if (navLinks) navLinks.classList.remove('open');
      return;
    }

    const insideNav = e.target.closest('.navbar');
    if (!insideNav) {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    }
  }, { passive: false });
}

function handleFaqAccordionClick(trigger) {
  const currentItem = trigger.closest('.faq-item');
  if (!currentItem) return;
  const container = currentItem.closest('.faq-container') || document;
  const opening = !currentItem.classList.contains('active');

  container.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
    const button = item.querySelector('.faq-trigger');
    if (button) button.setAttribute('aria-expanded', 'false');
  });

  if (opening) {
    currentItem.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('reveal-active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-active');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

function initNavbarScroll() {
  const navWrapper = document.querySelector('.nav-wrapper');
  if (!navWrapper) return;

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      navWrapper.classList.toggle('nav-scrolled', y > 24);
      scrollTicking = false;
    });
  }, { passive: true });
}

function initScrollProgress() {
  const progress = document.querySelector('.scroll-progress span');
  if (!progress) return;

  let ticking = false;
  const update = () => {
    const root = document.documentElement;
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    progress.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };

  update();
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  const media = document.querySelector('.hero-media');
  const content = document.querySelector('.hero-content');
  if (!hero || !media || !content || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, hero.offsetHeight);
    const progress = Math.min(1, y / Math.max(1, hero.offsetHeight));
    media.style.transform = `translate3d(0, ${progress * 34}px, 0)`;
    content.style.transform = `translate3d(0, ${progress * -18}px, 0)`;
    content.style.opacity = `${1 - Math.min(.3, progress * .42)}`;
    ticking = false;
  };

  update();
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
