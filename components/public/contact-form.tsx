"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Mesaj gönderilemedi.");
      setLoading(false);
      return;
    }

    setStatus("Mesajınız alındı. En kısa sürede dönüş yapacağız.");
    setForm(initialState);
    setLoading(false);
  }

  return (
    <form className="glass-card space-y-4 p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[var(--primary)]"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <input
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[var(--primary)]"
          placeholder="E-posta"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[var(--primary)]"
          placeholder="Telefon"
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <input
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[var(--primary)]"
          placeholder="Konu"
          value={form.subject}
          onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
        />
      </div>
      <textarea
        className="min-h-36 w-full rounded-3xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
        placeholder="Mesajınız"
        value={form.message}
        onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted)]">{status}</p>
        <Button type="submit" className="min-w-40" disabled={loading}>
          {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
        </Button>
      </div>
    </form>
  );
}
