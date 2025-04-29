import { IApiResponse } from "../interface/apiResponse";
import { INotificationPayload } from "../interface/notification";
import {
  CaseModel,
  CasePartiesModel,
  ScheduleModel,
  sequelize,
} from "../models";
import FindUserService from "../services/users/FindUserService";
import SendNoticationService from "../services/whats-app/SendNoticationService";
import {
  formatJamIndonesia,
  formatTanggalIndonesia,
} from "../utils/formatDate";

class notificationController {
  static async call(payload: INotificationPayload): Promise<IApiResponse> {
    const transaction = await sequelize.transaction();
    try {
      const schedule = await ScheduleModel.findByPk(payload.schedule_id);

      if (!schedule) {
        await transaction.rollback();
        return {
          status: 404,
          message: "Schedule not found",
          data: null,
        };
      }

      const caseParties = await CasePartiesModel.findOne({
        where: { case_id: schedule.case_id },
      });

      if (!caseParties) {
        await transaction.rollback();
        return {
          status: 404,
          message: "relation not found",
          data: null,
        };
      }

      const findCase = await CaseModel.findByPk(caseParties.case_id);

      if (!findCase) {
        await transaction.rollback();
        return {
          status: 404,
          message: "case not found",
          data: null,
        };
      }

      const findAllCaseParties = await CasePartiesModel.findAll({
        where: { case_id: findCase.id },
      });

      const partiesId = findAllCaseParties.map((item) => item.user_id);

      const user = await FindUserService.findAll(partiesId);

      if (user.status !== 200) {
        await transaction.rollback();
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      await findCase.update({
        status: "in_progress",
      });

      const judges = user.data?.filter((item) => item.role_id === 1) || [];
      const clerks = user.data?.filter((item) => item.role_id === 3) || [];
      const plaintiffs = user.data?.filter((item) => item.role_id === 6) || [];
      const defendants = user.data?.filter((item) => item.role_id === 7) || [];
      const preacheds = user.data?.filter((item) => item.role_id === 10) || [];

      await SendNoticationService(
        `
📢 *Jadwal Sidang Baru*

🆔 *Perkara*: ${findCase.case_number}

👨‍⚖️ *Hakim*: 
${judges
  ?.map(
    (judge, idx) =>
      `${idx + 1}. ${judge.name} (📞 https://wa.me/${judge.phone})`
  )
  .join("\n")}

🧑‍💼 *Panitera Pengganti*: 
${clerks
  ?.map(
    (clerk, idx) =>
      `${idx + 1}. ${clerk.name} (📞 https://wa.me/${clerk.phone})`
  )
  .join("\n")}

${
  findCase.case_type === "perdata"
    ? `
👥 *Penggugat*: 
${plaintiffs
  ?.map((p, idx) => `${idx + 1}. ${p.name} (📞 https://wa.me/${p.phone})`)
  .join("\n")}

👥 *Tergugat*: 
${defendants
  ?.map((d, idx) => `${idx + 1}. ${d.name} (📞 https://wa.me/${d.phone})`)
  .join("\n")}
    `
    : `
👥 *Terdakwa*:
${preacheds?.map((p, idx) => `${idx + 1}. ${p.name}`).join("\n")}
    `
}

📅 *Tanggal*: ${formatTanggalIndonesia(schedule.createdAt.toString())}
⏰ *Jam*: ${schedule.scheduled_time}

📝 *Tindakan:*
Silakan tentukan 🏛️ ruang & 🔢 antrian sidang.

🔗 *Dashboard*: 
👉 http://localhost:5173/

_Terima kasih atas kerjasama Bapak/Ibu._

Salam hormat,  
*PTSP PN Limboto*
  `
      );

      await transaction.commit();

      return {
        status: 201,
        message: "",
        data: null,
      };
    } catch (error) {
      await transaction.rollback();
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
}

export default notificationController;
