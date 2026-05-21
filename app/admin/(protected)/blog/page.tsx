import { ResourceManager } from "@/components/admin/resource-manager";
import { phpGet } from "@/lib/php-api";

export default async function AdminBlogPage() {
  let posts: Record<string, unknown>[] = [];
  try {
    const res = await phpGet("blog.php");
    if (res.ok) posts = await res.json();
  } catch { /* backend erişilemez */ }

  return (
    <ResourceManager
      type="blog"
      title="Blog Yönetimi"
      endpoint="/api/blog"
      fields={[
        { key: "title", label: "Başlık" },
        { key: "slug", label: "Slug" },
        { key: "excerpt", label: "Özet", type: "textarea" },
        { key: "content", label: "İçerik", type: "richtext" },
        { key: "coverImage", label: "Kapak görsel URL" },
        { key: "isPublished", label: "Yayında", type: "checkbox" }
      ]}
      items={posts}
    />
  );
}
