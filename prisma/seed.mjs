import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.AUTH_USERNAME || "admin";
  const password = process.env.AUTH_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { password: hash },
    create: { username, password: hash },
  });
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
