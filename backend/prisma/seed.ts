import { PrismaClient, EventStatus, TicketStatus, PurchaseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales para EventHub...');

  // 1. Roles
  const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'ORGANIZADOR' },
    { id: 3, name: 'USUARIO' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: role,
    });
  }
  console.log('✅ Roles asegurados: ADMIN, ORGANIZADOR, USUARIO');

  // 2. Categorías
  const categories = [
    { id: 1, name: 'Música', description: 'Conciertos en vivo, festivales y recitales acústicos', icon: 'Music' },
    { id: 2, name: 'Deportes', description: 'Torneos de fútbol, maratones, básquetbol y fitness', icon: 'Trophy' },
    { id: 3, name: 'Cultura', description: 'Obras de teatro, literatura, danza tradicional e historia', icon: 'Drama' },
    { id: 4, name: 'Comedia', description: 'Shows de stand-up, monólogos cómicos e improvisación', icon: 'Laugh' },
    { id: 5, name: 'Educación', description: 'Seminarios, congresos académicos, talleres y ponencias', icon: 'GraduationCap' },
    { id: 6, name: 'Tecnología', description: 'Hackathons, cumbres de inteligencia artificial y desarrollo', icon: 'Cpu' },
    { id: 7, name: 'Arte', description: 'Exposiciones de pintura, escultura y galerías fotográficas', icon: 'Palette' },
    { id: 8, name: 'Entretenimiento', description: 'Festivales de cine, ferias temáticas y convenciones cosplay', icon: 'Sparkles' },
    { id: 9, name: 'Familia', description: 'Festivales infantiles, circos, parques temáticos y ferias', icon: 'Users' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        active: true,
      },
      create: {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        active: true,
      },
    });
  }
  console.log(`✅ ${categories.length} Categorías inicializadas.`);

  // 3. Usuarios Principales
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin123!', salt);
  const organizerPassword = await bcrypt.hash('Organizador123!', salt);
  const userPassword = await bcrypt.hash('Usuario123!', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventhub.com' },
    update: { password: adminPassword, active: true },
    create: {
      firstName: 'Carlos',
      lastName: 'Administrador',
      email: 'admin@eventhub.com',
      password: adminPassword,
      roleId: 1,
      active: true,
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: 'organizador@eventhub.com' },
    update: { password: organizerPassword, active: true },
    create: {
      firstName: 'Mariana',
      lastName: 'Organizadora',
      email: 'organizador@eventhub.com',
      password: organizerPassword,
      roleId: 2,
      active: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'usuario@eventhub.com' },
    update: { password: userPassword, active: true },
    create: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'usuario@eventhub.com',
      password: userPassword,
      roleId: 3,
      active: true,
    },
  });

  console.log('✅ Usuarios del sistema creados:');
  console.log('   - Admin: admin@eventhub.com / Admin123!');
  console.log('   - Organizador: organizador@eventhub.com / Organizador123!');
  console.log('   - Usuario: usuario@eventhub.com / Usuario123!');

  // 4. Eventos Destacados
  const sampleEvents = [
    {
      id: 1,
      title: 'Festival Internacional de Rock & Pop 2026',
      description: 'La cumbre musical más esperada del año con bandas nacionales e internacionales en vivo, zona gastronómica y experiencia visual inmersiva.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-10-15T20:00:00Z'),
      time: '20:00',
      location: 'Santa Cruz',
      address: 'Estadio Ramón Tahuichi Aguilera',
      price: 150.0,
      capacity: 5000,
      availableTickets: 4850,
      status: EventStatus.PUBLICADO,
      organizerId: organizer.id,
      categoryId: 1, // Música
    },
    {
      id: 2,
      title: 'Gran Clásico Deportivo del Bicentenario',
      description: 'El encuentro definitivo por la copa dorada con tribunas preferenciales, seguridad de primer nivel y espectáculo de medio tiempo.',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-11-05T16:00:00Z'),
      time: '16:00',
      location: 'La Paz',
      address: 'Estadio Hernando Siles',
      price: 80.0,
      capacity: 8000,
      availableTickets: 7920,
      status: EventStatus.PUBLICADO,
      organizerId: organizer.id,
      categoryId: 2, // Deportes
    },
    {
      id: 3,
      title: 'Cumbre de Innovación y Tecnología TechHub 2026',
      description: 'Tres días de conferencias magistrales sobre Inteligencia Artificial, computación en la nube, arquitectura de software y networking empresarial.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-09-28T09:00:00Z'),
      time: '09:00',
      location: 'Tarija',
      address: 'Centro de Convenciones Los Ceibos',
      price: 220.0,
      capacity: 1200,
      availableTickets: 1150,
      status: EventStatus.PUBLICADO,
      organizerId: organizer.id,
      categoryId: 6, // Tecnología
    },
    {
      id: 4,
      title: 'Noche de Stand-Up Comedy con Risa Asegurada',
      description: 'Los mejores comediantes de la región reunidos en una noche inolvidable cargada de humor irreverente, monólogos y sorpresas.',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-10-02T21:30:00Z'),
      time: '21:30',
      location: 'Cochabamba',
      address: 'Teatro Achá',
      price: 60.0,
      capacity: 650,
      availableTickets: 610,
      status: EventStatus.PUBLICADO,
      organizerId: organizer.id,
      categoryId: 4, // Comedia
    },
    {
      id: 5,
      title: 'Gala Sinfónica y Ballet Clásico: El Lago de los Cisnes',
      description: 'Magna presentación de la orquesta sinfónica acompañada por el cuerpo nacional de ballet clásico en un despliegue artístico único.',
      image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-10-22T19:00:00Z'),
      time: '19:00',
      location: 'Sucre',
      address: 'Gran Mariscal de Ayacucho Theater',
      price: 100.0,
      capacity: 900,
      availableTickets: 870,
      status: EventStatus.PUBLICADO,
      organizerId: organizer.id,
      categoryId: 3, // Cultura
    },
    {
      id: 6,
      title: 'Expo Arte Contemporáneo & Nuevos Medios',
      description: 'Exhibición inmersiva de artes visuales, mapping digital, esculturas lumínicas e instalaciones interactivas.',
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-11-12T14:00:00Z'),
      time: '14:00',
      location: 'Santa Cruz',
      address: 'Feria Exposición Fexpocruz - Pabellón Internacional',
      price: 45.0,
      capacity: 2000,
      availableTickets: 1980,
      status: EventStatus.PUBLICADO,
      organizerId: organizer.id,
      categoryId: 7, // Arte
    },
  ];

  for (const ev of sampleEvents) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: ev,
      create: ev,
    });
  }
  console.log(`✅ ${sampleEvents.length} Eventos publicados creados.`);

  // 5. Compra y Entradas de Muestra para el Usuario
  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId: user.id },
  });

  if (!existingPurchase) {
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        total: 150.0,
        status: PurchaseStatus.COMPLETADA,
      },
    });

    const qrToken = `EVH-${crypto.randomUUID()}`;
    const ticketNumber = `EVH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    await prisma.ticket.create({
      data: {
        purchaseId: purchase.id,
        eventId: 1,
        userId: user.id,
        qrToken: qrToken,
        ticketNumber: ticketNumber,
        status: TicketStatus.ACTIVA,
      },
    });

    console.log(`✅ Compra y Ticket de prueba generados para ${user.email} (QR Token: ${qrToken})`);
  }

  // 6. Sincronizar secuencias de PostgreSQL para evitar errores de ID duplicado al crear nuevos registros
  const tables = ['roles', 'categories', 'users', 'events', 'purchases', 'tickets'];
  for (const table of tables) {
    try {
      const maxResult: any[] = await prisma.$queryRawUnsafe(`SELECT MAX(id) as max_id FROM "${table}";`);
      const maxId = maxResult[0]?.max_id;
      if (maxId && Number(maxId) > 0) {
        await prisma.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), ${maxId});`);
      }
    } catch (err: any) {
      console.warn(`⚠️ No se pudo sincronizar la secuencia de la tabla ${table}:`, err.message);
    }
  }
  console.log('✅ Secuencias de base de datos sincronizadas.');

  console.log('🎉 Seed de EventHub completado satisfactoriamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
