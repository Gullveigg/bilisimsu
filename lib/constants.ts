export const COMPANY = {
  name: "Bilişim Su Arıtma",
  phone: "0(232) 436 04 04",
  email: "info@bilisimsuaritma.com",
  address: "Işıklar, Aydınlar Cd. No:10/1, 35070 Bornova/İzmir",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905000000000"
};

export function buildWhatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encoded}`;
}

export const genericWhatsappMessage =
  "Merhaba, su arıtma sistemleri hakkında bilgi almak istiyorum. Uygun ürün ve hizmetlerinizi paylaşabilir misiniz?";

export const whatsappTopics = [
  { label: "Fiyat Teklifi", message: "Merhaba, su arıtma sistemi için fiyat teklifi almak istiyorum. Seçeneklerinizi paylaşabilir misiniz?" },
  { label: "Servis / Bakım", message: "Merhaba, mevcut su arıtma cihazım için servis ve bakım hizmeti almak istiyorum. Randevu planlayabilir miyiz?" },
  { label: "Ürün Bilgisi", message: "Merhaba, su arıtma ürünleriniz hakkında detaylı bilgi almak istiyorum." },
  { label: "Filtre Değişimi", message: "Merhaba, su arıtma cihazımın filtrelerini değiştirmek istiyorum. Hangi filtreler uyumlu, süreç nasıl işliyor?" },
];

export function buildProductWhatsappMessage(productName: string) {
  return `Merhaba, *${productName}* ürünü hakkında bilgi almak istiyorum.\n\nFiyat, kurulum süreci ve teslimat hakkında bilgi paylaşabilir misiniz?`;
}

export function buildServiceWhatsappMessage(topic: string) {
  return `Merhaba, *${topic}* konusunda destek almak istiyorum. Uygun süreç ve randevu hakkında bilgi paylaşabilir misiniz?`;
}

export function buildServiceRequestMessage(deviceType: string, issueType: string) {
  return `Merhaba, su arıtma sistemim için servis talebi oluşturmak istiyorum.\n\n📌 *Cihaz Tipi:* ${deviceType}\n🔧 *Talep:* ${issueType}\n\nEn kısa sürede dönüş yapabilir misiniz?`;
}
