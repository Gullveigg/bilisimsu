"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type Step = { step: string; title: string; text: string };

type Props = {
  pageId: string;
  initial: {
    excerpt: string;
    vision: string;
    mission: string;
    approach: string;
    offerings: string[];
    framework: string;
    steps: Step[];
  };
};

const inputCls =
  "w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]";

function buildContent(data: Omit<Props["initial"], "excerpt">): string {
  const lines: string[] = [];

  lines.push("Vizyon:", data.vision, "");
  lines.push("Misyon:", data.mission, "");
  lines.push("Yaklaşım:", data.approach, "");

  if (data.offerings.length) {
    lines.push("Neler sunuyoruz?");
    data.offerings.forEach((o) => lines.push(`- ${o}`));
    lines.push("");
  }

  lines.push("Güven Çerçevesi:", data.framework, "");

  data.steps.forEach((s) => {
    lines.push(`${s.step} ${s.title}: ${s.text}`);
  });

  return lines.join("\n");
}

export function KurumsalEditor({ pageId, initial }: Props) {
  const router = useRouter();
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [vision, setVision] = useState(initial.vision);
  const [mission, setMission] = useState(initial.mission);
  const [approach, setApproach] = useState(initial.approach);
  const [offerings, setOfferings] = useState<string[]>(
    initial.offerings.length ? initial.offerings : [""]
  );
  const [framework, setFramework] = useState(initial.framework);
  const [steps, setSteps] = useState<Step[]>(
    initial.steps.length
      ? initial.steps
      : [
          { step: "01", title: "", text: "" },
          { step: "02", title: "", text: "" },
          { step: "03", title: "", text: "" },
        ]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const content = buildContent({ vision, mission, approach, offerings, framework, steps });

    const res = await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Kurumsal",
        slug: "kurumsal",
        excerpt,
        content,
        isPublished: true,
      }),
    });

    const result = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) { setError(result?.error || "Kaydedilemedi."); return; }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Özet */}
      <Card className="admin-card space-y-4 p-6">
        <h3 className="text-base font-semibold">Sayfa Özeti</h3>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Özet (meta description ve hero altı)</span>
          <textarea
            className={`${inputCls} min-h-20 resize-none`}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </label>
      </Card>

      {/* Vizyon / Misyon / Yaklaşım */}
      <Card className="admin-card space-y-4 p-6">
        <h3 className="text-base font-semibold">Vizyon · Misyon · Yaklaşım</h3>
        {[
          { label: "Vizyon", value: vision, set: setVision },
          { label: "Misyon", value: mission, set: setMission },
          { label: "Yaklaşım", value: approach, set: setApproach },
        ].map(({ label, value, set }) => (
          <label key={label}>
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            <textarea
              className={`${inputCls} min-h-24 resize-none`}
              value={value}
              onChange={(e) => set(e.target.value)}
              required
            />
          </label>
        ))}
      </Card>

      {/* Değerlerimiz */}
      <Card className="admin-card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Değerlerimiz</h3>
          <Button
            type="button"
            variant="secondary"
            className="px-4 py-2 text-xs"
            onClick={() => setOfferings((prev) => [...prev, ""])}
          >
            <Plus size={13} className="mr-1" /> Ekle
          </Button>
        </div>
        <div className="space-y-3">
          {offerings.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inputCls} flex-1`}
                placeholder={`Değer ${i + 1}`}
                value={item}
                onChange={(e) => {
                  const next = [...offerings];
                  next[i] = e.target.value;
                  setOfferings(next);
                }}
              />
              <button
                type="button"
                onClick={() => setOfferings((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] border border-[var(--border)] text-red-400 transition hover:border-red-200 hover:bg-red-50"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Güven Çerçevesi */}
      <Card className="admin-card space-y-4 p-6">
        <h3 className="text-base font-semibold">Güven Çerçevesi</h3>
        <textarea
          className={`${inputCls} min-h-24 resize-none`}
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
          required
        />
      </Card>

      {/* Adımlar */}
      <Card className="admin-card space-y-4 p-6">
        <h3 className="text-base font-semibold">Adımlar</h3>
        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[64px_1fr_1fr]">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">No</span>
                <input
                  className={inputCls}
                  value={step.step}
                  onChange={(e) => {
                    const next = [...steps];
                    next[i] = { ...next[i], step: e.target.value };
                    setSteps(next);
                  }}
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Başlık</span>
                <input
                  className={inputCls}
                  value={step.title}
                  onChange={(e) => {
                    const next = [...steps];
                    next[i] = { ...next[i], title: e.target.value };
                    setSteps(next);
                  }}
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Açıklama</span>
                <input
                  className={inputCls}
                  value={step.text}
                  onChange={(e) => {
                    const next = [...steps];
                    next[i] = { ...next[i], text: e.target.value };
                    setSteps(next);
                  }}
                />
              </label>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="px-4 py-2 text-xs"
            onClick={() =>
              setSteps((prev) => [
                ...prev,
                { step: String(prev.length + 1).padStart(2, "0"), title: "", text: "" },
              ])
            }
          >
            <Plus size={13} className="mr-1" /> Adım Ekle
          </Button>
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">Kaydedildi.</p>}

      <div className="flex justify-end">
        <Button type="submit" className="min-w-44" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
