"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { cn, slugify, stripHtml } from "@/lib/utils";

type ResourceType = "category" | "service" | "blog" | "page";

type ResourceManagerProps = {
  type: ResourceType;
  title: string;
  endpoint: string;
  fields: Array<{ key: string; label: string; type?: "text" | "textarea" | "checkbox" | "richtext" }>;
  items: Array<Record<string, unknown>>;
};

function emptyState(fields: ResourceManagerProps["fields"]) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = field.type === "checkbox" ? true : "";
    return acc;
  }, {});
}

export function ResourceManager({ title, endpoint, fields, items }: ResourceManagerProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, unknown>>(emptyState(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(key: string, value: unknown) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      const labelSource = key === "name" || key === "title";
      const hasSlugField = fields.some((field) => field.key === "slug");

      if (labelSource && hasSlugField && !editingId && !String(prev.slug ?? "").trim()) {
        next.slug = slugify(String(value));
      }

      if (key === "slug") {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error || "Kayıt kaydedilemedi.");
      setLoading(false);
      return;
    }

    setForm(emptyState(fields));
    setEditingId(null);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Kaydı silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    setError("");
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error || "Kayıt silinemedi.");
      return;
    }

    router.refresh();
  }

  function resetForm() {
    setForm(emptyState(fields));
    setEditingId(null);
    setError("");
  }

  return (
    <div className="space-y-6">
      <Card className="admin-card overflow-hidden p-0">
        <div className="border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(221,238,255,0.55),rgba(255,255,255,0.95))] px-6 py-5 md:px-8">
          <p className="text-sm font-medium text-[var(--muted)]">İçerik düzenleme alanı</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {editingId
                  ? "Seçili kaydı güncelliyorsunuz. Değişiklikler kaydedildiğinde liste anında yenilenir."
                  : "Yeni kayıt ekleyin, sonra alt bölümden mevcut içerikleri hızlıca düzenleyin."}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--muted)]">
              Toplam kayıt: <span className="font-semibold text-[var(--foreground)]">{items.length}</span>
            </div>
          </div>
        </div>
        <form className="space-y-6 px-6 py-6 md:px-8 md:py-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-2">
          {fields.map((field) =>
            field.type === "richtext" ? (
              <RichTextEditor
                key={field.key}
                label={field.label}
                value={String(form[field.key] ?? "")}
                onChange={(value) => updateField(field.key, value)}
              />
            ) : field.type === "textarea" ? (
              <label key={field.key} className={field.key === "content" ? "lg:col-span-2" : ""}>
                <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">{field.label}</span>
                <textarea
                  className={cn(
                    "w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]",
                    field.key === "content" ? "min-h-52" : "min-h-36"
                  )}
                  placeholder={`${field.label} girin`}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              </label>
            ) : field.type === "checkbox" ? (
              <label
                key={field.key}
                className="flex min-h-[60px] items-center gap-3 rounded-[22px] border border-[var(--border)] bg-[var(--secondary)]/45 px-4 py-3 lg:col-span-2"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--primary)]"
                  checked={Boolean(form[field.key])}
                  onChange={(event) => updateField(field.key, event.target.checked)}
                />
                <div>
                  <p className="font-medium text-[var(--foreground)]">{field.label}</p>
                  <p className="text-sm text-[var(--muted)]">Bu kayıt web sitesinde görünür durumda olur.</p>
                </div>
              </label>
            ) : (
              <label key={field.key}>
                <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">{field.label}</span>
                <input
                  className="w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
                  placeholder={`${field.label} girin`}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              </label>
            )
          )}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted)]">
              {editingId ? "Düzenleme modundasınız." : "Form alanları otomatik olarak slug üretimini destekler."}
            </p>
            <div className="flex flex-wrap gap-3">
              {editingId ? (
                <Button type="button" variant="secondary" className="px-5 py-3" onClick={resetForm}>
                  Vazgeç
                </Button>
              ) : null}
              <Button type="submit" disabled={loading} className="px-6 py-3">
                {loading ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Yeni Kayıt Ekle"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card className="admin-card overflow-hidden p-0">
        <div className="flex flex-col gap-2 border-b border-[var(--border)] px-6 py-5 md:px-8">
          <p className="text-sm font-medium text-[var(--muted)]">Mevcut kayıtlar</p>
          <h3 className="text-2xl font-semibold">Liste görünümü</h3>
        </div>
        <div className="grid gap-4 px-6 py-6 md:px-8 md:py-8">
          {items.length ? (
            items.map((item) => (
              <Card
                key={String(item.id)}
                className="flex flex-col gap-5 rounded-[24px] border border-[var(--border)] bg-white/95 p-5 shadow-none lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-semibold">
                      {String(item.name || item.title || item.slug || "Kayıt")}
                    </p>
                    {"isPublished" in item ? (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          item.isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {item.isPublished ? "Yayında" : "Taslak"}
                      </span>
                    ) : null}
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                    {stripHtml(String(item.description || item.excerpt || item.content || ""))}
                  </p>
                  {"_count" in item ? (() => {
                    const count = (item._count as { products?: number }).products ?? 0;
                    return (
                      <span className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        count > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-500"
                      )}>
                        {count > 0 ? `${count} bağlı ürün` : "Bağlı ürün yok"}
                      </span>
                    );
                  })() : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="px-4 py-2.5"
                    onClick={() => {
                      const next: Record<string, unknown> = {};
                      fields.forEach((field) => {
                        next[field.key] = item[field.key];
                      });
                      setForm(next);
                      setEditingId(String(item.id));
                      setError("");
                    }}
                  >
                    Düzenle
                  </Button>
                  {"_count" in item && ((item._count as { products?: number }).products ?? 0) > 0 ? (
                    <div title="Önce ürünleri başka kategoriye taşıyın">
                      <Button variant="dark" className="cursor-not-allowed px-4 py-2.5 opacity-40" disabled>
                        Sil
                      </Button>
                    </div>
                  ) : (
                    <Button variant="dark" className="px-4 py-2.5" onClick={() => handleDelete(String(item.id))}>
                      Sil
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-6 text-sm text-[var(--muted)]">
              Henüz kayıt bulunmuyor. İlk kaydı üstteki formdan ekleyebilirsiniz.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
