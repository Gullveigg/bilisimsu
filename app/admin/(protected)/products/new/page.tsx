import { ProductForm } from "@/components/admin/product-form";
import { phpGet } from "@/lib/php-api";

export default async function NewProductPage() {
  let categories: Parameters<typeof ProductForm>[0]["categories"] = [];
  try {
    const res = await phpGet("categories.php");
    if (res.ok) categories = await res.json();
  } catch { /* backend erişilemez */ }

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
