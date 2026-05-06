import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doğru doldurun." }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({
    data: {
      ...parsed.data,
      phone: parsed.data.phone || null
    }
  });

  return NextResponse.json(message, { status: 201 });
}
