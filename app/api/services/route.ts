// Mevcut dosya — Prisma → PHP services.php proxy
// Admin panel fetch('/api/services') tarafından çağrılır
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { phpGet, phpPost } from "@/lib/php-api";

export async function GET() {
  const res = await phpGet("services.php");
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const res = await phpPost("services.php", await request.json());
  const data = await res.json();
  if (res.ok) { revalidatePath("/"); revalidatePath("/hizmetler"); revalidatePath("/admin/services"); }
  return NextResponse.json(data, { status: res.status });
}
