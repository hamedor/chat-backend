import { Sequelize } from 'sequelize';
import { development } from '@src/config/config';
import MessageModel from '@src/models/message';
import UserModel from '@src/models/user';

const sequelize = new Sequelize(
  development.database,
  development.username,
  development.password,
  {
    host: development.host,
    dialect: development.dialect,
  }
);

const User = UserModel(sequelize);
const Message = MessageModel(sequelize);

User.hasMany(Message, { foreignKey: 'userId', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const db = {
  sequelize,
  Sequelize,
  User,
  Message,
};

sequelize.sync({ force: false }).then(() => {
  console.log('База данных синхронизирована');
});

export default db;