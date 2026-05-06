"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductImageSet, parseImageGallery, slugify } from "@/lib/utils";
import { ImageIcon, Upload, X } from "lucide-react";

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

const inputCls =
  "w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]";

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const mainImageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    technicalSpecs: product?.technicalSpecs || "",
    price: product?.price || "",
    imageUrl: product?.imageUrl || "",
    imageGallery: parseImageGallery(product?.imageGallery),
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    whatsappEnabled: product?.whatsappEnabled ?? true
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"main" | number | null>(null);

  const previewImages = getProductImageSet(form.imageUrl, JSON.stringify(form.imageGallery));

  async function uploadFile(file: File, target: "main" | number) {
    setUploading(target);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(null);
    if (!res.ok) { setError(data.error || "Yükleme başarısız."); return; }
    if (target === "main") {
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } else {
      setForm((prev) => {
        const next = [...prev.imageGallery];
        next[target] = data.url;
        return { ...prev, imageGallery: next };
      });
    }
  }

  function updateGalleryImage(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.map((item, i) => (i === index ? value : item))
    }));
  }

  function addGalleryImage() {
    setForm((prev) => ({ ...prev, imageGallery: [...prev.imageGallery, ""] }));
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.categoryId) {
      setError("Önce bir kategori oluşturun.");
      setLoading(false);
      return;
    }

    const normalizedGallery = Array.from(
      new Set(
        form.imageGallery
          .map((u) => u.trim())
          .filter((u) => u.length > 0 && u !== form.imageUrl.trim())
      )
    );

    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl: form.imageUrl.trim(), imageGallery: normalizedGallery })
    });

    const result = await res.json();
    if (!res.ok) { setError(result.error || "İşlem başarısız."); setLoading(false); return; }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {!categories.length && (
        <div className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ürün ekleyebilmek için önce kategori oluşturmanız gerekiyor.
        </div>
      )}

      {/* Temel bilgiler */}
      <Card className="admin-card space-y-5 p-6 md:p-8">
        <h3 className="text-base font-semibold">Temel Bilgiler</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium">Ürün adı</span>
            <input className={inputCls} placeholder="Ürün adı" value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({ ...prev, name, slug: prev.slug ? prev.slug : slugify(name) }));
              }} required />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Slug</span>
            <input className={inputCls} placeholder="urun-adi" value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))} required />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Kategori</span>
            <select className={inputCls} value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              disabled={!categories.length}>
              {!categories.length && <option value="">Kategori yok</option>}
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Fiyat</span>
            <input className={inputCls} placeholder="₺ veya boş bırakın (Teklif Al)" value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
          </label>
        </div>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Kısa açıklama</span>
          <input className={inputCls} placeholder="Liste ve kart görünümünde kullanılır" value={form.shortDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Detaylı açıklama</span>
          <textarea className={`${inputCls} min-h-36 resize-none`} placeholder="Ürün detay sayfasında gösterilir"
            value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Teknik özellikler</span>
          <p className="mb-2 text-xs text-[var(--muted)]">Her satıra bir özellik yazın — detay sayfasında liste olarak gösterilir.</p>
          <textarea className={`${inputCls} min-h-36 resize-none`} placeholder={"Kapasite: 200 L/gün\nFiltre sayısı: 5\nBasınç: 2–6 bar"}
            value={form.technicalSpecs} onChange={(e) => setForm((prev) => ({ ...prev, technicalSpecs: e.target.value }))} required />
        </label>
      </Card>

      {/* Görseller */}
      <Card className="admin-card space-y-6 p-6 md:p-8">
        <h3 className="text-base font-semibold">Görseller</h3>

        {/* Ana görsel */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Ana görsel <span className="text-xs font-normal text-[var(--muted)]">— liste ve detay sayfasında ilk görünen</span></p>
          <div className="flex flex-wrap gap-3">
            <input className={`${inputCls} flex-1`} placeholder="https://… veya yükle →" value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
            <button type="button"
              className="inline-flex items-center gap-1.5 rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)]"
              onClick={() => mainImageRef.current?.click()}>
              <Upload size={14} />
              {uploading === "main" ? "Yükleniyor..." : "Yükle"}
            </button>
            <input ref={mainImageRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "main")} />
          </div>
          {form.imageUrl && (
            <div className="relative h-52 overflow-hidden rounded-[22px] border border-[var(--border)]">
              <Image src={form.imageUrl} alt="Ana görsel" fill className="object-cover" />
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70">
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Galeri */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Galeri görselleri</p>
            <Button type="button" variant="secondary" className="px-4 py-2 text-xs" onClick={addGalleryImage}>
              + Görsel Ekle
            </Button>
          </div>
          {form.imageGallery.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-[var(--border)] px-4 py-5 text-center text-sm text-[var(--muted)]">
              Henüz ek galeri görseli yok.
            </div>
          )}
          <div className="space-y-3">
            {form.imageGallery.map((img, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3">
                {img && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] border border-[var(--border)]">
                    <Image src={img} alt={`Galeri ${i + 1}`} fill className="object-cover" />
                  </div>
                )}
                {!img && (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-dashed border-[var(--border)] bg-white">
                    <ImageIcon size={18} className="text-[var(--muted)]" />
                  </div>
                )}
                <input className={`${inputCls} flex-1`} placeholder={`Görsel URL ${i + 1}`}
                  value={img} onChange={(e) => updateGalleryImage(i, e.target.value)} />
                <button type="button"
                  className="inline-flex items-center gap-1.5 rounded-[22px] border border-[var(--border)] bg-white px-3 py-3 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)]"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/jpeg,image/png,image/webp";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) uploadFile(file, i);
                    };
                    input.click();
                  }}>
                  <Upload size={14} />
                  {uploading === i ? "..." : "Yükle"}
                </button>
                <button type="button" onClick={() => removeGalleryImage(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-[18px] border border-[var(--border)] text-red-400 transition hover:border-red-200 hover:bg-red-50">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Önizleme grid */}
        {previewImages.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--muted)]">Önizleme</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previewImages.map((src, i) => (
                <div key={src} className="space-y-1.5">
                  <div className="relative h-28 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--secondary)]/40">
                    <Image src={src} alt={`Önizleme ${i + 1}`} fill className="object-cover" />
                  </div>
                  <p className="text-center text-xs text-[var(--muted)]">
                    {i === 0 ? "Ana" : `Galeri ${i}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Ayarlar */}
      <Card className="admin-card p-6 md:p-8">
        <h3 className="mb-4 text-base font-semibold">Ayarlar</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { key: "isFeatured", label: "Öne çıkan ürün", desc: "Anasayfada listelenir" },
            { key: "isActive", label: "Aktif", desc: "Sitede görünür" },
            { key: "whatsappEnabled", label: "WhatsApp butonu", desc: "Detay sayfasında gösterilir" }
          ].map((item) => (
            <label key={item.key}
              className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-[var(--border)] bg-white px-4 py-4 transition hover:border-[var(--primary)]/30">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                checked={form[item.key as keyof typeof form] as boolean}
                onChange={(e) => setForm((prev) => ({ ...prev, [item.key]: e.target.checked }))} />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" className="px-6" onClick={() => router.back()}>
          Vazgeç
        </Button>
        <Button type="submit" className="min-w-44" disabled={loading || !categories.length}>
          {loading ? "Kaydediliyor..." : product ? "Ürünü Güncelle" : "Ürün Oluştur"}
        </Button>
      </div>
    </form>
  );
}
