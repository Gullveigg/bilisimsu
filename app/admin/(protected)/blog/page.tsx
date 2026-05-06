import { ResourceManager } from "@/components/admin/resource-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

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
