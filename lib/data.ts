import { phpGet } from "@/lib/php-api";

type Category = {
  id: string; name: string; slug: string; description: string | null;
  createdAt: string; updatedAt: string; _count?: { products: number } | null;
};
type ProductWithCategory = {
  id: string; name: string; slug: string; shortDescription: string;
  description: string; technicalSpecs: string; price: string | null;
  imageUrl: string; imageGallery: string; isFeatured: boolean;
  isActive: boolean; whatsappEnabled: boolean; categoryId: string;
  createdAt: string; updatedAt: string; category: Category;
};
type Service = {
  id: string; title: string; slug: string; description: string;
  icon: string; isActive: boolean; createdAt: string; updatedAt: string;
};
type BlogPost = {
  id: string; title: string; slug: string; excerpt: string;
  content: string; coverImage: string; isPublished: boolean;
  createdAt: string; updatedAt: string;
};
type Page = {
  id: string; title: string; slug: string; excerpt: string;
  content: string; isPublished: boolean; createdAt: string; updatedAt: string;
};
type SiteSlide = {
  eyebrow: string; title: string; description: string;
  href: string; cta: string; trust: string[];
  imageUrl?: string | null; videoUrl?: string | null;
  image?: string | null; video?: string | null;
};
type Reference = {
  id: string; name: string; logoUrl: string; website?: string | null;
  order: number; isActive: boolean; createdAt: string; updatedAt: string;
};

const fallbackDate = "2026-01-01T00:00:00.000Z";

const fallbackCategories: Category[] = [
  { id: "fallback-ev-tipi", name: "Ev Tipi Sistemler", slug: "ev-tipi",
    description: "Mutfak ve daire kullanımı için kompakt su arıtma cihazları.",
    createdAt: fallbackDate, updatedAt: fallbackDate },
  { id: "fallback-isyeri", name: "İş Yeri Çözümleri", slug: "isyeri-cozumleri",
    description: "Ofis ve işletmeler için yüksek kapasiteli arıtma çözümleri.",
    createdAt: fallbackDate, updatedAt: fallbackDate },
  { id: "fallback-endustriyel", name: "Endüstriyel Sistemler", slug: "endustriyel",
    description: "Kurumsal ve üretim alanları için ölçeklenebilir sistemler.",
    createdAt: fallbackDate, updatedAt: fallbackDate },
];

const fallbackProducts: ProductWithCategory[] = [
  {
    id: "fallback-aqua-premium", name: "Aqua Premium 8 Aşamalı",
    slug: "aqua-premium-8-asamali",
    shortDescription: "Ev kullanımı için premium, sessiz ve kompakt su arıtma sistemi.",
    description: "Ev kullanıcıları için yüksek filtrasyon performansı ve şık tasarımı bir araya getirir.",
    technicalSpecs: "8 aşamalı filtrasyon\nGünlük 280 litre arıtma kapasitesi\nKompakt tezgah altı tasarım",
    price: "Teklif Al",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80",
    imageGallery: "[]", isFeatured: true, isActive: true, whatsappEnabled: true,
    categoryId: fallbackCategories[0].id, createdAt: fallbackDate, updatedAt: fallbackDate,
    category: fallbackCategories[0],
  },
  {
    id: "fallback-office-flow", name: "Office Flow Pro", slug: "office-flow-pro",
    shortDescription: "Ofisler için yüksek kapasiteli ve düşük bakım maliyetli sistem.",
    description: "Yoğun ofis kullanımı için tasarlanmış kurumsal su arıtma çözümüdür.",
    technicalSpecs: "Yüksek kapasiteli çıkış\nGelişmiş karbon blok filtre\nHızlı servis modülü",
    price: "Teklif Al",
    imageUrl: "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80",
    imageGallery: "[]", isFeatured: true, isActive: true, whatsappEnabled: true,
    categoryId: fallbackCategories[1].id, createdAt: fallbackDate, updatedAt: fallbackDate,
    category: fallbackCategories[1],
  },
  {
    id: "fallback-enterprise", name: "Pureline Enterprise", slug: "pureline-enterprise",
    shortDescription: "Yoğun tüketim noktaları için merkezi arıtma çözümü.",
    description: "Kurumsal binalar ve üretim alanları için ölçeklenebilir su arıtma altyapısı sağlar.",
    technicalSpecs: "Merkezi kurulum\nÇoklu hat desteği\nTers osmoz altyapısı",
    price: null,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageGallery: "[]", isFeatured: true, isActive: true, whatsappEnabled: true,
    categoryId: fallbackCategories[2].id, createdAt: fallbackDate, updatedAt: fallbackDate,
    category: fallbackCategories[2],
  },
];

const fallbackServices: Service[] = [
  { id: "fb-kurulum", title: "Kurulum Hizmeti", slug: "kurulum-hizmeti",
    description: "Satın alınan sistemin keşif sonrası profesyonel kurulumunu yapıyoruz.",
    icon: "wrench", isActive: true, createdAt: fallbackDate, updatedAt: fallbackDate },
  { id: "fb-bakim", title: "Periyodik Bakım", slug: "periyodik-bakim",
    description: "Filtre değişimi ve cihaz performans kontrolünü planlı biçimde sürdürüyoruz.",
    icon: "settings", isActive: true, createdAt: fallbackDate, updatedAt: fallbackDate },
  { id: "fb-servis", title: "Teknik Servis", slug: "teknik-servis",
    description: "Arıza, bakım ve ürün desteği taleplerine hızlı dönüş sağlıyoruz.",
    icon: "phone", isActive: true, createdAt: fallbackDate, updatedAt: fallbackDate },
];

const fallbackBlogPosts: BlogPost[] = [
  {
    id: "fb-blog-filtre", title: "Filtre Değişimi Ne Zaman Yapılmalı?",
    slug: "filtre-degisimi-ne-zaman-yapilmali",
    excerpt: "Su arıtma cihazlarında düzenli filtre değişiminin önemini ve temel işaretleri öğrenin.",
    content: "Filtre değişim aralığı kullanım yoğunluğu, su kalitesi ve cihaz modeline göre değişir.",
    coverImage: "https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=1200&q=80",
    isPublished: true, createdAt: fallbackDate, updatedAt: fallbackDate,
  },
];

const fallbackSlides: SiteSlide[] = [
  {
    eyebrow: "Kurumsal Su Teknolojileri",
    title: "Temiz, sağlıklı ve güvenilir su çözümleri",
    description: "Bilişim Su Arıtma ile eviniz ve iş yeriniz için kaliteli su arıtma sistemlerine kolayca ulaşın.",
    href: "/urunler", cta: "Ürünleri İncele",
    trust: ["Ücretsiz keşif", "Garantili kurulum", "7/24 destek"],
    imageUrl: null, videoUrl: null, image: null, video: null,
  },
];

function hasPHPApi() {
  return Boolean(process.env.PHP_API_URL);
}

async function safeJson<T>(res: Response, fallback: T): Promise<T> {
  try {
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const reservedPageSlugs = new Set([
  "kurumsal", "urunler", "hizmetler", "servis-filtre-degisimi",
  "blog", "iletisim", "admin", "api",
]);

export async function getSiteData() {
  if (!hasPHPApi()) {
    return {
      featuredProducts: fallbackProducts,
      categories: fallbackCategories,
      services: fallbackServices,
      blogPosts: fallbackBlogPosts,
      slides: fallbackSlides,
      references: [] as Reference[],
    };
  }

  let productsRes, categoriesRes, servicesRes, blogRes, slidesRes, refsRes;
  try {
    [productsRes, categoriesRes, servicesRes, blogRes, slidesRes, refsRes] = await Promise.all([
      phpGet("products.php"),
      phpGet("categories.php"),
      phpGet("services.php"),
      phpGet("blog.php"),
      phpGet("banners.php"),
      phpGet("references.php"),
    ]);
  } catch {
    return {
      featuredProducts: fallbackProducts,
      categories: fallbackCategories,
      services: fallbackServices,
      blogPosts: fallbackBlogPosts,
      slides: fallbackSlides,
      references: [] as Reference[],
    };
  }

  const [allProducts, categories, services, blogPosts, rawSlides, references] = await Promise.all([
    safeJson<ProductWithCategory[]>(productsRes, fallbackProducts),
    safeJson<Category[]>(categoriesRes, fallbackCategories),
    safeJson<Service[]>(servicesRes, fallbackServices),
    safeJson<BlogPost[]>(blogRes, fallbackBlogPosts),
    safeJson<SiteSlide[]>(slidesRes, fallbackSlides),
    safeJson<Reference[]>(refsRes, []),
  ]);

  const featuredProducts = allProducts.filter((p) => p.isFeatured && p.isActive).slice(0, 3);
  const slides = rawSlides.map((s: SiteSlide) => ({
    ...s,
    image: s.imageUrl ?? null,
    video: s.videoUrl ?? null,
  }));

  return { featuredProducts, categories, services, blogPosts: blogPosts.slice(0, 3), slides, references };
}

export async function getProducts() {
  if (!hasPHPApi()) return fallbackProducts;
  const res = await phpGet("products.php");
  return safeJson<ProductWithCategory[]>(res, fallbackProducts);
}

export async function getProductBySlug(slug: string) {
  if (!hasPHPApi()) return fallbackProducts.find((p) => p.slug === slug) ?? null;
  const res = await phpGet("products.php", { id: slug });
  if (!res.ok) return null;
  try { return (await res.json()) as ProductWithCategory; } catch { return null; }
}

export async function getRelatedProducts(categoryId: string, productId: string) {
  const all = await getProducts();
  return all.filter((p) => p.categoryId === categoryId && p.id !== productId).slice(0, 3);
}

export async function getPublishedPages() {
  if (!hasPHPApi()) return [] as Page[];
  const res = await phpGet("pages.php");
  const pages = await safeJson<Page[]>(res, []);
  return pages.filter((p) => p.isPublished && !reservedPageSlugs.has(p.slug));
}

export async function getPublishedPageBySlug(slug: string) {
  if (reservedPageSlugs.has(slug)) return null;
  if (!hasPHPApi()) return null;
  const res = await phpGet("pages.php", { id: slug });
  if (!res.ok) return null;
  try {
    const page = (await res.json()) as Page;
    return page.isPublished ? page : null;
  } catch { return null; }
}

export async function getServices() {
  if (!hasPHPApi()) return fallbackServices;
  const res = await phpGet("services.php");
  return safeJson<Service[]>(res, fallbackServices);
}

export async function getBlogPosts() {
  if (!hasPHPApi()) return fallbackBlogPosts;
  const res = await phpGet("blog.php");
  return safeJson<BlogPost[]>(res, fallbackBlogPosts);
}

export async function getBlogPostBySlug(slug: string) {
  if (!hasPHPApi()) return fallbackBlogPosts.find((p) => p.slug === slug) ?? null;
  const res = await phpGet("blog.php", { id: slug });
  if (!res.ok) return null;
  try { return (await res.json()) as BlogPost; } catch { return null; }
}

export async function getCorporatePage() {
  if (!hasPHPApi()) return null;
  const res = await phpGet("pages.php", { id: "kurumsal" });
  if (!res.ok) return null;
  try {
    const page = (await res.json()) as Page;
    return page.isPublished ? page : null;
  } catch { return null; }
}
