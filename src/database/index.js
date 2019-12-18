import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import Appointment from '../app/models/AppointmentsModel';
import File from '../app/models/FileModel';
import User from '../app/models/UserModel';
import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      `${process.env.MONGO_URL}${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}
export default new Database();
