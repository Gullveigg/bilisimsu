import { ResourceManager } from "@/components/admin/resource-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

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
