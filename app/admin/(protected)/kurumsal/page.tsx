import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCorporateContent } from "@/lib/utils";
import { KurumsalEditor } from "@/components/admin/kurumsal-editor";

export default async function AdminKurumsalPage() {
  const page = await prisma.page.findUnique({ where: { slug: "kurumsal" } });

  if (!page) notFound();

  const parsed = parseCorporateContent(page.content ?? "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kurumsal Sayfa</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Vizyon, misyon, değerler ve süreç adımlarını düzenleyin.
        </p>
      </div>
      <KurumsalEditor
        pageId={page.id}
        initial={{
          excerpt: page.excerpt ?? "",
          vision: parsed.vision,
          mission: parsed.mission,
          approach: parsed.approach,
          offerings: parsed.offerings,
          framework: parsed.framework,
          steps: parsed.steps,
        }}
      />
    </div>
  );
}
