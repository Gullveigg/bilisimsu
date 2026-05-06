import { ResourceManager } from "@/components/admin/resource-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });

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
