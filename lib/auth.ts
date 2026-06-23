import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import type { SessionUser } from "@/lib/auth-session";

export type { SessionUser } from "@/lib/auth-session";
export { COOKIE_NAME, createSessionToken, getSessionUser } from "@/lib/auth-session";

const INTERNAL_USER_ID = "internal-user";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function credentialsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<SessionUser | null> {
  const expectedUsername = process.env.AUTH_USERNAME || "admin";
  const expectedPassword = process.env.AUTH_PASSWORD || "admin123";

  if (!credentialsMatch(username, expectedUsername)) return null;
  if (!credentialsMatch(password, expectedPassword)) return null;

  return { id: INTERNAL_USER_ID, username: expectedUsername };
}
