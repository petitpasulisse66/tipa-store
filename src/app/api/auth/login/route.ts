import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { signToken } from '@/lib/jwt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Enfòmasyon pa valid' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Email oswa modpas pa kòrèk' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Kont sa a dezaktive' }, { status: 403 });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
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
