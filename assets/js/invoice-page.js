/* ============================================
   HALOVN — Invoice / Order success page
   Đọc orderId từ URL ?id=..., lấy data trong localStorage,
   render hoá đơn + nút in.
   ============================================ */
(() => {
  'use strict';

  const root = document.getElementById('invoice-root');
  if (!root) return;
  const fmt = window.HALOVN_formatPrice || ((n) => (n || 0).toLocaleString('vi-VN') + 'đ');
  const ORDERS_KEY = 'halovn_orders_v1';

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function loadOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
    catch { return []; }
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function shippingLabel(method) {
    return method === 'pickup'
      ? 'Nhận tại kho/cửa hàng HALOVN'
      : 'Giao hàng tận nơi';
  }
  function paymentLabel(method) {
    if (method === 'bank') return 'Chuyển khoản ngân hàng';
    if (method === 'contact') return 'Liên hệ tư vấn';
    return 'Thanh toán khi nhận hàng (COD)';
  }

  /* ---------- Render ---------- */
  const params = new URLSearchParams(location.search);
  const orderId = params.get('id');

  if (!orderId) return renderNotFound('Thiếu mã đơn hàng trong URL.');

  const order = loadOrders().find(o => o.id === orderId);
  if (!order) return renderNotFound(`Không tìm thấy đơn hàng "${orderId}". Có thể đơn đã bị xoá hoặc localStorage đã bị làm mới.`);

  document.title = `Hoá đơn ${order.id} — HALOVN`;
  renderInvoice(order);

  function renderInvoice(o) {
    const c = o.customer || {};
    const fullAddress = [c.address, c.district, c.province].filter(Boolean).join(', ');

    root.innerHTML = `
      <!-- Success banner — không in -->
      <div class="invoice-success no-print">
        <div class="invoice-success__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="invoice-success__body">
          <h1>Đặt hàng thành công!</h1>
          <p>Cảm ơn anh/chị đã tin tưởng HALOVN. Mã đơn hàng: <strong>${esc(o.id)}</strong></p>
          <p>HALOVN sẽ liên hệ xác nhận trong vòng 24h qua số <strong>${esc(c.phone)}</strong>.</p>
        </div>
      </div>

      <!-- Invoice document — phần in được -->
      <article class="invoice-doc">
        <header class="invoice-head">
          <div class="invoice-head__brand">
            <img src="assets/images/logo/logo.png" alt="HALOVN" />
            <div>
              <strong>Công ty TNHH HALOVN</strong>
              <small>58 NV1 Tổng Cục 5, Tân Triều, Thanh Trì, Hà Nội</small>
              <small>Hotline: 0818 685 222 · Email: admin@halo.com.vn</small>
            </div>
          </div>
          <div class="invoice-head__meta">
            <h2>HOÁ ĐƠN ĐẶT HÀNG</h2>
            <div><span>Mã đơn:</span> <strong>${esc(o.id)}</strong></div>
            <div><span>Ngày đặt:</span> <strong>${esc(fmtDate(o.createdAt))}</strong></div>
            <div><span>Trạng thái:</span> <span class="invoice-status">Chờ xác nhận</span></div>
          </div>
        </header>

        <section class="invoice-section invoice-info">
          <div>
            <h3>Người nhận</h3>
            <p><strong>${esc(c.name || '—')}</strong></p>
            <p>SĐT: ${esc(c.phone || '—')}</p>
            ${c.email ? `<p>Email: ${esc(c.email)}</p>` : ''}
          </div>
          <div>
            <h3>Giao hàng</h3>
            <p><strong>${esc(shippingLabel(c.shippingMethod))}</strong></p>
            ${c.shippingMethod === 'delivery'
              ? `<p>${esc(fullAddress || 'Chưa cập nhật địa chỉ')}</p>`
              : `<p>Đến nhận tại: 58 NV1 Tổng Cục 5, Tân Triều, Thanh Trì, Hà Nội</p>`
            }
            ${c.note ? `<p class="muted">Ghi chú: ${esc(c.note)}</p>` : ''}
          </div>
          <div>
            <h3>Thanh toán</h3>
            <p><strong>${esc(paymentLabel(c.paymentMethod))}</strong></p>
            ${c.paymentMethod === 'bank'
              ? '<p class="muted">HALOVN sẽ gửi thông tin tài khoản qua SMS/email.</p>'
              : c.paymentMethod === 'contact'
                ? '<p class="muted">Đội ngũ HALOVN sẽ gọi xác nhận chi tiết.</p>'
                : '<p class="muted">Thanh toán bằng tiền mặt khi nhận.</p>'
            }
          </div>
        </section>

        <section class="invoice-section">
          <h3>Sản phẩm đặt mua</h3>
          <table class="invoice-table">
            <thead>
              <tr>
                <th style="width:48px; text-align:center">STT</th>
                <th>Sản phẩm</th>
                <th style="text-align:center; width:64px">SL</th>
                <th style="text-align:right; width:120px">Đơn giá</th>
                <th style="text-align:right; width:140px">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${o.items.map((it, i) => `
                <tr>
                  <td style="text-align:center; color:var(--c-muted); font-weight:600">${i + 1}</td>
                  <td>
                    <div class="invoice-table__name">${esc(it.name)}</div>
                    ${it.variantLabel ? `<div class="invoice-table__meta">Phân loại: ${esc(it.variantLabel)}</div>` : ''}
                    ${it.brand ? `<div class="invoice-table__meta">Thương hiệu: ${esc(it.brand)}</div>` : ''}
                  </td>
                  <td style="text-align:center">${it.qty}</td>
                  <td style="text-align:right">${fmt(it.price)}</td>
                  <td style="text-align:right"><strong>${fmt(it.price * it.qty)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr><td colspan="4" style="text-align:right">Tạm tính</td><td style="text-align:right">${fmt(o.totals.subtotal)}</td></tr>
              <tr><td colspan="4" style="text-align:right">Phí vận chuyển</td><td style="text-align:right">${o.totals.shipping > 0 ? fmt(o.totals.shipping) : '<span class="muted">Liên hệ</span>'}</td></tr>
              <tr class="invoice-table__total">
                <td colspan="4" style="text-align:right">TỔNG THANH TOÁN</td>
                <td style="text-align:right">${fmt(o.totals.total)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <footer class="invoice-foot">
          <p>Đơn hàng được tạo bởi hệ thống halo.com.vn. Vui lòng giữ mã đơn để tra cứu.</p>
          <p>HALOVN hỗ trợ đổi/trả trong 30 ngày với sản phẩm còn nguyên seal — chi tiết liên hệ hotline.</p>
        </footer>
      </article>

      <div class="invoice-actions no-print">
        <button type="button" class="btn btn--primary btn--lg" id="btn-print">
          🖨️ In hoá đơn
        </button>
        <a href="products.html" class="btn btn--outline btn--lg">← Tiếp tục mua hàng</a>
        <a href="index.html" class="btn btn--outline btn--lg">🏠 Quay về trang chủ</a>
      </div>
    `;

    const printBtn = document.getElementById('btn-print');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
  }

  function renderNotFound(msg) {
    root.innerHTML = `
      <div class="invoice-notfound">
        <div class="invoice-notfound__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1>Không tìm thấy hoá đơn</h1>
        <p>${esc(msg)}</p>
        <div class="invoice-notfound__actions">
          <a href="products.html" class="btn btn--primary">← Quay lại trang sản phẩm</a>
          <a href="index.html" class="btn btn--outline">🏠 Về trang chủ</a>
        </div>
      </div>
    `;
  }
})();
