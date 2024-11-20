import { DataTypes, Sequelize, Model, Optional } from "sequelize";
import bcrypt from "bcrypt"

interface UserAttributes {
  id: number,
  username: string,
  password: string,
  role: string,
}

class User extends Model<UserAttributes> {
  public id: number
  public username: string
  public password: string
  role: string;

}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  )

  return User
}