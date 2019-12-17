import { Router } from 'express';
import multer from 'multer';
import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import ProviderController from './app/controllers/ProviderController';
import ScheduleController from './app/controllers/ScheduleController';
import SesstionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddlaware from './app/middlewares/AuthMiddleware';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

// NO SESSION REQUIRED
routes.post('/users', UserController.store);
routes.post('/session', SesstionController.store);

// MIDDLEWARE
routes.use(authMiddlaware);

// GET
routes.get('/users', UserController.list);
routes.get('/providers', ProviderController.list);
routes.get('/appointments', AppointmentController.list);
routes.get('/schedule', ScheduleController.list);
routes.get('/schedule/', ScheduleController.list);
routes.get('/available/:providerId', AvailableController.find);

// POST
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentController.store);

// PUT
routes.put('/users', UserController.update);
routes.put('/notifications/:id', NotificationController.update);

// DELETE
routes.delete('/appointments/:id', AppointmentController.delete);

export default routes;
