/* ============================================
   HALOVN — Checkout page
   - 2-column: customer form + order summary
   - Validate, tạo order ID, lưu localStorage, clear cart, redirect invoice
   ============================================ */
(() => {
  'use strict';

  const root = document.getElementById('checkout-root');
  if (!root) return;
  const fmt = window.HALOVN_formatPrice;
  const ORDERS_KEY = 'halovn_orders_v1';
  const FREESHIP_THRESHOLD = 1000000;

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Order ID & storage ---------- */
  function loadOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
    catch { return []; }
  }
  function saveOrders(list) {
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); } catch {}
  }
  function generateOrderId() {
    const d = new Date();
    const ymd = d.getFullYear().toString()
      + String(d.getMonth() + 1).padStart(2, '0')
      + String(d.getDate()).padStart(2, '0');
    const prefix = `HALO-${ymd}-`;
    // Tìm số đơn cao nhất trong ngày → +1
    const orders = loadOrders();
    const todayMax = orders
      .filter(o => o.id && o.id.startsWith(prefix))
      .map(o => parseInt(o.id.slice(prefix.length), 10) || 0)
      .reduce((a, b) => Math.max(a, b), 0);
    return prefix + String(todayMax + 1).padStart(3, '0');
  }

  /* ---------- Render ---------- */
  function render() {
    const items = window.HALOVN_CART.items();
    const subtotal = window.HALOVN_CART.total();

    // Empty cart guard
    if (items.length === 0) {
      root.innerHTML = `
        ${breadcrumb()}
        <h1 class="checkout-title">Thanh toán</h1>
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Không có sản phẩm nào để thanh toán</h2>
          <p>Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
          <a href="products.html" class="btn btn--primary btn--lg">← Quay lại trang sản phẩm</a>
        </div>
      `;
      return;
    }

    const isFreeship = subtotal >= FREESHIP_THRESHOLD;

    root.innerHTML = `
      ${breadcrumb()}
      <h1 class="checkout-title">Thanh toán đơn hàng</h1>

      <form class="checkout-grid" id="checkout-form" novalidate>
        <!-- LEFT: customer form -->
        <div class="checkout-form">
          <section class="checkout-card">
            <h2 class="checkout-card__title">1. Thông tin khách hàng</h2>
            <div class="form__row">
              <div class="field">
                <label for="co-name">Họ và tên *</label>
                <input id="co-name" name="name" type="text" required autocomplete="name" />
                <small class="field__error" data-error-for="name"></small>
              </div>
              <div class="field">
                <label for="co-phone">Số điện thoại *</label>
                <input id="co-phone" name="phone" type="tel" inputmode="numeric" required autocomplete="tel" />
                <small class="field__error" data-error-for="phone"></small>
              </div>
            </div>
            <div class="field">
              <label for="co-email">Email</label>
              <input id="co-email" name="email" type="email" autocomplete="email" placeholder="(không bắt buộc)" />
              <small class="field__error" data-error-for="email"></small>
            </div>
          </section>

          <section class="checkout-card">
            <h2 class="checkout-card__title">2. Phương thức nhận hàng</h2>
            <div class="radio-group">
              <label class="radio-card">
                <input type="radio" name="shipping_method" value="delivery" checked />
                <div class="radio-card__body">
                  <strong>Giao hàng tận nơi</strong>
                  <span>HALOVN giao đến địa chỉ bạn cung cấp (1–3 ngày).</span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="shipping_method" value="pickup" />
                <div class="radio-card__body">
                  <strong>Nhận tại kho/cửa hàng</strong>
                  <span>58 NV1 Tổng Cục 5, Tân Triều, Thanh Trì, Hà Nội — T2–T7, 8h–17h30.</span>
                </div>
              </label>
            </div>
          </section>

          <section class="checkout-card" id="address-section">
            <h2 class="checkout-card__title">3. Địa chỉ nhận hàng</h2>
            <div class="form__row">
              <div class="field">
                <label for="co-province">Tỉnh / Thành phố</label>
                <input id="co-province" name="province" type="text" autocomplete="address-level1" placeholder="VD: Hà Nội" />
              </div>
              <div class="field">
                <label for="co-district">Quận / Huyện</label>
                <input id="co-district" name="district" type="text" autocomplete="address-level2" placeholder="VD: Thanh Xuân" />
              </div>
            </div>
            <div class="field">
              <label for="co-address">Địa chỉ nhận hàng *</label>
              <input id="co-address" name="address" type="text" autocomplete="street-address" placeholder="Số nhà, tên đường, phường/xã" />
              <small class="field__error" data-error-for="address"></small>
            </div>
            <div class="field">
              <label for="co-note">Ghi chú đơn hàng</label>
              <textarea id="co-note" name="note" rows="3" placeholder="VD: Giao giờ hành chính, gọi trước khi đến..."></textarea>
            </div>
          </section>

          <section class="checkout-card">
            <h2 class="checkout-card__title">4. Phương thức thanh toán</h2>
            <div class="radio-group">
              <label class="radio-card">
                <input type="radio" name="payment_method" value="cod" checked />
                <div class="radio-card__body">
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <span>Kiểm tra hàng và thanh toán bằng tiền mặt khi shipper giao.</span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="payment_method" value="bank" />
                <div class="radio-card__body">
                  <strong>Chuyển khoản ngân hàng</strong>
                  <span>HALOVN sẽ gửi thông tin tài khoản qua SMS/email sau khi xác nhận đơn.</span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="payment_method" value="contact" />
                <div class="radio-card__body">
                  <strong>Liên hệ tư vấn</strong>
                  <span>Đại lý sỉ hoặc đơn lớn — HALOVN gọi xác nhận và thoả thuận chi tiết.</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <!-- RIGHT: summary -->
        <aside class="checkout-summary">
          <h2 class="checkout-summary__title">Tóm tắt đơn hàng</h2>

          <div class="checkout-items">
            ${items.map(renderItem).join('')}
          </div>

          <div class="checkout-summary__rows">
            <div class="cart-summary__row">
              <span>Tạm tính</span>
              <strong>${fmt(subtotal)}</strong>
            </div>
            <div class="cart-summary__row" id="ship-row">
              <span>Phí vận chuyển</span>
              <span id="ship-value">${isFreeship ? '<strong style="color:var(--c-green-dark)">Miễn phí</strong>' : '<span class="muted">Liên hệ</span>'}</span>
            </div>
            <div class="cart-summary__row cart-summary__total">
              <span>Tổng cộng</span>
              <strong>${fmt(subtotal)}</strong>
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--lg cart-summary__btn">
            Đặt hàng
          </button>
          <a href="cart.html" class="cart-summary__continue">← Quay lại giỏ hàng</a>

          <p class="checkout-summary__terms">
            Bằng việc bấm <strong>Đặt hàng</strong>, bạn đồng ý với <a href="#" onclick="return false">điều khoản mua hàng</a> của HALOVN.
          </p>
        </aside>
      </form>
    `;

    bindFormEvents(items, subtotal);
  }

  function breadcrumb() {
    return `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Trang chủ</a>
        <span class="breadcrumb__sep">/</span>
        <a href="cart.html">Giỏ hàng</a>
        <span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">Thanh toán</span>
      </nav>
    `;
  }

  function renderItem(it) {
    const lineTotal = it.price * it.qty;
    const placeholder = `<svg viewBox="0 0 100 100" fill="#00AEEF"><rect x="30" y="20" width="40" height="70" rx="6"/><rect x="35" y="10" width="30" height="15" rx="3" fill="#1A2B4A"/></svg>`;
    return `
      <article class="checkout-item">
        <div class="checkout-item__img">
          ${it.image
            ? `<img src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy" onerror="this.outerHTML='${placeholder.replace(/'/g, "\\'")}'" />`
            : placeholder}
          <span class="checkout-item__qty">${it.qty}</span>
        </div>
        <div class="checkout-item__body">
          <div class="checkout-item__name">${esc(it.name)}</div>
          ${it.variantLabel ? `<div class="checkout-item__variant">Phân loại: ${esc(it.variantLabel)}</div>` : ''}
          <div class="checkout-item__price">${fmt(it.price)} × ${it.qty}</div>
        </div>
        <div class="checkout-item__line">${fmt(lineTotal)}</div>
      </article>
    `;
  }

  /* ---------- Form behaviour ---------- */
  function bindFormEvents(items, subtotal) {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    // Toggle address section khi đổi phương thức nhận hàng
    const shippingRadios = form.querySelectorAll('input[name="shipping_method"]');
    const addressSection = document.getElementById('address-section');
    function syncAddressVisibility() {
      const isPickup = form.elements.shipping_method.value === 'pickup';
      addressSection.style.display = isPickup ? 'none' : '';
    }
    shippingRadios.forEach(r => r.addEventListener('change', syncAddressVisibility));

    // Validate khi submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(form);
      const fd = new FormData(form);
      const data = {
        name:    (fd.get('name') || '').trim(),
        phone:   (fd.get('phone') || '').trim(),
        email:   (fd.get('email') || '').trim(),
        province:(fd.get('province') || '').trim(),
        district:(fd.get('district') || '').trim(),
        address: (fd.get('address') || '').trim(),
        note:    (fd.get('note') || '').trim(),
        shippingMethod: fd.get('shipping_method'),
        paymentMethod:  fd.get('payment_method'),
      };

      const errors = validate(data);
      if (Object.keys(errors).length) {
        showErrors(form, errors);
        return;
      }

      // Lưu đơn hàng
      const order = {
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        customer: data,
        items: items.map(it => ({
          slug: it.slug, name: it.name, brand: it.brand,
          variantLabel: it.variantLabel, image: it.image,
          price: it.price, qty: it.qty,
        })),
        totals: {
          subtotal,
          shipping: 0,
          total: subtotal,
        },
        status: 'pending',
      };

      const orders = loadOrders();
      orders.push(order);
      saveOrders(orders);

      // Clear cart
      window.HALOVN_CART.clearCart();

      // Redirect sang trang hoá đơn
      location.href = `invoice.html?id=${encodeURIComponent(order.id)}`;
    });
  }

  function validate(data) {
    const errors = {};
    if (!data.name) errors.name = 'Vui lòng nhập họ và tên';
    if (!data.phone) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[\d\s().+-]{8,15}$/.test(data.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email không đúng định dạng';
    }
    if (data.shippingMethod === 'delivery' && !data.address) {
      errors.address = 'Vui lòng nhập địa chỉ nhận hàng';
    }
    return errors;
  }

  function clearErrors(form) {
    form.querySelectorAll('.field__error').forEach(el => el.textContent = '');
    form.querySelectorAll('.field.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  }

  function showErrors(form, errors) {
    let firstInvalid = null;
    Object.entries(errors).forEach(([key, msg]) => {
      const err = form.querySelector(`[data-error-for="${key}"]`);
      const input = form.querySelector(`[name="${key}"]`);
      if (err) err.textContent = msg;
      if (input) {
        input.closest('.field').classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = input;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ---------- Init ---------- */
  render();
  // Cart trống có thể xảy ra nếu user thao tác từ tab khác → re-render
  window.addEventListener('cartchange', render);
})();
