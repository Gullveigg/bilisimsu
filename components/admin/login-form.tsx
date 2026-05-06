"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@bilisimsuaritma.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Giriş başarısız.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form className="glass-card w-full max-w-md space-y-4 p-8" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          Admin Girişi
        </p>
        <h1 className="text-3xl font-semibold">Yönetim Paneli</h1>
      </div>
      <input
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="E-posta"
      />
      <input
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Şifre"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  );
}
