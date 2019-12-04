import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SesstionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddlaware from './app/middlewares/AuthMiddleware';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SesstionController.store);

routes.use(authMiddlaware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
