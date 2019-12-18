import User from '../models/UserModel';
import File from '../models/FileModel';

class ProviderController {
  async list(_, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'url', 'path'],
        },
      ],
    });
    return res.status(200).json(providers);
  }
}

export default new ProviderController();
