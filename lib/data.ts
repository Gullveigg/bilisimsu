import { prisma } from "@/lib/prisma";
import type { BlogPost, Category, Page, Product, Reference, Service } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };
type SiteSlide = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  trust: string[];
  image: string | null;
  video: string | null;
};

const fallbackDate = new Date("2026-01-01T00:00:00.000Z");

export const reservedPageSlugs = new Set([
  "kurumsal",
  "urunler",
  "hizmetler",
  "servis-filtre-degisimi",
  "blog",
  "iletisim",
  "admin",
  "api"
]);

const fallbackCategories: Category[] = [
  {
    id: "fallback-ev-tipi",
    name: "Ev Tipi Sistemler",
    slug: "ev-tipi",
    description: "Mutfak ve daire kullanımı için kompakt su arıtma cihazları.",
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  },
  {
    id: "fallback-isyeri",
    name: "İş Yeri Çözümleri",
    slug: "isyeri-cozumleri",
    description: "Ofis ve işletmeler için yüksek kapasiteli arıtma çözümleri.",
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  },
  {
    id: "fallback-endustriyel",
    name: "Endüstriyel Sistemler",
    slug: "endustriyel",
    description: "Kurumsal ve üretim alanları için ölçeklenebilir sistemler.",
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  }
];

const fallbackProducts: ProductWithCategory[] = [
  {
    id: "fallback-aqua-premium",
    name: "Aqua Premium 8 Aşamalı",
    slug: "aqua-premium-8-asamali",
    shortDescription: "Ev kullanımı için premium, sessiz ve kompakt su arıtma sistemi.",
    description:
      "Ev kullanıcıları için yüksek filtrasyon performansı ve şık tasarımı bir araya getirir.",
    technicalSpecs:
      "8 aşamalı filtrasyon\nGünlük 280 litre arıtma kapasitesi\nKompakt tezgah altı tasarım",
    price: "Teklif Al",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80",
    imageGallery: "[]",
    isFeatured: true,
    isActive: true,
    whatsappEnabled: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
    categoryId: fallbackCategories[0].id,
    category: fallbackCategories[0]
  },
  {
    id: "fallback-office-flow",
    name: "Office Flow Pro",
    slug: "office-flow-pro",
    shortDescription: "Ofisler için yüksek kapasiteli ve düşük bakım maliyetli sistem.",
    description:
      "Yoğun ofis kullanımı için tasarlanmış kurumsal su arıtma çözümüdür.",
    technicalSpecs:
      "Yüksek kapasiteli çıkış\nGelişmiş karbon blok filtre\nHızlı servis modülü",
    price: "Teklif Al",
    imageUrl: "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80",
    imageGallery: "[]",
    isFeatured: true,
    isActive: true,
    whatsappEnabled: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
    categoryId: fallbackCategories[1].id,
    category: fallbackCategories[1]
  },
  {
    id: "fallback-enterprise",
    name: "Pureline Enterprise",
    slug: "pureline-enterprise",
    shortDescription: "Yoğun tüketim noktaları için merkezi arıtma çözümü.",
    description:
      "Kurumsal binalar ve üretim alanları için ölçeklenebilir su arıtma altyapısı sağlar.",
    technicalSpecs:
      "Merkezi kurulum\nÇoklu hat desteği\nTers osmoz altyapısı",
    price: null,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageGallery: "[]",
    isFeatured: true,
    isActive: true,
    whatsappEnabled: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
    categoryId: fallbackCategories[2].id,
    category: fallbackCategories[2]
  }
];

const fallbackServices: Service[] = [
  {
    id: "fallback-kurulum",
    title: "Kurulum Hizmeti",
    slug: "kurulum-hizmeti",
    description: "Satın alınan sistemin keşif sonrası profesyonel kurulumunu yapıyoruz.",
    icon: "wrench",
    isActive: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  },
  {
    id: "fallback-bakim",
    title: "Periyodik Bakım",
    slug: "periyodik-bakim",
    description: "Filtre değişimi ve cihaz performans kontrolünü planlı biçimde sürdürüyoruz.",
    icon: "settings",
    isActive: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  },
  {
    id: "fallback-servis",
    title: "Teknik Servis",
    slug: "teknik-servis",
    description: "Arıza, bakım ve ürün desteği taleplerine hızlı dönüş sağlıyoruz.",
    icon: "phone",
    isActive: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  }
];

const fallbackBlogPosts: BlogPost[] = [
  {
    id: "fallback-blog-filtre",
    title: "Filtre Değişimi Ne Zaman Yapılmalı?",
    slug: "filtre-degisimi-ne-zaman-yapilmali",
    excerpt: "Su arıtma cihazlarında düzenli filtre değişiminin önemini ve temel işaretleri öğrenin.",
    content:
      "Filtre değişim aralığı kullanım yoğunluğu, su kalitesi ve cihaz modeline göre değişir. Düzenli bakım hem su kalitesini hem de cihaz ömrünü korur.",
    coverImage: "https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=1200&q=80",
    isPublished: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate
  }
];

const fallbackSlides: SiteSlide[] = [
  {
    eyebrow: "Kurumsal Su Teknolojileri",
    title: "Temiz, sağlıklı ve güvenilir su çözümleri",
    description:
      "Bilişim Su Arıtma ile eviniz ve iş yeriniz için kaliteli su arıtma sistemlerine kolayca ulaşın.",
    href: "/urunler",
    cta: "Ürünleri İncele",
    trust: ["Ücretsiz keşif", "Garantili kurulum", "7/24 destek"],
    image: null,
    video: null
  }
];

const fallbackReferences: Reference[] = [];

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function fallbackSiteData() {
  return {
    featuredProducts: fallbackProducts,
    categories: fallbackCategories,
    services: fallbackServices,
    blogPosts: fallbackBlogPosts,
    slides: fallbackSlides,
    references: fallbackReferences
  };
}

export async function getSiteData() {
  if (!hasDatabaseUrl()) {
    return fallbackSiteData();
  }

  const [featuredProducts, categories, services, blogPosts, heroSlides, references] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    }),
    prisma.reference.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    })
  ]);

  const slides = heroSlides.map((s) => {
    let trust: string[] = [];
    try { trust = JSON.parse(s.trust); } catch { trust = []; }
    return {
      eyebrow: s.eyebrow,
      title: s.title,
      description: s.description,
      href: s.href,
      cta: s.cta,
      trust,
      image: s.imageUrl ?? null,
      video: s.videoUrl ?? null
    };
  });

  return { featuredProducts, categories, services, blogPosts, slides, references };
}

export async function getProducts() {
  if (!hasDatabaseUrl()) {
    return fallbackProducts;
  }

  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProductBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }

  return prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });
}

export async function getRelatedProducts(categoryId: string, productId: string) {
  if (!hasDatabaseUrl()) {
    return fallbackProducts.filter((product) => product.categoryId === categoryId && product.id !== productId).slice(0, 3);
  }

  return prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: productId }
    },
    include: { category: true },
    take: 3
  });
}

export async function getPublishedPages() {
  if (!hasDatabaseUrl()) {
    return [] as Page[];
  }

  return prisma.page.findMany({
    where: {
      isPublished: true,
      slug: {
        notIn: Array.from(reservedPageSlugs)
      }
    },
    orderBy: { createdAt: "asc" }
  });
}

export async function getPublishedPageBySlug(slug: string) {
  if (reservedPageSlugs.has(slug)) {
    return null;
  }

  if (!hasDatabaseUrl()) {
    return null;
  }

  return prisma.page.findFirst({
    where: {
      slug,
      isPublished: true
    }
  });
}

export async function getServices() {
  if (!hasDatabaseUrl()) {
    return fallbackServices;
  }

  return prisma.service.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
}

export async function getBlogPosts() {
  if (!hasDatabaseUrl()) {
    return fallbackBlogPosts;
  }

  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getBlogPostBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }

  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getCorporatePage() {
  if (!hasDatabaseUrl()) {
    return null;
  }

  return prisma.page.findFirst({
    where: { slug: "kurumsal", isPublished: true }
  });
}
