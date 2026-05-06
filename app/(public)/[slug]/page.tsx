import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedPageBySlug } from "@/lib/data";
import { convertPlainTextToHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) {
    return {
      title: "Sayfa Bulunamadı"
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.excerpt,
    path: `/${page.slug}`,
    keywords: [page.title]
  });
}

export default async function DynamicPage({ params }: Params) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container-shell py-12">
      <Card className="space-y-8 p-8 md:p-10">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Kurumsal Sayfa
          </span>
          <h1 className="text-4xl font-semibold">{page.title}</h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">{page.excerpt}</p>
        </div>
        <div className="rounded-[28px] border border-[var(--border)] bg-white p-6">
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: convertPlainTextToHtml(page.content) }}
          />
        </div>
      </Card>
    </div>
  );
}
