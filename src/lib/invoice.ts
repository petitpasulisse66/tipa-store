import PDFDocument from 'pdfkit';

interface InvoiceData {
  invoiceNo: string;
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  items: { name: string; quantity: number; unitPrice: number }[];
  shippingFee: number;
  total: number;
}

/**
 * Jenere yon fakti PDF pou yon kòmand.
 * Retounen yon Buffer pou l ka anrejistre sou disk, voye pa email, oswa telechaje.
 */
export function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ---- Header / Logo ----
    doc.fontSize(22).fillColor('#3654f5').text('TIPA STORE', { align: 'left' });
    doc.fontSize(10).fillColor('#555').text('Fakti Elektwonik / Invoice');
    doc.moveDown();

    doc.fontSize(12).fillColor('#000');
    doc.text(`Fakti No: ${data.invoiceNo}`);
    doc.text(`Kòmand No: ${data.orderNumber}`);
    doc.text(`Dat: ${data.createdAt.toLocaleDateString('fr-HT')}`);
    doc.moveDown();

    doc.text(`Kliyan: ${data.customerName}`);
    doc.text(`Telefòn: ${data.customerPhone}`);
    if (data.customerEmail) doc.text(`Email: ${data.customerEmail}`);
    doc.moveDown();

    // ---- Table Header ----
    doc.fontSize(11).fillColor('#fff');
    const tableTop = doc.y;
    doc.rect(50, tableTop, 500, 20).fill('#3654f5');
    doc.fillColor('#fff').text('Pwodwi', 60, tableTop + 5);
    doc.text('Kantite', 300, tableTop + 5);
    doc.text('Pri Inite', 380, tableTop + 5);
    doc.text('Total', 470, tableTop + 5);

    let y = tableTop + 25;
    doc.fillColor('#000');
    let subtotal = 0;
    for (const item of data.items) {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;
      doc.text(item.name, 60, y, { width: 230 });
      doc.text(String(item.quantity), 300, y);
      doc.text(item.unitPrice.toFixed(2), 380, y);
      doc.text(lineTotal.toFixed(2), 470, y);
      y += 22;
    }

    y += 10;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;
    doc.text(`Sou-total: ${subtotal.toFixed(2)} HTG`, 380, y);
    y += 18;
    doc.text(`Livrezon: ${data.shippingFee.toFixed(2)} HTG`, 380, y);
    y += 18;
    doc.fontSize(13).text(`TOTAL: ${data.total.toFixed(2)} HTG`, 380, y);

    doc.moveDown(3);
    doc.fontSize(9).fillColor('#777').text('Mèsi paske ou fè konfyans Tipa Store. Pou nenpòt kesyon, kontakte sipò nou.', { align: 'center' });

    doc.end();
  });
}
