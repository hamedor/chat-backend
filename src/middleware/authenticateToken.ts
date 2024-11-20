import jwt from 'jsonwebtoken';
import jwtConfig from '@src/config/JwtConfig';


export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, jwtConfig.secret);
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истёк' });
    } else {
      return res.status(401).json({ message: 'Недействительный токен' });
    }
  }
}