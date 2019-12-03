import { Router } from 'express';
// import UserController from './app/controllers/UserController';
// import SesstionController from './app/controllers/SessionController';
// import authMiddlaware from './app/middlewares/auth';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (_, res) => {
  const user = await User.create({
    name: 'Kalleo',
    email: 'kalleo@test.com',
    password: 'asdas23ffsdf',
  });

  return res.json(user);
});

// routes.post('/users', UserController.store);
// routes.post('/sessions', SesstionController.store);

// routes.use(authMiddlaware);
// routes.put('/users', UserController.update);

export default routes;
