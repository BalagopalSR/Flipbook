import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifySessionToken, type SessionUser } from "@/lib/auth-session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, username: true },
  });

  if (user) return user;

  // Session may reference a user from a previous database (e.g. after SQLite → PostgreSQL).
  const byUsername = await prisma.user.findUnique({
    where: { username: session.username },
    select: { id: true, username: true },
  });

  return byUsername;
}
