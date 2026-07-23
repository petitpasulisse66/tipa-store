import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { generateInvoicePdf } from '@/lib/invoice';

// GET /api/invoice/:orderId - telechaje fakti PDF pou yon kòmand
export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Ou dwe konekte' }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true, invoice: true },
  });

  if (!order) return NextResponse.json({ error: 'Kòmand pa jwenn' }, { status: 404 });
  if (!requireAdmin(user) && order.userId !== user.userId) {
    return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });
  }

  const pdfBuffer = await generateInvoicePdf({
    invoiceNo: order.invoice?.invoiceNo || order.orderNumber,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    customerName: order.fullName,
    customerPhone: order.phone,
    customerEmail: order.email,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: Number(i.unitPrice) })),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="fakti-${order.orderNumber}.pdf"`,
    },
  });
}
