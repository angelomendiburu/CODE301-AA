import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'angelomendiburu@gmail.com'; // Reemplaza con tu email de Google

  await prisma.$queryRaw`UPDATE "User" SET role = 'admin' WHERE email = ${adminEmail}`;

  console.log(`Usuario ${adminEmail} actualizado a rol admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
