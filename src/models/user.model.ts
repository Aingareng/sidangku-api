import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class UserModel extends Model {
  public id!: number;
  public role_id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

UserModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    role_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "UserModel",
    tableName: "users",
  }
);
