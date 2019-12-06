import { compare, hash } from 'bcrypt';
import Sequelize, { Model } from 'sequelize';
import File from './FileModel';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        avatar_id: {
          type: Sequelize.INTEGER,
          references: {
            model: File,
            key: 'avatar_id',
          },
        },
      },
      {
        sequelize,
        modelName: 'user',
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { as: 'avatar', foreignKey: 'avatar_id' });
  }

  checkPassword(password) {
    return compare(password, this.password_hash);
  }
}

export default User;
