import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { phpGet } from "@/lib/php-api";

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  let product: Parameters<typeof ProductForm>[0]["product"] | null = null;
  let categories: Parameters<typeof ProductForm>[0]["categories"] = [];
  try {
    const [productRes, categoriesRes] = await Promise.all([
      phpGet("products.php", { id }),
      phpGet("categories.php"),
    ]);
    if (productRes.ok) product = await productRes.json();
    if (categoriesRes.ok) categories = await categoriesRes.json();
  } catch { /* backend erişilemez */ }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Ürün Düzenle</h2>
        <p className="text-sm text-[var(--muted)]">{product.name} kaydını güncelleyin.</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
