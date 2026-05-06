import type { Metadata } from "next";
import { ProductCard } from "@/components/public/product-card";
import { SectionTitle } from "@/components/ui/section-title";
import { getProducts } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Ürünler",
  description: "Ev, ofis ve kurumsal kullanım için su arıtma cihazları ve sistem çözümleri.",
  path: "/urunler",
  keywords: ["ev tipi su arıtma", "kurumsal su arıtma", "arıtma ürünleri"]
});

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container-shell space-y-10 py-12">
      <SectionTitle
        eyebrow="Ürünler"
        title="Farklı kullanım senaryoları için seçili su arıtma sistemleri"
        description="Kapasite, alan tipi ve bakım ihtiyacına göre kategorize edilmiş ürünleri inceleyin."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
