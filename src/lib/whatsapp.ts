/**
 * Sèvis WhatsApp Otomatik pou Tipa Store, itilize WhatsApp Cloud API (Meta).
 * Bezwen: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID nan .env
 *
 * Si w pito itilize yon founisè altènatif (Twilio, 360dialog, elt.), ranplase
 * fonksyon `sendWhatsappMessage` la sèlman - rès kòd la rete menm jan an.
 */

const WHATSAPP_API_URL = 'https://graph.facebook.com/v20.0';

async function sendWhatsappMessage(to: string, message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_API_TOKEN;

  if (!phoneNumberId || !token) {
    console.warn('[WhatsApp] Konfigirasyon manke - mesaj pa voye:', message);
    return;
  }

  await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  });
}

export async function notifyOrderReceived(phone: string, orderNumber: string) {
  await sendWhatsappMessage(phone, `Bonjou! Nou resevwa kòmand ou #${orderNumber} sou Tipa Store. N ap kontakte w byento pou konfime peman.`);
}

export async function notifyPaymentValidated(phone: string, orderNumber: string) {
  await sendWhatsappMessage(phone, `Peman ou pou kòmand #${orderNumber} konfime! Kòmand la ap prepare kounye a.`);
}

export async function notifyOrderDelivered(phone: string, orderNumber: string) {
  await sendWhatsappMessage(phone, `Kòmand #${orderNumber} livre! Mèsi paske ou achte sou Tipa Store.`);
}

export async function notifyInvoiceReady(phone: string, orderNumber: string, invoiceUrl: string) {
  await sendWhatsappMessage(phone, `Fakti kòmand #${orderNumber} disponib: ${invoiceUrl}`);
}
