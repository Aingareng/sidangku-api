import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class NotificationModel extends Model {
  public id!: number;
  public schedule_id!: string;
  public user_id!: number;
  public message!: string;
  public status!: "delivered" | "failed";

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

NotificationModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "schedules",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("delivered", "failed"),
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
    modelName: "NotificationModel",
    tableName: "notifications",
  }
);
