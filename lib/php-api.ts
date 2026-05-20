// Çağıranlar: lib/data.ts ve tüm app/api/ route dosyaları
// PHP backend URL yapısı: PHP_API_URL + "/" + dosya.php + "?id=xxx"
const BASE   = (process.env.PHP_API_URL ?? "").replace(/\/$/, "");
const SECRET = process.env.ADMIN_SECRET ?? "";

function phpUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${BASE}/${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  return url.toString();
}

export async function phpGet(path: string, params?: Record<string, string>) {
  return fetch(phpUrl(path, params), {
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(5000),
  });
}

export async function phpAdminGet(path: string, params?: Record<string, string>) {
  return fetch(phpUrl(path, params), {
    headers: { Authorization: `Bearer ${SECRET}` },
    next: { revalidate: 0 },
  });
}

export async function phpPost(path: string, body: unknown, params?: Record<string, string>) {
  return fetch(phpUrl(path, params), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SECRET}` },
    body: JSON.stringify(body),
  });
}

export async function phpPatch(path: string, body: unknown, params?: Record<string, string>) {
  return fetch(phpUrl(path, params), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SECRET}` },
    body: JSON.stringify(body),
  });
}

export async function phpDelete(path: string, params?: Record<string, string>) {
  return fetch(phpUrl(path, params), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${SECRET}` },
  });
}

export async function phpUpload(formData: FormData) {
  return fetch(phpUrl("upload.php"), {
    method: "POST",
    headers: { Authorization: `Bearer ${SECRET}` },
    body: formData,
  });
}

export async function phpLogin(email: string, password: string) {
  return fetch(phpUrl("admin.php", { action: "login" }), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function phpContactPost(body: unknown) {
  return fetch(phpUrl("contact.php"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
