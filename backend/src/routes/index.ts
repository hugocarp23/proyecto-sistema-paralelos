import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import eventRoutes from './event.routes.js';
import purchaseRoutes from './purchase.routes.js';
import ticketRoutes from './ticket.routes.js';
import qrRoutes from './qr.routes.js';
import attendanceRoutes from './attendance.routes.js';
import statisticsRoutes from './statistics.routes.js';
import reportRoutes from './report.routes.js';
import uploadRoutes from './upload.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/purchases', purchaseRoutes);
apiRouter.use('/tickets', ticketRoutes);
apiRouter.use('/qr', qrRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/statistics', statisticsRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/upload', uploadRoutes);

export default apiRouter;
