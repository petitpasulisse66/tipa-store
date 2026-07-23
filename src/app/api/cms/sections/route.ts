import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

// GET /api/cms/sections - lis seksyon paj akèy la, byen òdone (piblik, sèlman aktif pou vizitè)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get('all') === '1';
  const user = getCurrentUser();

  const sections = await prisma.homeSection.findMany({
    where: includeInactive && requireAdmin(user) ? {} : { isActive: true },
    orderBy: { position: 'asc' },
  });

  return NextResponse.json({ sections });
}

// POST /api/cms/sections - Admin ajoute yon nouvo seksyon
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  const maxPosition = await prisma.homeSection.aggregate({ _max: { position: true } });

  const section = await prisma.homeSection.create({
    data: {
      type: body.type,
      title: body.title,
      subtitle: body.subtitle,
      buttonText: body.buttonText,
      buttonUrl: body.buttonUrl,
      imageUrl: body.imageUrl,
      videoUrl: body.videoUrl,
      colorHex: body.colorHex,
      content: body.content || {},
      position: (maxPosition._max.position ?? 0) + 1,
    },
  });

  return NextResponse.json({ section }, { status: 201 });
}

// PATCH /api/cms/sections - reòdone, aktive/dezaktive, oswa modifye an mas
// body: { sections: [{ id, position, isActive, ... }] }
export async function PATCH(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  const updates: any[] = body.sections || [];

  await prisma.$transaction(
    updates.map((s) =>
      prisma.homeSection.update({
        where: { id: s.id },
        data: {
          position: s.position,
          isActive: s.isActive,
          title: s.title,
          subtitle: s.subtitle,
          buttonText: s.buttonText,
          buttonUrl: s.buttonUrl,
          imageUrl: s.imageUrl,
          videoUrl: s.videoUrl,
          colorHex: s.colorHex,
          content: s.content,
        },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
