import { ResourceManager } from "@/components/admin/resource-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <ResourceManager
      type="service"
      title="Hizmet Yönetimi"
      endpoint="/api/services"
      fields={[
        { key: "title", label: "Hizmet başlığı" },
        { key: "slug", label: "Slug" },
        { key: "icon", label: "İkon adı" },
        { key: "description", label: "Açıklama", type: "textarea" },
        { key: "isActive", label: "Aktif", type: "checkbox" }
      ]}
      items={services}
    />
  );
}
