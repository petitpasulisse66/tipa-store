import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { sendPaymentConfirmedEmail } from '@/lib/email';
import { notifyPaymentValidated } from '@/lib/whatsapp';

// PATCH /api/payments/:id/verify - Admin apwouve/refize yon peman MonCash/NatCash
// body: { action: 'APPROVE' | 'REJECT', transactionRef?: string }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  const { action, transactionRef } = body;

  const payment = await prisma.payment.findUnique({ where: { id: params.id }, include: { order: true } });
  if (!payment) return NextResponse.json({ error: 'Peman pa jwenn' }, { status: 404 });

  if (action === 'APPROVE') {
    const updated = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: 'PAID',
        transactionRef,
        verifiedAt: new Date(),
        verifiedByAdmin: user!.userId,
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PROCESSING' },
    });

    if (payment.order.email) {
      sendPaymentConfirmedEmail(payment.order.email, payment.order.orderNumber).catch(console.error);
    }
    notifyPaymentValidated(payment.order.whatsapp || payment.order.phone, payment.order.orderNumber).catch(console.error);

    return NextResponse.json({ payment: updated });
  }

  if (action === 'REJECT') {
    const updated = await prisma.payment.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    });
    await prisma.order.update({ where: { id: payment.orderId }, data: { status: 'CANCELLED' } });
    return NextResponse.json({ payment: updated });
  }

  return NextResponse.json({ error: 'Aksyon pa valid' }, { status: 400 });
}
