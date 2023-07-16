import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import User from "./user";

class Profile extends Model {
    public id!: number;
  public userId!: string;
  public email!: string;
  public username!: string;
  public phoneNumber?: string;
  public avatar?: string;
  public cover?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
}

Profile.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize,
    modelName: "Profiles",
  }
);

export default Profile;
