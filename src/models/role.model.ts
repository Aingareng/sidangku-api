import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class RoleModel extends Model {
  public id!: number;
  public name!: string;

  // timestamps

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoleModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  },

  {
    sequelize,
    modelName: "RoleModel",
    tableName: "roles",
  }
);
