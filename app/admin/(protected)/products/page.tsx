import { Button } from "@/components/ui/button";
import { ProductsClient } from "@/components/admin/products-client";
import { phpGet } from "@/lib/php-api";

export default async function AdminProductsPage() {
  let products: Parameters<typeof ProductsClient>[0]["products"] = [];
  try {
    const res = await phpGet("products.php");
    if (res.ok) products = await res.json();
  } catch { /* backend erişilemez */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Ürün Yönetimi</h2>
          <p className="text-sm text-[var(--muted)]">Ürün ekleme, düzenleme ve görünürlük kontrolü.</p>
        </div>
        <Button href="/admin/products/new">Yeni Ürün</Button>
      </div>
      <ProductsClient products={products} />
    </div>
  );
}
