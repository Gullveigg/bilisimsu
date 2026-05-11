import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { phpDelete } from "@/lib/php-api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const res = await phpDelete("contact.php", { id });
  const data = await res.json();
  if (res.ok) { revalidatePath("/admin/messages"); }
  return NextResponse.json(data, { status: res.status });
}
