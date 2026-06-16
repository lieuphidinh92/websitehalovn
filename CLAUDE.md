# HALOVN Website — Project Context

## Mục tiêu dự án

Website này **không phải** là website bán lẻ. Mục tiêu kép:

1. **Khách sỉ (B2B nội địa)** — nhà thuốc, phòng khám, gym, reseller muốn lấy hàng số lượng lớn
2. **Đối tác thương hiệu nước ngoài (B2B quốc tế)** — các brand châu Âu/Mỹ đánh giá HALOVN có đủ uy tín và năng lực để trao quyền phân phối độc quyền tại Việt Nam

Mục tiêu dài hạn: HALOVN trở thành **công ty nhập khẩu và phân phối độc quyền** các brand lớn tại Việt Nam.

---

## Thông tin công ty

- **Tên**: Công ty TNHH HALOVN
- **Domain**: halo.com.vn
- **Địa chỉ**: 282 Nguyễn Huy Tưởng, Thanh Xuân Trung, Thanh Xuân, Hà Nội
- **Hotline**: 0865 565 633
- **Email**: admin@halo.com.vn
- **Giờ làm việc**: Thứ 2 – Thứ 7, 8h–18h30
- **Slogan**: Healthy and Beauty
- **Ngành**: Phân phối thực phẩm chức năng, sức khỏe & làm đẹp

### Đội ngũ lãnh đạo
- **Mr. Phí Đình Liệu** — CEO & Founder
- **Mr. Hoài Nam** — Co-Founder
- **Mr. Thế Anh** — Leader TMĐT
- **Ms. Nguyễn Hạnh** — Leader Nhân sự

### Thương hiệu đang phân phối
Blackmores, Healthy Care, Bio Island, Puritan's Pride, OstroVit, Ostelin, Nature Made, BetterYou, USOLAB, Swisse, Now, Orgain, Aptamil, La Roche Posay, Vichy, Kiehl's, Klairs

### Quy mô hiện tại
- Hơn 500 sản phẩm
- Freeship toàn quốc với đơn từ 1.000.000đ
- Hoàn đổi hàng trong 30 ngày
- Hỗ trợ 24/7

---

## Khách hàng mục tiêu

### Audience 1 — Khách sỉ (Primary conversion)
- Nhà thuốc, spa, phòng khám, gym, reseller online
- Muốn: giá sỉ rõ ràng, chính hãng, giao nhanh, hỗ trợ tốt
- CTA: "Đăng ký đại lý", "Liên hệ lấy giá sỉ"

### Audience 2 — Brand partner nước ngoài (Credibility goal)
- Brand manager hoặc regional director của các thương hiệu EU/US
- Muốn thấy: năng lực phân phối, pháp lý, thị trường coverage, đội ngũ chuyên nghiệp
- Đọc tiếng Anh — **phải có phiên bản EN**
- CTA: "Become a Distribution Partner", "Contact for Partnership"

---

## Technical Stack

- **Dạng**: Static website — `index.html` + CSS + vanilla JS (hoặc tối thiểu dependency)
- **Không dùng**: framework nặng (React/Next.js), database, backend
- **Ngôn ngữ**: Song ngữ VI/EN — toggle trên header
- **Responsive**: Mobile-first
- **Hosting gợi ý**: GitHub Pages, Netlify, hoặc VPS đơn giản

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
- Heading: Bold, uppercase hoặc semi-bold — tạo cảm giác chuyên nghiệp
- Body: 16px, line-height 1.6
- Font gợi ý: `Inter` hoặc `Be Vietnam Pro` (Google Fonts — phù hợp tiếng Việt)

### Logo
- File: `/Logo.png`
- "HalovN" — chữ "vn" trong hình chữ nhật bo góc màu xanh lá
- Tagline: "Healthy and Beauty"
- Dùng trên nền trắng hoặc nền xanh nhạt

---

## Cấu trúc trang (Page Architecture)

### Website gồm 2 loại visitor — layout phải phục vụ cả hai

```
index.html          — Trang chủ (hero khác nhau cho 2 audience)
/about              — Giới thiệu (VI + EN toggle)
/products           — Sản phẩm (cho khách sỉ xem catalog)
/wholesale          — Chính sách sỉ (dành riêng khách sỉ)
/for-brands         — For Brand Partners (TIẾNG ANH — dành cho đối tác nước ngoài)
/news               — Tin tức
/contact            — Liên hệ
```

---

## Trang chủ — index.html (Chi tiết)

### Hero Section
- Headline chính (VI): "Đơn Vị Phân Phối Thực Phẩm Chức Năng Hàng Đầu Việt Nam"
- Sub-headline: nhấn mạnh 2 CTA:
  - "Đăng ký làm đại lý sỉ →"
  - "For brand partnerships →" (link sang /for-brands)
- Background: ảnh lifestyle health/beauty, tone xanh nhạt

### Trust Bar (ngay dưới hero)
```
[500+ Sản Phẩm]  [Phân Phối Chính Hãng]  [Freeship Toàn Quốc]  [Hỗ Trợ 24/7]
```

### Brand Logo Strip
- Carousel logo các brand đang phân phối
- Label: "Thương Hiệu Chúng Tôi Phân Phối"

### Tại Sao Chọn HALOVN (cho khách sỉ)
- Giá sỉ cạnh tranh
- Hàng chính hãng, có giấy ủy quyền
- Giao nhanh toàn quốc
- Hỗ trợ kỹ thuật bán hàng

### Partner CTA Block (cho brand nước ngoài)
```
Section riêng, nền navy tối:
"Looking for a distribution partner in Vietnam?"
[Our market coverage] [Our team] [Contact us]
```

### Sản Phẩm Nổi Bật
- Grid sản phẩm theo danh mục
- Categories: Thực phẩm bổ sung, Mẹ & Bé, Người cao tuổi, Sắc đẹp

### Tin Tức / Blog Preview
- 3 bài gần nhất

---

## Trang For Brands (/for-brands) — TIẾNG ANH

Đây là trang quan trọng nhất để thuyết phục brand nước ngoài.

### Sections cần có:
1. **Hero**: "Your Trusted Distribution Partner in Vietnam"
2. **Why Vietnam**: thị trường tiềm năng, tăng trưởng ngành health & beauty
3. **Why HALOVN**:
   - Distribution network (online + offline)
   - Regulatory & import expertise
   - Marketing & e-commerce capabilities
   - Dedicated brand management team
4. **Current Brand Partners** (logo grid)
5. **Our Capabilities**:
   - Warehousing & logistics
   - Multi-channel sales (website, Shopee, Lazada, pharmacies)
   - Brand localization support
6. **Process** (4 bước như mockup PDF 4):
   - Initial Contact → Due Diligence → Agreement → Launch
7. **Contact Form**: Name, Company, Brand, Country, Message

---

## Trang Chính Sách Sỉ (/wholesale)

- Điều kiện trở thành đại lý
- Bảng giá sỉ (hoặc "liên hệ để nhận bảng giá")
- Quy trình đặt hàng sỉ
- Chính sách đổi trả dành riêng đại lý
- Form đăng ký đại lý

---

## Nội dung CẦN anh cung cấp thêm

Những thông tin dưới đây chưa có trong mockup, cần bổ sung trước khi build:

| # | Thông tin | Tầm quan trọng |
|---|---|---|
| 1 | Năm thành lập | Cao |
| 2 | Số ĐKKD | Cao (hiển thị footer — tăng uy tín) |
| 3 | Danh sách brand có giấy ủy quyền chính thức | Rất cao |
| 4 | Ảnh kho hàng thực tế | Cao |
| 5 | Số đại lý/nhà thuốc đang hợp tác | Trung bình |
| 6 | Doanh thu hoặc quy mô ước tính (cho trang For Brands) | Trung bình |
| 7 | Chứng chỉ, giải thưởng (nếu có) | Trung bình |
| 8 | Video giới thiệu công ty (đã thấy trong mockup) | Trung bình |

---

## Quy tắc bắt buộc (MANDATORY)

### Kiểm tra sau mỗi thay đổi lớn
- **Chụp screenshot** sau mỗi thay đổi lớn và so sánh với design gốc trong `/mẫu/`
- Dùng tool `mcp__Claude_Preview__preview_screenshot` hoặc `mcp__computer-use__screenshot` để chụp
- Phải confirm layout không bị vỡ trên cả desktop (1440px) và mobile (375px) trước khi báo xong

### Mobile-first bắt buộc
- Thiết kế từ màn hình nhỏ (375px) ra lớn — không ngược lại
- Breakpoints: `375px` (mobile) → `768px` (tablet) → `1024px` (laptop) → `1440px` (desktop)
- Test trên Chrome DevTools mobile emulator sau mỗi section
- Navigation phải có hamburger menu trên mobile
- Touch targets tối thiểu 44×44px

### Animation khi scroll (bắt buộc mọi section)
- Dùng `Intersection Observer API` — không dùng thư viện nặng (không AOS, không GSAP)
- Mỗi section phải có hiệu ứng khi xuất hiện trong viewport:
  - **Fade in + slide up**: `opacity: 0 → 1`, `translateY(30px) → 0`
  - **Duration**: 0.6s, `ease-out`
  - **Stagger**: các card/item trong cùng section delay nhau 0.1s
- Không animate lại khi scroll ngược lên (once: true)
- Không dùng animation cho elements above-the-fold (hero section)

### Quy tắc nội dung
- **Không dùng shopping cart / giỏ hàng** — website này không bán lẻ trực tiếp
- **Giá sản phẩm** — không hiển thị giá công khai; dùng "Liên hệ lấy giá sỉ" hoặc form đăng ký
- **CTA chính của trang chủ** phải dẫn đến wholesale hoặc for-brands, không phải add-to-cart
- **Trang /for-brands** — viết hoàn toàn bằng tiếng Anh, tone professional/corporate
- **Trang còn lại** — tiếng Việt chính, có toggle EN ở header

### Performance & SEO
- Ảnh dùng WebP, lazy load (`loading="lazy"`)
- Không có JS nặng — mọi animation dùng CSS + Intersection Observer thuần
- Mỗi trang có `<title>`, `<meta description>`, OG tags
- Lighthouse score mục tiêu: Performance ≥ 85, Accessibility ≥ 90

---

## Assets có sẵn

```
/Logo.png           — Logo HALOVN chính thức
/mẫu/1.pdf          — Mockup trang Liên hệ
/mẫu/2.pdf          — Mockup trang Tuyển dụng
/mẫu/3.pdf          — Mockup trang Tin tức
/mẫu/4.pdf          — Mockup trang Hợp tác/Affiliate
/mẫu/5.pdf          — Mockup trang Sản phẩm
/mẫu/6.pdf          — Mockup trang Giới thiệu
/mẫu/7.pdf          — Mockup trang Chủ
```

Các mockup này là thiết kế cũ (hướng bán lẻ), dùng làm **tham khảo design system** (màu, layout, font), không copy nguyên xi nội dung.

---

## Ghi chú chiến lược

- Brand nước ngoài sẽ Google "HALOVN" hoặc "halo.com.vn" trước khi reply email
- Website phải trả lời câu hỏi: "Công ty này có đủ chuyên nghiệp để phân phối brand tôi không?"
- Ưu tiên **credibility signals**: logo đối tác, số năm hoạt động, quy mô, pháp lý rõ ràng
- Trang For Brands quan trọng hơn trang Sản phẩm đối với mục tiêu này
