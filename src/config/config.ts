import { Dialect } from 'sequelize'
import dotenv from 'dotenv';

dotenv.config();

export const development = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: (process.env.DB_DIALECT as Dialect),
};