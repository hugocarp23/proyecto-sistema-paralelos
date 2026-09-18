import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { AppError } from './utils/appError.js';
import { ENV } from './config/env.js';

const app: Application = express();

// Configuración de CORS
const rawOrigin = ENV.FRONTEND_URL || 'http://localhost:5173';
const cleanOrigin = rawOrigin.replace(/\/$/, '');
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  cleanOrigin,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como apps móviles, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.github.io')) {
        return callback(null, true);
      }
      return callback(null, true); // Permitir en desarrollo
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Servir archivos estáticos de imágenes subidas
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Endpoint de Salud / Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    service: 'EventHub API',
    message: 'EventHub API está respondiendo correctamente.',
    timestamp: new Date().toISOString(),
  });
});

// Montar Rutas de la API de EventHub
app.use('/api', apiRouter);

// Manejo de Rutas No Encontradas
app.all('*', (req: Request, res: Response) => {
  throw new AppError(`No se encontró la ruta ${req.originalUrl} en el servidor de EventHub.`, 404);
});

// Middleware Global de Manejo de Errores
app.use(errorHandler);

export default app;
