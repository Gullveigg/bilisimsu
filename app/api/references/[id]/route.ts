import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { phpPatch, phpDelete } from "@/lib/php-api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const res = await phpPatch("references.php", await request.json(), { id });
  const data = await res.json();
  if (res.ok) { revalidatePath("/"); revalidatePath("/admin/references"); }
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const res = await phpDelete("references.php", { id });
  const data = await res.json();
  if (res.ok) { revalidatePath("/"); revalidatePath("/admin/references"); }
  return NextResponse.json(data, { status: res.status });
}
