import { MessagesClient } from "@/components/admin/messages-client";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Mesajlar</h2>
        <p className="text-sm text-[var(--muted)]">Gelen talepleri isim, telefon ve tarihe göre filtreleyin.</p>
      </div>
      <MessagesClient messages={messages} />
    </div>
  );
}
