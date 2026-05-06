import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { WhatsAppFloat } from "@/components/public/whatsapp-float";
import { getPublishedPages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pages = await getPublishedPages();

  return (
    <>
      <Header pages={pages} />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
