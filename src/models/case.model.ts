import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class CaseModel extends Model {
  public id!: number;
  public case_number!: string;
  public case_type!: "perdata" | "pidana";
  public case_detail!: string;
  public status!: "planing" | "pending" | "in_progress" | "resolved" | "closed";

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

CaseModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    case_number: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    case_type: {
      type: DataTypes.ENUM("perdata", "pidana"),
      allowNull: false,
    },
    case_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "planing",
        "pending",
        "in_progress",
        "resolved",
        "closed"
      ),
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
    modelName: "CaseModel",
    tableName: "cases",
  }
);
