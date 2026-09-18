import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { AppError } from '../utils/appError.js';

const router = Router();

// Asegurar existencia del directorio de subidas
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento local
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueId = crypto.randomUUID();
    cb(null, `event-${Date.now()}-${uniqueId}${ext}`);
  },
});

// Filtro estricto para solo imágenes
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Solo se admiten archivos de imagen (JPEG, PNG, WEBP, GIF, AVIF)', 400) as any, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Máximo 10 MB
  },
});

// Endpoint POST /api/upload
router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('No se recibió ningún archivo de imagen para subir.', 400);
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      status: 'success',
      message: 'Imagen subida exitosamente.',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  }
);

export default router;
