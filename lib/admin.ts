import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
    };
  }

  return { ok: true as const, session };
}
