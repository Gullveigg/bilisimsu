# TODO

## Faz 1 — Tasarım & Public Site Temeli ✅
- [x] Proje klasör yapısını analiz et (`app`, `components`, `lib`, `prisma`)
- [x] Admin panel, ürün yönetimi, kategori ve public sayfalar arasındaki boşlukları netleştir
- [x] Kurumsal görsel dil oluştur (renk, tipografi, kart, spacing sistemi)
- [x] Hero slider: full-bleed arka plan, video/görsel desteği, progress bar
- [x] Anasayfaya Hakkımızda bölümü ekle (2 kolon, checklist, istatistik kartları)
- [x] Sertifikalar bölümü ekle (ISO 9001, ISO 14001, CE, NSF/ANSI, TSE)
- [x] Animasyon sistemi kur (scroll-reveal, CountUp, hero stagger, WhatsApp pulse)
- [x] Warm white arka plan (#fdfcfa)
- [x] Footer ve Header kurumsal tasarım
- [x] Anasayfadan iletişim bölümünü kaldır
- [x] Servis CTA bandını hizmetlerden ayır

## Faz 2 — WhatsApp & Dönüşüm
- [ ] Public sayfalardaki WhatsApp CTA metinlerini bağlama göre özelleştir
- [ ] Ürün detay sayfasında WhatsApp teklif butonu ekle
- [ ] Servis, iletişim ve kurumsal sayfalarda dönüşüm odaklı WhatsApp akışları ekle
- [ ] Admin tarafından yönetilebilir WhatsApp ayar ihtiyacını değerlendir

## Faz 3 — SEO & Performans ✅
- [x] Global metadata yapısını güçlendir (`layout.tsx`)
- [x] Sayfa bazlı `title`, `description`, Open Graph ve canonical alanları
- [x] Schema.org yapılandırılmış veri ekle (Organization, LocalBusiness, Product, Article)
- [x] Sitemap `changeFrequency` ve `priority` eklendi, robots.txt mevcut içerikle hizalı
- [x] Hero slider görsel/video upload API ve `/public/slides/` klasörü oluşturuldu

## Faz 4 — Admin Panel
- [x] Dashboard: son mesajlar, hızlı aksiyonlar, durum kartları ekle
- [x] Admin navigasyonunda eksik akışlar: Banner yönetimi sayfası + sidebar menüsü eklendi
- [x] HeroSlide DB modeli, CRUD API ve admin banner sayfası (`/admin/banners`)
- [x] Mesaj yönetiminde okunabilirlik ve aksiyon alanlarını iyileştir

## Faz 5 — Ürün & Kategori CRUD ✅
- [x] Ürün CRUD akışını uçtan uca doğrula
- [x] Ürün listesinde kart layout, renkli durum/öne çıkan/WhatsApp badge'leri, arama iyileştirmesi
- [x] Kategori listesinde bağlı ürün badge'i; bağlı ürün varken Sil butonu devre dışı
- [x] Ürün formu: dosya yükleme butonu (ana görsel + galeri), önizleme grid, bölümlü kart layout

## Faz 6 — Doğrulama & Yayın ✅
- [x] TypeScript: `tsc --noEmit` sıfır hata
- [x] Production build: `next build` 32 sayfa, sıfır hata
- [x] API auth kontrolü: tüm write endpoint'leri `requireAdmin` ile korumalı
- [x] `graphify update .` — 178 node, 177 edge, 48 community
- [ ] Mobil görünüm son kontrolü (tarayıcıda doğrulama)
- [ ] Lighthouse performans ve erişilebilirlik testi
