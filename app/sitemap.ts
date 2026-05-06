import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { reservedPageSlugs } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [products, posts, pages] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true, isActive: true } }),
    prisma.blogPost.findMany({ select: { slug: true, updatedAt: true, isPublished: true } }),
    prisma.page.findMany({ select: { slug: true, updatedAt: true, isPublished: true } })
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "",                        priority: 1.0,  freq: "daily"   },
    { path: "/urunler",                priority: 0.9,  freq: "weekly"  },
    { path: "/hizmetler",              priority: 0.85, freq: "monthly" },
    { path: "/servis-filtre-degisimi", priority: 0.85, freq: "monthly" },
    { path: "/kurumsal",               priority: 0.7,  freq: "monthly" },
    { path: "/blog",                   priority: 0.8,  freq: "weekly"  },
    { path: "/iletisim",               priority: 0.7,  freq: "monthly" }
  ].map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority
  }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p: { slug: string; updatedAt: Date; isActive: boolean }) => p.isActive)
    .map((p: { slug: string; updatedAt: Date; isActive: boolean }) => ({
      url: `${baseUrl}/urunler/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p: { slug: string; updatedAt: Date; isPublished: boolean }) => p.isPublished)
    .map((p: { slug: string; updatedAt: Date; isPublished: boolean }) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }));

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((p: { slug: string; updatedAt: Date; isPublished: boolean }) => p.isPublished && !reservedPageSlugs.has(p.slug))
    .map((p: { slug: string; updatedAt: Date; isPublished: boolean }) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5
    }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...pageRoutes];
}
