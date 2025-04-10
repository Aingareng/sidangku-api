import { where } from "sequelize";
import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import {
  CaseModel,
  CasePartiesModel,
  ScheduleModel,
  sequelize,
} from "../../models";
import { CasesPayload } from "../../interface/case";
import { ICasePartiesTable } from "../../interface/caseParties";
import CasePartiesService from "../case-parties/CasePartiesService";
import FindUserService from "../users/FindUserService";
import UpdateCasepartiesService from "../case-parties/UpdateCasepartiesService";

class UpdateSchedulesService {
  static async call(id: string, data: ISchedulesPayload) {
    const transaction = await sequelize.transaction();

    try {
      // 1. Check pakah schedule ada
      const schedule = await ScheduleModel.findByPk(id);
      if (!schedule) {
        transaction.rollback();
        return {
          status: 404,
          message: "Schedule not found",
          data: null,
        };
      }

      // 2 Jika schedule true, update data pada table case & cases_parties

      // Update table cases_parties
      const processParties = async (userIds: number[], roleType: string) => {
        for (const userId of userIds) {
          const user = await FindUserService.findByPk(userId, transaction);

          if (user.status !== 200)
            return {
              status: 400,
              message: user.message || `${roleType} not found`,
              data: null,
            };

          return await UpdateCasepartiesService.call(
            {
              case_id: schedule.case_id,
              user_id: userId,
              role_id: user.data?.role_id,
            },
            transaction
          );
        }
      };

      await processParties(data.judges, "Judge");
      await processParties(data.plaintiff, "Plaintiff");
      await processParties([data.registrar], "Defendant");

      const scheduleUpdateResult = await ScheduleModel.update(data, {
        where: {
          id: schedule.id,
        },
        transaction,
      });

      // update table cases
      const caseDataUpdate: CasesPayload = {
        case_number: data.case_number,
        case_detail: String(data.case_detail),
      };
      const caseUpdateResult = await CaseModel.update(
        caseDataUpdate, // Data to update
        {
          where: {
            id: schedule.case_id,
          },
          transaction,
        }
      );

      if (!scheduleUpdateResult && !caseUpdateResult) {
        await transaction.rollback();

        return {
          status: 400,
          message: "failed update scheduled",
          data: null,
        };
      }

      await transaction.commit();

      return {
        status: 201,
        message: "Updated",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
}

export default UpdateSchedulesService;
