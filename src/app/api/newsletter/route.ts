import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let email: string | null = null;

  if (contentType.includes('application/json')) {
    const body = await req.json();
    email = body.email;
  } else {
    const form = await req.formData();
    email = form.get('email') as string;
  }

  if (!email) return NextResponse.json({ error: 'Email obligatwa' }, { status: 400 });

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch (err) {
    console.error(err);
  }

  return NextResponse.redirect(new URL('/?subscribed=1', req.url));
}
