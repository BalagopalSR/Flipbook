import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
      password: await bcrypt.hash(password, 10),
    },
  });

  console.log(`Created default user "${username}".`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
