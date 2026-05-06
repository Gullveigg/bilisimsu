import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bilisimsuaritma.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      name: "Bilişim Admin",
      email: adminEmail,
      passwordHash
    }
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "ev-tipi" },
      update: {},
      create: { name: "Ev Tipi Sistemler", slug: "ev-tipi", description: "Mutfak ve daire kullanımı için kompakt su arıtma cihazları." }
    }),
    prisma.category.upsert({
      where: { slug: "isyeri-cozumleri" },
      update: {},
      create: { name: "İş Yeri Çözümleri", slug: "isyeri-cozumleri", description: "Ofis ve işletmeler için yüksek kapasiteli arıtma çözümleri." }
    }),
    prisma.category.upsert({
      where: { slug: "endustriyel" },
      update: {},
      create: { name: "Endüstriyel Sistemler", slug: "endustriyel", description: "Kurumsal ve üretim alanları için ölçeklenebilir sistemler." }
    }),
    prisma.category.upsert({
      where: { slug: "seperator-ve-diskli-filtreler" },
      update: {},
      create: { name: "Seperatör ve Diskli Filtreleme", slug: "seperator-ve-diskli-filtreler", description: "Endüstriyel filtrasyon için diskli filtre ve seperatör sistemleri." }
    }),
    prisma.category.upsert({
      where: { slug: "su-saflastirma-prosesleri" },
      update: {},
      create: { name: "Su Saflaştırma Prosesleri", slug: "su-saflastirma-prosesleri", description: "Ters osmoz, deiyonizasyon ve EDI sistemleri." }
    }),
    prisma.category.upsert({
      where: { slug: "geri-kazanim-ultra-filtrasyon" },
      update: {},
      create: { name: "Geri Kazanımlı Üniteleri - Ultra Filtrasyon", slug: "geri-kazanim-ultra-filtrasyon", description: "Geri kazanım ve ultra filtrasyon sistemleri." }
    }),
    prisma.category.upsert({
      where: { slug: "kimyasal-ekipmanlar" },
      update: {},
      create: { name: "Kimyasal Ekipmanlar", slug: "kimyasal-ekipmanlar", description: "Su arıtma kimyasal dozaj ve enjeksiyon ekipmanları." }
    })
  ]);

  const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));

  await Promise.all([
    prisma.product.upsert({
      where: { slug: "aqua-premium-8-asamali" },
      update: {},
      create: {
        name: "Aqua Premium 8 Aşamalı",
        slug: "aqua-premium-8-asamali",
        shortDescription: "Ev kullanımı için premium, sessiz ve kompakt su arıtma sistemi.",
        description:
          "Aqua Premium 8 Aşamalı, ev kullanıcıları için yüksek filtrasyon performansı ve şık tasarımı bir araya getirir. Tezgah altı yapısı sayesinde mutfakta yer kaybetmeden güvenli içme suyu sunar.",
        technicalSpecs:
          "8 aşamalı filtrasyon\nGünlük 280 litre arıtma kapasitesi\nDüşük enerji tüketimi\nBasınç dengeleyici pompa\nKompakt tezgah altı tasarım",
        price: "24.900 TL",
        imageUrl:
          "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([
          "https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1200&q=80"
        ]),
        isFeatured: true,
        categoryId: categoryBySlug["ev-tipi"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "office-flow-pro" },
      update: {},
      create: {
        name: "Office Flow Pro",
        slug: "office-flow-pro",
        shortDescription: "Ofisler için yüksek kapasiteli ve düşük bakım maliyetli sistem.",
        description:
          "Office Flow Pro, yoğun ofis kullanımı için tasarlanmış kurumsal su arıtma çözümüdür. Çalışan memnuniyetini artıran temiz içme suyu deneyimini kesintisiz sunar.",
        technicalSpecs:
          "Saatte 60 litre çıkış\nGelişmiş karbon blok filtre\nPaslanmaz çelik gövde\nHızlı servis modülü\nAkıllı filtre ömrü takibi",
        price: "39.500 TL",
        imageUrl:
          "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
        ]),
        isFeatured: true,
        categoryId: categoryBySlug["isyeri-cozumleri"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "pureline-enterprise" },
      update: {},
      create: {
        name: "Pureline Enterprise",
        slug: "pureline-enterprise",
        shortDescription: "Yoğun tüketim noktaları için merkezi arıtma çözümü.",
        description:
          "Pureline Enterprise, kurumsal binalar ve üretim alanları için ölçeklenebilir su arıtma altyapısı sağlar. Dayanıklı bileşenleri ve uzaktan takip edilebilir servis planı ile operasyonel sürekliliğe odaklanır.",
        technicalSpecs:
          "Merkezi kurulum\nÇoklu hat desteği\nTers osmoz altyapısı\nUzaktan takip desteği\nYıllık bakım planına uygun yapı",
        imageUrl:
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
        ]),
        isFeatured: false,
        categoryId: categoryBySlug["endustriyel"].id
      }
    }),

    // --- Seperatör ve Diskli Filtreleme ---
    prisma.product.upsert({
      where: { slug: "comwatech-df-1000" },
      update: {},
      create: {
        name: "Diskli Filtre — COMWATECH® DF-1000",
        slug: "comwatech-df-1000",
        shortDescription: "Endüstriyel kullanım için yüksek performanslı diskli filtre sistemi.",
        description: "COMWATECH® DF-1000 diskli filtre, endüstriyel sulama ve proses sularının mekanik filtrasyonunda kullanılır. Modüler yapısı sayesinde farklı kapasite ihtiyaçlarına uyarlanabilir.",
        technicalSpecs: "Model: COMWATECH® DF-1000\nFiltrasyon tipi: Diskli\nKapasite: Düzenlenecek\nÇalışma basıncı: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["seperator-ve-diskli-filtreler"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-seperator-filtre" },
      update: {},
      create: {
        name: "Seperatör Filtre",
        slug: "comwatech-seperator-filtre",
        shortDescription: "Katı-sıvı ayrıştırma için endüstriyel seperatör filtre.",
        description: "Seperatör filtre, su içindeki kum, çakıl ve iri partikülleri santrifüj kuvvetiyle ayırarak sistemin diğer filtre aşamalarının ömrünü uzatır.",
        technicalSpecs: "Filtrasyon tipi: Seperatör\nKapasite: Düzenlenecek\nÇalışma basıncı: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["seperator-ve-diskli-filtreler"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-sf-1000" },
      update: {},
      create: {
        name: "Kum Filtre — COMWATECH® SF-1000",
        slug: "comwatech-sf-1000",
        shortDescription: "Büyük debili uygulamalar için kum filtre sistemi.",
        description: "COMWATECH® SF-1000 kum filtre, sulama, endüstriyel proses ve havuz suyu uygulamalarında askıdaki katı maddelerin giderilmesinde kullanılır.",
        technicalSpecs: "Model: COMWATECH® SF-1000\nFiltrasyon ortamı: Kum / Silika\nKapasite: Düzenlenecek\nGeri yıkama: Otomatik\nÇalışma basıncı: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["seperator-ve-diskli-filtreler"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-cf-1000" },
      update: {},
      create: {
        name: "Karbon Filtre — COMWATECH® CF-1000",
        slug: "comwatech-cf-1000",
        shortDescription: "Klor, koku ve organik madde giderimi için aktif karbon filtre.",
        description: "COMWATECH® CF-1000 karbon filtre, içme suyu ve proses sularındaki klor, koku, renk ve organik maddeleri aktif karbon ortamı aracılığıyla giderir.",
        technicalSpecs: "Model: COMWATECH® CF-1000\nFiltrasyon ortamı: Aktif Karbon\nKapasite: Düzenlenecek\nGeri yıkama: Otomatik\nÇalışma basıncı: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["seperator-ve-diskli-filtreler"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-demir-mangan-giderimi" },
      update: {},
      create: {
        name: "Demir ve Mangan Giderimi",
        slug: "comwatech-demir-mangan-giderimi",
        shortDescription: "Sudaki demir ve mangan iyonlarının katalitik oksidasyonla giderilmesi.",
        description: "Demir ve mangan giderim sistemi, yeraltı sularında sıklıkla karşılaşılan Fe²⁺ ve Mn²⁺ iyonlarını katalitik oksidasyon ve filtrasyon yoluyla uzaklaştırır.",
        technicalSpecs: "Arıtma hedefi: Demir (Fe), Mangan (Mn)\nYöntem: Katalitik oksidasyon + filtrasyon\nKapasite: Düzenlenecek\nGeri yıkama: Otomatik",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["seperator-ve-diskli-filtreler"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-wss-1000" },
      update: {},
      create: {
        name: "Katyonik Reçineli Su Arıtma Sistemleri — COMWATECH® WSS-1000",
        slug: "comwatech-wss-1000",
        shortDescription: "Sertlik giderimi için katyonik iyon değiştirici reçine sistemi.",
        description: "COMWATECH® WSS-1000, suda çözünmüş Ca²⁺ ve Mg²⁺ iyonlarını Na⁺ iyonları ile değiştirerek sertliği giderir. Endüstriyel kazan ve proses suyu hazırlığında yaygın kullanılır.",
        technicalSpecs: "Model: COMWATECH® WSS-1000\nReçine tipi: Katyonik\nKapasite: Düzenlenecek\nRejenererasyon: Tuzlu su ile otomatik\nÇalışma basıncı: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["seperator-ve-diskli-filtreler"].id
      }
    }),

    // --- Su Saflaştırma Prosesleri ---
    prisma.product.upsert({
      where: { slug: "comwatech-ro-1000" },
      update: {},
      create: {
        name: "Ters Ozmos — COMWATECH® RO-1000",
        slug: "comwatech-ro-1000",
        shortDescription: "Yüksek saflıkta su üretimi için endüstriyel ters osmoz sistemi.",
        description: "COMWATECH® RO-1000, yarı geçirgen membran teknolojisi kullanarak suda çözünmüş tuz, mineral ve kirleticileri uzaklaştırır. İçme suyu, ilaç, elektronik ve gıda sektörlerinde kullanılır.",
        technicalSpecs: "Model: COMWATECH® RO-1000\nTeknoloji: Ters Osmoz\nKapasite: Düzenlenecek\nGiderim verimi: Düzenlenecek\nMembran tipi: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["su-saflastirma-prosesleri"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-deiyonizasyon-mr-1000" },
      update: {},
      create: {
        name: "Deiyonizasyon — COMWATECH® MR-1000",
        slug: "comwatech-deiyonizasyon-mr-1000",
        shortDescription: "İyon değişimi ile yüksek saflıkta deiyonize su üretimi.",
        description: "COMWATECH® MR-1000 deiyonizasyon sistemi, sudaki tüm iyonları katyonik ve anyonik reçine yatakları aracılığıyla uzaklaştırarak yüksek saflıkta su üretir.",
        technicalSpecs: "Model: COMWATECH® MR-1000\nTeknoloji: Deiyonizasyon\nReçine: Katyonik + Anyonik\nKapasite: Düzenlenecek\nÇıkış kalitesi: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["su-saflastirma-prosesleri"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-edi-mr-1000" },
      update: {},
      create: {
        name: "Elektrodeiyonizasyon-EDI — COMWATECH® MR-1000",
        slug: "comwatech-edi-mr-1000",
        shortDescription: "Kimyasalsız sürekli deiyonizasyon için EDI modülü.",
        description: "COMWATECH® MR-1000 EDI sistemi, iyon değiştirici membranlar ve elektrik akımı kullanarak kimyasal rejenererasyon gerektirmeksizin sürekli ultra saf su üretir.",
        technicalSpecs: "Model: COMWATECH® MR-1000\nTeknoloji: Elektrodeiyonizasyon (EDI)\nKimyasal ihtiyacı: Yok\nKapasite: Düzenlenecek\nÇıkış kalitesi: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["su-saflastirma-prosesleri"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-mixed-recineli-mr-1000" },
      update: {},
      create: {
        name: "Mixed Reçineli Sistemleri — COMWATECH® MR-1000",
        slug: "comwatech-mixed-recineli-mr-1000",
        shortDescription: "Tek kolonda katyonik ve anyonik reçine karışımıyla ultra saf su.",
        description: "COMWATECH® MR-1000 mixed bed sistemi, katyonik ve anyonik reçineleri tek tank içinde harmanlayarak deiyonizasyon sürecini optimize eder ve yüksek saflıkta çıkış suyu sağlar.",
        technicalSpecs: "Model: COMWATECH® MR-1000\nTeknoloji: Mixed Bed Deiyonizasyon\nReçine: Karma katyonik/anyonik\nKapasite: Düzenlenecek\nÇıkış kalitesi: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["su-saflastirma-prosesleri"].id
      }
    }),

    // --- Geri Kazanımlı Üniteleri - Ultra Filtrasyon ---
    prisma.product.upsert({
      where: { slug: "comwatech-uf-1000" },
      update: {},
      create: {
        name: "Geri Kazanımlı Üniteleri - Ultra Filtrasyon — COMWATECH® UF-1000",
        slug: "comwatech-uf-1000",
        shortDescription: "Membran tabanlı ultra filtrasyon ile geri kazanım ünitesi.",
        description: "COMWATECH® UF-1000, içme suyu, atık su geri kazanımı ve ön arıtma uygulamalarında kullanılan membran tabanlı ultra filtrasyon sistemidir. Bakteri, virüs ve kolloidal maddeleri etkili biçimde tutar.",
        technicalSpecs: "Model: COMWATECH® UF-1000\nTeknoloji: Ultra Filtrasyon\nMembran gözenek boyutu: Düzenlenecek\nKapasite: Düzenlenecek\nGeri yıkama: Otomatik",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["geri-kazanim-ultra-filtrasyon"].id
      }
    }),

    // --- Kimyasal Ekipmanlar ---
    prisma.product.upsert({
      where: { slug: "comwatech-cwt-1000" },
      update: {},
      create: {
        name: "COMWATECH® CWT-1000",
        slug: "comwatech-cwt-1000",
        shortDescription: "Endüstriyel su arıtma için kimyasal dozaj ünitesi.",
        description: "COMWATECH® CWT-1000, endüstriyel su arıtma sistemlerinde kullanılan kimyasal dozaj ve enjeksiyon ünitesidir.",
        technicalSpecs: "Model: COMWATECH® CWT-1000\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-cwt-a-0127" },
      update: {},
      create: {
        name: "COMWATECH® CWT-A-0127",
        slug: "comwatech-cwt-a-0127",
        shortDescription: "Özel uygulama için kimyasal ekipman.",
        description: "COMWATECH® CWT-A-0127, su arıtma proseslerinde kullanılan özel kimyasal ekipmandır.",
        technicalSpecs: "Model: COMWATECH® CWT-A-0127\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-cwt-b-0227" },
      update: {},
      create: {
        name: "COMWATECH® CWT-B-0227",
        slug: "comwatech-cwt-b-0227",
        shortDescription: "Özel uygulama için kimyasal ekipman.",
        description: "COMWATECH® CWT-B-0227, su arıtma proseslerinde kullanılan özel kimyasal ekipmandır.",
        technicalSpecs: "Model: COMWATECH® CWT-B-0227\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-cwt-0918" },
      update: {},
      create: {
        name: "COMWATECH® CWT-0918",
        slug: "comwatech-cwt-0918",
        shortDescription: "Özel uygulama için kimyasal ekipman.",
        description: "COMWATECH® CWT-0918, su arıtma proseslerinde kullanılan özel kimyasal ekipmandır.",
        technicalSpecs: "Model: COMWATECH® CWT-0918\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-lc-0017" },
      update: {},
      create: {
        name: "COMWATECH® LC-0017",
        slug: "comwatech-lc-0017",
        shortDescription: "Özel uygulama için kimyasal ekipman.",
        description: "COMWATECH® LC-0017, su arıtma proseslerinde kullanılan özel kimyasal ekipmandır.",
        technicalSpecs: "Model: COMWATECH® LC-0017\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-tp-6000" },
      update: {},
      create: {
        name: "COMWATECH® TP-6000",
        slug: "comwatech-tp-6000",
        shortDescription: "Özel uygulama için kimyasal ekipman.",
        description: "COMWATECH® TP-6000, su arıtma proseslerinde kullanılan özel kimyasal ekipmandır.",
        technicalSpecs: "Model: COMWATECH® TP-6000\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    }),
    prisma.product.upsert({
      where: { slug: "comwatech-tp-7000" },
      update: {},
      create: {
        name: "COMWATECH® TP-7000",
        slug: "comwatech-tp-7000",
        shortDescription: "Özel uygulama için kimyasal ekipman.",
        description: "COMWATECH® TP-7000, su arıtma proseslerinde kullanılan özel kimyasal ekipmandır.",
        technicalSpecs: "Model: COMWATECH® TP-7000\nUygulama: Düzenlenecek\nKapasite: Düzenlenecek\nMalzeme: Düzenlenecek",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        imageGallery: JSON.stringify([]),
        isFeatured: false,
        categoryId: categoryBySlug["kimyasal-ekipmanlar"].id
      }
    })
  ]);

  await Promise.all([
    prisma.service.upsert({
      where: { slug: "kurulum-devreye-alma" },
      update: {},
      create: {
        title: "Kurulum ve Devreye Alma",
        slug: "kurulum-devreye-alma",
        description: "Cihaz seçimi sonrası yerinde kurulum, test ve kullanıcı bilgilendirmesi.",
        icon: "Droplets"
      }
    }),
    prisma.service.upsert({
      where: { slug: "periyodik-bakim" },
      update: {},
      create: {
        title: "Periyodik Bakım",
        slug: "periyodik-bakim",
        description: "Planlı bakım takvimi ile performans ve hijyen sürekliliği sağlanır.",
        icon: "ShieldCheck"
      }
    }),
    prisma.service.upsert({
      where: { slug: "filtre-degisimi" },
      update: {},
      create: {
        title: "Filtre Değişimi",
        slug: "filtre-degisimi",
        description: "Zamanında filtre değişimi ile su kalitesi ve cihaz ömrü korunur.",
        icon: "RefreshCcw"
      }
    })
  ]);

  await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: "su-aritma-cihazi-secerken-nelere-dikkat-edilmeli" },
      update: {},
      create: {
        title: "Su Arıtma Cihazı Seçerken Nelere Dikkat Edilmeli?",
        slug: "su-aritma-cihazi-secerken-nelere-dikkat-edilmeli",
        excerpt: "Doğru cihaz seçimi için filtrasyon teknolojisi, kapasite ve servis ağı kritik önemdedir.",
        content:
          "Su arıtma cihazı seçerken ilk olarak kullanım senaryonuzu netleştirmeniz gerekir. Ev, ofis veya işletme kullanımına göre kapasite ihtiyacı değişir. Filtrasyon aşamaları, yedek parça erişimi ve teknik servis sürekliliği de karar sürecinde belirleyici olmalıdır.",
        coverImage:
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
      }
    }),
    prisma.blogPost.upsert({
      where: { slug: "filtre-degisimi-ne-zaman-yapilmali" },
      update: {},
      create: {
        title: "Filtre Değişimi Ne Zaman Yapılmalı?",
        slug: "filtre-degisimi-ne-zaman-yapilmali",
        excerpt: "Filtrelerin düzenli değişimi, su kalitesini ve cihaz verimliliğini doğrudan etkiler.",
        content:
          "Filtre değişim süresi kullanım yoğunluğuna ve su kalitesine bağlı olarak farklılaşır. Genel olarak ön filtreler 6 ayda bir, membran filtre ise 18 ila 24 ay arasında kontrol edilmelidir. Düzenli bakım, cihazın daha uzun ömürlü çalışmasını sağlar.",
        coverImage:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80"
      }
    })
  ]);

  await prisma.page.deleteMany({
    where: {
      slug: {
        in: ["hakkimizda", "kvkk-aydinlatma-metni"]
      }
    }
  });

  await Promise.all([
    prisma.page.upsert({
      where: { slug: "kurumsal" },
      update: {
        title: "Kurumsal",
        excerpt: "Bilişim Su Arıtma hakkında kurumsal yaklaşım, hizmet anlayışı ve operasyon modeli.",
        content:
          "Su arıtma alanında güven veren, sistemli ve modern bir hizmet yaklaşımı.\n\nBilişim Su Arıtma, satış odaklı ama sadece cihaz teslimi ile sınırlı kalmayan bir operasyon modeli kurar.\n\nVizyon:\nEv ve iş yerleri için su arıtma deneyimini daha güvenli, daha şeffaf ve daha ulaşılabilir hale getirmek.\n\nMisyon:\nDoğru ürün seçimi, sürdürülebilir teknik servis ve planlı bakım süreçlerini tek yapıda sunmak.\n\nYaklaşım:\nKurumsal dil, temiz tasarım ve hızlı iletişim ile müşterinin karar sürecini kolaylaştırmak.\n\nNeler sunuyoruz?\n- Ev tipi ve kurumsal su arıtma sistemleri\n- Yerinde kurulum ve kullanıcı bilgilendirmesi\n- Periyodik bakım ve filtre değişimi takibi\n- Tekliften satış sonrasına kadar tek iletişim hattı\n\nGüven Çerçevesi:\nBilişim Su Arıtma yalnızca cihaz satışı değil, keşif, kurulum, bakım ve hızlı iletişimi tek operasyon çizgisinde sunar.\n\n01 İhtiyaç Analizi: Alan tipi ve tüketim yoğunluğu birlikte değerlendirilir.\n02 Kurulum Planı: Teklif sonrası uygun ürün ve servis planı netleştirilir.\n03 Bakım Takibi: Filtre ve servis süreçleri görünür hale getirilir.",
        isPublished: true
      },
      create: {
        title: "Kurumsal",
        slug: "kurumsal",
        excerpt: "Bilişim Su Arıtma hakkında kurumsal yaklaşım, hizmet anlayışı ve operasyon modeli.",
        content:
          "Su arıtma alanında güven veren, sistemli ve modern bir hizmet yaklaşımı.\n\nBilişim Su Arıtma, satış odaklı ama sadece cihaz teslimi ile sınırlı kalmayan bir operasyon modeli kurar.\n\nVizyon:\nEv ve iş yerleri için su arıtma deneyimini daha güvenli, daha şeffaf ve daha ulaşılabilir hale getirmek.\n\nMisyon:\nDoğru ürün seçimi, sürdürülebilir teknik servis ve planlı bakım süreçlerini tek yapıda sunmak.\n\nYaklaşım:\nKurumsal dil, temiz tasarım ve hızlı iletişim ile müşterinin karar sürecini kolaylaştırmak.\n\nNeler sunuyoruz?\n- Ev tipi ve kurumsal su arıtma sistemleri\n- Yerinde kurulum ve kullanıcı bilgilendirmesi\n- Periyodik bakım ve filtre değişimi takibi\n- Tekliften satış sonrasına kadar tek iletişim hattı\n\nGüven Çerçevesi:\nBilişim Su Arıtma yalnızca cihaz satışı değil, keşif, kurulum, bakım ve hızlı iletişimi tek operasyon çizgisinde sunar.\n\n01 İhtiyaç Analizi: Alan tipi ve tüketim yoğunluğu birlikte değerlendirilir.\n02 Kurulum Planı: Teklif sonrası uygun ürün ve servis planı netleştirilir.\n03 Bakım Takibi: Filtre ve servis süreçleri görünür hale getirilir.",
        isPublished: true
      }
    }),
    prisma.page.upsert({
      where: { slug: "hizmetler" },
      update: {
        title: "Hizmetler",
        excerpt: "Kurulum, servis, bakım ve filtre değişimi hizmetlerini inceleyin.",
        content:
          "Kurulumdan periyodik bakıma uzanan destek modeli.\n\nSatış sonrası memnuniyeti görünür kılan operasyonel hizmetler.\n\nFiltre Değişimi:\nZamanında filtre değişimi ile su kalitesi ve cihaz ömrü korunur.\n\nPeriyodik Bakım:\nPlanlı bakım takvimi ile performans ve hijyen sürekliliği sağlanır.\n\nKurulum ve Devreye Alma:\nCihaz seçimi sonrası yerinde kurulum, test ve kullanıcı bilgilendirmesi.\n\nHizmet Talebi:\nKurulum ve bakım sürecini WhatsApp üzerinden başlatın.",
        isPublished: true
      },
      create: {
        title: "Hizmetler",
        slug: "hizmetler",
        excerpt: "Kurulum, servis, bakım ve filtre değişimi hizmetlerini inceleyin.",
        content:
          "Kurulumdan periyodik bakıma uzanan destek modeli.\n\nSatış sonrası memnuniyeti görünür kılan operasyonel hizmetler.\n\nFiltre Değişimi:\nZamanında filtre değişimi ile su kalitesi ve cihaz ömrü korunur.\n\nPeriyodik Bakım:\nPlanlı bakım takvimi ile performans ve hijyen sürekliliği sağlanır.\n\nKurulum ve Devreye Alma:\nCihaz seçimi sonrası yerinde kurulum, test ve kullanıcı bilgilendirmesi.\n\nHizmet Talebi:\nKurulum ve bakım sürecini WhatsApp üzerinden başlatın.",
        isPublished: true
      }
    }),
    prisma.page.upsert({
      where: { slug: "servis-filtre-degisimi" },
      update: {
        title: "Servis / Filtre Değişimi",
        excerpt: "Planlı filtre değişimi ve teknik servis talepleri için hızlı iletişim ekranı.",
        content:
          "Filtre değişimi ve bakım takibini aksatmadan yönetin.\n\nSu kalitesini ve cihaz ömrünü korumak için düzenli bakım sürecini planlı biçimde ilerletin.\n\n- Ön filtre ve membran değişim planı\n- Yerinde bakım ve performans kontrolü\n- Kurumsal müşteriler için periyodik servis takvimi\n\nServis talebinizi WhatsApp üzerinden başlatın. Cihaz modeliniz ve talebinizi iletin, uygun yönlendirmeyi kısa sürede paylaşalım.",
        isPublished: true
      },
      create: {
        title: "Servis / Filtre Değişimi",
        slug: "servis-filtre-degisimi",
        excerpt: "Planlı filtre değişimi ve teknik servis talepleri için hızlı iletişim ekranı.",
        content:
          "Filtre değişimi ve bakım takibini aksatmadan yönetin.\n\nSu kalitesini ve cihaz ömrünü korumak için düzenli bakım sürecini planlı biçimde ilerletin.\n\n- Ön filtre ve membran değişim planı\n- Yerinde bakım ve performans kontrolü\n- Kurumsal müşteriler için periyodik servis takvimi\n\nServis talebinizi WhatsApp üzerinden başlatın. Cihaz modeliniz ve talebinizi iletin, uygun yönlendirmeyi kısa sürede paylaşalım.",
        isPublished: true
      }
    }),
    prisma.page.upsert({
      where: { slug: "iletisim" },
      update: {
        title: "İletişim",
        excerpt: "Teklif, servis ve ürün bilgisi için Bilişim Su Arıtma ile iletişime geçin.",
        content:
          "İhtiyacınıza uygun çözüm için hızlı görüşme planlayın.\n\nÜrün bilgisi, fiyat talebi, servis ve filtre değişimi konularında bizimle iletişime geçin.\n\nTelefon: +90 555 000 00 00\nE-posta: info@bilisimsuaritma.com\nAdres: İstanbul / Türkiye\n\nWhatsApp ile hızlı iletişim başlatabilirsiniz.",
        isPublished: true
      },
      create: {
        title: "İletişim",
        slug: "iletisim",
        excerpt: "Teklif, servis ve ürün bilgisi için Bilişim Su Arıtma ile iletişime geçin.",
        content:
          "İhtiyacınıza uygun çözüm için hızlı görüşme planlayın.\n\nÜrün bilgisi, fiyat talebi, servis ve filtre değişimi konularında bizimle iletişime geçin.\n\nTelefon: +90 555 000 00 00\nE-posta: info@bilisimsuaritma.com\nAdres: İstanbul / Türkiye\n\nWhatsApp ile hızlı iletişim başlatabilirsiniz.",
        isPublished: true
      }
    })
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
