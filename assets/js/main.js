/* ============================================
   HALOVN — Main JS (vanilla)
   - Mobile nav toggle
   - Active nav link
   - Scroll-reveal via IntersectionObserver
   - Product filter
   - Simple form handling (front-end only)
   ============================================ */

(() => {
  'use strict';

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close drawer when a link is clicked
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link based on current page ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Slight stagger within the same observer batch
          const delay = (entry.target.dataset.delay || (i * 80)) + 'ms';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback — show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Product filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products   = document.querySelectorAll('[data-category]');
  if (filterBtns.length && products.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        products.forEach(p => {
          const show = cat === 'all' || p.dataset.category === cat;
          p.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Forms (front-end only — show success message) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form__success');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* ---------- Make product image/name clickable → detail ---------- */
  document.querySelectorAll('.product').forEach((card) => {
    const buyLink = card.querySelector('.product__buy');
    if (!buyLink) return;
    const detailHref = buyLink.getAttribute('href');
    if (!detailHref || !detailHref.startsWith('product.html')) return;

    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't hijack clicks on the action buttons themselves
      if (e.target.closest('.product__actions')) return;
      location.href = detailHref;
    });
  });

  /* ---------- Hero banner carousel ---------- */
  const banner = document.getElementById('hero-banner');
  if (banner) {
    const imgs = banner.querySelectorAll('.hero__banner-img');
    const dots = banner.querySelectorAll('.hero__banner-dot');
    const total = imgs.length;
    let current = 0;
    let timer = null;

    function show(idx) {
      idx = ((idx % total) + total) % total;
      imgs.forEach((img, i) => img.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      current = idx;
    }
    function autoRotate() {
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), 5000);
    }

    // Dot click → chuyển slide + reset auto rotate
    dots.forEach((d) => {
      d.addEventListener('click', () => {
        show(parseInt(d.dataset.slide, 10));
        autoRotate();
      });
    });

    // Pause khi hover (UX tốt hơn)
    banner.addEventListener('mouseenter', () => clearInterval(timer));
    banner.addEventListener('mouseleave', autoRotate);

    autoRotate();
  }

  /* ---------- Footer year ---------- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
