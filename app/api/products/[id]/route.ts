// Admin panel fetch('/api/products/ID', PATCH/DELETE) → PHP backend proxy
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { phpGet, phpPatch, phpDelete } from "@/lib/php-api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const res  = await phpGet("products.php", { id });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const body = await request.json();
  const res  = await phpPatch("products.php", body, { id });
  const data = await res.json();
  if (res.ok) { revalidatePath("/"); revalidatePath("/urunler"); revalidatePath("/admin/products"); }
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const res  = await phpDelete("products.php", { id });
  const data = await res.json();
  if (res.ok) { revalidatePath("/"); revalidatePath("/urunler"); revalidatePath("/admin/products"); }
  return NextResponse.json(data, { status: res.status });
}
