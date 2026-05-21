import { ResourceManager } from "@/components/admin/resource-manager";
import { phpGet } from "@/lib/php-api";

export default async function AdminCategoriesPage() {
  let categories: Record<string, unknown>[] = [];
  try {
    const res = await phpGet("categories.php");
    if (res.ok) categories = await res.json();
  } catch { /* backend erişilemez */ }

  return (
    <ResourceManager
      type="category"
      title="Kategori Yönetimi"
      endpoint="/api/categories"
      fields={[
        { key: "name", label: "Kategori adı" },
        { key: "slug", label: "Slug" },
        { key: "description", label: "Açıklama", type: "textarea" }
      ]}
      items={categories}
    />
  );
}
