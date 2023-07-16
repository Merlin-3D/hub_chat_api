import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public tag!: string;
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

export default User;