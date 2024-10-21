import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "ADMIN", permissions: ["*"] },
    { name: "COMPANY", permissions: ["*"] },
    { name: "SUPPORT", permissions: ["*"] },
    { name: "EMPLOYEE", permissions: ["*"] },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
