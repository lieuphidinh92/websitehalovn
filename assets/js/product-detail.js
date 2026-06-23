/* ============================================
   HALOVN — Product detail page renderer
   Reads ?slug=... from URL, looks up products-data.js
   and renders the detail layout into #pd-root
   ============================================ */

(() => {
  'use strict';

  const root = document.getElementById('pd-root');
  if (!root) return;

  // Helpers ---------------------------------------------------------------
  const fmt = window.HALOVN_formatPrice;
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');

  if (!slug) return renderNotFound('Thiếu tham số sản phẩm.');

  const product = window.HALOVN_findProduct(slug);
  if (!product) return renderNotFound('Không tìm thấy sản phẩm với mã: ' + slug);

  // Update page metadata --------------------------------------------------
  document.title = product.name + ' — HALOVN';
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', product.shortDescription);

  // Render ----------------------------------------------------------------
  // Variant mặc định (nếu có) sẽ override giá hiển thị ban đầu
  const initialVariant = (product.variants && product.variants.length)
    ? product.variants[product.defaultVariant || 0] : null;
  const displayPrice    = initialVariant ? initialVariant.price    : product.price;
  const displayOldPrice = initialVariant ? initialVariant.oldPrice : product.oldPrice;
  const savePct =
    displayOldPrice && displayOldPrice > displayPrice
      ? Math.round((1 - displayPrice / displayOldPrice) * 100)
      : 0;

  const placeholderSvg = categoryPlaceholder(product.category);

  root.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Trang chủ</a>
      <span class="breadcrumb__sep">/</span>
      <a href="products.html">Sản phẩm</a>
      <span class="breadcrumb__sep">/</span>
      <a href="products.html#${product.category}">${esc(product.categoryLabel)}</a>
      <span class="breadcrumb__sep">/</span>
      <span class="breadcrumb__current">${esc(product.name)}</span>
    </nav>

    <!-- Main grid -->
    <section class="pd-grid">
      <!-- Gallery -->
      <div>
        <div class="pd-gallery__main" id="pd-main-img" tabindex="0" aria-label="Thư viện ảnh — dùng ← →">
          ${renderImage(product.images[0], placeholderSvg, product.name)}
          ${product.images.length > 1 ? `
            <button type="button" class="pd-gallery__arrow pd-gallery__arrow--prev" id="pd-arrow-prev" aria-label="Ảnh trước">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button type="button" class="pd-gallery__arrow pd-gallery__arrow--next" id="pd-arrow-next" aria-label="Ảnh kế tiếp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <div class="pd-gallery__counter" id="pd-counter">1 / ${product.images.length}</div>
          ` : ''}
        </div>
        ${product.images.length > 1 ? `
        <div class="pd-gallery__thumbs" id="pd-thumbs">
          ${product.images.map((src, i) => `
            <button class="pd-thumb ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Ảnh ${i + 1}">
              ${renderImage(src, placeholderSvg, product.name + ' — ảnh ' + (i + 1))}
            </button>
          `).join('')}
        </div>` : ''}
      </div>

      <!-- Info -->
      <div>
        <!-- Top row: chính hãng + brand -->
        <div class="pd-toprow">
          <span class="pd-genuine">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Chính hãng
          </span>
          <span class="pd-brand-tag">Thương hiệu: <strong>${esc(product.brand)}</strong></span>
        </div>

        <h1 class="pd-title-lg">${esc(product.name)}</h1>

        <div class="pd-meta-line">
          <span>Yêu thích: <strong>${favoritesCount(product.id)}</strong></span>
        </div>

        <!-- Certificate badge -->
        <div class="pd-cert-badge">
          <div class="pd-cert-badge__icon"><span>SP</span></div>
          <div class="pd-cert-badge__txt">
            <strong>SẢN PHẨM CHÍNH HÃNG</strong>
            <small>TRA CỨU →</small>
          </div>
        </div>
        <a href="#" class="pd-cert-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Xem giấy công bố sản phẩm
        </a>

        <!-- Price card (giá đổi theo phân loại) -->
        <div class="pd-price-card">
          <div class="pd-price-now">
            <span class="pd-price-now__val" id="pd-price-val">${fmt(displayPrice)}</span>
            <span class="pd-price-now__unit">/ Hộp</span>
            <span class="pd-price-now__old" id="pd-price-old" ${displayOldPrice ? '' : 'hidden'}>${displayOldPrice ? fmt(displayOldPrice) : ''}</span>
            <span class="pd-price-now__save" id="pd-price-save" ${savePct ? '' : 'hidden'}>${savePct ? '-' + savePct + '%' : ''}</span>
          </div>
          <p class="pd-price-note">Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ được thể hiện khi đặt hàng.</p>
          <span class="pd-hot-tag">🔥 Đang bán chạy</span>
        </div>

        <!-- Variant (1 nút "Hộp" mặc định, hoặc list variants từ data) -->
        <div class="pd-variant">
          <span class="pd-variant__label">Phân loại sản phẩm</span>
          <div class="pd-variant__group" id="pd-variant-group">
            ${(product.variants && product.variants.length
              ? product.variants.map((v, i) => `
                <button type="button" class="pd-variant__btn ${i === (product.defaultVariant || 0) ? 'is-active' : ''}" data-variant="${i}">${esc(v.label)}</button>
              `).join('')
              : '<button type="button" class="pd-variant__btn is-active">Hộp</button>'
            )}
          </div>
        </div>

        <!-- Quantity -->
        <div class="pd-qty">
          <label for="pd-qty-input">Số lượng:</label>
          <div class="pd-qty__ctrl">
            <button type="button" class="pd-qty__btn" data-step="-1" aria-label="Giảm">−</button>
            <input id="pd-qty-input" class="pd-qty__input" type="number" value="1" min="1" max="99" />
            <button type="button" class="pd-qty__btn" data-step="1" aria-label="Tăng">+</button>
          </div>
        </div>

        <!-- CTA -->
        <div class="pd-cta">
          <button type="button" class="btn pd-cta__cart" id="pd-add-cart">
            🛒 Thêm vào giỏ
          </button>
          <button type="button" class="btn pd-cta__buy" id="pd-buy-now">
            Mua ngay
          </button>
        </div>

        <p style="margin-top:14px; font-size:.85rem; color:var(--c-muted); text-align:center">
          Hoặc <a href="wholesale.html#register" style="color:var(--c-primary); font-weight:600">liên hệ lấy giá sỉ →</a>
        </p>

        <!-- Quick info -->
        <div class="pd-quickinfo" style="margin-top:20px">
          <dl>
            <div><dt>Danh mục</dt><dd>${esc(product.categoryLabel)}</dd></div>
            <div><dt>Thương hiệu</dt><dd>${esc(product.brand)}</dd></div>
            <div><dt>Xuất xứ</dt><dd>${esc(extractCountry(product.manufacturer))}</dd></div>
            <div><dt>Mã sản phẩm</dt><dd>${esc(product.sku)}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Detail sections -->
    <section style="margin-bottom: 48px">
      <div class="pd-section">
        <h2>Mô tả sản phẩm</h2>
        <p>${esc(product.details)}</p>
      </div>

      <div class="pd-section">
        <h2>Thành phần</h2>
        <p>${esc(product.ingredients)}</p>
      </div>

      <div class="pd-section">
        <h2>Công dụng</h2>
        <ul>
          ${(product.benefits || []).map(b => `<li>${esc(b)}</li>`).join('')}
        </ul>
      </div>

      <div class="pd-section">
        <h2>Cách sử dụng</h2>
        <p>${esc(product.usage)}</p>
      </div>

      <div class="pd-section">
        <h2>Lưu ý</h2>
        <p>${esc(product.note)}</p>
      </div>

      <div class="pd-section">
        <h2>Thông tin sản xuất</h2>
        <p>${esc(product.manufacturer)}</p>
      </div>

      <div class="pd-section">
        <h2>Hỏi đáp & Đánh giá</h2>
        ${(product.reviews && product.reviews.length) ? product.reviews.map(r => `
          <div class="pd-review">
            <div class="pd-review__head">
              <span class="pd-review__name">${esc(r.name)}</span>
              <span class="pd-review__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
            </div>
            <p class="pd-review__comment">${esc(r.comment)}</p>
          </div>
        `).join('') : '<p class="pd-empty">Chưa có đánh giá. Hãy là người đầu tiên đánh giá sản phẩm này!</p>'}
      </div>
    </section>
  `;

  // Interactions ----------------------------------------------------------
  // Gallery: arrow + thumb + keyboard + swipe
  const galleryMain   = document.getElementById('pd-main-img');
  const prevBtn       = document.getElementById('pd-arrow-prev');
  const nextBtn       = document.getElementById('pd-arrow-next');
  const counterEl     = document.getElementById('pd-counter');
  const thumbsWrap    = document.getElementById('pd-thumbs');
  const thumbEls      = thumbsWrap ? [...thumbsWrap.querySelectorAll('.pd-thumb')] : [];
  const totalImages   = product.images.length;
  let activeIndex     = 0;

  function showImage(idx, dir = 0) {
    if (totalImages <= 1) return;
    const target = (idx + totalImages) % totalImages; // wrap-around
    if (target === activeIndex) return;

    // Direction tự suy luận nếu không truyền vào
    if (dir === 0) {
      const forward = (target - activeIndex + totalImages) % totalImages;
      dir = forward <= totalImages / 2 ? 1 : -1;
    }
    activeIndex = target;

    // Rebuild ảnh chính + áp dụng animation slide trái/phải
    const overlays = galleryMain.querySelectorAll('.pd-gallery__arrow, .pd-gallery__counter');
    galleryMain.innerHTML = renderImage(product.images[target], placeholderSvg, product.name);
    overlays.forEach((el) => galleryMain.appendChild(el));

    const img = galleryMain.querySelector('img');
    if (img) img.classList.add(dir > 0 ? 'is-slide-right' : 'is-slide-left');

    if (counterEl) counterEl.textContent = `${target + 1} / ${totalImages}`;

    // Update thumb highlight & scroll into view
    thumbEls.forEach((t, i) => t.classList.toggle('is-active', i === target));
    const activeThumb = thumbEls[target];
    if (activeThumb && thumbsWrap) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showImage(activeIndex - 1, -1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(activeIndex + 1,  1));

  thumbEls.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.dataset.index, 10);
      const dir = idx > activeIndex ? 1 : -1;
      showImage(idx, dir);
    });
  });

  // Keyboard ← → when focus inside gallery
  if (galleryMain) {
    galleryMain.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { showImage(activeIndex - 1, -1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { showImage(activeIndex + 1,  1); e.preventDefault(); }
    });
  }

  // Touch swipe
  if (galleryMain && totalImages > 1) {
    let touchStartX = 0;
    galleryMain.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    galleryMain.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) showImage(activeIndex + 1,  1);
      else        showImage(activeIndex - 1, -1);
    }, { passive: true });
  }

  // Variant switching — đổi giá theo phân loại
  const variantGroup = document.getElementById('pd-variant-group');
  const priceVal     = document.getElementById('pd-price-val');
  const priceOld     = document.getElementById('pd-price-old');
  const priceSave    = document.getElementById('pd-price-save');
  let activeVariant  = (product.variants && product.variants.length)
    ? (product.defaultVariant || 0) : null;

  if (variantGroup && product.variants && product.variants.length) {
    variantGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.pd-variant__btn');
      if (!btn || !btn.dataset.variant) return;
      const idx = parseInt(btn.dataset.variant, 10);
      const v = product.variants[idx];
      activeVariant = idx;

      // Highlight active
      variantGroup.querySelectorAll('.pd-variant__btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Update price display
      priceVal.textContent = fmt(v.price);
      if (v.oldPrice) {
        priceOld.textContent = fmt(v.oldPrice);
        priceOld.removeAttribute('hidden');
        const pct = Math.round((1 - v.price / v.oldPrice) * 100);
        priceSave.textContent = `-${pct}%`;
        priceSave.removeAttribute('hidden');
      } else {
        priceOld.setAttribute('hidden', '');
        priceSave.setAttribute('hidden', '');
      }
    });
  }

  // Quantity buttons
  const qtyInput = document.getElementById('pd-qty-input');
  root.querySelectorAll('.pd-qty__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      let v = parseInt(qtyInput.value, 10) || 1;
      v = Math.max(1, Math.min(99, v + step));
      qtyInput.value = v;
    });
  });

  // Hiện variant label được chọn (string|null)
  function currentVariantLabel() {
    if (activeVariant == null || !product.variants) return null;
    return product.variants[activeVariant].label;
  }

  // Add to cart — dùng cart store, hiện toast
  document.getElementById('pd-add-cart').addEventListener('click', () => {
    if (!window.HALOVN_CART) {
      alert('Không tải được giỏ hàng. Vui lòng tải lại trang.');
      return;
    }
    const qty = parseInt(qtyInput.value, 10) || 1;
    window.HALOVN_CART.addToCart(product, qty, currentVariantLabel());
    const vlabel = currentVariantLabel();
    const suffix = vlabel ? ` (${vlabel})` : '';
    window.HALOVN_CART.toast(`✓ Đã thêm ${qty} × ${product.name}${suffix} vào giỏ`);
  });

  // Buy now → add vào giỏ rồi chuyển sang trang Giỏ hàng
  const buyNowBtn = document.getElementById('pd-buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      if (!window.HALOVN_CART) return;
      const qty = parseInt(qtyInput.value, 10) || 1;
      window.HALOVN_CART.addToCart(product, qty, currentVariantLabel());
      location.href = 'cart.html';
    });
  }


  // Helper functions ------------------------------------------------------
  function renderNotFound(msg) {
    root.innerHTML = `
      <section style="padding: 80px 0; text-align:center;">
        <h1 style="color:var(--c-navy)">Không tìm thấy sản phẩm</h1>
        <p style="color:var(--c-muted)">${esc(msg)}</p>
        <a href="products.html" class="btn btn--primary" style="margin-top:16px">← Quay lại danh sách sản phẩm</a>
      </section>
    `;
  }

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Bỏ inline onerror — dùng event delegation an toàn (tránh bug dấu " trong SVG)
  function renderImage(src, fallbackSvg, alt) {
    return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" data-pd-fallback="1" />`;
  }

  function categoryPlaceholder(cat) {
    const colors = {
      supplement: '#00AEEF',
      'mom-baby': '#39B54A',
      senior:    '#1A2B4A',
      beauty:    '#39B54A',
    };
    const fill = colors[cat] || '#00AEEF';
    return `<svg viewBox="0 0 100 100" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="20" width="40" height="70" rx="6"/><rect x="35" y="10" width="30" height="15" rx="3" fill="#1A2B4A"/></svg>`;
  }

  // Event delegation cho ảnh lỗi — chỉ áp dụng trong vùng #pd-root
  if (root) {
    root.addEventListener('error', (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (!img.dataset.pdFallback) return;
      const wrapper = document.createElement('span');
      wrapper.innerHTML = placeholderSvg;
      const svg = wrapper.firstElementChild;
      if (svg) img.replaceWith(svg);
    }, true);
  }

  // Deterministic "yêu thích" count from product id (mock số liệu — luôn giống nhau cho mỗi SP)
  function favoritesCount(id) {
    const base = ((id || 1) * 7919) % 95000 + 5000; // 5k–100k
    if (base >= 1000) return (base / 1000).toFixed(1) + 'k';
    return String(base);
  }

  function extractCountry(manufacturer) {
    if (!manufacturer) return 'Đang cập nhật';
    // Try to pull the country from text like "...Ltd., Australia — ..."
    const m = manufacturer.match(/,\s*([^—.,]+?)(?:\s*[—.,]|$)/);
    return m ? m[1].trim() : manufacturer;
  }
})();
