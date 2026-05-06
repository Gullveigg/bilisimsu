import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { referenceSchema } from "@/lib/validators";

export async function GET() {
  const references = await prisma.reference.findMany({
    orderBy: { order: "asc" }
  });
  return NextResponse.json(references);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = referenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz referans verisi." }, { status: 400 });
  }

  const reference = await prisma.reference.create({ data: parsed.data });

  revalidatePath("/");
  revalidatePath("/admin/references");
  return NextResponse.json(reference, { status: 201 });
}
