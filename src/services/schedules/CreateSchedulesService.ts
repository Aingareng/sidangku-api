import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import { ScheduleModel, sequelize } from "../../models";
import {
  formatJamIndonesia,
  formatTanggalIndonesia,
} from "../../utils/formatDate";
import CasePartiesService from "../case-parties/CasePartiesService";
import CreateCasesService from "../cases/CreateCasesService";
import CreateUserService from "../users/CreateUsersService";
import FindUserService from "../users/FindUserService";
import SendNoticationService from "../whats-app/SendNoticationService";

class CreateSchedulesService {
  static async create(payload: ISchedulesPayload) {
    const transaction = await sequelize.transaction();
    try {
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
      await processParties([payload.registrar], "registrar");

      const schedule = await ScheduleModel.create(
        {
          case_id: caseId,
          status: "scheduled",
          scheduled_date: new Date(),
          scheduled_time: new Date(),
        },
        { transaction }
      );

      const judges = await FindUserService.findAll(payload.judges);
      const plaintiffs = await FindUserService.findAll(
        payload.plaintiffs || []
      );
      const defendants = await FindUserService.findAll(
        payload.defendants || []
      );
      const preacheds = await FindUserService.findAll(payload.preacheds || []);
      const clerks = await FindUserService.findAll([payload.registrar]);

      await transaction.commit();

      await SendNoticationService(
        `
📢 *Jadwal Sidang Baru*

🆔 *Perkara*: ${payload.case_number}

👨‍⚖️ *Hakim*: 
${judges.data
  ?.map(
    (judge, idx) =>
      `${idx + 1}. ${judge.name} (📞 https://wa.me/${judge.phone})`
  )
  .join("\n")}

🧑‍💼 *Panitera*: 
${clerks.data
  ?.map(
    (clerk, idx) =>
      `${idx + 1}. ${clerk.name} (📞 https://wa.me/${clerk.phone})`
  )
  .join("\n")}

${
  payload.case_type === "perdata"
    ? `
👥 *Penggugat*: 
${plaintiffs.data
  ?.map((p, idx) => `${idx + 1}. ${p.name} (📞 https://wa.me/${p.phone})`)
  .join("\n")}

👥 *Tergugat*: 
${defendants.data
  ?.map((d, idx) => `${idx + 1}. ${d.name} (📞 https://wa.me/${d.phone})`)
  .join("\n")}
    `
    : `
👥 *Terdakwa*:
${preacheds.data?.map((p, idx) => `${idx + 1}. ${p.name}`).join("\n")}
    `
}

📅 *Tanggal*: ${formatTanggalIndonesia(schedule.createdAt.toString())}
⏰ *Jam*: ${formatJamIndonesia(schedule.scheduled_time.toString())}

📝 *Tindakan:*
Silakan tentukan 🏛️ ruang & 🔢 antrian sidang.

🔗 *Dashboard*: 
👉 http://192.168.1.5/

_Terima kasih atas kerjasama Bapak/Ibu._

Salam hormat,  
*PTSP PN Limboto*
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
