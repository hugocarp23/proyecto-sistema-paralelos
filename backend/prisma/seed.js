// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.create({
    data: {
      nombre: 'Administrador SysLab',
      email: 'admin@syslab.com',
    },
  });
  console.log('Seed ejecutado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });