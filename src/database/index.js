import Sequelize from 'sequelize';
import mongoose from 'mongoose';
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

  mongo() {
    this.mongoConnection = mongoose.connect(
      `mongodb://localgost:27017/gobarber`,
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}
export default new Database();
