import { sequelize } from "../config/database";
import { CaseModel } from "./case.model";
import { UserModel } from "./user.model";
import { NotificationModel } from "./notification.model";
import { ScheduleModel } from "./schedule.model";

export { sequelize, UserModel, CaseModel, NotificationModel, ScheduleModel };
