/* ============================================
   HALOVN — Cart page renderer
   Render danh sách item trong giỏ vào #cart-root
   ============================================ */
(() => {
  'use strict';

  const root = document.getElementById('cart-root');
  if (!root) return;
  const fmt = window.HALOVN_formatPrice;

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function render() {
    const items = window.HALOVN_CART.items();
    const count = window.HALOVN_CART.count();
    const total = window.HALOVN_CART.total();

    // Breadcrumb dùng chung cho cả 2 state
    const breadcrumb = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Trang chủ</a>
        <span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">Giỏ hàng</span>
      </nav>
    `;

    if (items.length === 0) {
      root.innerHTML = `
        ${breadcrumb}
        <h1 class="cart-title">Giỏ hàng của bạn</h1>
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Khám phá hơn 80 sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới.</p>
          <a href="products.html" class="btn btn--primary btn--lg">← Quay lại trang sản phẩm</a>
        </div>
      `;
      return;
    }

    // Phí vận chuyển: freeship nếu đơn ≥ 1 triệu, ngược lại tạm để 0đ + ghi chú "Liên hệ"
    const FREESHIP_THRESHOLD = 1000000;
    const isFreeship = total >= FREESHIP_THRESHOLD;
    const shippingHTML = isFreeship
      ? '<strong style="color:var(--c-green-dark)">Miễn phí</strong>'
      : '<span class="muted">Liên hệ</span>';
    const grandTotal = total; // shipping = 0 ở giai đoạn này, finalize ở checkout

    root.innerHTML = `
      ${breadcrumb}
      <h1 class="cart-title">Giỏ hàng của bạn <span class="cart-title__count">(${count} sản phẩm)</span></h1>

      <div class="cart-grid">
        <div class="cart-items">
          ${items.map(renderItem).join('')}
          <div class="cart-actions-bottom">
            <a href="products.html" class="btn btn--outline">← Tiếp tục mua hàng</a>
            <button class="btn btn--ghost" id="cart-clear" type="button">Xoá toàn bộ giỏ</button>
          </div>
        </div>

        <aside class="cart-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div class="cart-summary__row">
            <span>Tạm tính (${count} sản phẩm)</span>
            <strong>${fmt(total)}</strong>
          </div>
          <div class="cart-summary__row">
            <span>Phí vận chuyển</span>
            ${shippingHTML}
          </div>
          <div class="cart-summary__row cart-summary__total">
            <span>Tổng cộng</span>
            <strong>${fmt(grandTotal)}</strong>
          </div>
          <p class="cart-summary__note">${
            isFreeship
              ? '✓ Đơn hàng đủ điều kiện freeship toàn quốc.'
              : 'Freeship cho đơn từ <strong>1.000.000đ</strong>. Còn thiếu <strong>' + fmt(FREESHIP_THRESHOLD - total) + '</strong>.'
          }</p>
          <a href="checkout.html" class="btn btn--primary btn--lg cart-summary__btn">Tiến hành thanh toán →</a>
          <a href="products.html" class="cart-summary__continue">← Tiếp tục mua hàng</a>
          <a href="wholesale.html#register" class="cart-summary__wholesale">Hoặc đăng ký lấy giá sỉ →</a>
        </aside>
      </div>
    `;

    // Bind events
    root.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleAction);
    });
    root.querySelectorAll('.cart-item__qty-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const v = parseInt(e.target.value, 10) || 1;
        window.HALOVN_CART.updateQuantity(id, v);
      });
    });
    const clearBtn = document.getElementById('cart-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Xoá toàn bộ giỏ hàng?')) window.HALOVN_CART.clearCart();
      });
    }
  }

  function renderItem(it) {
    const lineTotal = it.price * it.qty;
    const placeholder = `<svg viewBox="0 0 100 100" fill="#00AEEF"><rect x="30" y="20" width="40" height="70" rx="6"/><rect x="35" y="10" width="30" height="15" rx="3" fill="#1A2B4A"/></svg>`;
    return `
      <article class="cart-item">
        <a href="product.html?slug=${esc(it.slug)}" class="cart-item__img">
          ${it.image
            ? `<img src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy" onerror="this.outerHTML='${placeholder.replace(/'/g, "\\'")}'" />`
            : placeholder}
        </a>
        <div class="cart-item__body">
          <div class="cart-item__brand">${esc(it.brand || '')}</div>
          <a href="product.html?slug=${esc(it.slug)}" class="cart-item__name">${esc(it.name)}</a>
          ${it.variantLabel ? `<div class="cart-item__variant">Phân loại: <strong>${esc(it.variantLabel)}</strong></div>` : ''}
          <div class="cart-item__price">${fmt(it.price)} ${it.oldPrice ? `<s class="muted">${fmt(it.oldPrice)}</s>` : ''}</div>
        </div>

        <div class="cart-item__qty">
          <button class="cart-item__qty-btn" data-action="dec" data-id="${esc(it.id)}" aria-label="Giảm">−</button>
          <input class="cart-item__qty-input" type="number" min="1" max="99" value="${it.qty}" data-id="${esc(it.id)}" />
          <button class="cart-item__qty-btn" data-action="inc" data-id="${esc(it.id)}" aria-label="Tăng">+</button>
        </div>

        <div class="cart-item__line">
          <div class="cart-item__line-total">${fmt(lineTotal)}</div>
          <button class="cart-item__remove" data-action="remove" data-id="${esc(it.id)}" aria-label="Xoá sản phẩm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </article>
    `;
  }

  function handleAction(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'inc') window.HALOVN_CART.increaseQuantity(id);
    else if (action === 'dec') window.HALOVN_CART.decreaseQuantity(id);
    else if (action === 'remove') window.HALOVN_CART.removeFromCart(id);
  }

  render();
  window.addEventListener('cartchange', render);
})();
