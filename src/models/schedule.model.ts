import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class ScheduleModel extends Model {
  public id!: number;
  public case_id!: number;
  public status!: "scheduled" | "pending" | "finished";
  public scheduled_date!: Date;
  public scheduled_time!: Date;
  public queue_number!: number;
  public location!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

ScheduleModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    case_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    scheduled_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    queue_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "pending", "finished"),
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
    modelName: "ScheduleModel",
    tableName: "schedules",
  }
);
