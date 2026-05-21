import { ResourceManager } from "@/components/admin/resource-manager";
import { phpGet } from "@/lib/php-api";

export default async function AdminPagesPage() {
  let pages: Record<string, unknown>[] = [];
  try {
    const res = await phpGet("pages.php");
    if (res.ok) pages = await res.json();
  } catch { /* backend erişilemez */ }

  return (
    <ResourceManager
      type="page"
      title="Sayfa Yönetimi"
      endpoint="/api/pages"
      fields={[
        { key: "title", label: "Sayfa başlığı" },
        { key: "slug", label: "Slug" },
        { key: "excerpt", label: "Özet", type: "textarea" },
        { key: "content", label: "İçerik", type: "richtext" },
        { key: "isPublished", label: "Yayında", type: "checkbox" }
      ]}
      items={pages}
    />
  );
}
