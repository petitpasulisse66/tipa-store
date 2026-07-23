import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { signToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Non an twò kout'),
  email: z.string().email('Email pa valid'),
  phone: z.string().min(8, 'Nimewo telefòn pa valid'),
  password: z.string().min(6, 'Modpas la dwe gen omwen 6 karaktè'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, email, phone, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Yon kont deja egziste ak email sa a' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { fullName, email, phone, passwordHash },
    });

    const token = signToken({ userId: user.id, role: user.role, email: user.email });

    // Voye email byenvini (san bloke repons lan si SMTP pa konfigire)
    sendWelcomeEmail(user.email, user.fullName).catch((err) =>
      console.error('Erè email byenvini:', err)
    );

    const response = NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });

    response.cookies.set('tipa_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erè sèvè - eseye ankò' }, { status: 500 });
  }
}
