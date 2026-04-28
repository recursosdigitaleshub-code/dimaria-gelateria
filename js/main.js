/**
 * Dimaria Gelateria — Script principal
 * Vanilla JS · ES6+ · Modo estricto · IIFE
 */
'use strict';

(() => {
  /* ============================================================
   *  1. NAVBAR — efecto scroll
   * ============================================================ */
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ============================================================
   *  2. MENÚ MÓVIL
   * ============================================================ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('navbar__toggle--open');
      navMenu.classList.toggle('navbar__menu--open');
      document.body.style.overflow = navMenu.classList.contains('navbar__menu--open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('navbar__toggle--open');
        navMenu.classList.remove('navbar__menu--open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
   *  3. SMOOTH SCROLL
   * ============================================================ */
  const NAVBAR_OFFSET = 80;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================================
   *  4. TABS DE SABORES
   * ============================================================ */
  const tabs = document.querySelectorAll('.sabores__tab');
  const panels = document.querySelectorAll('.sabores__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove('sabores__tab--active'));
      tab.classList.add('sabores__tab--active');

      panels.forEach((panel) => {
        panel.classList.toggle('sabores__panel--active', panel.dataset.panel === target);
      });
    });
  });

  /* ============================================================
   *  5. FORMULARIO DE CONTACTO
   * ============================================================ */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^(\+57\d{10}|\d{10})$/;

  function setError(field, isError) {
    field.classList.toggle('input--error', isError);
  }

  if (form) {
    form.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('input--error'));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nombre = form.querySelector('[name="nombre"]');
      const telefono = form.querySelector('[name="telefono"]');
      const email = form.querySelector('[name="email"]');
      const tipo = form.querySelector('[name="tipo"]');

      if (nombre && nombre.value.trim().length < 2) { setError(nombre, true); isValid = false; }

      if (telefono) {
        const cleaned = telefono.value.replace(/[\s\-().]/g, '');
        if (!PHONE_RE.test(cleaned)) { setError(telefono, true); isValid = false; }
      }

      if (email && email.value.trim() && !EMAIL_RE.test(email.value.trim())) {
        setError(email, true); isValid = false;
      }

      if (tipo && !tipo.value) { setError(tipo, true); isValid = false; }

      if (!status) return;
      status.classList.remove('form__status--success', 'form__status--error');

      if (isValid) {
        status.textContent = '¡Gracias! Te contactaremos en menos de 24 horas.';
        status.classList.add('form__status--success');
        setTimeout(() => {
          form.reset();
          status.textContent = '';
          status.classList.remove('form__status--success');
        }, 4000);
      } else {
        status.textContent = 'Por favor revisa los campos marcados.';
        status.classList.add('form__status--error');
      }
    });
  }

  /* ============================================================
   *  6. STICKY CTA BAR — aparece después del hero
   * ============================================================ */
  const stickyBar = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');

  if (stickyBar && hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyBar.classList.toggle('sticky-cta--visible', !entry.isIntersecting);
      },
      { rootMargin: '-100px 0px 0px 0px' }
    );
    observer.observe(hero);
  }

  /* ============================================================
   *  7. ANIMACIONES FADE-IN AL SCROLL
   * ============================================================ */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const fadeObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '-30px' }
    );
    fadeEls.forEach((el) => fadeObs.observe(el));
  }
})();
