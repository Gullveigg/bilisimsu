import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/public/product-card";
import { ProductGallery } from "@/components/public/product-gallery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildProductWhatsappMessage, buildWhatsappLink } from "@/lib/constants";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { absoluteUrl, buildProductSchema } from "@/lib/seo";
import { getProductImageSet, parseLines } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı"
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: {
      canonical: absoluteUrl(`/urunler/${product.slug}`)
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: absoluteUrl(`/urunler/${product.slug}`),
      images: [product.imageUrl]
    }
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const whatsappMessage = buildProductWhatsappMessage(product.name);
  const productImages = getProductImageSet(product.imageUrl, product.imageGallery);

  const productSchema = buildProductSchema({
    name: product.name,
    description: product.shortDescription,
    image: product.imageUrl,
    price: product.price ?? null,
    slug: product.slug
  });

  return (
    <div className="container-shell space-y-16 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden p-4">
          <ProductGallery images={productImages} name={product.name} />
        </Card>
        <Card className="space-y-6 p-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              {product.category.name}
            </span>
            <h1 className="text-4xl font-semibold">{product.name}</h1>
            <p className="text-base leading-8 text-[var(--muted)]">{product.shortDescription}</p>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">Fiyat</p>
            <p className="mt-2 text-3xl font-semibold">{product.price || "Teklif Al"}</p>
          </div>
          {product.whatsappEnabled ? (
            <Button
              href={buildWhatsappLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              WhatsApp’tan Bilgi Al
            </Button>
          ) : null}
        </Card>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold">Teknik Özellikler</h2>
          <div className="mt-5 space-y-4">
            {parseLines(product.technicalSpecs).map((spec) => (
              <div key={spec} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-sm text-[var(--foreground)]">{spec}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-8">
          <h2 className="text-2xl font-semibold">Açıklama</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{product.description}</p>
        </Card>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold">Benzer Ürünler</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
