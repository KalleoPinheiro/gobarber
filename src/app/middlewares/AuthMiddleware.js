import { verify } from 'jsonwebtoken';
import { promisify } from 'util';

require('dotenv').config();

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(verify)(token, process.env.SECRET_KEY);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token!' });
  }
};
