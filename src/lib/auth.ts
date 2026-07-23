import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyToken, JwtPayload } from './jwt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Li itilizatè kounye a (server-side) apati cookie sekirize "tipa_session".
 * Retounen null si pa gen sesyon valid.
 */
export function getCurrentUser(): JwtPayload | null {
  const token = cookies().get('tipa_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(user: JwtPayload | null): boolean {
  return !!user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
}
