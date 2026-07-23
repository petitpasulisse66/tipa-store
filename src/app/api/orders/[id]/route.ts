import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { sendOrderDeliveredEmail } from '@/lib/email';
import { notifyOrderDelivered } from '@/lib/whatsapp';

// GET /api/orders/:id - detay yon kòmand
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Ou dwe konekte' }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true, invoice: true, user: true },
  });

  if (!order) return NextResponse.json({ error: 'Kòmand pa jwenn' }, { status: 404 });
  if (!requireAdmin(user) && order.userId !== user.userId) {
    return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });
  }

  return NextResponse.json({ order });
}

// PATCH /api/orders/:id - chanje estati kòmand (Admin): PENDING -> ACCEPTED -> PROCESSING -> DELIVERED / CANCELLED
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  const { status } = body;
  const validStatuses = ['PENDING', 'ACCEPTED', 'PROCESSING', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Estati pa valid' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });

  if (status === 'DELIVERED') {
    if (order.email) sendOrderDeliveredEmail(order.email, order.orderNumber).catch(console.error);
    notifyOrderDelivered(order.whatsapp || order.phone, order.orderNumber).catch(console.error);
  }

  return NextResponse.json({ order });
}
