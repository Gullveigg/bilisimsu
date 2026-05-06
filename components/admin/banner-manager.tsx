"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImageIcon, VideoIcon, X, Plus, GripVertical } from "lucide-react";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  trust: string;
  imageUrl: string | null;
  videoUrl: string | null;
  order: number;
  isActive: boolean;
};

const empty = (): Omit<Slide, "id" | "trust"> & { trust: string[] } => ({
  eyebrow: "",
  title: "",
  description: "",
  href: "/urunler",
  cta: "İncele",
  trust: ["", "", ""],
  imageUrl: null,
  videoUrl: null,
  order: 0,
  isActive: true
});

function parseSlide(s: Slide) {
  let trust: string[] = [];
  try { trust = JSON.parse(s.trust); } catch { trust = []; }
  return { ...s, trust };
}

function inputClass(full = false) {
  return cn(
    "w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]",
    full && "lg:col-span-2"
  );
}

export function BannerManager({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setTrust(i: number, value: string) {
    const next = [...form.trust];
    next[i] = value;
    setForm((prev) => ({ ...prev, trust: next }));
  }

  async function uploadFile(file: File, type: "image" | "video") {
    setUploading(type);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(null);
    if (!res.ok) { setError(data.error || "Yükleme başarısız."); return; }
    if (type === "image") set("imageUrl", data.url);
    else set("videoUrl", data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      trust: form.trust.filter(Boolean),
      order: Number(form.order)
    };

    const res = await fetch(
      editingId ? `/api/banners/${editingId}` : "/api/banners",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setError(d?.error || "Kayıt kaydedilemedi.");
      setLoading(false);
      return;
    }

    setForm(empty());
    setEditingId(null);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Banner silinsin mi?")) return;
    const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    if (!res.ok) { setError("Silinemedi."); return; }
    router.refresh();
  }

  function startEdit(s: Slide) {
    const parsed = parseSlide(s);
    setForm({ ...parsed, trust: parsed.trust.length ? [...parsed.trust, "", ""].slice(0, 3) : ["", "", ""] });
    setEditingId(s.id);
    setError("");
  }

  function reset() {
    setForm(empty());
    setEditingId(null);
    setError("");
  }

  return (
    <div className="space-y-6">
      {/* ── Form ─── */}
      <Card className="admin-card overflow-hidden p-0">
        <div className="border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(221,238,255,0.55),rgba(255,255,255,0.95))] px-6 py-5 md:px-8">
          <p className="text-sm font-medium text-[var(--muted)]">Hero slider yönetimi</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Banner Yönetimi</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {editingId
                  ? "Seçili banneri güncelliyorsunuz."
                  : "Yeni banner ekle, görsel veya video yükle."}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--muted)]">
              Toplam: <span className="font-semibold text-[var(--foreground)]">{slides.length}</span>
            </div>
          </div>
        </div>

        <form className="space-y-6 px-6 py-6 md:px-8 md:py-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Eyebrow */}
            <label>
              <span className="mb-2 block text-sm font-medium">Üst etiket (eyebrow)</span>
              <input className={inputClass()} placeholder="Kurumsal Su Teknolojileri" value={form.eyebrow}
                onChange={(e) => set("eyebrow", e.target.value)} required />
            </label>

            {/* CTA */}
            <label>
              <span className="mb-2 block text-sm font-medium">Buton metni</span>
              <input className={inputClass()} placeholder="Ürünleri İncele" value={form.cta}
                onChange={(e) => set("cta", e.target.value)} required />
            </label>

            {/* Title */}
            <label className="lg:col-span-2">
              <span className="mb-2 block text-sm font-medium">Başlık</span>
              <input className={inputClass(true)} placeholder="Temiz, sağlıklı ve güvenilir su çözümleri"
                value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </label>

            {/* Description */}
            <label className="lg:col-span-2">
              <span className="mb-2 block text-sm font-medium">Açıklama</span>
              <textarea className={cn(inputClass(true), "min-h-24 resize-none")}
                placeholder="Bilişim Su Arıtma ile eviniz ve iş yeriniz için..."
                value={form.description} onChange={(e) => set("description", e.target.value)} required />
            </label>

            {/* Href + Order */}
            <label>
              <span className="mb-2 block text-sm font-medium">Bağlantı (href)</span>
              <input className={inputClass()} placeholder="/urunler" value={form.href}
                onChange={(e) => set("href", e.target.value)} required />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">Sıra numarası</span>
              <input type="number" className={inputClass()} value={form.order}
                onChange={(e) => set("order", parseInt(e.target.value) || 0)} />
            </label>

            {/* Trust items */}
            <div className="lg:col-span-2">
              <p className="mb-3 text-sm font-medium">Güven göstergeleri (en fazla 3)</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {form.trust.map((t, i) => (
                  <input key={i} className={inputClass()} placeholder={["Ücretsiz keşif", "Garantili kurulum", "7/24 destek"][i]}
                    value={t} onChange={(e) => setTrust(i, e.target.value)} />
                ))}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <p className="mb-1 text-sm font-medium">Arka plan görseli</p>
              <p className="mb-3 text-xs text-[var(--muted)]">
                Önerilen: <span className="font-semibold text-[var(--foreground)]">1920 × 760 px</span> · JPG, PNG veya WEBP · Maks. 10 MB
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button"
                  className="inline-flex items-center gap-2 rounded-[20px] border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)]"
                  onClick={() => imageRef.current?.click()}>
                  <ImageIcon size={15} />
                  {uploading === "image" ? "Yükleniyor..." : "Görsel Seç"}
                </button>
                <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "image")} />
                {form.imageUrl && (
                  <div className="flex items-center gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-xs text-[var(--muted)]">
                    <span className="max-w-[160px] truncate">{form.imageUrl}</span>
                    <button type="button" onClick={() => set("imageUrl", null)}><X size={12} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Video upload */}
            <div>
              <p className="mb-1 text-sm font-medium">Arka plan videosu</p>
              <p className="mb-3 text-xs text-[var(--muted)]">
                Önerilen: <span className="font-semibold text-[var(--foreground)]">1920 × 1080 px</span> · MP4 veya WEBM · Maks. 100 MB · Video varsa görselin önünde gösterilir
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button"
                  className="inline-flex items-center gap-2 rounded-[20px] border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)]"
                  onClick={() => videoRef.current?.click()}>
                  <VideoIcon size={15} />
                  {uploading === "video" ? "Yükleniyor..." : "Video Seç"}
                </button>
                <input ref={videoRef} type="file" accept="video/mp4,video/webm" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")} />
                {form.videoUrl && (
                  <div className="flex items-center gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-xs text-[var(--muted)]">
                    <span className="max-w-[160px] truncate">{form.videoUrl}</span>
                    <button type="button" onClick={() => set("videoUrl", null)}><X size={12} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* isActive */}
            <label className="flex min-h-[60px] items-center gap-3 rounded-[22px] border border-[var(--border)] bg-[var(--secondary)]/45 px-4 py-3 lg:col-span-2">
              <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]"
                checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
              <div>
                <p className="font-medium">Aktif</p>
                <p className="text-sm text-[var(--muted)]">Aktif bannerlar slider&apos;da gösterilir.</p>
              </div>
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted)]">
              {editingId ? "Düzenleme modundasınız." : "Sıra numarası küçük olan önce gösterilir."}
            </p>
            <div className="flex flex-wrap gap-3">
              {editingId ? (
                <Button type="button" variant="secondary" className="px-5 py-3" onClick={reset}>
                  Vazgeç
                </Button>
              ) : null}
              <Button type="submit" disabled={loading || uploading !== null} className="px-6 py-3">
                {loading ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Banner Ekle"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* ── List ─── */}
      <Card className="admin-card overflow-hidden p-0">
        <div className="flex flex-col gap-2 border-b border-[var(--border)] px-6 py-5 md:px-8">
          <p className="text-sm font-medium text-[var(--muted)]">Mevcut bannerlar</p>
          <h3 className="text-2xl font-semibold">Liste görünümü</h3>
        </div>
        <div className="grid gap-4 px-6 py-6 md:px-8 md:py-8">
          {slides.length ? (
            slides.map((s) => {
              let trust: string[] = [];
              try { trust = JSON.parse(s.trust); } catch { trust = []; }
              return (
                <Card key={s.id}
                  className="flex flex-col gap-5 rounded-[24px] border border-[var(--border)] bg-white/95 p-5 shadow-none lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--secondary)] text-xs font-bold text-[var(--primary)]">
                      <GripVertical size={16} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold">{s.title}</p>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          s.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>
                          {s.isActive ? "Aktif" : "Pasif"}
                        </span>
                        <span className="rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">
                          Sıra: {s.order}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{s.eyebrow} · {s.cta}</p>
                      <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">{s.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {trust.filter(Boolean).map((t) => (
                          <span key={t} className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                            {t}
                          </span>
                        ))}
                      </div>
                      {(s.imageUrl || s.videoUrl) && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {s.imageUrl && (
                            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
                              <ImageIcon size={11} /> Görsel yüklü
                            </span>
                          )}
                          {s.videoUrl && (
                            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs text-purple-700">
                              <VideoIcon size={11} /> Video yüklü
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:shrink-0">
                    <Button variant="secondary" className="px-4 py-2.5" onClick={() => startEdit(s)}>
                      Düzenle
                    </Button>
                    <Button variant="dark" className="px-4 py-2.5" onClick={() => handleDelete(s.id)}>
                      Sil
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-6 text-sm text-[var(--muted)]">
              Henüz banner yok. Üstteki formdan ilk banneri ekleyebilirsiniz.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
