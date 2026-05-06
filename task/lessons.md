# LESSONS

## Operasyonel Hatalar
- `pipx run ...` komutları sandbox içinde `pipx` log dizinine yazamadığı için izin gerektirdi.
- `app/(public)` ve `[slug]` gibi özel karakter içeren yollar kabuk tarafından glob olarak yorumlandı — tek tırnak kullan: `'app/(public)/page.tsx'`
- `grep` komutlarında parantezli yollar zsh tarafından glob olarak parse edilir; her zaman `'...'` ile sarılmalı.

## Dikkat Noktaları
- `pipx` kullanan komutlarda gerektiğinde yetkili çalıştırma gerekebilir.
- Bu projede mimari veya kod analizi yaparken önce `graphify-out/GRAPH_REPORT.md` okunmalı.
- Kod değişikliği sonrası `graphify update .` çalıştırılmalı.
- Kullanıcı dosyayı aynı anda düzenleyebilir — edit öncesi mutlaka `Read` yapılmalı, aksi halde eski içerik üzerine yazılır.

## Teknik Gözlemler
- Tailwind v4 bu projede `@import "tailwindcss"` söz dizimiyle kullanılıyor, `tailwind.config.js` yok. Özel token için `@theme` direktifi veya `:root` CSS değişkenleri kullanılmalı.
- Graph raporunda omurga `api` ve `auth` çevresinde; admin alanı mevcut ama kapsamı `components/admin` altında.
- `container-shell`: `max-width: 1280px; px-6 lg:px-8` — full-bleed bölümler bu sınıfı dışarıya taşır.

## UI & Animasyon Kalıpları
- **Full-bleed hero**: `<section>` wrapper'dan `container-shell` kaldırılmalı; iç metin `container-shell` ile hizalanır. Slider şeridi `translateX(-N*100%)` ile kaydırılır.
- **CSS stagger yeniden tetikleme**: `key={active}` prop'u React'in ilgili DOM'u yeniden mount etmesini sağlar → `@keyframes staggerIn` sıfırdan başlar.
- **CountUp**: IntersectionObserver ile viewport'a girence `requestAnimationFrame` döngüsü başlatılır. Sayısal olmayan değerler (`7/24`) `parse()` → `null` ile statik gösterilir.
- **Scroll-reveal**: `AnimateSection` wrapper'ı `anim-{type}` class'ı ve IntersectionObserver ile `is-visible` ekler. `delay` prop'u `anim-delay-{N}` class'ına dönüştürülür.
- **WhatsApp pulse**: `wa-pulse` CSS class'ı, `rgba(37,211,102,0.45)` ile 2.5 s döngülü `box-shadow` animasyonu yapar.
- **`glass-card` hover**: `transform: translateY(-2px)` + `shadow-lg` + `border-color` geçişiyle kart kalkma efekti.

## Veri & Şema
- Prisma + SQLite; `getSiteData()` server component'ten `featuredProducts`, `services`, `blogPosts` döner.
- Slug tabanlı blog routing: `/blog/[slug]`.
