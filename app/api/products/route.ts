import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { phpGet, phpPost } from "@/lib/php-api";

export async function GET() {
  const res  = await phpGet("products.php");
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const res  = await phpPost("products.php", body);
  const data = await res.json();

  if (res.ok) {
    revalidatePath("/");
    revalidatePath("/urunler");
    revalidatePath("/admin/products");
  }

  return NextResponse.json(data, { status: res.status });
}
