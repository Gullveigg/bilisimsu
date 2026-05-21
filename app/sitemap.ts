import type { MetadataRoute } from "next";
import { phpGet } from "@/lib/php-api";
import { reservedPageSlugs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

  if (!process.env.PHP_API_URL) return staticRoutes;

  try {
    const [productsRes, blogRes, pagesRes] = await Promise.all([
      phpGet("products.php"),
      phpGet("blog.php"),
      phpGet("pages.php"),
    ]);

    const products: { slug: string; updatedAt: string; isActive: boolean }[]    = productsRes.ok ? await productsRes.json() : [];
    const posts:    { slug: string; updatedAt: string; isPublished: boolean }[]  = blogRes.ok     ? await blogRes.json()     : [];
    const pages:    { slug: string; updatedAt: string; isPublished: boolean }[]  = pagesRes.ok    ? await pagesRes.json()    : [];

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => p.isActive)
      .map((p) => ({ url: `${baseUrl}/urunler/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "weekly" as const, priority: 0.8 }));

    const blogRoutes: MetadataRoute.Sitemap = posts
      .filter((p) => p.isPublished)
      .map((p) => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.6 }));

    const pageRoutes: MetadataRoute.Sitemap = pages
      .filter((p) => p.isPublished && !reservedPageSlugs.has(p.slug))
      .map((p) => ({ url: `${baseUrl}/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.5 }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes, ...pageRoutes];
  } catch {
    return staticRoutes;
  }
}
