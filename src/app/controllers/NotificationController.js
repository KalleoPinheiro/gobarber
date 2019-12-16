import User from '../models/UserModel';
import NotificationSchema from '../schemas/NotificationSchema';

class NotificationController {
  async list(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await NotificationSchema.find({
      user: req.userId,
    })
      .select('_id read content createdAt')
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.status(200).json(notifications);
  }

  async update(req, res) {
    const notfication = await NotificationSchema.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.status(200).json(notfication);
  }
}

export default new NotificationController();
