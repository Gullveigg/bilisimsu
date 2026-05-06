import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Yeni Ürün</h2>
        <p className="text-sm text-[var(--muted)]">Ürün bilgilerini doldurarak yeni kayıt oluşturun.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
