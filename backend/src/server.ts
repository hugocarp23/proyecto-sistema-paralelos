import app from './app.js';
import { ENV } from './config/env.js';
import { prisma } from './config/prisma.js';

const PORT = ENV.PORT || 5000;

async function startServer() {
  try {
    // Verificar conexión con la base de datos
    await prisma.$connect();
    console.log('✅ [EventHub] Conexión con PostgreSQL establecida correctamente.');
  } catch (error: any) {
    console.warn(
      '⚠️ [EventHub] No se pudo conectar inmediatamente a PostgreSQL (verifica DATABASE_URL en .env):',
      error.message
    );
  }

  app.listen(PORT, () => {
    console.log(`🚀 [EventHub Backend] Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`📡 [API Base]: http://localhost:${PORT}/api`);
    console.log(`🩺 [Health Check]: http://localhost:${PORT}/api/health`);
  });
}

startServer();
