import { Button } from "@/components/ui/button";
import { ProductsClient } from "@/components/admin/products-client";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

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
