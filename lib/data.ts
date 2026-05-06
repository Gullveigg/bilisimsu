import { prisma } from "@/lib/prisma";

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

export async function getSiteData() {
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
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });
}

export async function getRelatedProducts(categoryId: string, productId: string) {
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

  return prisma.page.findFirst({
    where: {
      slug,
      isPublished: true
    }
  });
}
