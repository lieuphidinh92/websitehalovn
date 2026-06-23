/* ============================================
   HALOVN — Cart store (vanilla, persisted in localStorage)
   Exposes: window.HALOVN_CART
   API tương đương CartContext của React:
     - cartItems        → window.HALOVN_CART.items()
     - addToCart(p, q)  → window.HALOVN_CART.addToCart(product, qty, variantLabel)
     - removeFromCart   → removeFromCart(id)
     - increaseQuantity → increaseQuantity(id)
     - decreaseQuantity → decreaseQuantity(id)
     - updateQuantity   → updateQuantity(id, qty)
     - clearCart        → clearCart()
     - cartCount        → count()
     - cartTotal        → total()
   Sự kiện: 'cartchange' dispatch trên window mỗi khi giỏ thay đổi.
   ============================================ */
(() => {
  'use strict';

  const STORAGE_KEY = 'halovn_cart_v1';
  const MAX_QTY = 99;

  /* ---------- Internal state ---------- */
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
    } catch {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // localStorage có thể bị disable (private mode) — bỏ qua, giỏ chỉ còn trong session.
    }
    window.dispatchEvent(new CustomEvent('cartchange', { detail: snapshot() }));
  }

  function isValidItem(it) {
    return it && typeof it.id === 'string'
      && typeof it.slug === 'string'
      && typeof it.qty === 'number' && it.qty > 0;
  }

  function snapshot() {
    return {
      items: state.slice(),
      count: cartCount(),
      total: cartTotal(),
    };
  }

  /* ---------- Helpers ---------- */
  function makeId(slug, variantLabel) {
    return variantLabel ? `${slug}::${variantLabel}` : slug;
  }

  function findIndex(id) {
    return state.findIndex(it => it.id === id);
  }

  function clamp(n) {
    n = Math.floor(Number(n) || 0);
    return Math.max(1, Math.min(MAX_QTY, n));
  }

  /* ---------- Public API ---------- */
  function items() { return state.slice(); }

  function cartCount() {
    return state.reduce((s, it) => s + it.qty, 0);
  }

  function cartTotal() {
    return state.reduce((s, it) => s + it.price * it.qty, 0);
  }

  /**
   * Thêm sản phẩm vào giỏ. Nếu đã có (cùng slug + variant) thì tăng số lượng.
   * @param {object} product - sản phẩm từ HALOVN_PRODUCTS
   * @param {number} qty - số lượng (mặc định 1)
   * @param {string|null} variantLabel - nhãn phân loại (vd '90 viên'), nullable
   */
  function addToCart(product, qty = 1, variantLabel = null) {
    if (!product || !product.slug) return null;
    qty = clamp(qty);

    // Nếu SP có variants và caller không truyền — dùng default variant
    let price = product.price;
    let oldPrice = product.oldPrice || null;
    if (product.variants && product.variants.length) {
      const idx = variantLabel
        ? product.variants.findIndex(v => v.label === variantLabel)
        : (product.defaultVariant || 0);
      const v = product.variants[idx >= 0 ? idx : 0];
      if (v) {
        variantLabel = v.label;
        price = v.price;
        oldPrice = v.oldPrice || null;
      }
    }

    const id = makeId(product.slug, variantLabel);
    const existing = findIndex(id);
    if (existing >= 0) {
      state[existing].qty = clamp(state[existing].qty + qty);
    } else {
      state.push({
        id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: (product.images && product.images[0]) || '',
        variantLabel: variantLabel || null,
        price,
        oldPrice,
        qty,
      });
    }
    save();
    return state.find(it => it.id === id);
  }

  function removeFromCart(id) {
    const i = findIndex(id);
    if (i >= 0) { state.splice(i, 1); save(); }
  }

  function increaseQuantity(id) {
    const i = findIndex(id);
    if (i >= 0) { state[i].qty = clamp(state[i].qty + 1); save(); }
  }

  function decreaseQuantity(id) {
    const i = findIndex(id);
    if (i >= 0) {
      const next = state[i].qty - 1;
      if (next <= 0) state.splice(i, 1);
      else state[i].qty = next;
      save();
    }
  }

  function updateQuantity(id, qty) {
    const i = findIndex(id);
    if (i >= 0) { state[i].qty = clamp(qty); save(); }
  }

  function clearCart() {
    state = [];
    save();
  }

  /* ---------- Cross-tab sync ---------- */
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = load();
    window.dispatchEvent(new CustomEvent('cartchange', { detail: snapshot() }));
  });

  /* ---------- Expose ---------- */
  window.HALOVN_CART = {
    items, count: cartCount, total: cartTotal,
    addToCart, removeFromCart,
    increaseQuantity, decreaseQuantity,
    updateQuantity, clearCart,
  };

  /* ---------- UI: render badge số lượng trên header ---------- */
  function renderBadge() {
    const c = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = c > 99 ? '99+' : String(c);
      el.classList.toggle('is-empty', c === 0);
    });
  }
  document.addEventListener('DOMContentLoaded', renderBadge);
  window.addEventListener('cartchange', renderBadge);

  /* ---------- Toast helper (thông báo) ---------- */
  let toastTimer = null;
  function showToast(message, type = 'success') {
    let toast = document.getElementById('halovn-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'halovn-toast';
      toast.className = 'halovn-toast';
      document.body.appendChild(toast);
    }
    toast.dataset.type = type;
    toast.innerHTML = `
      <span class="halovn-toast__icon">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span class="halovn-toast__msg"></span>
    `;
    toast.querySelector('.halovn-toast__msg').textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }
  window.HALOVN_CART.toast = showToast;
})();
