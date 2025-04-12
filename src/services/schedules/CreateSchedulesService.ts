import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import { ScheduleModel, sequelize } from "../../models";
import CasePartiesService from "../case-parties/CasePartiesService";
import CreateCasesService from "../cases/CreateCasesService";
import CreateUserService from "../users/CreateUsersService";
import FindUserService from "../users/FindUserService";

class CreateSchedulesService {
  static async create(payload: ISchedulesPayload) {
    const transaction = await sequelize.transaction();
    try {
      const caseService = await CreateCasesService.create(
        {
          case_number: payload.case_number,
          case_detail: String(payload.case_detail),
        },
        transaction
      );

      if (caseService?.status !== 201) {
        return {
          status: 400,
          message: caseService.message || "Create case failed",
          data: null,
        };
      }

      const caseId = caseService.data?.id;

      const processParties = async (userIds: number[], roleType: string) => {
        for (const userId of userIds) {
          const user = await FindUserService.findByPk(userId, transaction);

          if (user.status !== 200)
            return {
              status: 400,
              message: user.message || `${roleType} not found`,
              data: null,
            };

          await CasePartiesService.create(
            {
              case_id: caseId,
              user_id: userId,
              role_id: user.data?.role_id,
            },
            transaction
          );
        }
      };

      await processParties(payload.judges, "Judge");
      await processParties(payload.plaintiff, "Plaintiff");
      await processParties(payload.defendant, "Defendant");
      await processParties([payload.registrar], "Defendant");

      const schedule = await ScheduleModel.create(
        {
          case_id: caseId,
          status: "scheduled",
          scheduled_date: new Date(),
          scheduled_time: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      return {
        status: 201,
        message: "created",
        data: schedule,
      };
    } catch (error) {
      console.error("CreateSchedulesService Error:", error);
      await transaction.rollback();
      return {
        status: 500,
        message: error,
        data: null,
      };
    }
  }
}

export default CreateSchedulesService;
