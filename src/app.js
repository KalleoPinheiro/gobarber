import 'dotenv/config';
import * as Sentry from '@sentry/node';
import express from 'express';
import 'express-async-errors';
import { resolve } from 'path';
import Youch from 'youch';
import sentryConfig from './config/sentry';
import './database';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exeptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exeptionHandler() {
    this.server.use(async (error, req, res, next) => {
      const errors = await new Youch(error, req).toJSON();
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
