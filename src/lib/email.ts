import nodemailer from 'nodemailer';

/**
 * Sèvis Email Otomatik pou Tipa Store.
 * Itilize SMTP (Gmail, SendGrid SMTP, Mailgun SMTP, elt.) - konfigire nan .env
 *
 * Evènman yo voye otomatikman:
 *  - Byenvini (rejis kont)
 *  - Konfimasyon kòmand
 *  - Konfimasyon peman / kòmand ap prepare
 *  - Kòmand livre
 *  - Invoice (PDF an pyès jwenn)
 */

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function send(to: string, subject: string, html: string, attachments?: { filename: string; content: Buffer }[]) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    attachments,
  });
}

export async function sendWelcomeEmail(to: string, fullName: string) {
  await send(
    to,
    'Byenvini nan Tipa Store!',
    `<h2>Byenvini, ${fullName}!</h2><p>Mèsi paske ou kreye yon kont sou Tipa Store. Kounye a ou ka fè acha, swiv kòmand ou yo, epi jwenn ofri eksklizif.</p>`
  );
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string, total: string) {
  await send(
    to,
    `Konfimasyon Kòmand #${orderNumber}`,
    `<h2>Nou resevwa kòmand ou!</h2><p>Kòmand #${orderNumber} anrejistre pou yon total de ${total} HTG. Nou pral kontakte w pou konfime peman an.</p>`
  );
}

export async function sendPaymentConfirmedEmail(to: string, orderNumber: string) {
  await send(
    to,
    `Peman Konfime - Kòmand #${orderNumber}`,
    `<h2>Peman ou konfime!</h2><p>Kòmand #${orderNumber} kounye a ap prepare pou l al nan wout.</p>`
  );
}

export async function sendOrderDeliveredEmail(to: string, orderNumber: string) {
  await send(
    to,
    `Kòmand Livre - #${orderNumber}`,
    `<h2>Kòmand ou livre!</h2><p>Kòmand #${orderNumber} livre ak siksè. Mèsi paske ou fè konfyans Tipa Store.</p>`
  );
}

export async function sendInvoiceEmail(to: string, orderNumber: string, pdfBuffer: Buffer) {
  await send(
    to,
    `Fakti #${orderNumber} - Tipa Store`,
    `<p>Ou ka jwenn fakti kòmand #${orderNumber} an pyès jwenn.</p>`,
    [{ filename: `fakti-${orderNumber}.pdf`, content: pdfBuffer }]
  );
}
