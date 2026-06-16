// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open'); mobileNav.classList.remove('open');
  }));
}

// ===== LANGUAGE TOGGLE =====
let currentLang = 'vi';
const langBtns = document.querySelectorAll('.lang-toggle button');
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-vi]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) el.innerHTML = txt;
  });
  const emailInput = document.querySelector('.newsletter-form input[type="email"]');
  if (emailInput) emailInput.placeholder = lang === 'en' ? 'Your email address' : 'Email của bạn';
}
langBtns.forEach(btn => btn.addEventListener('click', () => {
  langBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyLang(btn.dataset.lang);
}));

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== STICKY HEADER SHADOW =====
const headerEl = document.querySelector('header');
if (headerEl) {
  window.addEventListener('scroll', () => {
    headerEl.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)';
  }, { passive: true });
}

// ===== NEWSLETTER =====
function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = currentLang === 'en' ? 'Subscribed! ✓' : 'Đã đăng ký! ✓';
  btn.style.background = '#39B54A';
  setTimeout(() => { btn.textContent = currentLang === 'en' ? 'Subscribe' : 'Đăng ký'; btn.style.background = ''; e.target.reset(); }, 3000);
}

// ===== CONTACT FORM =====
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '✓ Đã gửi thành công!';
  btn.style.background = '#39B54A';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; e.target.reset(); }, 4000);
}

// ===== TAB FILTER =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.products-tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
