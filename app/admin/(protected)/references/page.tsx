import { phpGet } from "@/lib/php-api";
import { ReferencesManager } from "@/components/admin/references-manager";

export default async function AdminReferencesPage() {
  let references: unknown[] = [];
  try {
    const res = await phpGet("references.php");
    if (res.ok) references = await res.json();
  } catch { /* backend erişilemez */ }
  return <ReferencesManager references={references as Parameters<typeof ReferencesManager>[0]["references"]} />;
}
