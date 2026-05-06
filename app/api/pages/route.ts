import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { pageSchema } from "@/lib/validators";

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = pageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz sayfa verisi." }, { status: 400 });
  }

  const page = await prisma.page.create({ data: parsed.data });

  revalidatePath("/admin/pages");
  return NextResponse.json(page, { status: 201 });
}
