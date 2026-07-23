import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

// GET /api/payments?status=PENDING - lis peman pou verifikasyon Admin
export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const payments = await prisma.payment.findMany({
    where: status ? { status: status as any } : {},
    include: { order: { select: { orderNumber: true, fullName: true, phone: true, total: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ payments });
}
