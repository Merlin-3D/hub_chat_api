import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Profile from "./profile";
import Friend from "./friend";

class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public tag!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly profile?: Profile;
  public readonly friends?: Friend;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize,
    modelName: "Users",
  }
);
/** User Profile */
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Friend, { foreignKey: 'userId', as: 'friends' });
Friend.belongsTo(User, { foreignKey: 'friendId', as: 'user' });

export default User;
