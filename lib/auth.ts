import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth-session";

export type { SessionUser } from "@/lib/auth-session";
export { COOKIE_NAME, createSessionToken, getSessionUser } from "@/lib/auth-session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function ensureDefaultUser(): Promise<void> {
  const username = process.env.AUTH_USERNAME || "admin";
  const password = process.env.AUTH_PASSWORD || "admin123";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return;

  await prisma.user.create({
    data: {
      username,
      password: await hashPassword(password),
    },
  });
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<SessionUser | null> {
  await ensureDefaultUser();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const valid = await verifyPassword(password, user.password);
  if (!valid) return null;
  return { id: user.id, username: user.username };
}
