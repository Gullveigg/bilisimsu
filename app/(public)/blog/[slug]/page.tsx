import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { absoluteUrl, buildArticleSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: absoluteUrl(`/blog/${post.slug}`)
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      images: [post.coverImage]
    }
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.isPublished) {
    notFound();
  }

  const articleSchema = buildArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    createdAt: post.createdAt,
    slug: post.slug
  });

  return (
    <div className="container-shell py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Card className="mx-auto max-w-4xl p-8 lg:p-12">
        <p className="text-sm text-[var(--muted)]">{formatDate(post.createdAt)}</p>
        <h1 className="mt-4 text-4xl font-semibold">{post.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
        <div className="mt-8 border-t border-[var(--border)] pt-8 text-base leading-8 text-[var(--foreground)]">
          {post.content}
        </div>
      </Card>
    </div>
  );
}
