import dotenv from 'dotenv';

dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

export default jwtConfig;