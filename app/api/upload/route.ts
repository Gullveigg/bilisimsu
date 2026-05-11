import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { phpUpload } from "@/lib/php-api";

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm"
]);
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Desteklenmeyen dosya türü." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya çok büyük (max 100 MB)." }, { status: 400 });
  }

  if (!process.env.PHP_API_URL) {
    return NextResponse.json({ error: "Upload sunucusu yapılandırılmamış." }, { status: 500 });
  }

  const upload = new FormData();
  upload.append("file", file);

  const res  = await phpUpload(upload);
  const data = await res.json() as { url?: string; error?: string };

  if (!res.ok || !data.url) {
    return NextResponse.json({ error: data.error ?? "Dosya yüklenemedi." }, { status: 502 });
  }

  return NextResponse.json({ url: data.url });
}
