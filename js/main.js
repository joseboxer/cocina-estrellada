/**
 * Cocina Estrellada — Interactividad y animaciones
 */

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========== SCROLL REVEAL ==========
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const isVisible = entry.target.classList.contains('is-visible');
            if (isVisible) {
                if (entry.intersectionRatio < 0.05) entry.target.classList.remove('is-visible');
            } else {
                if (entry.intersectionRatio >= 0.15) entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: [0, 0.15, 0.5, 1], rootMargin: '0px 0px -50px 0px' });

    function initReveal() {
        if (prefersReducedMotion) return;
        let index = 0;
        document.querySelectorAll('.reveal').forEach((el) => {
            el.style.transitionDelay = `${(index % 6) * 0.08}s`;
            revealObserver.observe(el);
            index++;
        });
    }

    // ========== MOBILE NAV ==========
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');

    if (navToggle && header) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            header.classList.toggle('nav-open');
            document.documentElement.classList.toggle('nav-open', !isOpen);
            document.body.classList.toggle('nav-open', !isOpen);
            document.body.style.overflow = isOpen ? '' : 'hidden';
            if (!isOpen) window.scrollTo(0, 0);
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                header.classList.remove('nav-open');
                document.documentElement.classList.remove('nav-open');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });
    }

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== FORM ==========
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.removeAttribute('hidden');
        toast.classList.add('is-visible');
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.setAttribute('hidden', ''), 300);
        }, 3000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit span');
            const originalText = btn.textContent;
            btn.textContent = 'Enviando…';
            contactForm.querySelector('.btn-submit').disabled = true;

            setTimeout(() => {
                btn.textContent = '¡Enviado! ✨';
                contactForm.reset();
                showToast('¡Mensaje enviado! Te responderemos pronto ✨');
                setTimeout(() => {
                    btn.textContent = originalText;
                    contactForm.querySelector('.btn-submit').disabled = false;
                }, 2000);
            }, 800);
        });
    }

    // ========== HEADER SCROLL ==========
    let lastScroll = 0;
    function updateHeader() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header?.classList.add('header--scrolled');
        } else {
            header?.classList.remove('header--scrolled');
        }
        lastScroll = scrollY;
    }

    // ========== INIT ==========
    function init() {
        initReveal();
        updateHeader();
        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateHeader);
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
