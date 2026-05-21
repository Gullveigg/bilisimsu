import { ResourceManager } from "@/components/admin/resource-manager";
import { phpGet } from "@/lib/php-api";

export default async function AdminServicesPage() {
  let services: Record<string, unknown>[] = [];
  try {
    const res = await phpGet("services.php");
    if (res.ok) services = await res.json();
  } catch { /* backend erişilemez */ }

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
