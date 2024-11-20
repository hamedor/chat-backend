import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface MessageAttributes {
  id: number;
  username: string;
  message: string;
  role: string;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> {
  public id!: number;
  public username!: string;
  public message!: string;
  public role!: string;
  public readonly createdAt!: Date;
}

export default (sequelize: Sequelize) => {
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      timestamps: true,
      underscored: false,
    }
  );

  return Message;
};