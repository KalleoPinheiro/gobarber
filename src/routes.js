import { Router } from 'express';
import multer from 'multer';
import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
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
// routes.get('/appointments', AppointmentController.list);

// POST
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentController.store);

// PUT
routes.put('/users', UserController.update);

export default routes;
