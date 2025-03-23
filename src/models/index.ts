import { sequelize } from "../config/database";
import { CaseModel } from "./case.model";
import { UserModel } from "./user.model";
import { NotificationModel } from "./notification.model";
import { ScheduleModel } from "./schedule.model";
import { CasePartiesModel } from "./caseParties.model";

export {
  sequelize,
  UserModel,
  CaseModel,
  NotificationModel,
  ScheduleModel,
  CasePartiesModel,
};
