# Bilişim Su Arıtma

Next.js App Router, TypeScript, Tailwind CSS ve Prisma tabanlı kurumsal su arıtma web sitesi. Public tarafta satış odaklı modern vitrin, admin tarafta ürün, kategori, hizmet, blog ve iletişim mesajı yönetimi bulunur.

## Özellikler

- Responsive, modern ve kurumsal public site
- WhatsApp CTA ve ürün bazlı WhatsApp mesaj akışı
- Admin giriş, dashboard ve temel CRUD ekranları
- Prisma + SQLite veri modeli
- Dinamik ürün detay SEO alanları
- `sitemap.xml` ve `robots.txt` desteği

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Ortam değişkenlerini hazırlayın:

```bash
cp .env.example .env
```

3. Veritabanını oluşturun ve seed verisini yükleyin:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## Admin Giriş

- URL: `/admin/login`
- Varsayılan e-posta: `.env` içindeki `ADMIN_EMAIL`
- Varsayılan şifre: `.env` içindeki `ADMIN_PASSWORD`

## Önemli Notlar

- WhatsApp numarası `NEXT_PUBLIC_WHATSAPP_NUMBER` üzerinden yönetilir.
- Ürün görselleri bu MVP sürümünde URL alanı üzerinden yönetilir.
- SQLite local development için seçildi; production ortamında Prisma datasource değiştirilebilir.
