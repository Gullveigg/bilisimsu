import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

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

  const phpUploadUrl = process.env.PHP_UPLOAD_URL;
  const phpUploadSecret = process.env.PHP_UPLOAD_SECRET;

  if (!phpUploadUrl || !phpUploadSecret) {
    return NextResponse.json({ error: "Upload sunucusu yapılandırılmamış." }, { status: 500 });
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("secret", phpUploadSecret);

  const phpRes = await fetch(phpUploadUrl, {
    method: "POST",
    body: uploadForm,
  });

  if (!phpRes.ok) {
    return NextResponse.json({ error: "Dosya sunucusuna yüklenemedi." }, { status: 502 });
  }

  const data = await phpRes.json() as { url?: string; error?: string };

  if (!data.url) {
    return NextResponse.json({ error: data.error ?? "Bilinmeyen hata." }, { status: 502 });
  }

  return NextResponse.json({ url: data.url });
}
