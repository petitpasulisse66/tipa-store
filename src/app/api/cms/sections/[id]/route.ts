import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  await prisma.homeSection.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
