import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Checking and resetting database sequences...');

  const tables = [
    'roles',
    'categories',
    'users',
    'events',
    'purchases',
    'tickets',
    'attendances',
    'password_reset_tokens'
  ];

  for (const table of tables) {
    try {
      const maxResult: any[] = await prisma.$queryRawUnsafe(`SELECT MAX(id) as max_id FROM "${table}";`);
      const maxId = maxResult[0]?.max_id;
      
      if (maxId !== null && maxId !== undefined && Number(maxId) > 0) {
        await prisma.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), ${maxId});`);
        console.log(`✅ Table "${table}": sequence set to ${maxId}`);
      } else {
        console.log(`ℹ️ Table "${table}": no records found or max id is 0.`);
      }
    } catch (err: any) {
      console.warn(`⚠️ Table "${table}": could not update sequence:`, err.message);
    }
  }

  console.log('✨ Sequence synchronization complete.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
