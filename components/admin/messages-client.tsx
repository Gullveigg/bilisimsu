"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactMessage } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Trash2, ChevronDown, ChevronUp, Search, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type SortOrder = "newest" | "oldest";

export function MessagesClient({ messages }: Readonly<{ messages: ContactMessage[] }>) {
  const router = useRouter();
  const [nameQuery, setNameQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const n = nameQuery.trim().toLocaleLowerCase("tr-TR");
    const p = phoneQuery.trim();
    return [...messages]
      .filter((m) => {
        const matchName = !n || m.name.toLocaleLowerCase("tr-TR").includes(n);
        const matchPhone = !p || (m.phone ?? "").includes(p);
        return matchName && matchPhone;
      })
      .sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortOrder === "newest" ? diff : -diff;
      });
  }, [messages, nameQuery, phoneQuery, sortOrder]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bu mesaj silinsin mi?")) return;
    setDeleting(id);
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(null);
  }

  const inputCls = "w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]";

  return (
    <div className="space-y-4">
      {/* Filtre */}
      <Card className="admin-card p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_200px]">
          <label className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input className={cn(inputCls, "pl-10")} placeholder="Ada göre ara"
              value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} />
          </label>
          <label className="relative">
            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input className={cn(inputCls, "pl-10")} placeholder="Telefona göre ara"
              value={phoneQuery} onChange={(e) => setPhoneQuery(e.target.value)} />
          </label>
          <select className={inputCls} value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
            <option value="newest">En yeni önce</option>
            <option value="oldest">En eski önce</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          {filtered.length} / {messages.length} mesaj gösteriliyor
        </p>
      </Card>

      {/* Liste */}
      {filtered.length === 0 ? (
        <Card className="admin-card p-10 text-center">
          <p className="text-sm text-[var(--muted)]">Arama kriterlerine uygun mesaj bulunamadı.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const isOpen = expanded.has(msg.id);
            const isLong = msg.message.length > 160;
            return (
              <Card key={msg.id} className="admin-card overflow-hidden p-0">
                {/* Üst satır */}
                <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar harf */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)] text-sm font-bold text-[var(--primary)]">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{msg.name}</p>
                      <p className="text-sm text-[var(--foreground)]">{msg.email}</p>
                      {msg.phone && (
                        <p className="text-sm font-bold text-[var(--foreground)]">{msg.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {/* Konu */}
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                      {msg.subject}
                    </span>
                    {/* Tarih */}
                    <span className="flex items-center gap-1 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs text-[var(--muted)]">
                      <Clock size={11} />
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Mesaj içeriği */}
                <div className="border-t border-[var(--border)] px-6 py-4">
                  <p className={cn("text-sm leading-7 text-[var(--foreground)]", !isOpen && isLong && "line-clamp-2")}>
                    {msg.message}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(msg.id)}
                      className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--primary)] transition hover:underline"
                    >
                      {isOpen ? <><ChevronUp size={13} /> Küçült</> : <><ChevronDown size={13} /> Tamamını oku</>}
                    </button>
                  )}
                </div>

                {/* Aksiyon çubuğu */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] bg-[var(--secondary)]/30 px-6 py-3">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                  >
                    <Mail size={13} />
                    E-posta Gönder
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-[var(--foreground)] transition hover:border-emerald-400 hover:text-emerald-600"
                    >
                      <Phone size={13} />
                      Ara
                    </a>
                  )}
                  <button
                    disabled={deleting === msg.id}
                    onClick={() => handleDelete(msg.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-transparent px-4 py-2 text-xs font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {deleting === msg.id ? "Siliniyor..." : "Sil"}
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
