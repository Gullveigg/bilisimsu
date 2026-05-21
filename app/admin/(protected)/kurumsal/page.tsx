import { notFound } from "next/navigation";
import { phpGet } from "@/lib/php-api";
import { parseCorporateContent } from "@/lib/utils";
import { KurumsalEditor } from "@/components/admin/kurumsal-editor";

export default async function AdminKurumsalPage() {
  let page: { id: string; title: string; slug: string; excerpt: string; content: string; isPublished: boolean } | null = null;
  try {
    const res = await phpGet("pages.php", { id: "kurumsal" });
    if (res.ok) page = await res.json();
  } catch { /* backend erişilemez */ }

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
