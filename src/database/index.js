import Sequelize from 'sequelize';
import Appointment from '../app/models/AppointmentsModel';
import File from '../app/models/FileModel';
import User from '../app/models/UserModel';
import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig.development);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}
export default new Database();
