import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointments from '../models/AppointmentsModel';

class AvailableController {
  async find(req, res) {
    const { providerId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const scheduleDate = Number(date);

    const appointments = await Appointments.findAll({
      where: {
        provider_id: providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(scheduleDate), endOfDay(scheduleDate)],
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(scheduleDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.status(200).json(available);
  }
}

export default new AvailableController();
