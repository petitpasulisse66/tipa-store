import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  email: string;
}

export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) throw new Error('JWT_SECRET pa konfigire nan .env');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
