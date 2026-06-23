# HALOVN Website — Project Context

> Snapshot tại thời điểm hiện tại — phản ánh đúng codebase đang chạy.

---

## Mục tiêu dự án

Website có **mục tiêu kép**:

1. **Khách lẻ + sỉ (B2C/B2B nội địa)** — khách cá nhân mua lẻ + nhà thuốc, phòng khám, gym, reseller muốn lấy hàng số lượng lớn
2. **Đối tác thương hiệu nước ngoài (B2B quốc tế)** — các brand châu Âu/Mỹ đánh giá HALOVN có đủ uy tín và năng lực để trao quyền phân phối độc quyền tại Việt Nam

Mục tiêu dài hạn: HALOVN trở thành **công ty nhập khẩu và phân phối độc quyền** các brand lớn tại Việt Nam.

---

## Thông tin công ty

- **Tên**: Công ty TNHH HALOVN
- **Domain**: halo.com.vn
- **Địa chỉ**: 58 NV1 Tổng Cục 5, Tân Triều, Thanh Trì, Hà Nội
- **Hotline**: 0865 565 633
- **Email**: admin@halo.com.vn
- **Giờ làm việc**: Thứ 2 – Thứ 7, 8h–17h30
- **Slogan**: Healthy and Beauty
- **Ngành**: Phân phối thực phẩm chức năng, sức khoẻ & làm đẹp

### Đội ngũ lãnh đạo
- **Mr. Phí Đình Liệu** — CEO & Founder
- **Mr. Hoài Nam** — Co-Founder
- **Mr. Thế Anh** — Leader TMĐT
- **Ms. Nguyễn Hạnh** — Leader Nhân sự

### Thương hiệu đang phân phối (14 brand đã lên catalog — 87 SKU)
Marvis · Bio Island · Vitatree · Healthy Care · Optibac · Manhae · Vagisil · BetterYou · Nature Made · Vitabiotics · HAPPi · Neubria · P'tit BoBo · USOLAB

(Các brand được nhắc đến trên tài liệu marketing nhưng chưa có SKU trên web: Blackmores, Ostelin, Swisse, Puritan's Pride, OstroVit, La Roche-Posay, Vichy, Kiehl's — đã có logo trong brand strip homepage.)

### Quy mô hiện tại
- **87 SKU** đã lên web (cập nhật giá theo bảng "Giá hàng ngày")
- Freeship toàn quốc với đơn từ 1.000.000đ
- Đổi/hoàn trả trong 30 ngày
- Hỗ trợ 24/7

---

## Khách hàng mục tiêu

### Audience 1 — Khách lẻ + đại lý (Primary conversion)
- Khách cá nhân, nhà thuốc, spa, phòng khám, gym, reseller online
- Muốn: thấy giá rõ ràng, đặt hàng nhanh, hàng chính hãng, giao nhanh
- CTA: **"Thêm vào giỏ"**, **"Mua ngay"**, "Đăng ký đại lý" (cho đối tác sỉ)

### Audience 2 — Brand partner nước ngoài (Credibility goal)
- Brand manager / regional director các thương hiệu EU/US/Korea
- Muốn thấy: năng lực phân phối, pháp lý, thị trường coverage, đội ngũ chuyên nghiệp
- Trang **`/for-brands.html`** dành riêng — viết bằng tiếng Việt (đã đổi sang VI theo yêu cầu — nếu cần EN sau này thì thêm toggle)
- CTA: "Trở thành đối tác", "Xem năng lực của chúng tôi"

---

## Technical Stack

- **Dạng**: Static website thuần — HTML + CSS + Vanilla JS, **không framework**
- **Không dùng**: React, Vue, Vite, Webpack, npm, database, backend
- **Hosting**: GitHub Pages (mỗi route là file `.html` thật → không cần router/SPA hack)
- **State management**: `window.HALOVN_CART` + `localStorage` (cart-store.js)
- **Persistence**: `localStorage` (giỏ hàng, đơn hàng — chưa có backend thật)
- **Responsive**: Mobile-first, breakpoints 640/1024px
- **Ngôn ngữ**: Tiếng Việt 100% (đã bỏ kế hoạch toggle EN — anh có thể yêu cầu lại sau)

---

## Cấu trúc thư mục

```
websitehalovn/
├── 12 file .html         (1 cho mỗi route)
├── 404.html              (graceful Not Found)
├── CLAUDE.md             (file này)
├── assets/
│   ├── css/style.css     (tất cả style trong 1 file)
│   ├── js/
│   │   ├── main.js              — header nav, mobile menu, scroll-reveal, banner carousel
│   │   ├── cart-store.js        — global cart state + localStorage
│   │   ├── cart-page.js         — render trang Giỏ hàng
│   │   ├── checkout-page.js     — render Checkout + validate + tạo order
│   │   ├── invoice-page.js      — render Hoá đơn + window.print()
│   │   ├── products-data.js     — DATA 87 sản phẩm (HALOVN_PRODUCTS)
│   │   ├── products-list.js     — render listing + filter theo brand
│   │   ├── product-detail.js    — render trang chi tiết SP + gallery
│   │   ├── news-data.js         — DATA 4 bài viết (HALOVN_NEWS)
│   │   ├── news-page.js         — render listing tin tức
│   │   └── news-detail.js       — render trang bài viết
│   └── images/
│       ├── banners/      (3 banner carousel hero)
│       ├── brands/       (16 logo brand)
│       ├── logo/         (logo HALOVN)
│       └── products/     (~400 ảnh: thumb + 6-8 ảnh mô tả/SP)
```

---

## Routes (file thật trên đĩa — không có router)

| Route | File | Mô tả |
|---|---|---|
| `/` | `index.html` | Trang chủ + banner carousel + brand strip + featured products + tin tức |
| `/about.html` | `about.html` | Giới thiệu, đội ngũ |
| `/products.html` | `products.html` | Catalog 87 SP + filter theo brand |
| `/product.html?slug=X` | `product.html` | Chi tiết SP (gallery + variant + add to cart) |
| `/cart.html` | `cart.html` | Giỏ hàng + qty stepper + summary |
| `/checkout.html` | `checkout.html` | Form thông tin khách + sinh order |
| `/invoice.html?id=HALO-...` | `invoice.html` | Hoá đơn + nút "In hoá đơn" (`window.print`) |
| `/wholesale.html` | `wholesale.html` | Chính sách sỉ + form đăng ký đại lý |
| `/for-brands.html` | `for-brands.html` | Trang dành cho brand quốc tế |
| `/news.html` | `news.html` | Listing tin tức (4 bài từ halo.com.vn) |
| `/news-detail.html?slug=X` | `news-detail.html` | Chi tiết bài viết |
| `/contact.html` | `contact.html` | Thông tin liên hệ + map + form |
| `/404.html` | `404.html` | Trang Not Found graceful |

---

## E-commerce flow đã hoạt động

```
Catalog → Click SP → Detail page
       → Chọn variant (nếu có) + qty
       → "Thêm vào giỏ" → cart-store.addToCart()
       → Badge header cập nhật số lượng
       → Click icon giỏ → cart.html
       → Tăng/giảm/xoá → cart-store update
       → "Tiến hành thanh toán" → checkout.html
       → Nhập thông tin + chọn phương thức nhận hàng / thanh toán
       → "Đặt hàng" → sinh ID HALO-YYYYMMDD-NNN → lưu localStorage
       → Auto redirect invoice.html?id=...
       → "In hoá đơn" → window.print() (CSS @media print ẩn header/footer)
```

**Phương thức nhận hàng**: Giao tận nơi · Nhận tại kho (58 NV1 Tổng Cục 5, T2-T7 8h-17h30)
**Phương thức thanh toán**: COD · Chuyển khoản · Liên hệ tư vấn

---

## Design System

### Màu sắc
```
Primary Blue:   #00AEEF  (sky blue — màu chủ, nav, CTA)
Dark Navy:      #1A2B4A  (footer, section tối)
Accent Green:   #39B54A  (logo "vn", badge, highlight)
White:          #FFFFFF  (background chính)
Light Grey:     #F5F7FA  (section nền xen kẽ)
Text Dark:      #1A1A2E
Text Muted:     #6B7280
```

### Typography
- Heading: Bold, color navy — chuyên nghiệp
- Body: 16px, line-height 1.6
- Font: **Be Vietnam Pro** (Google Fonts — hỗ trợ tiếng Việt)

### Logo
- File: `assets/images/logo/logo.png`
- Header height: 104px, logo height: 80px
- Tagline: "Healthy and Beauty"

---

## Quy tắc nội dung (cập nhật theo trạng thái hiện tại)

### Giá sản phẩm
- **Hiển thị giá công khai** cho khách lẻ (mua trực tiếp)
- Mỗi SP có thể có `variants[]` (vd Manhaé Ménopause 30/60/90 viên, Optibac For Women 30/90 viên)
- Bỏ field `oldPrice` → chỉ hiện 1 giá đỏ (không có giá gạch ngang khuyến mãi mặc định)

### CTA chính
- **"Thêm vào giỏ"** (outline) + **"Mua ngay"** (filled) — trên mọi trang detail SP
- Đại lý sỉ vẫn có link "Hoặc liên hệ lấy giá sỉ →" dẫn về `/wholesale.html#register`

### Trang For Brands
- Hiện đang viết bằng **tiếng Việt** (theo yêu cầu user)
- Nếu cần EN sau này → thêm toggle hoặc tạo route `/for-brands-en.html` riêng

### Hero banner carousel (trang chủ)
- 3 ảnh banner trong `assets/images/banners/banner-{1,2,3}.png`
- Auto-rotate mỗi 5 giây, fade transition 0.8s
- Dots indicator, pause khi hover

### Brand strip (trang chủ + for-brands)
- 16 logo brand thật trong `assets/images/brands/`
- 4 logo phóng to +40% (Manhae, BetterYou, USOLAB, Ostelin)
- Logo grayscale 20% mặc định → 100% màu khi hover

---

## Data architecture — sửa data 1 lần, web update toàn bộ

### `products-data.js` — 87 SP
Mỗi SP có schema chuẩn:
```js
{
  id, slug, name, brand, category, categoryLabel,
  price, oldPrice, sku, shortDescription,
  images: [<thumb>, <desc-2>, <desc-3>, ...],
  badges: ['Chính hãng', 'Best Seller', ...],
  promotion,
  benefits: [...],
  variants: [{label, price, oldPrice, sku}, ...],  // optional
  defaultVariant: 0,                                // optional
  details, ingredients, usage, note, manufacturer,
  reviews: [{name, rating, comment}, ...],
}
```

Sửa file này → cả listing + detail + cart + checkout đều tự cập nhật.

### `news-data.js` — 4 bài
Schema tương tự, nội dung lấy từ halo.com.vn.

### `cart-store.js` — Vanilla CartContext
API tương đương React Context:
- `addToCart(product, qty, variantLabel)` · `removeFromCart(id)`
- `increaseQuantity(id)` · `decreaseQuantity(id)` · `updateQuantity(id, qty)`
- `clearCart()` · `items()` · `count()` · `total()`
- Persist `localStorage` key `halovn_cart_v1`
- Cross-tab sync qua `storage` event
- Dispatch `cartchange` event cho UI listen

---

## Performance & SEO

- Ảnh dùng WebP / JPG nén ~80% chất lượng (resize bằng `sips`)
- Lazy load `loading="lazy"` cho mọi ảnh dưới fold
- Mỗi trang có `<title>`, `<meta description>`, `<meta og:*>`
- Không JS nặng — animation dùng CSS + Intersection Observer thuần
- Print CSS `@media print` ẩn header/footer/nav khi in hoá đơn

---

## Quy tắc bắt buộc (MANDATORY)

### Mobile-first
- Test trên DevTools mobile emulator (375px → 1440px)
- Touch targets ≥ 44×44px
- Hamburger menu mobile

### Scroll reveal (mọi section)
- `Intersection Observer API` — không AOS, không GSAP
- Fade in + slide up 0.6s
- `once: true` — không animate lại khi scroll ngược

### Code quality
- Vanilla JS thuần — không jQuery
- Sửa data file → tất cả trang tự cập nhật (no duplicate data)
- Cẩn thận dấu `"` trong SVG inline `onerror` — đã chuyển sang event delegation cho an toàn

---

## Việc chưa làm / TODO trong tương lai

| # | Mục | Mức ưu tiên |
|---|---|---|
| 1 | Backend thật (Node/Python) để lưu đơn hàng và sync nhiều thiết bị | Cao |
| 2 | EN toggle trên header (nếu cần audience quốc tế) | Trung |
| 3 | SEO meta đa ngôn ngữ + sitemap.xml | Trung |
| 4 | Tích hợp cổng thanh toán (VNPay/Momo) | Trung |
| 5 | Filter sản phẩm theo nhiều tiêu chí (giá, danh mục, đối tượng) | Thấp |
| 6 | Tìm kiếm trong header | Thấp |
| 7 | Trang tài khoản khách hàng (login/register) | Thấp — phụ thuộc backend |
| 8 | Bổ sung ảnh kho hàng thật vào trang About / For Brands | Trung |
| 9 | Số ĐKKD ở footer (tăng uy tín) | Trung |
| 10 | Video giới thiệu công ty trên trang chủ | Thấp |

---

## Ghi chú chiến lược

- Brand nước ngoài sẽ Google "HALOVN" / "halo.com.vn" trước khi reply email
- Website phải trả lời: "Công ty này có đủ chuyên nghiệp để phân phối brand tôi không?"
- Ưu tiên **credibility signals**: logo đối tác thật, mạng lưới phân phối, pháp lý, đội ngũ chuyên nghiệp
- Đối với mục tiêu B2B quốc tế, trang `for-brands.html` quan trọng hơn `products.html`

---

## Lịch sử cập nhật chính

- **2026-06-22**: Cập nhật giá 84 SP theo bảng "Giá hàng ngày" — bỏ oldPrice
- **2026-06-22**: Thêm Hero banner carousel (3 ảnh, 5s auto-rotate)
- **2026-06-22**: Thêm 16 brand logo thay text, 4 brand phóng to +40%
- **2026-06-22**: Đổi địa chỉ → 58 NV1 Tổng Cục 5, Tân Triều, Thanh Trì + cập nhật Google Maps
- **2026-06-22**: Tạo hệ thống tin tức (news-data.js + news-detail.html) — fetch từ halo.com.vn
- **2026-06-22**: Sửa bug ảnh fallback — chuyển từ inline onerror sang event delegation
- **2026-06-21**: Build full e-commerce — cart.html + checkout.html + invoice.html + cart-store.js
- **2026-06-21**: Build catalog 87 SP với 14 brand, mỗi SP có 6-8 ảnh mô tả
- **2026-06-21**: Rebuild toàn bộ website từ HTML mockup cũ (Pharmacity-style layout)
