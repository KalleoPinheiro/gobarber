import { number, object, string } from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/AppointmentsModel';
import User from '../models/UserModel';

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

      return res.status(200).json(appointment);
    } catch (error) {
      return res.status(200).json({ error });
    }
  }

  // async list(req, res) {
  //   try {
  //     const appointments = await Appointment.findAll();
  //     res.status(200).json(appointments);
  //   } catch (error) {
  //     res.status(200).json();
  //   }
  // }
}

export default new AppointmentController();