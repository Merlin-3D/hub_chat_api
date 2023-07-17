import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import User from "./user";

class Friend extends Model {
  public id!: string;
  public userId!: string;
  public friendId!: string;
  public isPending!: boolean;
  public isAccepted!: boolean;
  public isBlocked!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
}

Friend.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    friendId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isPending: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    sequelize,
    modelName: "Friends",
  }
);

export default Friend;
