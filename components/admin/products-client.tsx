"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, getProductImageSet } from "@/lib/utils";
import { Search } from "lucide-react";

type ProductWithCategory = Product & { category: Category };

const selectCls =
  "rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]";

export function ProductsClient({ products }: Readonly<{ products: ProductWithCategory[] }>) {
  const router = useRouter();
  const [nameQuery, setNameQuery] = useState("");
  const [skuQuery, setSkuQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "passive">("all");
  const [featured, setFeatured] = useState<"all" | "featured" | "normal">("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const name = nameQuery.trim().toLocaleLowerCase("tr-TR");
    const sku = skuQuery.trim().toLocaleLowerCase("tr-TR");

    const result = products.filter((p) => {
      const matchName = !name || p.name.toLocaleLowerCase("tr-TR").includes(name);
      const matchSku = !sku || p.slug.toLocaleLowerCase("tr-TR").includes(sku);
      const matchS = status === "all" || (status === "active" ? p.isActive : !p.isActive);
      const matchF = featured === "all" || (featured === "featured" ? p.isFeatured : !p.isFeatured);
      return matchName && matchSku && matchS && matchF;
    });

    result.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return dateSort === "newest" ? -diff : diff;
    });

    return result;
  }, [products, nameQuery, skuQuery, status, featured, dateSort]);

  async function handleDelete(id: string) {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setBusyId(id);
    setFeedback("");
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) { setFeedback(result?.error || "Silinemedi."); setBusyId(null); return; }
    setBusyId(null);
    router.refresh();
  }

  async function handleToggle(p: ProductWithCategory) {
    setBusyId(p.id);
    setFeedback("");
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: p.name, slug: p.slug, categoryId: p.categoryId,
        shortDescription: p.shortDescription, description: p.description,
        technicalSpecs: p.technicalSpecs, price: p.price || "",
        imageUrl: p.imageUrl,
        imageGallery: getProductImageSet(p.imageUrl, p.imageGallery).slice(1),
        isFeatured: p.isFeatured, isActive: !p.isActive, whatsappEnabled: p.whatsappEnabled
      })
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) { setFeedback(result?.error || "Güncellenemedi."); setBusyId(null); return; }
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Filtre */}
      <Card className="admin-card p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Ürün adı */}
          <label className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              className="w-full rounded-[20px] border border-[var(--border)] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
              placeholder="Ürün adına göre ara"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
            />
          </label>
          {/* SKU / slug */}
          <label className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              className="w-full rounded-[20px] border border-[var(--border)] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
              placeholder="SKU / slug ara"
              value={skuQuery}
              onChange={(e) => setSkuQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {/* Tarihe göre sıralama */}
          <select className={selectCls} value={dateSort} onChange={(e) => setDateSort(e.target.value as typeof dateSort)}>
            <option value="newest">En yeni önce</option>
            <option value="oldest">En eski önce</option>
          </select>
          {/* Durum */}
          <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">Tüm durumlar</option>
            <option value="active">Aktif</option>
            <option value="passive">Pasif</option>
          </select>
          {/* Vitrin */}
          <select className={selectCls} value={featured} onChange={(e) => setFeatured(e.target.value as typeof featured)}>
            <option value="all">Tüm vitrinler</option>
            <option value="featured">Öne çıkanlar</option>
            <option value="normal">Normal</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          {filtered.length} / {products.length} ürün gösteriliyor
        </p>
      </Card>

      {feedback && <p className="text-sm text-red-600">{feedback}</p>}

      {filtered.length === 0 ? (
        <Card className="admin-card p-10 text-center">
          <p className="text-sm text-[var(--muted)]">Arama kriterlerine uygun ürün bulunamadı.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const imgCount = getProductImageSet(p.imageUrl, p.imageGallery).length;
            return (
              <Card key={p.id} className="admin-card overflow-hidden p-0">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  {/* Görsel */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--secondary)]/40">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  </div>

                  {/* Bilgi */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[var(--foreground)]">{p.name}</p>
                      {/* Durum badge */}
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {p.isActive ? "Aktif" : "Pasif"}
                      </span>
                      {/* Öne çıkan badge */}
                      {p.isFeatured && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          Öne Çıkan
                        </span>
                      )}
                      {/* WhatsApp badge */}
                      {p.whatsappEnabled && (
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          WhatsApp
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                      <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5">{p.category.name}</span>
                      <span>/{p.slug}</span>
                      <span>{p.price || "Teklif Al"}</span>
                      <span>{imgCount} fotoğraf</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] line-clamp-1">{p.shortDescription}</p>
                  </div>
                </div>

                {/* Aksiyon çubuğu */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] bg-[var(--secondary)]/30 px-5 py-3">
                  <Button href={`/admin/products/${p.id}/edit`} variant="secondary" className="px-4 py-2 text-xs">
                    Düzenle
                  </Button>
                  <button
                    onClick={() => handleToggle(p)}
                    disabled={busyId === p.id}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-medium transition disabled:opacity-50",
                      p.isActive
                        ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                    )}
                  >
                    {p.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={busyId === p.id}
                    className="ml-auto rounded-full border border-transparent px-4 py-2 text-xs font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                  >
                    Sil
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
