"use client";

import { useState } from "react";
import { buildWhatsappLink, whatsappTopics } from "@/lib/constants";

export function WhatsAppTopicPicker() {
  const [selected, setSelected] = useState<number | null>(null);

  const topic = selected !== null ? whatsappTopics[selected] : null;
  const link = topic ? buildWhatsappLink(topic.message) : "#";

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Konu seçin</p>
      <div className="grid grid-cols-2 gap-2">
        {whatsappTopics.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setSelected(i === selected ? null : i)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              selected === i
                ? "border-[#25D366] bg-[#f0fdf4] text-[#166534]"
                : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[#25D366]/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <a
        href={link}
        target={topic ? "_blank" : undefined}
        rel="noreferrer"
        onClick={(e) => !topic && e.preventDefault()}
        className={`flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-sm font-semibold shadow transition ${
          topic
            ? "bg-[#25D366] text-white hover:bg-[#1ebe5c]"
            : "cursor-not-allowed bg-[var(--border)] text-[var(--muted)]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.878-1.426A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.073-1.115l-.292-.174-3.024.884.844-3.098-.19-.317A7.955 7.955 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
        {topic ? `WhatsApp'ta Başlat — ${topic.label}` : "Konu seçilmedi"}
      </a>
    </div>
  );
}
