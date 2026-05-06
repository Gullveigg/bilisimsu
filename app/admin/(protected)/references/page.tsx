import { prisma } from "@/lib/prisma";
import { ReferencesManager } from "@/components/admin/references-manager";

export default async function AdminReferencesPage() {
  const references = await prisma.reference.findMany({ orderBy: { order: "asc" } });
  return <ReferencesManager references={references} />;
}
