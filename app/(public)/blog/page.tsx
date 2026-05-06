import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { formatDate } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog / Faydalı Bilgiler",
  description: "Su arıtma cihazları, bakım süreçleri ve doğru ürün seçimi hakkında içerikler.",
  path: "/blog",
  keywords: ["su arıtma blog", "bakım önerileri", "ürün seçimi"]
});

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container-shell space-y-10 py-12">
      <SectionTitle
        eyebrow="Blog"
        title="Doğru su arıtma kararı için faydalı bilgiler"
        description="Ürün seçimi, bakım dönemleri ve kullanım önerileri hakkında kısa içerikler."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} className="p-8">
            <p className="text-sm text-[var(--muted)]">{formatDate(post.createdAt)}</p>
            <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
            >
              Yazıyı aç
              <ArrowRight size={16} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
