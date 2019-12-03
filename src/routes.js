import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SesstionController from './app/controllers/SessionController';
import authMiddlaware from './app/middlewares/AuthMiddleware';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SesstionController.store);

routes.use(authMiddlaware);
routes.put('/users', UserController.update);

export default routes;
