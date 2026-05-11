import { MessagesClient } from "@/components/admin/messages-client";
import { phpAdminGet } from "@/lib/php-api";

export default async function AdminMessagesPage() {
  let messages: unknown[] = [];
  try {
    const res = await phpAdminGet("contact.php");
    if (res.ok) messages = await res.json();
  } catch { /* PHP backend erişilemez */ }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Mesajlar</h2>
        <p className="text-sm text-[var(--muted)]">Gelen talepleri isim, telefon ve tarihe göre filtreleyin.</p>
      </div>
      <MessagesClient messages={messages as Parameters<typeof MessagesClient>[0]["messages"]} />
    </div>
  );
}
