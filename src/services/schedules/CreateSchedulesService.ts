import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import { ScheduleModel, sequelize, UserModel } from "../../models";
import {
  formatJamIndonesia,
  formatTanggalIndonesia,
} from "../../utils/formatDate";
import CasePartiesService from "../case-parties/CasePartiesService";
import CreateCasesService from "../cases/CreateCasesService";
import FindUserService from "../users/FindUserService";
import SendNoticationService from "../whats-app/SendNoticationService";

class CreateSchedulesService {
  static async create(payload: ISchedulesPayload) {
    const transaction = await sequelize.transaction();
    try {
      const findMainClerck = await UserModel.findOne({ where: { role_id: 2 } });

      const caseService = await CreateCasesService.create(
        {
          case_number: payload.case_number,
          case_type: payload.case_type,
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
      await processParties(payload.plaintiffs || [], "Plaintiff");
      await processParties(payload.defendants || [], "Defendant");
      await processParties(payload.preacheds || [], "preacheds");

      const schedule = await ScheduleModel.create(
        {
          case_id: caseId,
          scheduled_date: new Date(),
          scheduled_time: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      await SendNoticationService(
        `
📢 *Jadwal Sidang Baru*

*Panitera*:
${findMainClerck?.name ?? ""} (📞 https://wa.me/${findMainClerck?.phone})

🆔 Perkara: ${payload.case_number}
📅 Tanggal: ${formatTanggalIndonesia(schedule.createdAt.toString())}
⏰ Jam: ${formatJamIndonesia(schedule.scheduled_time.toString())}

Mohon tetapkan 🧑‍💼 *Panitera Pengganti*.

🔗 Dashboard: 
👉 http://localhost:5173/

_PTSP PN Limboto_

  `
      );

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
