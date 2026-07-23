import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

// PATCH /api/admin/customers/:id - aktive/dezaktive/modifye yon kliyan
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  const customer = await prisma.user.update({
    where: { id: params.id },
    data: {
      isActive: body.isActive,
      fullName: body.fullName,
      phone: body.phone,
      whatsapp: body.whatsapp,
    },
  });

  return NextResponse.json({ customer });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
