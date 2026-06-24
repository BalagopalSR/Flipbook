import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth-session";
import { hashPassword, verifyPassword } from "@/lib/password";

export type { SessionUser } from "@/lib/auth-session";
export { COOKIE_NAME, createSessionToken } from "@/lib/auth-session";
export { getSessionUser } from "@/lib/auth-server";
export { hashPassword, verifyPassword };

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
