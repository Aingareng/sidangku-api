import { IApiResponse } from "../interface/apiResponse";
import {
  CaseModel,
  CasePartiesModel,
  ScheduleModel,
  sequelize,
  UserModel,
} from "../models";

export interface IReplacementClerkPayload {
  schedule_id: string;
  user_id: number;
}

class setReplacementClerkController {
  static async call(payload: IReplacementClerkPayload): Promise<IApiResponse> {
    const transaction = await sequelize.transaction();
    try {
      const existingSchedule = await ScheduleModel.findByPk(
        payload.schedule_id
      );
      if (!existingSchedule) {
        transaction.rollback();
        return {
          status: 404,
          message: "schedule not found",
          data: null,
        };
      }

      const existingCase = await CaseModel.findByPk(existingSchedule.case_id);

      if (!existingCase) {
        transaction.rollback();
        return {
          status: 404,
          message: "Case not found",
          data: null,
        };
      }

      const existingUser = await UserModel.findByPk(payload.user_id);

      if (!existingUser) {
        transaction.rollback();
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      const existingCaseParties = await CasePartiesModel.findOne({
        where: { user_id: payload.user_id },
      });

      if (existingCaseParties) {
        transaction.rollback();
        return {
          status: 400,
          message: `${existingUser.name} sudah terdaftar pada kasus ini`,
          data: null,
        };
      }

      await CasePartiesModel.create({
        case_id: existingCase.id,
        user_id: existingUser.id,
        role_id: existingUser.role_id,
      });
      transaction.commit();
      return {
        status: 201,
        message: "Replacement clerk set successfully",
        data: null,
      };
    } catch (error) {
      transaction.rollback();
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
}

export default setReplacementClerkController;
