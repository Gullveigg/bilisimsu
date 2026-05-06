"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Check, Upload } from "lucide-react";
import type { Reference } from "@prisma/client";

const inputCls =
  "w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]";

type FormData = {
  name: string;
  logoUrl: string;
  website: string;
  order: number;
  isActive: boolean;
};

const empty: FormData = { name: "", logoUrl: "", website: "", order: 0, isActive: true };

function ReferenceForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof FormData, v: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) set("logoUrl", data.url);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-3 rounded-[20px] border border-[var(--border)] bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Firma Adı *</span>
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Örn: COMWATECH GmbH" />
        </label>
        <div>
          <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Logo *</span>
          <div className="flex gap-2">
            <input className={`${inputCls} flex-1`} value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="/slides/logo.png veya https://..." />
            <label className="flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-[18px] border border-[var(--border)] bg-white text-[var(--muted)] transition hover:border-[var(--primary)]/40 hover:text-[var(--primary)]">
              {uploading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" /> : <Upload size={16} />}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          {form.logoUrl && (
            <div className="mt-2 flex h-12 w-24 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-white p-1">
              <Image src={form.logoUrl} alt="önizleme" width={80} height={40} className="h-auto max-h-10 w-auto max-w-full object-contain" unoptimized />
            </div>
          )}
        </div>
        <label>
          <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Web Sitesi</span>
          <input className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Sıra</span>
          <input type="number" className={inputCls} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 rounded" />
        Aktif
      </label>
      <div className="flex gap-2 pt-1">
        <Button type="button" className="gap-1.5 px-5 py-2 text-xs" onClick={() => onSave(form)} disabled={loading}>
          <Check size={13} /> Kaydet
        </Button>
        <Button type="button" variant="secondary" className="px-5 py-2 text-xs" onClick={onCancel} disabled={loading}>
          <X size={13} /> İptal
        </Button>
      </div>
    </div>
  );
}

export function ReferencesManager({ references: initial }: { references: Reference[] }) {
  const router = useRouter();
  const [references, setReferences] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd(data: FormData) {
    setLoading(true);
    const res = await fetch("/api/references", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const ref = await res.json();
    if (res.ok) {
      setReferences((prev) => [...prev, ref]);
      setAdding(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleEdit(id: string, data: FormData) {
    setLoading(true);
    const res = await fetch(`/api/references/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const ref = await res.json();
    if (res.ok) {
      setReferences((prev) => prev.map((r) => (r.id === id ? ref : r)));
      setEditingId(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    const res = await fetch(`/api/references/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReferences((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Referanslar</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Anasayfada kayan bantta gösterilen referans logoları.</p>
        </div>
        {!adding && (
          <Button type="button" className="gap-1.5 px-5 py-2.5 text-sm" onClick={() => setAdding(true)}>
            <Plus size={15} /> Yeni Referans
          </Button>
        )}
      </div>

      {adding && (
        <Card className="admin-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Yeni Referans</h3>
          <ReferenceForm initial={empty} onSave={handleAdd} onCancel={() => setAdding(false)} loading={loading} />
        </Card>
      )}

      <div className="space-y-3">
        {references.length === 0 && (
          <p className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)]">
            Henüz referans eklenmemiş.
          </p>
        )}
        {references.map((ref) => (
          <Card key={ref.id} className="admin-card p-4">
            {editingId === ref.id ? (
              <ReferenceForm
                initial={{ name: ref.name, logoUrl: ref.logoUrl, website: ref.website ?? "", order: ref.order, isActive: ref.isActive }}
                onSave={(data) => handleEdit(ref.id, data)}
                onCancel={() => setEditingId(null)}
                loading={loading}
              />
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2">
                  <Image src={ref.logoUrl} alt={ref.name} width={80} height={40} className="h-auto max-h-10 w-auto max-w-full object-contain" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{ref.name}</p>
                  {ref.website && <p className="text-xs text-[var(--muted)] truncate">{ref.website}</p>}
                  <p className="text-xs text-[var(--muted)]">Sıra: {ref.order} · {ref.isActive ? "Aktif" : "Pasif"}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditingId(ref.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(ref.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-red-400 transition hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
