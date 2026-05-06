import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseImageGallery(value?: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function getProductImageSet(mainImage: string, galleryValue?: string | null) {
  return Array.from(new Set([mainImage, ...parseImageGallery(galleryValue)].filter(Boolean)));
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function isProbablyHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function convertPlainTextToHtml(value: string) {
  const normalized = value.trim();
  if (!normalized) return "";
  if (isProbablyHtml(normalized)) return normalized;

  const lines = normalized.split("\n").map((line) => line.trim());
  const blocks: string[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (!listBuffer.length) return;
    blocks.push(`<ul>${listBuffer.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    listBuffer = [];
  }

  for (const line of lines) {
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      continue;
    }

    flushList();

    if (line.endsWith(":")) {
      blocks.push(`<h3>${line.slice(0, -1)}</h3>`);
      continue;
    }

    blocks.push(`<p>${line}</p>`);
  }

  flushList();
  return blocks.join("");
}

export function contentToLines(value: string) {
  const normalized = value.trim();
  if (!normalized) return [];

  const htmlAware = isProbablyHtml(normalized)
    ? normalized
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|ul|ol)>/gi, "\n")
        .replace(/<li>/gi, "- ")
        .replace(/<\/li>/gi, "\n")
        .replace(/&nbsp;/gi, " ")
    : normalized;

  return htmlAware
    .replace(/<[^>]*>/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

type CorporateContent = {
  vision: string;
  mission: string;
  approach: string;
  offerings: string[];
  framework: string;
  steps: Array<{ step: string; title: string; text: string }>;
};

export function parseCorporateContent(value: string): CorporateContent {
  const lines = contentToLines(value);
  const sections: Record<string, string[]> = {
    vision: [],
    mission: [],
    approach: [],
    offerings: [],
    framework: []
  };
  const steps: Array<{ step: string; title: string; text: string }> = [];
  let currentSection: keyof typeof sections | null = null;

  for (const line of lines) {
    const normalized = line.toLocaleLowerCase("tr-TR");

    if (normalized === "vizyon" || normalized === "vizyon:") {
      currentSection = "vision";
      continue;
    }

    if (normalized === "misyon" || normalized === "misyon:") {
      currentSection = "mission";
      continue;
    }

    if (normalized === "yaklaşım" || normalized === "yaklasim" || normalized === "yaklaşım:" || normalized === "yaklasim:") {
      currentSection = "approach";
      continue;
    }

    if (normalized === "neler sunuyoruz?" || normalized === "neler sunuyoruz" || normalized === "neler sunuyoruz?:") {
      currentSection = "offerings";
      continue;
    }

    if (normalized === "güven çerçevesi" || normalized === "guven cercevesi" || normalized === "güven çerçevesi:" || normalized === "guven cercevesi:") {
      currentSection = "framework";
      continue;
    }

    const stepMatch = line.match(/^(0\d)\s+([^:]+):\s*(.+)$/);
    if (stepMatch) {
      steps.push({
        step: stepMatch[1],
        title: stepMatch[2].trim(),
        text: stepMatch[3].trim()
      });
      currentSection = null;
      continue;
    }

    if (currentSection === "offerings") {
      sections.offerings.push(line.replace(/^-+\s*/, ""));
      continue;
    }

    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  return {
    vision: sections.vision.join(" "),
    mission: sections.mission.join(" "),
    approach: sections.approach.join(" "),
    offerings: sections.offerings,
    framework: sections.framework.join(" "),
    steps
  };
}
