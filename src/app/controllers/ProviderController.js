import User from '../models/UserModel';
import File from '../models/FileModel';

class ProviderController {
  async list(_, res) {
    try {
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
    } catch (error) {
      return res.status(400).json({ error: 'Cant not list providers!' });
    }
  }
}

export default new ProviderController();
