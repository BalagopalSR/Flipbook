import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function seedDefaultUser(): Promise<void> {
  const username = process.env.AUTH_USERNAME || "admin";
  const password = process.env.AUTH_PASSWORD || "admin123";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`User "${username}" already exists — skipped.`);
    return;
  }

  await prisma.user.create({
    data: {
      username,
      password: await hashPassword(password),
    },
  });

  console.log(`Created default user "${username}".`);
}
