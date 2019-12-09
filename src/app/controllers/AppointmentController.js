import { isBefore, parseISO, startOfHour, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { number, object, string } from 'yup';
import Appointment from '../models/AppointmentsModel';
import User from '../models/UserModel';
import File from '../models/FileModel';
import Notification from '../schemas/NotificationSchema';

class AppointmentController {
  async store(req, res) {
    const schema = object().shape({
      date: string().required(),
      provider_id: number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    try {
      const { provider_id, date } = req.body;

      const isProvider = await User.findOne({
        where: { id: provider_id, provider: true },
      });

      if (!isProvider) {
        return res
          .status(401)
          .json({ error: 'You can only create appointments with providers' });
      }

      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(200).json({ error: 'Past dates are not permited!' });
      }

      const checkAvailability = await Appointment.findOne({
        where: { provider_id, canceled_at: null, date: hourStart },
      });

      if (checkAvailability) {
        return res
          .status(200)
          .json({ error: 'Appointment date is not available' });
      }

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date: hourStart,
      });

      const user = await User.findByPk(req.userId);
      const dateFormated = format(
        hourStart,
        " 'dia' dd 'de'  MMMM', às' H:mm'h'",
        { locale: pt }
      );

      // Notify Provider

      await Notification.create({
        content: `Novo agendamento de ${user.name} para ${dateFormated}`,
        user: provider_id,
      });

      return res.status(200).json(appointment);
    } catch (error) {
      return res.status(200).json({ error });
    }
  }

  async list(req, res) {
    const { page = 1 } = req.query;
    try {
      const appointments = await Appointment.findAll({
        where: { user_id: req.userId, canceled_at: null },
        attributes: ['id', 'date'],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: User,
            as: 'provider',
            attributes: ['name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['path', 'url'],
              },
            ],
          },
        ],
      });
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(200).json({ error });
    }
  }
}

export default new AppointmentController();
