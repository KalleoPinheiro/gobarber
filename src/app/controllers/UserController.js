import { object, ref, string } from 'yup';
import File from '../models/FileModel';
import User from '../models/UserModel';

class UserController {
  async store(req, res) {
    const schema = object().shape({
      name: string().required(),
      email: string()
        .email()
        .required(),
      password: string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const schema = object().shape({
      name: string(),
      email: string().email(),
      oldPassword: string().min(6),
      password: string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: string().when('password', (password, field) =>
        password ? field.required().oneOf([ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (user && user.email !== email && email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    if (!user) {
      res.status(400).json({ message: 'User not found' });
    }
    const { id, name, provider } = await user.update(req.body);
    return res.json({ id, name, email, provider });
  }

  async list(_, res) {
    const user = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'url', 'path'],
        },
      ],
    });
    return res.status(200).json(user);
  }
}

export default new UserController();
