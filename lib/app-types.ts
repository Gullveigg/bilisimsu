// PHP backend'den gelen JSON ile uyumlu tipler (createdAt/updatedAt string olarak gelir)
// Prisma tiplerinin yerini alır

export type AppCategory = {
  id: string; name: string; slug: string; description: string | null;
  createdAt: string; updatedAt: string; _count?: { products: number } | null;
};

export type AppProduct = {
  id: string; name: string; slug: string; shortDescription: string;
  description: string; technicalSpecs: string; price: string | null;
  imageUrl: string; imageGallery: string; isFeatured: boolean;
  isActive: boolean; whatsappEnabled: boolean; categoryId: string;
  createdAt: string; updatedAt: string;
};

export type AppProductWithCategory = AppProduct & { category: AppCategory };

export type AppService = {
  id: string; title: string; slug: string; description: string;
  icon: string; isActive: boolean; createdAt: string; updatedAt: string;
};

export type AppBlogPost = {
  id: string; title: string; slug: string; excerpt: string;
  content: string; coverImage: string; isPublished: boolean;
  createdAt: string; updatedAt: string;
};

export type AppPage = {
  id: string; title: string; slug: string; excerpt: string;
  content: string; isPublished: boolean; createdAt: string; updatedAt: string;
};

export type AppReference = {
  id: string; name: string; logoUrl: string; website?: string | null;
  order: number; isActive: boolean; createdAt: string; updatedAt: string;
};

export type AppSlide = {
  eyebrow: string; title: string; description: string;
  href: string; cta: string; trust: string[];
  imageUrl?: string | null; videoUrl?: string | null;
  image?: string | null; video?: string | null;
};

export type AppContactMessage = {
  id: string; name: string; email: string; phone?: string | null;
  subject: string; message: string; createdAt: string;
};
