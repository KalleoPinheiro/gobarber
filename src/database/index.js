import { Sequelize } from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

require('dotenv/config');

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig.local);
    models.map(model => model.init(this.connection));
  }
}
export default new Database();
